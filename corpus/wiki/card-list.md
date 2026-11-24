---
summary: The card list in content/cards.json, as seeded on 2026-11-24 from the approved sketches' fixture. Its shape (site, access labels, five sections, 38 cards); each card's fields; the three link forms (/path/, host:<name>, an https address off the domain) and how each is resolved and shown; the access label against the part (34 public cards, 4 in the owner part); which filter takes which label; who reads the file (the page build, the API, vps-deploy's check); the rules the schema and its tests hold.
updated: 2026-11-24
---

# The card list

`content/cards.json` is the one list of cards. The page build, the API and vps-deploy's check read
it, so a card that is added, moved or removed changes in one place. It is also the only file in the
repo that holds the GitHub links and the wordmark.

It was seeded on 2026-11-24 from the fixture the sketches were drawn from, minus the sketch-only
fields (`updated`, `expandedInSketch`, a note), plus `part`. Brief 02 adds the schema that checks it.

## Shape

- `site`: `wordmark`, `line`, `sub`, `github`, `filters` (the three chip labels) and `footer`.
- `access`: the words each access label shows: `open` Public, `sign-in` Sign-in, `owner` Owner only,
  `docs` Docs only, `repo` On GitHub.
- `sections`, in page order, each with `id`, `title`, `line`, `compact` (true for the last two) and
  `cards`.

| Section | `id` | Cards | Public part |
| --- | --- | --- | --- |
| Games and toys | `play` | 6 | 6 |
| Apps for home | `home` | 10 | 10 |
| Sites for other people | `sites` | 9 | 9 |
| Behind the scenes | `estate` | 8 | 4 |
| On GitHub | `github` | 5 | 5 |

## A card

| Field | What it holds |
| --- | --- |
| `id` | Unique, kebab-case. Used for the card's anchor and the build guard |
| `name` | As the app names itself on its own page (Mercatus, not its old name) |
| `href` | Where Open goes, in one of the three link forms below |
| `access` | The access label: `open`, `sign-in`, `owner`, `docs` or `repo` |
| `part` | `public` or `owner`. Only `owner` cards are kept out of the built page, its HTML and its scripts alike |
| `image` | A file in `content/images/`, or `null`. Compact sections have none |
| `blurb` | One sentence, shown on the card |
| `more` | The See more text |
| `docs` | A path link to the docs, or `null` |
| `source` | The GitHub address, or `null` |

## Links

- `/path/`: a path on the domain. The page and the API keep it relative. Shown as `/path/`.
- `host:<name>`: a host of its own. Resolved against the origin as `https://<name>.<domain>/`:
  `GATEHOUSE_ORIGIN` in the page build, `PUBLIC_ORIGIN` in the API, the same resolver in `shared`.
  Shown as `<name>.` followed by "own address", never with the domain.
- `https://...`: an address off the domain, for now only GitHub. Used as it is.

## Access label and part

They answer two questions. The access label tells a visitor what happens when they open the card;
the part decides whether a visitor sees the card at all. ImbatranimOS is labelled Owner only (a
visitor gets its sign-in screen) but it is in the public part. The owner part is exactly four
cards, all in Behind the scenes: `brief-board`, `grafana`, `vault`, `mail`. Their names are public
anyway, in the certificate transparency logs; the split keeps them off the page, not secret.

## Filters

| Chip | Labels it shows | Public cards |
| --- | --- | --- |
| All | every label | 34 |
| Open to anyone | `open`, `docs`, `repo` | 22 |
| Needs sign-in | `sign-in`, `owner` | 12, and 16 once the owner part is in |

A section whose cards a filter hides drops out, and so does its link in the section row.

## Buttons

The filled primary button means the card opens for anyone: `open`, `docs` and `repo` cards. On
`sign-in` and `owner` cards, Open is drawn as the secondary button, so a visitor isn't invited into
a sign-in wall. The primary button reads "Open", "Read the docs" on a `docs` card and "View on
GitHub" on a `repo` card.

## What the schema and its tests hold (brief 02)

- Every card validates; ids are unique across the list.
- `part: owner` on exactly the four cards above, all in `estate`.
- Every `image` exists in `content/images/`, and every file there is used.
- Compact sections have no images.
- Every link is one of the three forms; no link names the domain.
