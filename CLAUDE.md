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
python3 tools/generate-artifacts.py client   # logo.svg, favicon.svg, artifacts/garden.svg
python3 tools/generate-og-image.py client    # og-image.png, which embeds the logo
```

The generator counts the articles and the projects itself, straight from those
two files (`read_growth`), so there is nothing to pass in and nothing to keep in
sync by hand. Never hand-edit `client/logo.svg`, `client/favicon.svg` or
`client/artifacts/garden.svg` — they are output. Change the drawing in the
generator instead.

Two things read the same rule from the other side and have to keep up with it:

- `Topbar.gardenState` in `client/components/Topbar.js` mirrors the formula to
  tell the visitor, in the logo tooltip, how big the garden is right now. If the
  rule in the Python changes, change it there too.
- `client/og-image.png` bakes in the logo, so it is stale until regenerated.

When the garden outgrows what the current rule can express — the 3x3 cap, the
five plant shapes, the petal count — grow the rule rather than freezing the
picture. The point of the logo is that it is never finished.

## Conventions

- No build step, no framework, no dependencies on the front-end: plain classes
  in `client/components`, appended through `appendInnerHtmlTemplate`.
- The palette is fixed: `#f3ece3` paper, `#f71735` accent, `#2a7061` leaf,
  `#9a634e` soil, `#c6aa4a` wood, `#3a3532` ink.
- Articles are written in Italian, first person.
- Comments explain why, not what, and only where the reason is not obvious from
  the code.
