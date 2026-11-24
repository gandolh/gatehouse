import { hasZodFastifySchemaValidationErrors, ResponseSerializationError } from "@fastify/type-provider-zod";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { ApiError, ERROR_STATUS, type ErrorBody, type ErrorCode, type Issue } from "../lib/api-error.js";

/** The fixed message of every 500: the details go to the log, never to the page. */
const INTERNAL_MESSAGE = "Gatehouse's API hit an error; its log says why.";

function errorBody(error: ErrorCode, message: string, issues?: Issue[]): ErrorBody {
  return issues === undefined ? { error, message } : { error, message, issues };
}

/** The code for a 4xx that Fastify or a plugin raised. */
function clientErrorCode(status: number): ErrorCode {
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 413) return "too_large";
  return "bad_request";
}

/** The status a thrown value carries, if it carries one (Fastify's own errors and its plugins' do). */
function statusOf(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null || !("statusCode" in error)) return undefined;
  return typeof error.statusCode === "number" ? error.statusCode : undefined;
}

/**
 * A client error's message. JSON.parse's own message quotes the start of the body, so bad JSON gets a fixed one; the
 * rest are Fastify's and its plugins', written for clients.
 */
function clientMessage(error: unknown): string {
  if (error instanceof SyntaxError) return "The body is not valid JSON.";
  return error instanceof Error ? error.message : "The request is not valid.";
}

/**
 * The one error handler, and the 404 handler. Wrapped in fastify-plugin, so they are set on the root and every feature
 * inherits them; app.ts registers this plugin before any route.
 *
 * - `ApiError` answers its code's status with its message.
 * - A request that fails its route schema answers 400 with every issue.
 * - A 4xx that Fastify or a plugin raised (bad JSON, a body too large) keeps its status.
 * - Anything else is a 500 with a fixed message, logged with the request. A thrown message never reaches the client.
 */
const errorHandling: FastifyPluginAsync = async (app) => {
  app.setErrorHandler((error: unknown, request, reply) => {
    if (error instanceof ApiError)
      return reply.code(ERROR_STATUS[error.code]).send(errorBody(error.code, error.message));

    if (hasZodFastifySchemaValidationErrors(error)) {
      const where = error.validationContext ?? "request";
      const issues = error.validation.map((issue) => ({
        path: `${where}${issue.instancePath}`,
        message: issue.message ?? "is not valid",
      }));
      return reply.code(400).send(errorBody("validation", "The request is not valid.", issues));
    }

    const status = statusOf(error);
    if (status !== undefined && status >= 400 && status < 500) {
      return reply.code(status).send(errorBody(clientErrorCode(status), clientMessage(error)));
    }

    if (error instanceof ResponseSerializationError) {
      // A handler sent what its response schema doesn't allow: a bug to fix, never the client's fault. The zod issues
      // stay out of the log, since they can quote what the reply held.
      request.log.error(
        { err: { name: error.name, code: error.code }, method: error.method, url: error.url },
        "a reply doesn't match its response schema",
      );
    } else {
      request.log.error({ err: error }, "unhandled error");
    }
    return reply.code(500).send(errorBody("internal", INTERNAL_MESSAGE));
  });

  app.setNotFoundHandler((request, reply) =>
    reply.code(404).send(errorBody("not_found", `There is no route ${request.method} ${request.url}.`)),
  );
};

export const errors = fp(errorHandling, { name: "gatehouse-errors" });
