import { readFileSync } from "node:fs";
import { cardListSchema, type CardList } from "./cards.js";

/** Reads and validates the card list. An invalid file throws, naming the card id and the field. */
export function loadCards(path: string): CardList {
  const raw: unknown = JSON.parse(readFileSync(path, "utf8"));
  const result = cardListSchema.safeParse(raw);
  if (result.success) return result.data;
  const problems = result.error.issues.map((issue) => {
    const where = describe(raw, issue.path);
    return `${where}: ${issue.message}`;
  });
  throw new Error(`${path} is not a valid card list:\n${problems.join("\n")}`);
}

function describe(raw: unknown, path: readonly PropertyKey[]): string {
  const [first, s, second, c, ...rest] = path;
  if (first === "sections" && typeof s === "number" && second === "cards" && typeof c === "number") {
    const sections = (raw as { sections?: { cards?: { id?: unknown }[] }[] }).sections;
    const id = sections?.[s]?.cards?.[c]?.id;
    return `card ${typeof id === "string" ? id : `#${c}`}, field ${rest.map(String).join(".") || "(card)"}`;
  }
  return path.map(String).join(".") || "(file)";
}
