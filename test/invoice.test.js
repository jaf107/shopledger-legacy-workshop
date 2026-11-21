const assert = require('node:assert/strict');
const test = require('node:test');
const { computeInvoiceFigures } = require('../lib/invoice');

const rice = { id: 1, sku: 'GRN-001', name: 'Rice', hsn: '1006', qty: 1 };
const tea = { id: 2, sku: 'TEA-001', name: 'Tea', hsn: '0902', qty: 1 };

test('invoice itemizes a coupon-free 18% order and splits GST', () => {
  const invoice = computeInvoiceFigures({ items: [{ ...tea, price: 500 }] });

  assert.deepEqual(invoice, {
    subtotal: 500,
    discount: 0,
    tax: 90,
    cgst: 45,
    sgst: 45,
    total: 590,
    rows: [{
      name: 'Tea',
      sku: 'TEA-001',
      hsn: '0902',
      qty: 1,
      price: 500,
      gstPercent: 18,
      line: 500,
      lineTax: 90
    }]
  });
});

test('CURRENT BEHAVIOUR: invoice uses 18% for rice with a 5% HSN slab', () => {
  const invoice = computeInvoiceFigures({ items: [{ ...rice, price: 500 }] });

  assert.equal(invoice.rows[0].gstPercent, 18);
  assert.equal(invoice.tax, 90);
  assert.equal(invoice.total, 590);
});

test('CURRENT BEHAVIOUR: SAVE10 is applied after invoice GST', () => {
  const invoice = computeInvoiceFigures({
    items: [{ ...rice, price: 1020 }],
    coupon: 'SAVE10',
    subtotal: 1020,
    discount: 102,
    tax: 45.90,
    total: 963.90
  });

  assert.equal(invoice.discount, 120.36);
  assert.equal(invoice.tax, 183.60);
  assert.equal(invoice.total, 1083.24);
});

test('CURRENT BEHAVIOUR: invoice ignores the SAVE10 discount cap', () => {
  const invoice = computeInvoiceFigures({
    items: [{ ...tea, price: 2240 }],
    coupon: 'SAVE10'
  });

  assert.equal(invoice.discount, 264.32);
  assert.equal(invoice.tax, 403.20);
  assert.equal(invoice.total, 2378.88);
});
