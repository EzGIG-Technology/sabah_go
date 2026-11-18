# Sabah GO

Prototype of the Sabah Tourism Digital Platform and Tourist Entry Contribution (TEC) system. It is a static site (plain HTML, CSS and JavaScript, no build step) with two parts that share one theme:

| Path | What it is |
|---|---|
| `/` | **Sabah GO Console**, the main dashboard. The landing page is the sign-in for every portal: the visitor app, Sabah GO Operations, KePKAS, Ministry of Finance Sabah, Immigration Sabah, the merchant app and the State command centre. |
| `/app/` | **Sabah GO visitor app**, the traveller mobile app prototype. It opens from the "Sabah GO visitor app" sign-in on the console, and links back to the console. |

Sign-in is a prototype: the sample account is filled in, and a signed-in portal is remembered for the browser tab (sessionStorage). Real sign-in and two-factor authentication need the backend.

## Run locally

```bash
python3 -m http.server 5174
```

Then open http://localhost:5174 for the console and http://localhost:5174/app/ for the visitor app. Open it over http, not `file://`, because both parts load images from `/img/`.

## Deploy to Vercel

Import this repository in Vercel. No settings are needed: `vercel.json` marks it as a static site with no build command and serves the repository root.

When you change a CSS or JS file, bump the `?v=` number on its tag (`index.html` for the console, `app/index.html` for the app) so browsers fetch the new file.

## Shared theme

Both parts use the visitor app's look: Poppins, the light blue ground (`#F3F7FD`), white cards with soft blue shadows, navy `#0A2463`, blue `#1460E0`, cyan `#22B5F0`, and the navy to cyan gradient. The tokens live at the top of `app/styles.css` and `css/console.css`; keep the two in step. Chart colours for the console are in `js/ui.js` (`PAL`, `MODEC`, `RAILC`).

## Files

- `index.html`, `css/console.css`, `js/*.js`: the console (see `docs/console/README.md` and `docs/console/HANDOFF.md` for its architecture, reports and the data contract for live APIs)
- `app/index.html`, `app/app.js`, `app/data.js`, `app/styles.css`: the visitor app
- `img/`: photos, payment-method icons, and agency logos in `img/logos/`. Generated console images go in `img/console/` (see `docs/console/IMAGE_PROMPTS.md`); until they exist the console falls back to the photos already in `img/`
- `a11y-audit.js`: dev-only accessibility check for the app; load it in the browser console and run `a11yAudit()` (not deployed)
