# README images

How each image was made, so the next refresh is a re-run. Re-take an image when the screen it shows changes.

| File | Shows | How to reach that state | Viewport | Data | Taken |
|---|---|---|---|---|---|
| hero.webp | Profile, light, the top of the page | `npm run dev:fake -w @gatehouse/web`, open `/?look=profile&mode=light` | 1280 x 800 @2x | `content/cards.json` | 2026-11-24 |
| terminal-dark-phone.webp | Terminal, dark, on a phone | `/?look=terminal&mode=dark` | 390 x 844 @2x | `content/cards.json` | 2026-11-24 |
| ninety-six-light.webp | Ninety-six, light | `/?look=ninety-six&mode=light` | 1280 x 800 @2x | `content/cards.json` | 2026-11-24 |
| owner-part.webp | The owner signed in: Behind the scenes with the owner's three cards | Same page with the fake API's default scenario; run `localStorage.setItem('gatehouse.owner', '1')` in the console, reload, scroll to Behind the scenes | 1280 x 800 @2x | fake API (`owner`) | 2026-11-24 |

The wordmark in the header is the one in `content/cards.json`, the repo's accepted exception to the no-account-names rule.
Host links show a placeholder domain in dev. The real local Ward was not used.

Capture method: `agent-browser`, one session, `set viewport <w> <h> 2`, wait three seconds, `screenshot` to an absolute
path (not full-page), then
`ffmpeg -i shot.png -c:v libwebp -quality 80 shot.webp`.
