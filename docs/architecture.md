# ShopLedger architecture

[Open the standalone diagram](architecture.svg) for a screenshot of the architecture.

```mermaid
flowchart LR
    UI["Browser UI · public/"] --> SERVER["server.js"]
    SERVER --> PRODUCTS["routes/products.js"]
    SERVER --> ORDERS["routes/orders.js"]
    SERVER --> CUSTOMERS["routes/customers.js"]
    SERVER --> REPORTS["routes/reports.js"]

    ORDERS == "1. Read current data" ==> STORE["lib/store.js"]
    ORDERS == "2. Check and deduct stock" ==> INVENTORY["lib/inventory.js"]
    ORDERS == "3. Compute checkout totals" ==> PRICING["lib/pricing.js"]
    ORDERS == "4. Charge Khata when selected" ==> LEDGER["lib/ledger.js"]
    ORDERS --> COUPONS
    ORDERS == "5. Add order" ==> ORDERLOGIC["lib/orders.js"]
    ORDERS == "6. Append audit and save" ==> STORE
    STORE == "Read and rewrite JSON" ==> DB["data/db.json"]

    PRODUCTS --> TAX & INVENTORY & COUPONS["lib/coupons.js"] & STORE
    CUSTOMERS --> LEDGER & STORE
    REPORTS --> REPORTLOGIC["lib/reports.js"] & PRICING & COUPONS & STORE
    SERVER -->|"Printable invoice"| INVOICE["lib/invoice.js"]
    SERVER --> ORDERLOGIC & STORE
    REPORTLOGIC --> INVOICE & INVENTORY & LEDGER
    PRICING --> COUPONS & TAX["lib/tax.js"]
    ORDERLOGIC --> DATES["lib/dates.js"] & INVENTORY & LEDGER
    LEDGER --> DATES
    SERVER & INVENTORY & COUPONS & TAX & INVOICE & REPORTS --> CONFIG["config.js"]
```

## Place an order

The browser sends item IDs, quantities, and checkout details to `POST /api/orders`. The router reads the current store, resolves each item from the catalog, checks sellable stock, and validates the coupon. Pricing applies the discount and calculates GST using each item's HSN code. The stock check happens before pricing, and the physical stock deduction happens after any Khata debit succeeds.

The router then adds the order, appends an audit entry, and writes the updated database. On HTTP `201`, the browser displays the saved total and a link to the printable invoice. The invoice route retrieves the saved order and passes it to `lib/invoice.js` to calculate and render the printed figures. GST reconciliation uses that same invoice calculator to compare against the stored checkout figures.
