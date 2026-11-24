---
summary: The card list in content/cards.json (schema in shared, live access check of 2026-11-24 in a table), as seeded on 2026-11-24 from the approved sketches' fixture. Its shape (site, access labels, five sections, 38 cards); each card's fields; the three link forms (/path/, host:<name>, an https address off the domain) and how each is resolved and shown; the access label against the part (34 public cards, 4 in the owner part); which filter takes which label; who reads the file (the page build, the API, vps-deploy's check); the rules the schema and its tests hold.
updated: 2026-11-24
---

# The card list

`content/cards.json` is the one list of cards. The page build, the API and vps-deploy's check read
it, so a card that is added, moved or removed changes in one place. It is also the only file in the
repo that holds the GitHub links and the wordmark.

It was seeded on 2026-11-24 from the fixture the sketches were drawn from, minus the sketch-only
fields (`updated`, `expandedInSketch`, a note), plus `part`. The schema in `shared` checks it (below).

## Shape

- `site`: `wordmark`, `line`, `sub`, `github`, `filters` (the three chip labels) and `footer`.
- `access`: the words each access label shows: `open` Public, `sign-in` Sign-in, `owner` Owner only,
  `docs` Docs only, `repo` On GitHub.
- `sections`, in page order, each with `id`, `title`, `line`, `compact` (true for the last two) and
  `cards`.

| Section | `id` | Cards | Public part |
| --- | --- | --- | --- |
| Games and toys | `play` | 6 | 6 |
| Apps for home | `home` | 11 | 11 |
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
visitor gets its sign-in screen) but it is in the public part. The owner part is exactly three
cards, all in Behind the scenes: `brief-board`, `vault`, `mail` (`grafana` was removed on
2026-11-24, when monitoring left the box). Their names are public
anyway, in the certificate transparency logs; the split keeps them off the page, not secret.

## Filters

| Chip | Labels it shows | Public cards |
| --- | --- | --- |
| All | every label | 35 |
| Open to anyone | `open`, `docs`, `repo` | 22 |
| Needs sign-in | `sign-in`, `owner` | 13, and 17 once the owner part is in |

A section whose cards a filter hides drops out, and so does its link in the section row.

## Buttons

The filled primary button means the card opens for anyone: `open`, `docs` and `repo` cards. On
`sign-in` and `owner` cards, Open is drawn as the secondary button, so a visitor isn't invited into
a sign-in wall. The primary button reads "Open", "Read the docs" on a `docs` card and "View on
GitHub" on a `repo` card.

## The schema and its tests

- Every card validates; ids are unique across the list.
- `part: owner` on exactly the four cards above, all in `estate`.
- Every `image` exists in `content/images/`, and every file there is used.
- Compact sections have no images.
- Every link is one of the three forms; no link names the domain.

Where it lives, in `shared/src/`:

- `cards.ts`: the zod schema (`cardListSchema`, with `access` and `part` as enums), the `Card`,
  `Section` and `CardList` types, and `publicCards` / `ownerCards`. Also holds the duplicate-id and
  compact-image rules.
- `links.ts`: `resolveLink(link, origin)` and `displayAddress(link)`; both throw on a link in none
  of the three forms.
- `load.ts`: `loadCards(path)`, which reads and validates the file; an invalid file throws, naming
  the card id and the field. It imports `node:fs`, so it sits behind its own subpath,
  `@gatehouse/shared/load`; the barrel (`@gatehouse/shared`) holds nothing from `node:`, because the
  browser imports it.
- `cards.test.ts`: the rules above against the real file, and the resolver on each form.

`content/cards.json` was formatted with Prettier on 2026-11-24 (one line, the filter labels, now sits
on one row) and left `.prettierignore`; the parsed list is the same 38 cards.

## The live check, 2026-11-24

Each card that isn't On GitHub was opened once, logged out, in a real browser at 1280 x 800, and
read: what the visitor gets. Nothing was signed in to or submitted. All 33 labels held, so none
changed. Two single-page apps (`lantern`, `ro-housing`) and `grafana` (which wakes on demand) showed
a loading screen at the first read, so each was opened a second time and waited on; both end on
their sign-in screen. No card answered with a 404 or an error.

| Card | Path or host | A visitor gets | Label before | Label after |
| --- | --- | --- | --- | --- |
| `games` | `/games/` | The portal, four games listed | open | open |
| `farm-valley` | `/farm-valley/` | The game, start screen | open | open |
| `citadel` | `/citadel/` | The game, running | open | open |
| `hollow` | `/hollow/` | The game's setup screen | open | open |
| `mathquest` | `/mathquest/` | The game, level 1 map | open | open |
| `solstice` | `/solstice/` | The editor, a scene loaded | open | open |
| `imbatranim` | `imbatranim.` | A password sign-in screen | owner | owner |
| `atrium` | `/atrium/` | Sign-in (account or Ward) | sign-in | sign-in |
| `shelfmark` | `/shelfmark/` | Redirect to sign-in (account or Ward) | sign-in | sign-in |
| `almanac` | `/almanac/` | Redirect to sign-in (account or Ward) | sign-in | sign-in |
| `lantern` | `/lantern/` | Redirect to sign-in (account or Ward) | sign-in | sign-in |
| `sports-app` | `/sports-app/` | Redirect to sign-in (account) | sign-in | sign-in |
| `satchel` | `satchel.` | Sign-in (account or Ward) | sign-in | sign-in |
| `postern` | `postern.` | Sign-in with a mail account | sign-in | sign-in |
| `newspapper` | `/newspapper/` | Redirect to sign-in (account or Ward) | sign-in | sign-in |
| `ro-housing` | `/ro-housing/` | Redirect to sign-in (account or Ward) | sign-in | sign-in |
| `trips` | `/trips/` | The site | open | open |
| `saloon` | `/saloon/` | The site | open | open |
| `auto-service` | `/auto-service/` | The site | open | open |
| `tractari` | `/tractari/` | The site | open | open |
| `subcort` | `/subcort/` | The site | open | open |
| `churchix` | `/churchix/` | The site | open | open |
| `design-study` | `/design-study/` | The site | open | open |
| `prm` | `/prm/` | The map, a city chosen by default, no sign-in | open | open |
| `piataro` | `/piataro/` | The Mercatus front page, browsable; a Sign-in link in the header | open | open |
| `ward` | `ward.` | Redirect to its sign-in | sign-in | sign-in |
| `wicket` | `/wicket/` | Redirect to sign-in (account or Ward) | sign-in | sign-in |
| `brief-board` | `/brief-board/` | Redirect to sign-in (account or Ward) | owner | owner |
| `status` | `uptime.` | The health dashboard | open | open |
| `just-a-bot` | `/just-a-bot/docs/` | The docs | docs | docs |
| `vault` | `vault.` | Its log-in screen | owner | owner |
| `mail` | `mail.` | The mail admin's sign-in | owner | owner |

The Mercatus picture was retaken the same day from `/piataro/`, logged out, light, at 1280 x 800.
The page's cookie notice covers its bottom edge, so the picture is cropped above it (1280 x 714
scaled to 800 px wide) rather than answered.

