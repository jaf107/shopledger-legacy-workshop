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

test('invoice uses the 5% HSN slab for rice', () => {
  const invoice = computeInvoiceFigures({ items: [{ ...rice, price: 500 }] });

  assert.equal(invoice.rows[0].gstPercent, 5);
  assert.equal(invoice.tax, 25);
  assert.equal(invoice.total, 525);
});

test('invoice applies the SAVE10 cap before calculating GST', () => {
  const invoice = computeInvoiceFigures({
    items: [{ ...tea, price: 2240 }],
    coupon: 'SAVE10'
  });

  assert.equal(invoice.discount, 150);
  assert.equal(invoice.tax, 376.20);
  assert.equal(invoice.total, 2466.20);
});

test('invoice matches the recorded checkout totals for a discounted 5% order', () => {
  const order = {
    items: [{ ...rice, price: 1020 }],
    coupon: 'SAVE10',
    subtotal: 1020,
    discount: 102,
    tax: 45.90,
    total: 963.90
  };
  const invoice = computeInvoiceFigures(order);

  assert.deepEqual(
    { discount: invoice.discount, tax: invoice.tax, total: invoice.total },
    { discount: order.discount, tax: order.tax, total: order.total }
  );
  assert.equal(invoice.rows[0].lineTax, 45.90);
  assert.equal(invoice.cgst + invoice.sgst, invoice.tax);
});
