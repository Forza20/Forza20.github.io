# Peter Lindholm-Bekker – portfolio

Personal website built with plain HTML, CSS and vanilla JavaScript. No frameworks, no build step.

Live: https://forza20.github.io/

## Files

| File | What it holds |
| --- | --- |
| `index.html` | All text and links |
| `style.css` | Layout and colours (theme variables at the top under `:root`) |
| `script.js` | E-mail links and copy button, scroll animations, game embed with fallback, visitor stats and full screen button |
| `assets/favicon.svg` | Favicon |
| `assets/og-image.png` | Preview image for links shared on LinkedIn, Slack etc. |

## Making changes

- **Text:** edit `index.html` directly. Sections are marked with `<!-- HERO -->`, `<!-- ABOUT -->` and so on.
- **Links:** GitHub and LinkedIn URLs appear in the hero, the contact section and the footer in `index.html`.
- **E-mail:** change `data-user` and `data-domain` on every `js-email` link in `index.html` (hero, contact section and footer). The address is assembled in `script.js` so it never appears as plain text in the source; the contact section and the "Copy e-mail" button use the first one.
- **Game preview:** `assets/data-runner-poster.jpg` is shown behind the loading spinner and in the fallback card if the game can't load.
- **Link previews:** `og:*` and `twitter:*` tags in the `<head>` of `index.html` use `assets/og-image.png` (1200 × 630).
- **Colours:** change the variables at the top of `style.css`. `--accent` is the teal accent colour.
- **Embedded game:** change `data-src` on `<div id="game">` and the direct links next to it.

## Visitor stats

Page views are counted with [GoatCounter](https://www.goatcounter.com/) (no cookies, so no consent banner needed). Dashboard: https://forza20.goatcounter.com. The script tag is at the bottom of `index.html`. Visits from localhost are not counted.

The "Who visits this site" section in the footer shows the share of visitors by system, location and screen size (percentages only, no counts). The GitHub Action in `.github/workflows/visitor-stats.yml` fetches the numbers from the GoatCounter API once a day and writes them to `assets/visitor-stats.json`. It needs the repo secret `GOATCOUNTER_TOKEN`: a GoatCounter API key with the "Read statistics" permission. Until there are at least 10 visitors the section shows "Not enough visitors yet". Run it by hand under Actions → Update visitor stats → Run workflow.

## Running locally

```bash
python -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly also works.

## Deploy

The site is served by GitHub Pages from the `main` branch (root) of the `Forza20.github.io` repo. Push to `main` and the site updates within a minute or two.
