import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const source = readFileSync(new URL('../assets/theme.js', import.meta.url), 'utf8');

class FormValues {
  constructor(form) { this.values = form.values; }
  get(name) { return this.values.find(([key]) => key === name)?.[1] ?? null; }
  entries() { return this.values[Symbol.iterator](); }
}

const context = vm.createContext({
  document: { addEventListener() {} },
  window: { crypto: { randomUUID: () => 'test-id' } },
  FormData: FormValues,
  fetch: async () => { throw new Error('Unexpected request'); },
});
vm.runInContext(source, context);

test('live price adds selected priced upgrades and marks unpriced services pending', () => {
  const calculate = vm.runInContext('calculateCompositionEstimate', context);
  const estimate = calculate(82500, [
    { label: 'Vinyl-wrapped pumpkin', priceCents: 2500, quantity: 2 },
    { label: 'Removal · not included', priceCents: 0 },
  ]);
  assert.equal(estimate.knownCents, 87500);
  assert.deepEqual(Array.from(estimate.pending), ['Removal · not included']);
  assert.equal(estimate.rows[1].priceCents, 5000);
  assert.equal(estimate.rows[2].priceCents, null);
});

test('live price does not count an invalid quantity or missing base price', () => {
  const calculate = vm.runInContext('calculateCompositionEstimate', context);
  const estimate = calculate(0, [{ label: 'Vinyl-wrapped pumpkin', priceCents: 2500, quantity: 0 }]);
  assert.equal(estimate.knownCents, 0);
  assert.deepEqual(Array.from(estimate.pending), ['Base display', 'Vinyl-wrapped pumpkin']);
});

test('delivery and removal each use the size fee while installation and hay bales are included', () => {
  const calculate = vm.runInContext('calculateCompositionEstimate', context);
  const estimate = calculate(82500, [
    { label: 'Delivery', priceCents: 5000 },
    { label: 'Custom installation · setup', included: true },
    { label: 'Hay bales · pair', included: true },
    { label: 'Removal', priceCents: 5000 },
  ]);
  assert.equal(estimate.knownCents, 92500);
  assert.deepEqual(Array.from(estimate.pending), []);
  assert.equal(estimate.rows[2].included, true);
  assert.equal(estimate.rows[3].priceCents, 0);
});

function form(overrides = {}) {
  const values = [
    ['id', '101'], ['quantity', '1'],
    ['properties[Requested Week]', 'Week of Oct 5'],
    ['properties[Service]', 'Delivery only'],
    ['properties[Hay Bales]', 'Yes'],
    ['properties[Vinyl Artwork]', 'No'],
    ['properties[Removal]', 'No'],
  ];
  for (const [name, value] of Object.entries(overrides.values || {})) {
    const index = values.findIndex(([key]) => key === name);
    if (index >= 0) values[index][1] = value;
    else values.push([name, value]);
  }
  return {
    values,
    reportValidity: () => true,
    querySelector(selector) {
      if (selector === 'select[name="id"]') {
        return { options: [{ value: '101', disabled: false, dataset: { price: overrides.price ?? '10000' } }] };
      }
      if (selector === '[data-requested-week]') {
        return { options: [{ value: 'Week of Oct 5' }] };
      }
      if (selector === '[data-service-products]') {
        return { dataset: { displaySize: 'medium', deliveryId: '201', deliveryPrice: '5000', monogramId: '203', removalId: '204', removalPrice: '5000', ...overrides.services } };
      }
      if (selector === '[data-artwork-file]') {
        return { files: overrides.artwork ? [overrides.artwork] : [] };
      }
    },
    querySelectorAll(selector) {
      return selector === '[name="addons[]"]:checked'
        ? (overrides.extras || []).map(value => ({ value }))
        : [];
    }
  };
}

test('approval creates one grouped base line and separate selected extras', () => {
  const result = vm.runInContext('configuredCartItems', context)(form({ extras: ['301'] }));
  assert.equal(result.items.length, 3);
  assert.equal(result.items[0].properties['Requested Week'], 'Week of Oct 5');
  assert.equal(result.items[1].properties['_Service Kind'], 'delivery');
  assert.equal(result.items[2].properties['_Service Kind'], 'extra');
  assert.equal(result.items[2].properties['_Composition ID'], result.compositionId);
});

test('installation is free, but delivery, vinyl artwork, and removal each have grouped lines', () => {
  const result = vm.runInContext('configuredCartItems', context)(form({
    values: {
      'properties[Service]': 'Custom installation',
      'properties[Vinyl Artwork]': 'Yes',
      'properties[Vinyl-wrapped Pumpkins]': '2',
      'properties[Pumpkin Color Preference]': 'White',
      'properties[Vinyl Color Preference]': 'Gold',
      'properties[Removal]': 'Yes',
    },
    artwork: { name: 'signature.pdf', size: 1024, type: 'application/pdf' }
  }));
  assert.deepEqual(Array.from(result.items, item => item.id), ['101', '201', '203', '204']);
  assert.equal(result.items[2].quantity, 2);
  assert.equal(result.items[0].properties['Vinyl Artwork'], 'Yes');
  assert.equal(result.items[0].properties['Hay Bales'], 'Yes', 'The Porch includes hay bales with either fulfillment method');
  assert.equal(result.items[0].properties['Artwork File'], undefined, 'file bytes must use Shopify multipart form, not JSON');
});

test('each display charges its service fee and includes hay only with The Porch and The Estate', () => {
  const configure = vm.runInContext('configuredCartItems', context);
  for (const [size, price, hay] of [['small', '2500', 'No'], ['medium', '5000', 'Yes'], ['large', '8500', 'Yes']]) {
    const result = configure(form({
      values: { 'properties[Service]': 'Delivery only', 'properties[Hay Bales]': hay, 'properties[Removal]': 'Yes' },
      services: { displaySize: size, deliveryPrice: price, removalPrice: price }
    }));
    assert.deepEqual(Array.from(result.items, item => item.properties['_Service Kind'] || 'base'), ['base', 'delivery', 'removal']);
    assert.equal(result.items[0].properties['Hay Bales'], hay);
  }
});

test('vinyl artwork requires a PNG or PDF and listed pumpkin and vinyl colors', () => {
  const configure = vm.runInContext('configuredCartItems', context);
  const values = {
    'properties[Vinyl Artwork]': 'Yes',
    'properties[Vinyl-wrapped Pumpkins]': '1',
    'properties[Pumpkin Color Preference]': 'Orange',
    'properties[Vinyl Color Preference]': 'Black'
  };
  assert.throws(() => configure(form({ values })), /Upload a PNG or PDF/);
  assert.throws(() => configure(form({ values, artwork: { name: 'design.svg', size: 100, type: 'image/svg+xml' } })), /Upload a PNG or PDF/);
  assert.throws(() => configure(form({ values, artwork: { name: 'design.png', size: 21 * 1024 * 1024, type: 'image/png' } })), /20 MB or smaller/);
  assert.throws(() => configure(form({ values, artwork: { name: 'design.pdf', size: 100, type: 'image/png' } })), /Upload a PNG or PDF/);
  assert.throws(() => configure(form({
    values: { ...values, 'properties[Pumpkin Color Preference]': 'Purple' },
    artwork: { name: 'design.png', size: 100, type: 'image/png' }
  })), /white or orange pumpkin/);
});

test('unpriced base and missing paid service cannot reach cart', () => {
  const configure = vm.runInContext('configuredCartItems', context);
  assert.throws(() => configure(form({ price: '0' })), /not priced/);
  assert.throws(() => configure(form({
    values: { 'properties[Service]': 'Custom installation' },
    services: { deliveryId: '' }
  })), /not available to order/);
  assert.throws(() => configure(form({
    services: { deliveryPrice: '2500' }
  })), /delivery price no longer matches/);
  assert.throws(() => configure(form({
    values: { 'properties[Removal]': 'Yes' },
    services: { removalPrice: '2500' }
  })), /removal price no longer matches/);
  assert.throws(() => configure(form({
    values: { 'properties[Hay Bales]': 'No' }
  })), /hay-bale inclusion does not match/);
  assert.throws(() => configure(form({
    values: { 'properties[Hay Bales]': 'Yes' },
    services: { displaySize: 'small', deliveryPrice: '2500' }
  })), /hay-bale inclusion does not match/);
});

test('cart review accepts grouped extras but rejects missing service lines', () => {
  const validate = vm.runInContext('validateCartGroups', context);
  const base = {
    dataset: { compositionId: 'test-id', serviceKind: '', itemQuantity: '1', displaySize: 'medium', service: 'Delivery only', hay: 'Yes', monogram: 'No', removal: 'No' },
    querySelector: () => ({ value: '1' })
  };
  const extra = {
    dataset: { compositionId: 'test-id', serviceKind: 'extra', itemQuantity: '1' },
    querySelector: () => ({ value: '1' })
  };
  const delivery = {
    dataset: { compositionId: 'test-id', serviceKind: 'delivery', itemQuantity: '1' },
    querySelector: () => ({ value: '1' })
  };
  const error = { textContent: '' };
  const cart = {
    dataset: {},
    querySelector: () => error,
    querySelectorAll: () => [base, delivery, extra]
  };
  assert.equal(validate(cart), true);
  base.dataset.hay = 'No';
  assert.equal(validate(cart), false);
  assert.match(error.textContent, /hay bales in this composition/);
  base.dataset.hay = 'Yes';
  cart.querySelectorAll = () => [base, extra];
  assert.equal(validate(cart), false);
  assert.match(error.textContent, /missing or has mismatched paid service lines/);
  cart.querySelectorAll = () => [base, delivery, extra];
  base.dataset.artworkRequired = 'true';
  base.dataset.artworkPresent = 'false';
  assert.equal(validate(cart), false);
  assert.match(error.textContent, /Artwork is missing/);
  base.dataset.artworkPresent = 'true';
  base.dataset.monogram = 'Yes';
  base.dataset.monogramQty = '2';
  assert.equal(validate(cart), false);
  assert.match(error.textContent, /mismatched paid service/);
});

test('native artwork upload only adds paid extras after Shopify stores the file', async () => {
  const memory = new Map();
  const pending = {
    compositionId: 'uploaded-design',
    extras: [{ id: '203', quantity: 2, properties: { '_Composition ID': 'uploaded-design', '_Service Kind': 'monogram' } }]
  };
  memory.set('palette-pending-artwork-composition', JSON.stringify(pending));
  context.sessionStorage = {
    getItem: key => memory.get(key) || null,
    setItem: (key, value) => memory.set(key, value),
    removeItem: key => memory.delete(key)
  };
  let navigations = 0;
  context.window.location = { replace: () => { navigations++; } };
  let addRequests = 0;
  const items = [{ variant_id: 101, quantity: 1, properties: { '_Composition ID': 'uploaded-design', 'Artwork File': 'https://cdn.shopify.com/uploads/design.pdf' } }];
  context.fetch = async (url, options) => {
    if (url === '/cart/add.js') {
      addRequests++;
      const [extra] = JSON.parse(options.body).items;
      items.push({ variant_id: Number(extra.id), quantity: extra.quantity, properties: extra.properties });
      return { ok: true };
    }
    return { ok: true, json: async () => ({ items }) };
  };
  const finish = vm.runInContext('finishPendingArtwork', context);
  await finish({ dataset: {} });
  assert.equal(addRequests, 1);
  assert.equal(navigations, 1);
  assert.equal(memory.has('palette-pending-artwork-composition'), false);
});

test('interrupted artwork service addition does not retry blindly', async () => {
  const memory = new Map();
  memory.set('palette-pending-artwork-composition', JSON.stringify({
    compositionId: 'uploaded-design', started: true,
    extras: [{ id: '203', quantity: 1, properties: { '_Composition ID': 'uploaded-design', '_Service Kind': 'monogram' } }]
  }));
  context.sessionStorage = {
    getItem: key => memory.get(key) || null,
    setItem: (key, value) => memory.set(key, value),
    removeItem: key => memory.delete(key)
  };
  let addRequests = 0;
  context.fetch = async (url) => {
    if (url === '/cart/add.js') addRequests++;
    return { ok: true, json: async () => ({ items: [{
      variant_id: 101, properties: { '_Composition ID': 'uploaded-design', 'Artwork File': 'https://cdn.shopify.com/uploads/design.pdf' }
    }] }) };
  };
  await assert.rejects(vm.runInContext('finishPendingArtwork', context)({ dataset: {} }), { name: 'CartReviewRequired' });
  assert.equal(addRequests, 0);
});

test('lost add response is reconciled without a second chargeable add', async () => {
  let adds = 0;
  context.fetch = async (url) => {
    if (url === '/cart/add.js') {
      adds++;
      throw new Error('response lost');
    }
    return {
      ok: true,
      json: async () => ({ items: [{ properties: { '_Composition ID': 'test-id' } }] })
    };
  };
  await vm.runInContext('addCompositionToCart', context)({ items: [], compositionId: 'test-id' });
  assert.equal(adds, 1);
});

test('unconfirmed add requires cart review instead of a blind retry', async () => {
  let adds = 0;
  context.fetch = async (url) => {
    if (url === '/cart/add.js') {
      adds++;
      throw new Error('response lost');
    }
    return { ok: true, json: async () => ({ items: [] }) };
  };
  await assert.rejects(
    vm.runInContext('addCompositionToCart', context)({ items: [], compositionId: 'test-id' }),
    { name: 'CartReviewRequired' }
  );
  assert.equal(adds, 1);
});

test('lost removal response never deletes the replacement', async () => {
  let updates = 0;
  let items = [
    { key: 'old-line', properties: { '_Composition ID': 'old' } },
    { key: 'new-line', properties: { '_Composition ID': 'new' } }
  ];
  context.fetch = async (url) => {
    if (url === '/cart/update.js') {
      updates++;
      items = items.filter(item => item.key !== 'old-line');
      throw new Error('response lost');
    }
    return { ok: true, json: async () => ({ items }) };
  };
  await vm.runInNewContext('replaceComposition', context)('old', 'new');
  assert.equal(updates, 1);
  assert.deepEqual(items.map(item => item.key), ['new-line']);
});

test('uncertain replacement with both versions requires review, not rollback', async () => {
  let updates = 0;
  context.fetch = async (url) => {
    if (url === '/cart/update.js') {
      updates++;
      throw new Error('response lost');
    }
    return { ok: true, json: async () => ({
      items: [
        { key: 'old-line', properties: { '_Composition ID': 'old' } },
        { key: 'new-line', properties: { '_Composition ID': 'new' } }
      ]
    }) };
  };
  await assert.rejects(vm.runInContext('replaceComposition', context)('old', 'new'), { name: 'CartReviewRequired' });
  assert.equal(updates, 1);
});