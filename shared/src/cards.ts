import { z } from "zod";

export const accessLabels = ["open", "sign-in", "owner", "docs", "repo"] as const;
export const parts = ["public", "owner"] as const;

const accessSchema = z.enum(accessLabels);
const partSchema = z.enum(parts);

const kebab = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** A link in one of the three forms: `/path/`, `host:<name>` or an `https://` address. */
export const linkSchema = z
  .string()
  .refine(
    (value) => /^\/[^\s]*$/.test(value) || /^host:[a-z0-9-]+$/.test(value) || /^https:\/\/[^\s/]+[^\s]*$/.test(value),
    {
      message: "must be /path/, host:<name> or an https address",
    },
  );

const pathLinkSchema = z.string().regex(/^\/[^\s]*$/, "must be a /path/ link");
const addressSchema = z.string().regex(/^https:\/\/[^\s/]+[^\s]*$/, "must be an https address");

export const cardSchema = z.object({
  id: z.string().regex(kebab, "must be kebab-case"),
  name: z.string().min(1),
  href: linkSchema,
  access: accessSchema,
  part: partSchema,
  image: z.string().min(1).nullable(),
  blurb: z.string().min(1),
  more: z.string().min(1),
  docs: pathLinkSchema.nullable(),
  source: addressSchema.nullable(),
});

export const sectionSchema = z.object({
  id: z.string().regex(kebab, "must be kebab-case"),
  title: z.string().min(1),
  line: z.string().min(1),
  compact: z.boolean().optional(),
  cards: z.array(cardSchema),
});

export const cardListSchema = z
  .object({
    site: z.object({
      wordmark: z.string().min(1),
      line: z.string().min(1),
      sub: z.string().min(1),
      github: addressSchema,
      filters: z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)]),
      footer: z.string().min(1),
    }),
    access: z.object({
      open: z.string().min(1),
      "sign-in": z.string().min(1),
      owner: z.string().min(1),
      docs: z.string().min(1),
      repo: z.string().min(1),
    }),
    sections: z.array(sectionSchema).min(1),
  })
  .superRefine((list, ctx) => {
    const seen = new Set<string>();
    list.sections.forEach((section, s) => {
      section.cards.forEach((card, c) => {
        if (seen.has(card.id)) {
          ctx.addIssue({
            code: "custom",
            message: `duplicate card id ${card.id}`,
            path: ["sections", s, "cards", c, "id"],
          });
        }
        seen.add(card.id);
        if (section.compact === true && card.image !== null) {
          ctx.addIssue({
            code: "custom",
            message: `card ${card.id} is in a compact section and must have no image`,
            path: ["sections", s, "cards", c, "image"],
          });
        }
      });
    });
  });

export type Access = z.infer<typeof accessSchema>;
export type Part = z.infer<typeof partSchema>;
export type Card = z.infer<typeof cardSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type CardList = z.infer<typeof cardListSchema>;

/** The sections with only the cards in the public part; a section left empty is dropped. */
export function publicCards(list: CardList): Section[] {
  return list.sections
    .map((section) => ({ ...section, cards: section.cards.filter((card) => card.part === "public") }))
    .filter((section) => section.cards.length > 0);
}

/** Only the cards in the owner part, flat, in page order. */
export function ownerCards(list: CardList): Card[] {
  return list.sections.flatMap((section) => section.cards.filter((card) => card.part === "owner"));
}
