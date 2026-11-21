# ShopLedger repository guide

ShopLedger uses Node.js, CommonJS, Express, and a vanilla JavaScript frontend. Local persistence is a single JSON file.

- `server.js` serves the frontend, mounts the API routers, and handles printable invoices.
- `public/` contains the browser UI. `routes/` contains the catalog, orders, customers, and reporting endpoints.
- `lib/` contains checkout, invoice, inventory, Khata, reporting, date, and persistence logic.
- `config.js` contains shop settings, tax slabs, and coupon rules. `data/db.json` contains the tracked seed data and local application state.

Use `npm install` to install declared dependencies, `npm start` to run the app, and `node --test` to run the workshop tests. The baseline `npm test` script is a placeholder.

- Write and run passing characterization tests before changing behavior.
- Limit behavior changes to the module or modules covered by the ticket.
- Use in-memory fixtures for tests. Tests must never read or write `data/db.json`.
- Add no dependencies.
