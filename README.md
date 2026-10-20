# Peter Lindholm-Bekker – portfolio

Personal website built with plain HTML, CSS and vanilla JavaScript. No frameworks, no build step.

Live: https://forza20.github.io/

## Files

| File | What it holds |
| --- | --- |
| `index.html` | All text and links |
| `style.css` | Layout and colours (theme variables at the top under `:root`) |
| `script.js` | E-mail link, scroll animations, game embed and full screen button |
| `assets/favicon.svg` | Favicon |
| `assets/og-image.png` | Preview image for links shared on LinkedIn, Slack etc. |

## Making changes

- **Text:** edit `index.html` directly. Sections are marked with `<!-- HERO -->`, `<!-- ABOUT -->` and so on.
- **Links:** GitHub and LinkedIn URLs appear in the hero and the footer in `index.html`.
- **E-mail:** change `data-user` and `data-domain` on the two `js-email` links in `index.html`. The address is assembled in `script.js` so it never appears as plain text in the source.
- **Colours:** change the variables at the top of `style.css`. `--accent` is the teal accent colour.
- **Embedded game:** change `data-src` on `<div id="game">` and the direct links next to it.

## Visitor stats

Page views are counted with [GoatCounter](https://www.goatcounter.com/) (no cookies, so no consent banner needed). Dashboard: https://forza20.goatcounter.com. The script tag is at the bottom of `index.html`. Visits from localhost are not counted.

## Running locally

```bash
python -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly also works.

## Deploy

The site is served by GitHub Pages from the `main` branch (root) of the `Forza20.github.io` repo. Push to `main` and the site updates within a minute or two.
