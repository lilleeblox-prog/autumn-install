import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../assets/theme.js', import.meta.url), 'utf8');
const helpers = source.slice(
  source.indexOf('const CONSULTATION_STORAGE_KEY'),
  source.indexOf('function setupProductJourney')
);
const contactMarkup = fs.readFileSync(new URL('../sections/contact-form.liquid', import.meta.url), 'utf8');
assert.ok(contactMarkup.includes('{% form \'contact\' %}'), 'The Shopify contact form must remain a native form');
assert.ok(contactMarkup.includes('data-consultation-form'));

function fixture() {
  const stored = new Map();
  const listeners = new Map();
  const context = vm.createContext({
    sessionStorage: {
      setItem(key, value) { stored.set(key, value); },
      getItem(key) { return stored.get(key) ?? null; },
      removeItem(key) { stored.delete(key); },
    },
    document: {
      addEventListener(type, listener) { listeners.set(type, listener); },
      dispatchEvent(event) { listeners.get(event.type)?.(); },
    },
    Event: class Event { constructor(type) { this.type = type; } },
    FormData: class FormData {
      constructor(form) { this.form = form; }
      get(key) { return this.form.values[key] ?? null; }
    },
    Date, JSON,
  });
  vm.runInContext(`${helpers}\nthis.save = saveConsultationDraft; this.snapshot = productConsultationChoices; this.prefill = setupConsultationForm;`, context);
  return { stored, save: context.save, snapshot: context.snapshot, prefill: context.prefill };
}

function product() {
  const paletteGroup = {
    querySelector(selector) {
      if (selector === '.variant-picker__label') return { textContent: 'Palette' };
      if (selector === 'input[type="radio"]:checked') return { value: 'Classic Harvest' };
      return null;
    },
  };
  return {
    dataset: { productTitle: 'The Porch' },
    values: {
      'properties[Service]': 'Custom installation',
      'properties[Vinyl Artwork]': 'Yes',
      'properties[Vinyl-wrapped Pumpkins]': '2',
      'properties[Pumpkin Color Preference]': 'White',
      'properties[Vinyl Color Preference]': 'Gold',
      'properties[Requested Week]': 'Week of Oct 5, 2026',
      'properties[Removal]': 'Yes',
      'properties[General Notes]': 'A fall birthday celebration',
    },
    querySelectorAll(selector) { return selector === '.variant-picker__group' ? [paletteGroup] : []; },
    querySelector(selector) {
      if (selector === '[data-service-products]') return { dataset: { displaySize: 'medium' } };
      if (selector === '[data-artwork-file]') return { files: [{ name: 'artwork.png' }] };
      if (selector === '[data-custom-request]') return { checked: true };
      return null;
    },
  };
}

function contactForm() {
  const timing = { value: '', dataset: {} };
  const body = { value: '', dataset: {} };
  const notice = { hidden: true };
  const root = {
    dataset: {},
    success: false,
    querySelector(selector) {
      if (selector === '[data-contact-success]') return this.success ? {} : null;
      if (selector === '[name="contact[timing]"]') return timing;
      if (selector === '[name="contact[body]"]') return body;
      if (selector === '[data-consultation-prefill-notice]') return notice;
      return null;
    },
  };
  return { root, timing, body, notice };
}

test('a selected Shopify design prefills the native consultation form without copying artwork bytes', () => {
  const app = fixture();
  const form = contactForm();
  app.prefill(form.root);
  assert.equal(app.save(app.snapshot(product())), true);
  assert.equal(form.timing.value, 'Week of Oct 5, 2026');
  assert.match(form.body.value, /Display: The Porch/);
  assert.match(form.body.value, /Palette: Classic Harvest/);
  assert.match(form.body.value, /Fulfillment: Custom installation/);
  assert.match(form.body.value, /Hay bales: 2 included/);
  assert.match(form.body.value, /Vinyl-wrapped pumpkins: 2/);
  assert.match(form.body.value, /Removal: Yes/);
  assert.match(form.body.value, /Your vision: A fall birthday celebration/);
  assert.match(form.body.value, /file not transferred/);
  assert.doesNotMatch(app.stored.get('palette-install-consultation-v1'), /artwork\\.png/);
  assert.equal(form.notice.hidden, false);

  form.body.value = 'A personally edited request';
  form.timing.value = 'Oct 9 birthday';
  app.save({ display: 'The Estate', displaySize: 'large', palette: 'Coastal Cowgirl' });
  assert.equal(form.body.value, 'A personally edited request', 'Updated selections must not overwrite edits');
  assert.equal(form.timing.value, 'Oct 9 birthday');
});

test('a successful Shopify inquiry clears old choices instead of refilling the next inquiry', () => {
  const app = fixture();
  app.save({ display: 'The Stoop', palette: 'Classic Harvest' });
  const form = contactForm();
  form.root.success = true;
  app.prefill(form.root);
  assert.equal(app.stored.has('palette-install-consultation-v1'), false);
  assert.equal(form.body.value, '');
});

test('homepage palette and scale choices carry over without inventing other choices', () => {
  const app = fixture();
  app.save({ display: 'The Stoop', palette: 'Classic Harvest' });
  const form = contactForm();
  app.prefill(form.root);
  assert.equal(form.body.value, 'Display: The Stoop\nPalette: Classic Harvest');
  assert.equal(form.timing.value, '');
  assert.doesNotMatch(form.body.value, /Hay bales|Fulfillment|Removal/);
});