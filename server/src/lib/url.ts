/**
 * A URL without its leading API prefix, when `/`, `?` or the end follows the prefix; any other URL as it is. Caddy
 * strips the prefix in production and the dev page's proxy doesn't, so the API strips it too and one build answers
 * both ways.
 */
export function stripPrefix(url: string, prefix: string): string {
  if (!url.startsWith(prefix)) return url;
  const rest = url.slice(prefix.length);
  if (rest === "") return "/";
  if (rest.startsWith("/")) return rest;
  if (rest.startsWith("?")) return `/${rest}`;
  return url;
}
