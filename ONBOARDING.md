# Day one on ShopLedger

ShopLedger is a retail and wholesale point-of-sale app with stock tracking, Khata credit accounts, and printable GST invoices. This guide takes you from a fresh checkout to your first reviewable change.

## Get oriented

1. Open the repository folder and run `pwd` to confirm where you are working.
2. Read the [project README](README.md) for setup and the [architecture guide](docs/architecture.md) for the checkout flow.
3. Start with a read-only walkthrough. Trace order placement from [the browser handler](public/js/app.js#L501) to [the order router](routes/orders.js#L29) and [JSON storage](lib/store.js#L23).
4. Pick one workshop ticket. Invoice and GST discrepancies start in [invoice calculation](lib/invoice.js) and [checkout pricing](lib/pricing.js). Stock issues start in [inventory](lib/inventory.js) and [cancellation](lib/orders.js). History and Khata issues start in [dates](lib/dates.js), [orders](lib/orders.js), and [the ledger](lib/ledger.js).

## Start the app when you need it

Use Node.js 22 or newer, then run `npm install` and `npm start`. Open [the local app](http://localhost:3000). Checkout, cancellations, and settlements rewrite the tracked `data/db.json` file. Use a temporary copy of the project for reproductions that write data, and use in-memory fixtures for tests.

## Make one reviewable change

Use a `fix/<short-name>` branch for the selected ticket. Add and commit passing `node:test` characterization tests before changing behavior. Then reproduce the issue in the temporary copy, write a regression test and capture its failure, make the smallest fix, and run `node --test` again. The baseline `npm test` script is a placeholder. Review the diff and open one PR containing both the test-first commit and the fix.

## Capture workshop evidence

| Checkpoint | Screenshot |
| --- | --- |
| CP1 | Read-only walkthrough with the working directory visible. |
| CP2 | [Standalone architecture diagram](docs/architecture.svg) open at a readable size. |
| CP3 | Test filenames and the passing characterization test run. |
| CP4 | Regression test failing and passing, plus the affected app screen before and after the fix. |
| CP5 | PR page showing the title, issue reference, and fork URL. |

On macOS, press `Shift-Command-4` and drag around the content you want to include. Capture temporary states, such as the first failing regression run, while they are visible.
