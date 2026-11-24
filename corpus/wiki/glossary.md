---
summary: Gatehouse's vocabulary, settled in the grill of 2026-11-23 and the plan of 2026-11-24. Look (Profile, Terminal, Ninety-six) and mode (light, dark, system), never "theme"; access label (Public, Sign-in, Owner only, Docs only, On GitHub), never status or badge; part (public, owner) and the owner part; owner hint; card, section and compact section; See more.
updated: 2026-11-24
---

# Glossary

**Look:** one of the three visual designs of the page: Profile, Terminal or Ninety-six. A look
changes tokens and skin rules, never the markup or the navigation.
_Avoid:_ theme, skin, style.

**Mode:** light, dark or system, within a look. System follows the device.
_Avoid:_ theme.

**Access label:** the label on a card saying who can open it: Public, Sign-in, Owner only, Docs only,
On GitHub. Always words, never colour alone.
_Avoid:_ status, badge.

**Part:** which visitors see a card at all: `public` or `owner`. Separate from the access label.
_Avoid:_ visibility, access (that is the label).

**Owner part:** the cards that appear only after the owner signs in with Ward: the vault, Grafana,
the mail admin and brief-board. They come from the API, never from the public HTML.
_Avoid:_ private cards, admin cards.

**Owner hint:** `gatehouse.owner` in localStorage. While it is set, the page asks the API for the
owner part; without it, the page never calls the API.
_Avoid:_ session (that is the API's cookie).

**Card:** one app, site, docs page or repo on the page: picture, name, access label, one sentence,
actions.
_Avoid:_ tile, item.

**Section:** a group of cards by what they are: Games and toys, Apps for home, Sites for other
people, Behind the scenes, On GitHub.
_Avoid:_ category.

**Compact section:** a section drawn with smaller cards and no pictures: Behind the scenes and On
GitHub.

**See more:** the toggle that opens a card's longer text and facts inside the card.
_Avoid:_ details, expand.
