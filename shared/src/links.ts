/** Turns a card link into an address: a path stays, `host:<name>` becomes `https://<name>.<origin host>/`. */
export function resolveLink(link: string, origin: string): string {
  if (/^\/[^\s]*$/.test(link)) return link;
  const host = /^host:([a-z0-9-]+)$/.exec(link);
  if (host !== null) {
    if (!URL.canParse(origin)) throw new Error(`origin is not an address: ${origin}`);
    return `https://${host[1]}.${new URL(origin).host}/`;
  }
  if (/^https:\/\/[^\s/]+[^\s]*$/.test(link)) return link;
  throw new Error(`not a card link: ${link}`);
}

/** How a link shows on the card: `/path/`, `<name>.` or the address without `https://`. */
export function displayAddress(link: string): string {
  if (/^\/[^\s]*$/.test(link)) return link;
  const host = /^host:([a-z0-9-]+)$/.exec(link);
  if (host !== null) return `${host[1]}.`;
  if (/^https:\/\/[^\s/]+[^\s]*$/.test(link)) return link.slice("https://".length);
  throw new Error(`not a card link: ${link}`);
}
