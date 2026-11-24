---
paths:
  - "server/src/**"
---

# The API (`server/src`)

- Follow the `code-structure` skill. `server.ts` listens and `app.ts` builds (`buildApp(config)`, registering the
  error plugin first, then each feature by name); `config.ts` is the only reader of `process.env` and of the repo's
  `.env`. An empty value counts as unset; a bad value stops the start with a message naming the variable, never its
  value.
- A feature is `server/src/features/<name>/`, used through its `index.ts`; its routes are a `FastifyPluginAsyncZod`
  taking its dependencies as options; its SQL is in its `store.ts`. Pure helpers are in `lib/`, which never imports
  Fastify. Cross-cutting plugins (`fastify-plugin` wrapped) are in `plugins/`.
- Every route declares its schemas with zod (`params`, `querystring`, `body`, and a `response` for each status its
  handler sends). No handler parses request input. Schemas the page imports live in `shared/`.
- Errors are `{ error, message, issues? }` (`server/src/lib/api-error.ts`): throw `ApiError(code, message)`, and
  `server/src/plugins/errors.ts` writes the body. A 500 never carries a thrown message. Ward's library answers 401 and
  403 as `{ error: "unauthorized" }` and `{ error: "forbidden" }`, the same codes.
- Routes sit under `/v1`. The browser reaches them under `/gatehouse-api`; `app.ts` strips the prefix before routing,
  so the same build answers behind Caddy (which strips it) and behind the dev proxy (which doesn't).
- Visitors never call the API: only the owner's browser does. Add no timer and no WebSocket, so the container can
  sleep when idle.
- Tests build the app with `buildTestApp` (`server/src/testing/buildTestApp.ts`) on a fresh temporary data folder,
  and go through `app.inject()`, with a schema-failure case per feature.
- `npm run check:conventions` runs `check-structure` strictly and dependency-cruiser over these folders.
