import closeWithGrace from "close-with-grace";
import { buildApp } from "./app.js";
import { ConfigError, loadConfig, readEnvFile, type Config } from "./config.js";

/**
 * Start Gatehouse's API on 127.0.0.1:8815 by default. Locally `npm run dev` runs it beside the page; on the VPS it is
 * the `gatehouse-api` container.
 *
 * Settings come from the environment, and from the repo root's `.env` for what the environment leaves unset.
 * `config.ts` lists them and stops the start with a message naming any that is wrong.
 */

const envFile = readEnvFile();

let config: Config;
try {
  config = loadConfig();
} catch (error) {
  if (!(error instanceof ConfigError)) throw error;
  console.error(`Gatehouse's API cannot start:\n${error.message}`);
  process.exit(1);
}

const app = await buildApp(config, {
  server: {
    logger: true,
    // Only the proxy on the same host is believed about the client's address.
    trustProxy: ["loopback"],
    // A socket silent this long mid-request is cut: no route here holds a request open.
    connectionTimeout: 30_000,
    // The whole request, body included, must arrive within this.
    requestTimeout: 60_000,
    // Longer than Caddy keeps an idle upstream connection (two minutes), so it never sends a request down a socket the
    // API has just closed.
    keepAliveTimeout: 125_000,
  },
});
app.log.info(
  envFile === undefined ? "no .env: settings from the environment" : "settings from .env and the environment",
);

// SIGINT, SIGTERM or an uncaught error: stop taking requests, finish those in flight, run the onClose hooks and exit.
// After 10 s it exits anyway.
closeWithGrace({ delay: 10_000, logger: app.log }, async ({ signal, err }) => {
  if (err) app.log.error({ err }, "closing after an uncaught error");
  else app.log.info(`closing on ${signal ?? "request"}`);
  await app.close();
});

await app.listen({ host: config.host, port: config.port });
