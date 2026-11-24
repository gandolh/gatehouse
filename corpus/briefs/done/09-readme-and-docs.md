# Task 09: The README and docs

**Depends on:** 08.

**Runs before:** nothing.

**Builder:** Sonnet ([routing.md](../../routing.md)).

## Context

The repo has no README yet. This brief writes it and the `docs/` folder to the estate's standard,
with the `readme-docs` skill: a short README a newcomer can judge in a minute, and a `docs/` folder
holding what it links to. Lantern's README and `docs/` are the nearest finished example.
`docs/owner-setup.md` already exists from brief 07; keep it and link it.

What Gatehouse is: [overview.md](../../wiki/overview.md). How it is built:
[architecture.md](../../wiki/architecture.md).

## Files you OWN

- `README.md` (new), `docs/` (except `owner-setup.md`, which only gains links), `docs/images/` and its
  `shots.md`
- Corpus: `corpus/wiki/status.md`, `corpus/log.md`

## Files you must NOT touch

- `web/`, `server/`, `shared/`, `content/`, `design/`.

## Steps

1. **Shots** with the page on `npm run dev` (each look and mode opened with `?look=` and
   `?mode=`) and the fake API from brief 06 for the signed-in shot:
   a hero of Profile at 1280 x 800 light, the phone in Terminal dark at 390 x 844, Ninety-six at
   1280 x 800 light, and the owner part signed in. Webp, in `docs/images/`, with `shots.md` saying
   how to take them again. Read each shot before keeping it: no domain in any address bar or link
   text, no personal data. Host links show `example.org` in dev, which is fine.
2. **README.md**, as the skill orders it: what Gatehouse is in two sentences, the hero, a status
   line, what it does (sections, three looks, See more, the owner part), how to run it, and links
   into `docs/`.
3. **docs/**: `getting-started.md` (install, `npm run dev`, the fake API, the checks, adding a card),
   `architecture.md` (a short version of the wiki page, with a diagram from the `diagram-design`
   skill if it earns its place), and `design.md` (the three looks, pointing at `DESIGN.md` and
   `design/`).
4. The corpus: `status.md`, a `log.md` entry.

## Acceptance

- [ ] `README.md` and `docs/` follow the `readme-docs` skill; every relative link resolves.
- [ ] The shots exist, are webp, and show no domain or personal data.
- [ ] No domain, account name or machine path in any new file.
- [ ] `npm run check` passes; `bash corpus/lint.sh` passes.

## Owner steps

- None.

## Owner decisions

- None new.
