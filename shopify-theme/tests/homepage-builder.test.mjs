import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const section = fs.readFileSync(new URL('../sections/package-browser.liquid', import.meta.url), 'utf8');
assert.ok(section.includes('id="PackageBrowser-{{ section.id }}"'), 'Builder styles must target the rendered section ID');
const script = section.match(/<script>([\s\S]*?)<\/script>/)?.[1]
  .replaceAll('{{ section.id }}', 'test')
  .replace('{{ palette_names | json }}', JSON.stringify(['Autumn in the Countryside', 'Classic Harvest', 'Coastal Cowgirl']))
  .replace('{{ palette_descriptions | json }}', JSON.stringify(['Countryside colors', 'Harvest oranges', 'Coastal pastels']));
assert.ok(script, 'The homepage builder script must exist');

function fixture(variants) {
  const listeners = {};
  const stored = {};
  const radios = ['Autumn in the Countryside', 'Classic Harvest', 'Coastal Cowgirl'].map(value => ({
    value, checked: value === 'Autumn in the Countryside',
    addEventListener(event, listener) { listeners[`radio:${value}:${event}`] = listener; },
  }));
  const image = { dataset: { palette: 'Autumn in the Countryside' }, classList: { toggle() {} } };
  const empty = { hidden: false };
  const palette = { textContent: '' };
  const description = { textContent: '' };
  const scale = { textContent: '' };
  const statuses = {};
  const details = {};
  const cards = ['small', 'medium', 'large'].map(key => {
    statuses[key] = { textContent: '' };
    details[key] = { hidden: true };
    const disclosure = { textContent: '' };
    return {
      dataset: {
        productUrl: `/products/${key}-pumpkin-display`,
        paletteOptionIndex: '0',
        paletteVariants: JSON.stringify(variants),
        scaleName: { small: 'The Stoop', medium: 'The Porch', large: 'The Estate' }[key],
        defaultScale: key === 'medium' ? 'true' : 'false',
      },
      attrs: { 'aria-expanded': 'false' },
      parentElement: { querySelector: () => details[key] },
      querySelector(selector) { return selector === '[data-package-disclosure]' ? disclosure : statuses[key]; },
      getAttribute(name) { return this.attrs[name]; },
      setAttribute(name, value) { this.attrs[name] = value; },
      addEventListener(event, listener) { listeners[`card:${key}:${event}`] = listener; },
    };
  });
  const link = {
    attrs: {},
    setAttribute(name, value) { this.attrs[name] = value; },
    removeAttribute(name) { delete this.attrs[name]; if (name === 'href') delete this.href; },
  };
  const root = {
    dataset: {},
    querySelectorAll(selector) {
      if (selector.startsWith('input[name=')) return radios;
      if (selector === '[data-package-card]') return cards;
      if (selector === '[data-palette-browser-gallery] [data-palette]') return [image];
      return [];
    },
    querySelector(selector) {
      if (selector === 'input[name="package-palette-test"]:checked') return radios.find(radio => radio.checked);
      if (selector === '[data-package-card][data-default-scale="true"]') return cards[1];
      return ({
        '.palette-study__empty': empty,
        '[data-selected-palette]': palette,
        '[data-selected-palette-description]': description,
        '[data-selected-scale]': scale,
        '[data-package-continue]': link,
      })[selector] ?? null;
    },
  };
  vm.runInNewContext(script, {
    document: { querySelector: () => root, dispatchEvent() {} },
    window: { location: { origin: 'https://example.test', search: '' } },
    sessionStorage: { setItem(key, value) { stored[key] = value; } },
    Event: class Event { constructor(type) { this.type = type; } },
    URL, URLSearchParams,
  });
  return { listeners, radios, link, palette, scale, status: statuses.medium, cards, details, stored };
}

test('selecting an available palette and scale opens the matching Shopify product', () => {
  const view = fixture([
    { options: ['Autumn in the Countryside'], available: true, price: 45000 },
    { options: ['Classic Harvest'], available: true, price: 45000 },
    { options: ['Coastal Cowgirl'], available: true, price: 45000 },
  ]);
  assert.equal(view.scale.textContent, 'The Porch');
  assert.equal(view.cards[1].attrs['aria-pressed'], 'true');
  assert.equal(view.cards[1].attrs['aria-expanded'], 'false', 'The default scale stays collapsed until clicked');
  assert.equal(view.cards[0].attrs['aria-pressed'], 'false');
  assert.equal(view.link.href, '/products/medium-pumpkin-display?palette=Autumn+in+the+Countryside');
  assert.equal(view.link.attrs['aria-disabled'], 'false');
  view.radios[0].checked = false;
  view.radios[1].checked = true;
  view.listeners['radio:Classic Harvest:change']();
  assert.equal(view.palette.textContent, 'Classic Harvest');
  assert.equal(view.scale.textContent, 'The Porch');
  assert.equal(view.link.href, '/products/medium-pumpkin-display?palette=Classic+Harvest');
  assert.deepEqual(JSON.parse(view.stored['palette-install-consultation-v1']).choices, {
    display: 'The Porch', palette: 'Classic Harvest'
  });
  view.radios[1].checked = false;
  view.radios[2].checked = true;
  view.listeners['radio:Coastal Cowgirl:change']();
  assert.equal(view.palette.textContent, 'Coastal Cowgirl');
  assert.equal(view.link.href, '/products/medium-pumpkin-display?palette=Coastal+Cowgirl');
  view.listeners['card:small:click']();
  assert.equal(view.scale.textContent, 'The Stoop');
  assert.equal(view.cards[0].attrs['aria-pressed'], 'true');
  assert.equal(view.cards[0].attrs['aria-expanded'], 'true');
  assert.equal(view.details.small.hidden, false);
  assert.equal(view.link.href, '/products/small-pumpkin-display?palette=Coastal+Cowgirl');
  assert.equal(JSON.parse(view.stored['palette-install-consultation-v1']).choices.display, 'The Stoop');
  view.listeners['card:large:click']();
  assert.equal(view.scale.textContent, 'The Estate');
  assert.equal(view.details.small.hidden, true);
  assert.equal(view.details.large.hidden, false);
  assert.equal(view.link.href, '/products/large-pumpkin-display?palette=Coastal+Cowgirl');
  view.listeners['card:large:click']();
  assert.equal(view.details.large.hidden, true);
  assert.equal(view.cards[2].attrs['aria-pressed'], 'true', 'Closing details must not deselect the size');
});

test('unavailable or unpriced palette cannot continue', () => {
  for (const variant of [
    { options: ['Autumn in the Countryside'], available: false, price: 45000 },
    { options: ['Autumn in the Countryside'], available: true, price: 0 },
    { options: ['Classic Autumn'], available: true, price: 45000 },
  ]) {
    const view = fixture([variant]);
    assert.equal(view.link.attrs['aria-disabled'], 'true');
    assert.equal(view.link.href, undefined);
    assert.match(view.status.textContent, /not available/);
  }
});

test('each shipped palette has a matching editable image block', () => {
  const schema = JSON.parse(section.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
  const imageBlock = schema.blocks.find(block => block.type === 'palette_image');
  const settings = new Map(imageBlock.settings.map(setting => [setting.id, setting]));
  for (const id of ['position_x', 'position_y', 'zoom', 'flip_180']) {
    assert.ok(settings.has(id), `Missing editor control: ${id}`);
  }
  const homepage = JSON.parse(fs.readFileSync(new URL('../templates/index.json', import.meta.url)));
  const browser = Object.values(homepage.sections).find(item => item.type === 'package-browser');
  const blocks = Object.values(browser.blocks).filter(block => block.type === 'palette_image');
  const scales = Object.values(browser.blocks).filter(block => block.type === 'package');
  assert.deepEqual(scales.map(block => block.settings.included_items.split('\n').length), [5, 6, 9]);
  assert.equal(scales[0].settings.included_items.includes('Hay Bales'), false);
  assert.equal(scales[1].settings.included_items.includes('2 Hay Bales'), true);
  assert.equal(scales[2].settings.included_items.includes('2 Hay Bales'), true);
  assert.ok(schema.blocks.find(block => block.type === 'package').settings.some(setting => setting.id === 'included_items'));
  assert.deepEqual(scales.filter(block => block.settings.default_selected).map(block => block.settings.scale_name), ['The Porch']);
  assert.deepEqual(scales.filter(block => block.settings.most_popular).map(block => block.settings.scale_name), ['The Porch']);
  assert.ok(schema.blocks.find(block => block.type === 'package').settings.some(setting => setting.id === 'most_popular'));
  assert.equal(blocks.length, 3);
  for (const block of blocks) {
    assert.ok(settings.get('palette').options.some(option => option.value === block.settings.palette));
    assert.ok(settings.get('reference_asset').options.some(option => option.value === block.settings.reference_asset));
    assert.ok(fs.existsSync(new URL(`../assets/${block.settings.reference_asset}.webp`, import.meta.url)));
  }
});