import type { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";
import { ownerCardsAnswer, ownerCardsSchema } from "@gatehouse/shared";
import { loadCards } from "@gatehouse/shared/load";
import { ownerOnly } from "../../plugins/auth.js";

export interface OwnerCardsOptions {
  /** The card list, read once when the feature registers: a bad file stops the start. */
  cardsFile: string;
  /** The page's origin, which the owner cards' `host:` links resolve against. */
  publicOrigin: string;
}

/**
 *   GET /v1/owner/cards     the owner: the owner part's cards, links resolved, in the shape the page's Card takes
 *
 * The guard answers 401 `unauthorized` with no session, and `ownerOnly` 403 `forbidden` for a user without the owner's
 * role. Neither is declared here: a declared status encodes every reply on it, and theirs are the library's bodies.
 */
export const ownerCardRoutes: FastifyPluginAsyncZod<OwnerCardsOptions> = async (app, options) => {
  const answer = ownerCardsAnswer(loadCards(options.cardsFile), options.publicOrigin);

  app.get(
    "/v1/owner/cards",
    { preHandler: ownerOnly, schema: { response: { 200: ownerCardsSchema } } },
    async (_request, reply) => {
      // The owner's own answer: no cache along the way keeps it.
      reply.header("cache-control", "no-store");
      return answer;
    },
  );
};
