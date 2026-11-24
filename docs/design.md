# Design

The page comes in three looks. The markup is the same for all three; only the tokens and the skin rules differ. A look
is separate from a mode (light, dark or system), and the footer holds the look switcher.

| Look | What it is | Fonts |
|---|---|---|
| Profile (default) | The GitHub profile made into a page: cool grey ground, white cards with a hairline | Geist |
| Terminal | A listing on a well-kept machine: a paper printout in light, amber phosphor in dark, each section head written as a command | IBM Plex Mono and Plex Sans |
| Ninety-six | A 1990s homepage done with care: teal ground, bevelled grey panels, navy section bars | Pixelify Sans and Arimo |

## Where the design lives

- [DESIGN.md](../DESIGN.md) at the repo root locks the tokens of all three looks. Build against it.
- `design/` holds the approved sketches (`design/sketches/A`, `B`, `C`, each with a `tokens.md`), their renders in
  `design/shots/`, and the brief the sketchers worked from. It is read only; [design/README.md](../design/README.md) says
  which file wins.
- [corpus/wiki/looks.md](../corpus/wiki/looks.md) says how each look is built, and
  [corpus/wiki/decisions.md](../corpus/wiki/decisions.md) why all three stayed.

Pictures of each look: [images/shots.md](images/shots.md).
