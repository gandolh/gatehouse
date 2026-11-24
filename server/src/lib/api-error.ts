/** The status each error code answers with. A new code is one line here. */
export const ERROR_STATUS = {
  /** The request failed its route schema. */
  validation: 400,
  /** A 400 that Fastify raised itself: bad JSON, an empty body with a JSON content type. */
  bad_request: 400,
  /** No session. Ward's library sends this code itself, and the page reads it. */
  unauthorized: 401,
  /** Signed in, but not the owner. Ward's library sends this code itself, and the page reads it. */
  forbidden: 403,
  not_found: 404,
  /** A body over the limit: Fastify raises it as a 413. */
  too_large: 413,
  internal: 500,
} as const satisfies Record<string, number>;

export type ErrorCode = keyof typeof ERROR_STATUS;

/** One thing wrong with a request: where (`querystring/look`) and what. */
export interface Issue {
  path: string;
  message: string;
}

/**
 * Every error the API sends. `error` is a code the page can switch on, `message` is for people, and a 400 from a schema
 * lists its `issues`. Ward's library answers 401 and 403 as `{ error }` with the same codes.
 */
export interface ErrorBody {
  error: ErrorCode;
  message: string;
  issues?: Issue[];
}

/**
 * The API's one error class. Throw it from a handler or a hook to answer `ERROR_STATUS[code]` with this message; the
 * error plugin writes the body.
 */
export class ApiError extends Error {
  readonly code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}
