# garden.filippoitaliano.com

A hand-rolled, decoupled microblog: a vanilla JS front-end on GitHub Pages, a
small Node server on Render, articles in `data/articles.json`.

## The garden has to grow

The logo is not a fixed drawing. It is an isometric vegetable plot that is
generated from how much has been planted on the site, and it is expected to get
better every time something is added. The rule lives in `garden_growth` in
`tools/generate-artifacts.py`:

- the bed is the smallest square grid of tiles that holds every project in the
  articles bar (capped at 3x3, past that the tiles turn to mush);
- every published article plants one plant, filling the tiles from the middle
  outwards;
- the flower in the middle opens one more petal, from 5 up to 8, as articles and
  projects add up.

**Whenever an article is added to `data/articles.json` — or an entry is added to
`ARTICLES_BAR_ARTIFACTS` in `client/components/ArticlesBar.js` — regenerate the
garden and commit the result:**

```
python3 tools/generate-artifacts.py client   # logo, favicon, artifacts/garden, the animated pair
python3 tools/generate-og-image.py client    # og-image.png, which embeds the logo
```

The generator counts the articles and the projects itself, straight from those
two files (`read_growth`), so there is nothing to pass in and nothing to keep in
sync by hand. Never hand-edit any of `client/logo.svg`, `client/logo-growing.svg`,
`client/logo-loading.svg`, `client/favicon.svg` or `client/artifacts/garden.svg`
— they are output. Change the drawing in the generator instead.

The last two are the garden in motion, built out of the same scene at the stages
in `GROWTH_FRAMES`: `logo-growing.svg` runs through them once and settles on the
garden as it is today (the topbar plays it on the first render only),
`logo-loading.svg` loops while the server wakes up. Both hold their last frame
under `prefers-reduced-motion`.

Two things read the same rule from the other side and have to keep up with it:

- `Topbar.gardenState` in `client/components/Topbar.js` mirrors the formula to
  tell the visitor, in the logo tooltip, how big the garden is right now. If the
  rule in the Python changes, change it there too.
- `client/og-image.png` bakes in the logo, so it is stale until regenerated.

When the garden outgrows what the current rule can express — the 3x3 cap, the
five plant shapes, the petal count — grow the rule rather than freezing the
picture. The point of the logo is that it is never finished.

## Articles

The home page shows the `promoted` ones in full, in the order they sit in
`data/articles.json`, and everything `listed` is reachable from `/articles`, the
index behind the first topbar link. Only the most recent handful stays promoted —
a home page that shows everything in full is the index with extra steps — so
adding one at the top means demoting the one at the bottom.

Every article carries a `date`, the day it was planted, written `YYYY-MM-DD`.
It shows under the big title — on the home page and on the article's own page —
spelled out in Italian by `formatArticleDate`. A new article needs one, or it
goes up looking like it has always been there.

## The version in the footer

The footer says one thing: which version of the site you are looking at. It is
calver, three numbers like an npm package — `anno.mese.build` — and it lives in
`client/version.js`.

**Bump `SITE_VERSION` on every change that ships.** Same month: add one to the
build. New month: the first two numbers become the current year and month and
the build starts over at `1`.

## Conventions

- No build step, no framework, no dependencies on the front-end: plain classes
  in `client/components`, appended through `appendInnerHtmlTemplate`.
- The palette is fixed: `#f3ece3` paper, `#f71735` accent, `#2a7061` leaf,
  `#9a634e` soil, `#c6aa4a` wood, `#3a3532` ink.
- The page decides how wide its content is: grid tracks are `minmax(0, ...)`,
  their items may shrink, boxes are `border-box`. Anything that does not fit —
  a line of code, an image, the artifacts bar — scrolls or wraps inside its own
  box rather than widening the document. Nothing should ever scroll sideways.
- Whatever scrolls sideways inside its own box says so: give it a positioned
  wrapper and `ScrollHint.appendTo(wrapper, scroller)`, plus a rule tinting the
  arrow's fade with that box's own background colour.
- One arrow, one place: every arrow on the site comes out of `arrowIcon` in
  `client/icons.js`, and how it answers a hover is written once, against
  `.arrow-icon`. Draw a new one there rather than inlining another `<svg>`.
- The topbar stays on screen and draws the red line under itself, because an
  `hr` there would scroll out of sight and leave the artifacts with nothing over
  them. That is the only line that is not an `hr`: everything else separates
  with one, and nothing puts a second line within a few pixels of another — two
  red lines that close together read as a mistake.
- Articles are written in Italian, first person.
- Comments explain why, not what, and only where the reason is not obvious from
  the code.
