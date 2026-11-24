import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, afterEach, describe, expect, it } from "vitest";
import { ConfigError, loadConfig, readEnvFile } from "./config.js";

/** `data/` at the repo root, found from this file the way config.ts finds it. */
const DEFAULT_DATA_DIR = fileURLToPath(new URL("../../data", import.meta.url));

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
    });
  });

  it("counts an empty value as unset", () => {
    expect(
      loadConfig({ HOST: "", PORT: " ", PUBLIC_ORIGIN: "", GATEHOUSE_API_PREFIX: "", GATEHOUSE_DATA_DIR: "  " }),
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
      }),
    ).toEqual({
      host: "0.0.0.0",
      port: 9000,
      publicOrigin: "https://example.org",
      apiPrefix: "/api",
      dataDir: "/data",
    });
  });

  it("takes a relative data folder from the repo root", () => {
    expect(loadConfig({ GATEHOUSE_DATA_DIR: "data/elsewhere" }).dataDir).toBe(join(DEFAULT_DATA_DIR, "elsewhere"));
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
