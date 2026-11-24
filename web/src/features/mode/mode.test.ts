import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GROUNDS } from "./mode";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("the browser bar's colours", () => {
  it("are the same in the head script and the mode store", () => {
    const script = read("../../../index.html");
    const table = /var grounds = (\{[^;]*\});/.exec(script)?.[1];
    expect(table).toBeDefined();
    // The head script's table is an object literal: quote its keys and drop the trailing comma to read it as JSON.
    const json = (table ?? "").replace(/(\w+):/g, '"$1":').replace(/,(\s*})/, "$1");
    expect(JSON.parse(json)).toEqual(GROUNDS);
  });

  it("are Profile's ground in the stylesheet, light and dark", () => {
    const css = read("../../styles/index.css");
    const [light, dark] = GROUNDS.profile;
    expect(css).toContain(`--color-ground: light-dark(${light}, ${dark});`);
  });
});
