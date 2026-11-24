import { errorBodySchema } from "@gatehouse/shared";

/**
 * The API client: `fetch`, JSON in and out, and the shared schemas checking every answer. Every failure is one
 * `ApiError`: the server's code, or the client's own `network` (no answer, status 0) and `bad_response` (an answer the
 * schema rejects). Only the owner part calls the API, and only once the browser holds the owner hint, so this module
 * loads with it, never for a visitor.
 */
export class ApiError extends Error {
  /** The HTTP status; 0 when no answer came. */
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/** The part of a zod schema the client uses. */
interface ResponseSchema<T> {
  safeParse(data: unknown): { success: true; data: T } | { success: false };
}

interface RequestOptions {
  method?: "GET" | "POST";
  signal?: AbortSignal;
}

/**
 * One request with no body: the API's posts take none (Ward's start reads an empty body as no options, where an empty
 * JSON body is a 400).
 */
async function send(path: string, { method = "GET", signal }: RequestOptions): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(path, {
      method,
      headers: { accept: "application/json" },
      credentials: "same-origin",
      cache: "no-store",
      ...(signal && { signal }),
    });
  } catch {
    throw new ApiError(0, "network", "The API can't be reached.");
  }
  if (response.ok) return response;
  const parsed = errorBodySchema.safeParse(await response.json().catch(() => undefined));
  if (!parsed.success) throw new ApiError(response.status, "bad_response", `The API answered ${response.status}.`);
  throw new ApiError(response.status, parsed.data.error, parsed.data.message ?? parsed.data.error);
}

/** A call whose answer the page reads: resolves to the parsed body. */
export async function apiJson<T>(path: string, schema: ResponseSchema<T>, options: RequestOptions = {}): Promise<T> {
  const response = await send(path, options);
  const parsed = schema.safeParse(await response.json().catch(() => undefined));
  if (!parsed.success) {
    throw new ApiError(response.status, "bad_response", "The API's answer isn't what this page expects.");
  }
  return parsed.data;
}

/** A call whose answer the page doesn't read: a 204. */
export async function apiNoContent(path: string, options: RequestOptions): Promise<void> {
  await send(path, options);
}
