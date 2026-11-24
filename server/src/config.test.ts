import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, afterEach, describe, expect, it } from "vitest";
import { ConfigError, loadConfig, readEnvFile } from "./config.js";

/** `data/` at the repo root, found from this file the way config.ts finds it. */
const DEFAULT_DATA_DIR = fileURLToPath(new URL("../../data", import.meta.url));
/** The card list at the repo root. */
const DEFAULT_CARDS_FILE = fileURLToPath(new URL("../../content/cards.json", import.meta.url));

/** Sign in with Ward's five settings, as a dev `.env` would set them. The key is a placeholder: config only reads it. */
const WARD_ENV = {
  WARD_OIDC_ISSUER: "http://localhost:8792/ward-api/oidc",
  WARD_OIDC_CLIENT_ID: "gatehouse",
  WARD_OIDC_CLIENT_KEY: "not-a-real-key",
  WARD_OIDC_REDIRECT_URI: "http://localhost:5182/gatehouse-api/auth/ward/callback",
  WARD_OIDC_POST_LOGOUT_REDIRECT_URI: "http://localhost:5182/",
};

/** The message of the ConfigError `env` throws. */
function problemsWith(env: NodeJS.ProcessEnv): string {
  try {
    loadConfig(env);
  } catch (error) {
    expect(error).toBeInstanceOf(ConfigError);
    return (error as ConfigError).message;
  }
  throw new Error("loadConfig accepted the settings");
}

describe("loadConfig", () => {
  it("has a default for every setting", () => {
    expect(loadConfig({})).toEqual({
      host: "127.0.0.1",
      port: 8815,
      publicOrigin: "http://localhost:5182",
      apiPrefix: "/gatehouse-api",
      dataDir: DEFAULT_DATA_DIR,
      cardsFile: DEFAULT_CARDS_FILE,
      ward: undefined,
      trustedProxies: [],
    });
  });

  it("counts an empty value as unset", () => {
    expect(
      loadConfig({
        HOST: "",
        PORT: " ",
        PUBLIC_ORIGIN: "",
        GATEHOUSE_API_PREFIX: "",
        GATEHOUSE_DATA_DIR: "  ",
        GATEHOUSE_CARDS_FILE: "",
        WARD_OIDC_ISSUER: "",
        AUTH_TRUSTED_PROXIES: " ",
      }),
    ).toEqual(loadConfig({}));
  });

  it("takes what the environment gives", () => {
    expect(
      loadConfig({
        HOST: "0.0.0.0",
        PORT: "9000",
        PUBLIC_ORIGIN: "https://example.org",
        GATEHOUSE_API_PREFIX: "/api",
        GATEHOUSE_DATA_DIR: "/data",
        GATEHOUSE_CARDS_FILE: "/app/content/cards.json",
        AUTH_TRUSTED_PROXIES: "172.16.0.0/12, ,10.0.0.1",
      }),
    ).toEqual({
      host: "0.0.0.0",
      port: 9000,
      publicOrigin: "https://example.org",
      apiPrefix: "/api",
      dataDir: "/data",
      cardsFile: "/app/content/cards.json",
      ward: undefined,
      trustedProxies: ["172.16.0.0/12", "10.0.0.1"],
    });
  });

  it("takes a relative data folder from the repo root", () => {
    expect(loadConfig({ GATEHOUSE_DATA_DIR: "data/elsewhere" }).dataDir).toBe(join(DEFAULT_DATA_DIR, "elsewhere"));
  });

  it("takes Sign in with Ward's five settings", () => {
    expect(loadConfig(WARD_ENV).ward).toEqual({
      issuer: WARD_ENV.WARD_OIDC_ISSUER,
      clientId: "gatehouse",
      clientKey: "not-a-real-key",
      redirectUri: WARD_ENV.WARD_OIDC_REDIRECT_URI,
      postLogoutRedirectUri: "http://localhost:5182/",
    });
  });

  it("names the Ward settings missing beside the issuer, never a value", () => {
    const message = problemsWith({ ...WARD_ENV, WARD_OIDC_CLIENT_ID: "", WARD_OIDC_CLIENT_KEY: " " });
    expect(message).toContain("WARD_OIDC_CLIENT_ID");
    expect(message).toContain("WARD_OIDC_CLIENT_KEY");
    expect(message).not.toContain("localhost");
  });

  it("wants the Ward callback on the page's origin, under the API prefix", () => {
    for (const redirect of [
      "http://localhost:5182/auth/ward/callback",
      "http://localhost:8815/gatehouse-api/auth/ward/callback",
      "https://example.org/gatehouse-api/auth/ward/callback",
    ]) {
      const message = problemsWith({ ...WARD_ENV, WARD_OIDC_REDIRECT_URI: redirect });
      expect(message, redirect).toBe(
        "WARD_OIDC_REDIRECT_URI must be the callback as the browser reaches it: PUBLIC_ORIGIN, then /gatehouse-api/auth/ward/callback.",
      );
    }
    const moved = {
      ...WARD_ENV,
      GATEHOUSE_API_PREFIX: "/api",
      WARD_OIDC_REDIRECT_URI: "http://localhost:5182/api/auth/ward/callback",
    };
    expect(loadConfig(moved).ward?.redirectUri).toBe(moved.WARD_OIDC_REDIRECT_URI);
  });

  it("names bad trusted proxies, never the value", () => {
    for (const value of ["0.0.0.0/0", "10.0.0.1/40", "not-an-address"]) {
      const message = problemsWith({ AUTH_TRUSTED_PROXIES: value });
      expect(message, value).toBe(
        "AUTH_TRUSTED_PROXIES must be addresses or CIDR ranges, comma-separated, with no /0 among them.",
      );
    }
  });

  it("takes a relative card list from the repo root", () => {
    expect(loadConfig({ GATEHOUSE_CARDS_FILE: "content/other.json" }).cardsFile).toBe(
      join(DEFAULT_CARDS_FILE, "..", "other.json"),
    );
  });

  it("names a bad port, never its value", () => {
    for (const port of ["70000", "0", "8815.5", "eighty"]) {
      const message = problemsWith({ PORT: port });
      expect(message, port).toBe("PORT must be a port number (1-65535).");
    }
  });

  it("names every bad variable at once, never a value", () => {
    const message = problemsWith({
      PORT: "70000",
      PUBLIC_ORIGIN: "https://example.org/somewhere/",
      GATEHOUSE_API_PREFIX: "gatehouse-api/",
    });
    expect(message).toContain("PORT must be a port number");
    expect(message).toContain("PUBLIC_ORIGIN must be a bare origin");
    expect(message).toContain("GATEHOUSE_API_PREFIX must be a path");
    expect(message).not.toContain("70000");
    expect(message).not.toContain("somewhere");
    expect(message).not.toContain("gatehouse-api/");
  });
});

describe("readEnvFile", () => {
  const folder = mkdtempSync(join(tmpdir(), "gatehouse-env-"));
  const keys = ["GATEHOUSE_TEST_UNSET", "GATEHOUSE_TEST_SET"];
  afterEach(() => {
    for (const key of keys) delete process.env[key];
  });
  afterAll(() => {
    rmSync(folder, { recursive: true, force: true });
  });

  it("fills what the environment leaves unset, and keeps what it has", () => {
    const file = join(folder, "settings.env");
    writeFileSync(file, "GATEHOUSE_TEST_UNSET=from-file\nGATEHOUSE_TEST_SET=from-file\n");
    process.env.GATEHOUSE_TEST_SET = "from-environment";
    expect(readEnvFile(file)).toBe(file);
    expect(process.env.GATEHOUSE_TEST_UNSET).toBe("from-file");
    expect(process.env.GATEHOUSE_TEST_SET).toBe("from-environment");
  });

  it("answers undefined when there is no file", () => {
    expect(readEnvFile(join(folder, "missing.env"))).toBeUndefined();
  });
});
