# Sabah GO Console

> **In this repo:** the console is installed at the site root (`/index.html`, `css/`, `js/`, logos in `img/logos/`) and is the main dashboard. The visitor app moved to `/app/` and is one of the console's sign-ins. Both now use the visitor app's theme (Poppins, light ground, white cards), so the colour and font notes below describe the original package.

Government and merchant dashboards for Sabah GO: the platform that collects the Tourist Entry Contribution (TEC). The package has a landing page, a State command centre and five portals:

| Portal | Who | Hash route |
|---|---|---|
| Sabah GO Operations | Platform operator | `#ops/overview` |
| KePKAS | Kementerian Pelancongan, Kebudayaan dan Alam Sekitar Sabah | `#tourism/overview` |
| Ministry of Finance Sabah | Kementerian Kewangan Sabah | `#finance/overview` |
| Immigration Sabah | Jabatan Imigresen Malaysia, Negeri Sabah | `#immigration/overview` |
| Merchant app | Puan Aminah, Tamu Kota Belud (sample merchant) | `#merchant/overview` |
| State command centre | All ministries on one wall | `#command` |

Every portal has its own reports module covering the full reporting journey:

1. Choose a report and set its parameters.
2. Preview it with arithmetic checks.
3. Save it as a draft or submit it for approval.
4. The approver signs it, or returns it with comments. A returned report is revised as a new version with commentary.
5. Distribute or publish the signed report.

The module also covers:

- Scheduled reports.
- Sharing reports between agencies.
- History and an audit trail.
- Exports to XLSX, CSV and PDF.

It is plain HTML, CSS and JavaScript, with no framework and no build step. That matches the existing Sabah GO app (`index.html`, `app.js`, `data.js`, `img/`).

## Add it to the Vercel repo

1. Copy the `console/` folder into the root of the repo next to `index.html`:

   ```
   your-repo/
     index.html        (existing visitor app)
     app.js, data.js   (existing)
     img/              (existing photos)
       console/        (new: generated images, see IMAGE_PROMPTS.md)
     console/          (this package)
       index.html
       css/console.css
       js/*.js
       img/logos/*.png
   ```

2. Commit and push. Vercel serves it at `https://<your-domain>/console/` with no configuration.
3. Photos load from the app's existing `/img/` folder. Generated images go in `/img/console/` and replace the fallbacks automatically as soon as they exist.
4. Optional: link to it from the visitor app, for example a footer link to `/console/`.

To use a different image path, set it before the scripts load in `console/index.html`:

```html
<script>window.SG_CONFIG = { imgBase: 'https://cdn.example.com/img/' };</script>
```

## Run locally

```bash
cd your-repo
npx serve .          # or: python3 -m http.server 8080
# open http://localhost:3000/console/
```

Open it over http, not `file://`, so that `/img/` resolves.

## What moves

The backdrop does three things:

- It drifts slowly across a photograph of Sabah.
- Three swoosh lines from the Sabah GO logo flow along the bottom.
- A small plane flies the swoosh path.

Landing blocks rise in on load, the Finance live feed ticks every 6 seconds, and the card covers zoom on hover. `prefers-reduced-motion` switches all of it off.

## Fonts

Red Hat Display is used for titles and figures, and Public Sans for text and tables. Both load from Google Fonts. Public Sans was designed for government services, and both faces read clearly at small sizes and in tables.

## Files

| File | What it holds |
|---|---|
| `js/config.js` | Image and logo paths, image keys |
| `js/engine.js` | Simulated data engine: arrivals, payments, settlement, reconciliation, periods (replace with live APIs) |
| `js/ui.js` | Icons, charts, tables, drawers, modals, toasts, XLSX/CSV export |
| `js/records.js` | Travellers, merchants, tickets, roles, routing, landing, shell, traveller drawer, TEC refunds |
| `js/models.js` | Destinations, alerts, events, exceptions, merchant ledger and payouts |
| `js/reports.js` | Every report definition (39 reports) with arithmetic checks |
| `js/reports-ui.js` | Report catalogue, builder, approval flow, history, schedules, sharing, export |
| `js/pages-*.js` | One file per portal, plus the command centre |
| `css/console.css` | Design tokens, components, print stylesheet, responsive rules |

See `HANDOFF.md` for the architecture, the data contract for live APIs, and a prompt to give Claude Code.
