import { describe, expect, it } from "vitest";
import { stripPrefix } from "./url.js";

describe("stripPrefix", () => {
  it("drops the prefix before a slash, a query or the end", () => {
    expect(stripPrefix("/gatehouse-api/v1/health", "/gatehouse-api")).toBe("/v1/health");
    expect(stripPrefix("/gatehouse-api?x=1", "/gatehouse-api")).toBe("/?x=1");
    expect(stripPrefix("/gatehouse-api", "/gatehouse-api")).toBe("/");
  });

  it("leaves any other URL as it is", () => {
    expect(stripPrefix("/v1/health", "/gatehouse-api")).toBe("/v1/health");
    expect(stripPrefix("/gatehouse-apix/v1/health", "/gatehouse-api")).toBe("/gatehouse-apix/v1/health");
  });
});
