import { describe, expect, it } from "vitest";
import { isUnder, pathOf, stripPrefix } from "./url.js";

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

describe("pathOf and isUnder", () => {
  it("drop the query, and match whole path segments only", () => {
    expect(pathOf("/v1/owner/cards?x=1")).toBe("/v1/owner/cards");
    expect(isUnder("/v1/owner/cards", "/v1")).toBe(true);
    expect(isUnder("/v1", "/v1")).toBe(true);
    expect(isUnder("/v10/health", "/v1")).toBe(false);
  });
});
