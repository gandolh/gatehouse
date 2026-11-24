# Routing

Read by the `orchestrate` skill at the start of a work request, and by any agent deciding where to
send a question.

## Skills

| Job | Skill |
| --- | --- |
| Implement | Inline, one brief at a time. `plan-split-dispatch` only for a brief that splits into three or more independent chunks. |
| Builders | Each brief names one on its **Builder** line: Opus for the harness, the API, Ward and the first look; Sonnet for the narrow screen and data briefs. |
| Review | `npm run check`, the brief's own Acceptance, and for the page the shots beside `design/shots/`. |
| PR | None. The repo has no remote; commit on `main`. |
| Capture and knowledge | `corpus-flow` |
| The page's look | `DESIGN.md` at the root once brief 03 writes it, then `design/` in the order its README gives; the `hallmark` skill's floor and its `sloplint` |
| Code layout | `house-style` (its Astro recipe for `web/`), `code-structure` for `server/` |
| Sign-in | Ward's vendored library and its README; Lantern's server is the nearest working example |
| Diagrams | `diagram-design` |

## Intent

| The user says | Route to |
| --- | --- |
| "add a card", "this app moved", "rename X" | `content/cards.json`, then `npm run check`. vps-deploy's check reads the same file. |
| "make it look like the sketch" | `DESIGN.md` and the sketch of that look in `design/sketches/` |
| "the owner's cards don't show" | [wiki/architecture.md](wiki/architecture.md), the owner part |
| "why is it like this" | [wiki/decisions.md](wiki/decisions.md) |
| "what is left" | [wiki/status.md](wiki/status.md) |

## READ / SKIP

| Read | Skip |
| --- | --- |
| `corpus/index.md`, then two or three wiki pages | `node_modules/`, `web/dist/`, `web/.astro/` |
| The brief you are building, whole | Other briefs, unless yours names them |
| `design/README.md` before any file in `design/` | The PNG renders: there are none here, and the webp shots are enough |

## Which layer answers which question

| Question | Layer |
| --- | --- |
| "Why is it this way?", "was this decided?" | `wiki/decisions.md` |
| "What is a look, a mode, an access label?" | `wiki/glossary.md` |
| "Which cards are there, and who sees them?" | `content/cards.json` and [wiki/card-list.md](wiki/card-list.md) |
| "Where does X live?", "who calls X?" | `grep` and read. The repo is small; no code graph is installed. |
| "Did I get every usage?" | `grep -rnw`, never the wiki |
| "Did this change anything on screen?" | Shots at 1280 x 800 and 390 x 844 beside the ones in `design/shots/` |
