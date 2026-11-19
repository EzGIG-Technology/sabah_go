# Handoff: Sabah GO Console

## 1. Prompt for Claude Code

Paste this into Claude Code from the root of the Sabah GO repo after copying `console/` in:

```
I've added a folder called console/ to this repo. It is the government and merchant
dashboard for Sabah GO, written in plain HTML, CSS and JavaScript with no build step.
Read console/README.md and HANDOFF.md first.

1. Check that /console/ is served correctly on Vercel next to the existing visitor app
   (index.html, app.js, data.js, img/). Add a vercel.json only if it is needed. The
   visitor app's routes must keep working.
2. Make sure every photo the console asks for resolves: for each entry in
   console/js/config.js IMGS, the fallback file (second value) must exist in /img/.
   List any that are missing and point them to the closest existing photo.
3. Add a small "Government console" link in the visitor app footer pointing to /console/.
4. Run the console locally (npx serve .) and open #command, #finance/overview,
   #immigration/flights, #tourism/movement, #merchant/overview and each
   #<role>/reports page. Fix any console errors.
5. Do not change the figures or the data engine (console/js/engine.js) yet. That will
   be replaced by live APIs following the data contract in HANDOFF.md.
Commit on a new branch called console and open a pull request.
```

## 2. Architecture

- **Routing.** Routes are hashes of the form `#role/page/sub`. `route()` in `records.js` reads the hash and renders it.
  - `#` shows the landing page.
  - `#command` shows the command centre.
  - Each role's pages are functions in `PAGES[role]`, defined in `pages-*.js`. A page function returns an HTML string.
  - A function named `_page` runs after its page renders. It is used for timers.
- **State.** All state lives in one object, `S` (role, page, range, filters, "acting as" user), with no framework.
  - `rerender()` redraws the current page.
  - Report history (`RHIST`), schedules (`RSCHED`), shares (`RSHARED`) and the audit log (`AUDIT`) are in-memory arrays. They reset on reload, so wire them to storage when the backend exists.
- **Shell.** `renderShell()` draws the sidebar and the top bar:
  - the agency logo;
  - the period selector, which is a segmented control on desktop and a select at 900px or below;
  - search;
  - notifications.
- **Overlays.** One drawer, one modal and one toast are shared by every page: `drawer()`, `modal()`, `toast()` and `closeAll()` in `ui.js`.
- **Reports.** Each report is defined in `RDEF[role][id]` (in `reports.js`).
  - `run(params)` returns `{kpis, chart, cols, rows, foot, notes, checks, extra}`.
  - Flags on a definition:
    - `monthly`: the report covers a calendar month.
    - `fixed`: the period cannot be changed.
    - `closedOnly`: today cannot be submitted.
    - `flow`: the sign-off path, either `signoff`, `publish` or `none`.
    - `to`: the agencies it can be shared with.
  - `reports-ui.js` provides the whole journey, and nothing in it is specific to a report. A new report needs only a new `RDEF` entry.
- **Exports.**
  - XLSX is a real Office Open XML workbook, zipped in the browser.
  - CSV uses typed values, so numbers stay numbers.
  - PDF goes through the browser's print dialog with a print stylesheet.
  - Every export writes to the audit trail. A draft export carries a DRAFT watermark.

## 3. Data contract: replacing `engine.js`

`engine.js` builds a deterministic sample world. To go live, keep the same global names and shapes, filled from APIs instead. The pages only read these:

| Global | Shape | Live source |
|---|---|---|
| `LAST`, `NDAYS` | Day index of today; days since go-live (the most recent 1 June) | Server clock in MYT |
| `MKT` | `[iso, name, …]` source markets | Reference table |
| `CP` | Checkpoints `{id, name, short, mode, share, kiosks, unpaid, district}` | Reference table |
| `RAIL` | `[method, fee rate]` payment methods | Acquirer contract |
| `cube(from, to, filters, by)` | Arrivals by day × checkpoint × market: `n` arrivals, `pay` paying, `ex` exempt under 12, `ks` unpaid on arrival, `sp` spending sen, `dep` departures | MDAC/JIM entry feed joined to Sabah GO passes |
| `LED` | Paying travellers by **payment date** × checkpoint × market | Sabah GO payment ledger |
| `DAY[d]` | `{n, pay, ex, ks, gr collected, ref, refCnt, fee, net credited, partner, chan{app,web,kiosk}, rv[], fees[]}` in sen | Daily rollup job |
| `RECON[i]` | `{d, ledger, acquirer, bank, variance, st, note, resolved}` | Three-way reconciliation job |
| `FLIGHTS` | `{id, time, origin, cp, pax, pay, ex, ks, arrived}` for today | Airport arrivals schedule plus pass matches |
| `STOCK[d]`, `IN_SABAH` | Pass holders in Sabah per day | Entries less departures |
| `BUDGET[yyyymm]` | Monthly TEC target, sen | MOF budget |
| `TRAV` | Parties `{pass, name, members[{n, age, st}], cc, cp, flight, arr, dep, st, amt, rail, chan, pp (masked), paidAt, arrAt}` | Passes API (masked passport) |
| `MERCH`, `APPS` | Merchants and pending applications | Merchant onboarding |
| `MTXS`, `payouts()` | Merchant transactions and payout schedule | Merchant acquirer |
| `TICKETS` | Support tickets | Helpdesk |
| `ALERTS`, `EVENTS`, `DEST` | Alerts, events, destination capacity | KePKAS content and permit systems |

Rules the figures already follow, which must hold for live data:

- **Money.** All money is held in sen as integers. TEC is RM 50, which is `TEC_SEN = 5000`. Children under 12 are exempt.
- **Two dates.** Collections are counted on the payment date. Arrivals are counted on the entry date. Most visitors pay before they fly, so the two differ.
- **Arrivals.** Paying plus exempt equals arrivals. Unpaid on arrival equals kiosk payments plus those still unpaid.
- **Payment totals.** The sum over payment methods equals collected. The sum over channels equals visitors paid.
- **Credited.** Collected less refunds less acquirer fees equals credited to the State account. The acquirer pays straight into the State account, and Sabah GO never holds TEC money.
- **Partner share.** The partner share is 20% of the amount credited and is payable by the State.
- **Pending.** Pending settlement equals collected less settled. Sweeps run every hour.
- **Reconciliation.** The ledger, acquirer and bank must agree each day. A late batch is shown as an exception until it clears.

The arithmetic checks in every report test these rules. If a check fails on live data, the data is wrong, not the check.

## 4. Sample content to replace before launch

- **People and merchants.** All of these are fictional:
  - the Lin family;
  - Sofia Rossi;
  - Puan Aminah and "Kuih & Kraf Aminah";
  - every officer name: Hafiz Mansor, Siti Mariam Yusof and the others in `ROLES`;
  - every traveller, merchant, ticket and pass ID.
- **Market figures.** The 2025 figures are published arrival figures. The growth, budget and arrival target (920,000 from June to December of the go-live year) are assumptions.
- **Rates and system figures.** These are placeholders:
  - acquirer fee rates;
  - the uptime and payment success figures;
  - Bella AI conversation counts.
- **Simulated clock.** The operating date is the viewer's own date, at 15:20 MYT; go-live is the most recent 1 June. Remove it with the engine.
- **Logos.** Logos are used here for a proposal prototype only. Get each agency's approval before any public use.
- **"Sample data" badges.** These appear on every screen. Remove them only when the data is live.

## 5. Not built yet (research gaps)

These came up in the ministry research and stress tests, and they need data sources that Sabah GO will not have at launch:

- **Domestic visitors** (Malaysians from Peninsular Malaysia and Sarawak). They pay no TEC, so the console covers international visitors only.
- **Hotel occupancy and length of stay by accommodation.** This needs a feed from the State tourism board or the accommodation registry.
- **Watchlist or security screening.** It is deliberately not in the console. Immigration sees TEC status only, with no spending or location data.
- **Refund disputes with card schemes (chargebacks).** This is handled in the acquirer portal.
- **Real sign-in, two-factor authentication and role permissions.** These are shown in the UI copy and the approval flow, but they need the backend.

## 6. Tests used during the build

- **Smoke test.** It renders every page, report, history item, shared item and tab for every period: 192 views.
  - It fails on NaN, horizontal overflow, failed arithmetic checks or stray dashes.
  - Result: 0 failures.
- **Fuzz test.** It runs 2,123 reports with random parameters, filters and periods.
  - Result: 0 issues.
- **Stress tests by role.** Separate agents tested each role's user journeys. Every finding was fixed:
  - dead ends in the approval flow;
  - duplicate submissions;
  - signed reports changing after signing;
  - payout and refund arithmetic;
  - mobile menu and period selector;
  - validation on every form.
- **Design gate.** The design-taste lint finished with 0 failures, and the browser inspector was run on the landing page. The deliberate departures from its house style are listed in the delivery notes:
  - glass surfaces and the moving photographic backdrop, which were requested;
  - smaller type and outlined panels inside the data screens, kept for density.
