// The public card module, made at build time (and by the dev server) by the plugin in vite.config.ts: the public
// part of the card list only, links resolved against the origin, each picture imported so Vite fingerprints it.
// Only the two entries import it; the page takes the cards as props.
declare module "virtual:gatehouse-cards" {
  const cards: import("./features/cards/types").PageData;
  export default cards;
}
