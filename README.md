# Sabah GO — mobile app prototype

Interactive prototype of the Sabah GO tourism app, built as a static site (plain HTML, CSS and JavaScript, no build step).

## Run locally

```bash
python3 -m http.server 5174
```

Then open http://localhost:5174.

## Deploy to Vercel

Import this repository in Vercel. No settings are needed: `vercel.json` marks it as a static site with no build command and serves the repository root.

When you change `styles.css`, `app.js` or `data.js`, bump the `?v=` number on their tags in `index.html` so browsers fetch the new files.

## Files

- `index.html` — page shell and phone frame
- `app.js` — screens, routing and interactions
- `data.js` — destinations, events, deals and translations
- `styles.css` — all styles
- `img/` — photos, logos and payment-method icons
- `a11y-audit.js` — dev-only accessibility check; load it in the browser console and run `a11yAudit()` (not deployed)
