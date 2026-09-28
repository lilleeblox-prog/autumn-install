/* Palette Install Theme JS */

function formatMoney(cents, format) {
  if (typeof cents === 'string') { cents = cents.replace('.', ''); }
  let value = '';
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  const formatString = format || '${{amount}}';
  
  function defaultOption(opt, def) { return (typeof opt == 'undefined' ? def : opt); }
  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal = defaultOption(decimal, '.');
    if (isNaN(number) || number == null) { return 0; }
    number = (number / 100.0).toFixed(precision);
    const parts = number.split('.');
    const dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
    const centsParts = parts[1] ? (decimal + parts[1]) : '';
    return dollars + centsParts;
  }
  
  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount': value = formatWithDelimiters(cents, 2); break;
    case 'amount_no_decimals': value = formatWithDelimiters(cents, 0); break;
    case 'amount_with_comma_separator': value = formatWithDelimiters(cents, 2, '.', ','); break;
    case 'amount_no_decimals_with_comma_separator': value = formatWithDelimiters(cents, 0, '.', ','); break;
  }
  return formatString.replace(placeholderRegex, value);
}

function updatePaletteGalleries(palette) {
  document.querySelectorAll('[data-palette-gallery]').forEach((gallery) => {
    const items = gallery.querySelectorAll('[data-palette]');
    let visibleCount = 0;
    items.forEach((item) => {
      const isMatch = item.dataset.palette === palette;
      item.classList.toggle('hidden', !isMatch);
      if (isMatch) visibleCount += 1;
    });
    const emptyMessage = gallery.querySelector('.gallery-empty, .palette-gallery__empty');
    if (emptyMessage) emptyMessage.hidden = visibleCount > 0;
  });
}

function syncPaletteGalleries(selector, variant) {
  document.querySelectorAll('[data-palette-gallery]').forEach((gallery) => {
    const index = Number(gallery.dataset.paletteOptionIndex);
    if (variant && Number.isInteger(index) && variant.options[index]) {
      updatePaletteGalleries(variant.options[index]);
      return;
    }
    const selected = selector && selector.querySelectorAll('input[type="radio"]:checked');
    if (selected && selected[index]) updatePaletteGalleries(selected[index].value);
  });
}

function selectPaletteFromQuery(selector) {
  const palette = new URLSearchParams(window.location.search).get('palette');
  if (!palette) return { requested: false, matched: false, changed: false };
  const groups = selector.querySelectorAll('.variant-picker__group');
  let changed = false;
  let matched = false;
  groups.forEach((group) => {
    const label = group.querySelector('.variant-picker__label');
    if (!label || !label.textContent.toLowerCase().includes('palette')) return;
    const radio = Array.from(group.querySelectorAll('input[type="radio"]'))
      .find(input => input.value === palette);
    if (radio) {
      matched = true;
      if (!radio.checked) {
        radio.checked = true;
        changed = true;
      }
    }
  });
  return { requested: true, matched, changed };
}

function setupVariantSelectors() {
  document.querySelectorAll('variant-selects').forEach((selector) => {
    if (selector.dataset.paletteVariantBound === 'true') return;
    selector.dataset.paletteVariantBound = 'true';
    selector.addEventListener('change', () => {
      const form = selector.closest('form');
      if (!form) return;
      const error = form.querySelector('#product-form-error');
      if (error) {
        error.textContent = '';
        error.classList.add('hidden');
      }

      const selectedOptions = Array.from(selector.querySelectorAll('input[type="radio"]:checked')).map(input => input.value);
      const scriptData = selector.querySelector('[type="application/json"]');
      if (!scriptData) return;

      const variantsData = JSON.parse(scriptData.textContent);
      const currentVariant = variantsData.find(variant => selectedOptions.every((option, index) => variant.options[index] === option));
      const approveBtn = form.querySelector('[data-approve-design]');
      const masterSelect = form.querySelector('select[name="id"]');
      const priceContainer = document.querySelector('[data-price-container]');

      if (currentVariant) {
        if (masterSelect) masterSelect.value = currentVariant.id;
        if (priceContainer) {
          const moneyFormat = window.shopMoneyFormat || "${{amount}}";
          priceContainer.textContent = Number(currentVariant.price) > 0
            ? formatMoney(currentVariant.price, moneyFormat)
            : 'Pricing to be confirmed';
        }
        if (currentVariant.featured_image) {
          const mainImage = document.querySelector('[data-main-image]');
          if (mainImage) mainImage.src = currentVariant.featured_image.src;
        }
        const url = new URL(window.location.href);
        url.searchParams.set('variant', currentVariant.id);
        const paletteGallery = form.querySelector('[data-palette-gallery]');
        const paletteIndex = paletteGallery ? Number(paletteGallery.dataset.paletteOptionIndex) : -1;
        if (Number.isInteger(paletteIndex) && paletteIndex >= 0 && currentVariant.options[paletteIndex]) {
          url.searchParams.set('palette', currentVariant.options[paletteIndex]);
        }
        window.history.replaceState({}, '', url);
        if (approveBtn) {
          approveBtn.disabled = !currentVariant.available || Number(currentVariant.price) <= 0;
          approveBtn.textContent = !currentVariant.available ? 'Sold out' : Number(currentVariant.price) <= 0 ? 'Pricing pending' : form.dataset.editCompositionId ? 'Approve changes' : 'Approve design';
        }
      } else if (approveBtn) {
        approveBtn.disabled = true;
        approveBtn.textContent = 'Unavailable';
      }

      // Sync even when no variant matches the selected combination.
      syncPaletteGalleries(selector, currentVariant);
    });
    const selection = selectPaletteFromQuery(selector);
    if (selection.requested && !selection.matched) {
      const form = selector.closest('form');
      const error = form && form.querySelector('#product-form-error');
      if (error) {
        error.textContent = 'This palette is not offered in this size. Choose an available palette above.';
        error.classList.remove('hidden');
      }
      const submit = form && form.querySelector('[data-approve-design]');
      if (submit) submit.disabled = true;
    }
    if (selection.changed) {
      const selectedPalette = selector.querySelector('input[type="radio"]:checked');
      if (selectedPalette) selectedPalette.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      syncPaletteGalleries(selector);
    }
  });
}

function setupProductPalette(form) {
  const group = form.querySelector('[data-product-palette]');
  if (!group || group.dataset.paletteBound === 'true') return;
  group.dataset.paletteBound = 'true';
  const radios = Array.from(group.querySelectorAll('input[name="properties[Palette]"]'));
  const requested = new URLSearchParams(window.location.search).get('palette');
  const match = radios.find(input => input.value === requested);
  if (match) match.checked = true;
  const update = () => {
    const selected = radios.find(input => input.checked);
    updatePaletteGalleries(selected?.value || '');
    if (selected) {
      const url = new URL(window.location.href);
      url.searchParams.set('palette', selected.value);
      window.history.replaceState({}, '', url);
    }
  };
  group.addEventListener('change', update);
  update();
}

// Requested weeks close at midnight Monday in the studio's Central time zone.
const requestedWeekDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit'
});
function studioTodayIso(now = new Date()) {
  const parts = Object.fromEntries(requestedWeekDateFormatter.formatToParts(now).map(part => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
function requestedWeekStart(value) {
  const match = /^Week of (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2}), (\d{4})(?:$| [–-] )/.exec(value || '');
  if (!match) return '';
  const month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(match[1]);
  const year = Number(match[3]);
  const day = Number(match[2]);
  const date = new Date(Date.UTC(year, month, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month ||
      date.getUTCDate() !== day || date.getUTCDay() !== 1) return '';
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
function requestedWeekOpen(value, now = new Date()) {
  const start = requestedWeekStart(value);
  return !!start && start > studioTodayIso(now);
}
function refreshRequestedWeeks(form) {
  form.querySelectorAll('[data-requested-week]').forEach(control => {
    if (control.tagName === 'SELECT') {
      Array.from(control.options).forEach(option => {
        if (option.value) option.disabled = !requestedWeekOpen(option.value);
      });
      if (control.value && !requestedWeekOpen(control.value)) {
        control.value = '';
        control.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } else {
      control.disabled = !requestedWeekOpen(control.value);
      control.closest('.composer-week-card')?.classList.toggle('is-expired', control.disabled);
      if (control.disabled && control.checked) {
        control.checked = false;
        control.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  });
}
function setupRequestedWeekAvailability(form) {
  if (form.dataset.weekAvailabilityBound === 'true') return;
  form.dataset.weekAvailabilityBound = 'true';
  const refresh = () => refreshRequestedWeeks(form);
  const tick = () => {
    if (!form.isConnected) return;
    refresh();
    setTimeout(tick, 60000 - Date.now() % 60000 + 50);
  };
  tick();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  window.addEventListener('focus', refresh);
}
window.paletteInstallWeekAvailability = { setup: setupRequestedWeekAvailability, open: requestedWeekOpen };

const CONSULTATION_STORAGE_KEY = 'palette-install-consultation-v1';

// Merchant-provided delivery list: "ZIPs near 37064" workbook, ZIP Type = Standard.
// PO Box-only and unique-organization ZIPs cannot receive a street installation.
const SERVICE_AREA_ZIPS = new Set([
  '37064', '37069', '37067', '37027', '37179', '37221', '37220', '37135',
  '37215', '37205', '37046', '37211', '37014', '37204', '37062', '37212',
  '37174', '37013', '37143', '37209', '37203', '37210', '37201', '37217',
  '37219', '37208', '37213', '37082', '37228', '37238', '37060', '37086',
  '37206', '37218', '38482', '37214', '37207', '37167', '37216', '38476',
  '37128', '37153', '37187', '37034', '37076', '37025', '38401', '37189',
  '37115', '37098'
]);
function serviceAreaForZip(value) {
  const zip = String(value || '').trim();
  if (!/^\d{5}$/.test(zip)) return 'invalid';
  return SERVICE_AREA_ZIPS.has(zip) ? 'within' : 'outside';
}
window.paletteInstallServiceArea = { check: serviceAreaForZip };

function saveConsultationDraft(choices) {
  try {
    sessionStorage.setItem(CONSULTATION_STORAGE_KEY, JSON.stringify({ savedAt: Date.now(), choices }));
    document.dispatchEvent(new Event('palette-install:consultation-updated'));
    return true;
  } catch {
    return false;
  }
}

function productConsultationChoices(form) {
  const data = new FormData(form);
  const text = key => String(data.get(key) || '');
  const paletteGroup = Array.from(form.querySelectorAll('.variant-picker__group'))
    .find(group => group.querySelector('.variant-picker__label')?.textContent.toLowerCase().includes('palette'));
  const artwork = text('properties[Vinyl Artwork]');
  return {
    display: form.dataset.productTitle || '',
    displaySize: form.querySelector('[data-service-products]')?.dataset.displaySize || '',
    palette: paletteGroup?.querySelector('input[type="radio"]:checked')?.value ||
      form.querySelector('[data-composer-palette]:checked')?.value || '',
    service: text('properties[Service]'),
    installationZip: text('properties[Installation ZIP]'),
    artwork,
    artworkSelected: artwork === 'Yes' && !!form.querySelector('[data-artwork-file]')?.files?.[0],
    housePhotoSelected: !!form.querySelector('[data-house-photo-file]')?.files?.[0],
    quantity: artwork === 'Yes' ? text('properties[Vinyl-wrapped Pumpkins]') : '',
    pumpkinColor: artwork === 'Yes' ? text('properties[Pumpkin Color Preference]') : '',
    vinylColor: artwork === 'Yes' ? text('properties[Vinyl Color Preference]') : '',
    week: text('properties[Requested Week]'),
    removal: text('properties[Removal]'),
    notes: text('properties[General Notes]'),
    addons: Array.from(form.querySelectorAll('input[name="addons[]"]:checked'))
      .map(input => input.closest('.addon-option')?.querySelector('strong')?.textContent?.trim())
      .filter(Boolean),
    custom: !!form.querySelector('[data-custom-request]')?.checked
  };
}

function consultationSummary(choices) {
  const includesHay = ['medium', 'large'].includes(choices.displaySize) ||
    (!choices.displaySize && ['The Porch', 'The Estate'].includes(choices.display));
  return [
    choices.display && `Display: ${choices.display}`,
    choices.palette && `Palette: ${choices.palette}`,
    choices.service && `Fulfillment: ${choices.service}`,
    choices.installationZip && `Requested installation/delivery ZIP: ${choices.installationZip}`,
    includesHay && 'Hay bales: 2 included with the display',
    choices.artwork && `Vinyl artwork: ${choices.artwork}`,
    choices.artwork === 'Yes' && choices.quantity && `Vinyl-wrapped pumpkins: ${choices.quantity}`,
    choices.artwork === 'Yes' && choices.pumpkinColor && `Pumpkin color: ${choices.pumpkinColor}`,
    choices.artwork === 'Yes' && choices.vinylColor && `Vinyl color: ${choices.vinylColor}`,
    choices.week && `Requested week: ${choices.week}`,
    choices.removal && `Removal: ${choices.removal}`,
    choices.addons?.length && `Finishing touches: ${choices.addons.join(', ')}`,
    choices.custom && 'Further customization: Consultation requested',
    typeof choices.notes === 'string' && choices.notes.trim() && `Your vision: ${choices.notes.trim()}`
  ].filter(Boolean).join('\n');
}

const INQUIRY_PENDING_KEY = 'palette-install-inquiry-pending-v1';

function setupSpecialInquiryDialog(dialog) {
  if (dialog.dataset.inquiryBound === 'true') return;
  dialog.dataset.inquiryBound = 'true';
  const contactForm = dialog.querySelector('form');
  const error = dialog.querySelector('[data-inquiry-error]');
  const summary = dialog.querySelector('[data-inquiry-summary]');
  const body = dialog.querySelector('[data-inquiry-body]');
  const filesNotice = dialog.querySelector('[data-inquiry-files]');
  dialog.querySelector('[data-inquiry-close]')?.addEventListener('click', () => dialog.close());
  const showError = message => { error.textContent = message; error.hidden = !message; };

  let pending;
  try { pending = JSON.parse(sessionStorage.getItem(INQUIRY_PENDING_KEY) || 'null'); } catch { /* A blocked browser store cannot resume. */ }
  if (dialog.querySelector('[data-inquiry-success]')) {
    try { sessionStorage.removeItem(INQUIRY_PENDING_KEY); } catch { /* Storage may be unavailable. */ }
    dialog.showModal();
  } else if (dialog.querySelector('[data-inquiry-form-error]')) {
    // Shopify repopulates form.body on validation errors. Session storage is
    // only a backup; the submitted message survives even when storage is blocked.
    const previousBody = body.value || pending?.body;
    if (previousBody) {
      dialog.inquiryRetry = true;
      body.value = previousBody;
      summary.textContent = 'Review your previous design, request, and file links in the message below before resending.';
      filesNotice.textContent = 'Your previously uploaded files are linked in the message.';
      dialog.showModal();
    }
  }

  contactForm.addEventListener('submit', async event => {
    if (dialog.inquiryPrepared) return;
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    showError('');
    const submit = contactForm.querySelector('[type="submit"]');
    submit.disabled = true;
    submit.textContent = 'Sending your inquiry…';
    try {
      const choices = dialog.inquiryChoices;
      const source = dialog.inquirySource;
      const retry = dialog.inquiryRetry;
      if (retry) {
        dialog.inquiryPrepared = true;
        submit.disabled = false;
        contactForm.requestSubmit(submit);
        return;
      }
      if (!source) throw new Error('Your design details are no longer available. Return to the builder and try again.');
      const design = consultationSummary(choices);
      const artwork = choices?.artwork === 'Yes' ? source?.querySelector('[data-artwork-file]')?.files?.[0] : null;
      const housePhoto = source?.querySelector('[data-house-photo-file]')?.files?.[0];
      if (choices?.artwork === 'Yes' && !artwork) {
        throw new Error('Choose your PNG or PDF artwork file before sending a vinyl-artwork inquiry.');
      }
      let links = {};
      let reference = '';
      if (artwork || housePhoto) {
        const rawEndpoint = dialog.dataset.uploadEndpoint || '';
        let endpoint;
        try { endpoint = new URL(rawEndpoint); } catch { /* No service configured yet. */ }
        if (!endpoint || endpoint.protocol !== 'https:' || endpoint.pathname !== '/api/consultation-uploads') {
          throw new Error('Secure file submission is not available yet. Your files have not been sent; please contact the studio.');
        }
        if (artwork && (!/\.(png|pdf)$/i.test(artwork.name) || artwork.size < 1 || artwork.size > MAX_ARTWORK_SIZE)) {
          throw new Error('Choose a PNG or PDF artwork file 20 MB or smaller.');
        }
        if (housePhoto) selectedHousePhoto(source);
        const uploads = new FormData();
        if (artwork) uploads.append('artwork', artwork);
        if (housePhoto) uploads.append('housePhoto', housePhoto);
        const response = await fetch(endpoint.href, { method: 'POST', body: uploads, credentials: 'omit' });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Files could not be uploaded. No inquiry was sent; please try again.');
        const safeLink = value => {
          const link = new URL(value, endpoint);
          if (link.origin !== endpoint.origin || link.protocol !== 'https:') throw new Error('The file service returned an invalid link. No inquiry was sent.');
          return link.href;
        };
        if ((artwork && !result.links?.artwork) || (housePhoto && !result.links?.housePhoto) || !result.reference) {
          throw new Error('The file service did not confirm both selected uploads. No inquiry was sent.');
        }
        links = {
          ...(artwork && { artwork: safeLink(result.links.artwork) }),
          ...(housePhoto && { housePhoto: safeLink(result.links.housePhoto) })
        };
        reference = result.reference;
      }
      const message = [
        `Design choices:\n${design}`,
        `Special request:\n${body.value.trim()}`,
        reference && `File reference: ${reference}`,
        links.artwork && `Uploaded vinyl artwork: ${links.artwork}`,
        links.housePhoto && `Uploaded house photo: ${links.housePhoto}`
      ].filter(Boolean).join('\n\n');
      body.value = message;
      dialog.inquiryRetry = true;
      try {
        sessionStorage.setItem(INQUIRY_PENDING_KEY, JSON.stringify({ body: message }));
      } catch { /* Shopify's form.body still carries the full submitted message. */ }
      // Dispatch the native submit event so Shopify's own contact-form spam
      // protection and validation still run.
      dialog.inquiryPrepared = true;
      submit.disabled = false;
      contactForm.requestSubmit(submit);
    } catch (problem) {
      dialog.inquiryPrepared = false;
      showError(problem.message || 'Your inquiry was not sent. Please try again.');
      submit.disabled = false;
      submit.textContent = 'Send inquiry';
    }
  });
}

function openSpecialInquiry(sourceForm, choices) {
  const dialog = document.querySelector('[data-consultation-dialog]');
  if (!dialog) throw new Error('The inquiry form is unavailable. Please contact the studio.');
  setupSpecialInquiryDialog(dialog);
  dialog.inquirySource = sourceForm;
  dialog.inquiryChoices = choices;
  dialog.inquiryPrepared = false;
  if (dialog.inquiryRetry) dialog.querySelector('[data-inquiry-body]').value = '';
  dialog.inquiryRetry = false;
  dialog.querySelector('[data-inquiry-summary]').textContent = consultationSummary(choices);
  const artwork = choices.artwork === 'Yes' ? sourceForm.querySelector('[data-artwork-file]')?.files?.[0] : null;
  const photo = sourceForm.querySelector('[data-house-photo-file]')?.files?.[0];
  dialog.querySelector('[data-inquiry-files]').textContent =
    [artwork && `Artwork: ${artwork.name}`, photo && `House photo: ${photo.name}`].filter(Boolean).join(' · ') ||
    'No files selected.';
  const timing = dialog.querySelector('[data-inquiry-timing]');
  if (timing && !timing.value) timing.value = choices.week || '';
  const endpoint = dialog.dataset.uploadEndpoint || '';
  const uploadUnavailable = !!(artwork || photo) && !/^https:\/\/[^/]+\/api\/consultation-uploads\/?$/.test(endpoint);
  const error = dialog.querySelector('[data-inquiry-error]');
  error.textContent = uploadUnavailable
    ? 'Secure file submission is not available yet. Your files have not been sent; please contact the studio.'
    : '';
  error.hidden = !uploadUnavailable;
  dialog.querySelector('[type="submit"]').disabled = uploadUnavailable;
  if (!dialog.open) dialog.showModal();
}
window.paletteInstallOpenInquiry = openSpecialInquiry;

function setupConsultationForm(root) {
  if (root.dataset.consultationBound === 'true') return;
  root.dataset.consultationBound = 'true';
  const transferError = root.querySelector('[data-consultation-transfer-error]');
  if (transferError && new URLSearchParams(window.location.search).get('consultation_transfer') === 'failed') {
    transferError.hidden = false;
  }
  if (root.querySelector('[data-contact-success]')) {
    try { sessionStorage.removeItem(CONSULTATION_STORAGE_KEY); } catch { /* Storage may be unavailable. */ }
    return;
  }
  const timing = root.querySelector('[name="contact[timing]"]');
  const body = root.querySelector('[name="contact[body]"]');
  const notice = root.querySelector('[data-consultation-prefill-notice]');
  const apply = () => {
    let saved;
    try { saved = JSON.parse(sessionStorage.getItem(CONSULTATION_STORAGE_KEY) || 'null'); } catch { return; }
    if (!saved || typeof saved.savedAt !== 'number' || Date.now() - saved.savedAt < 0 ||
        Date.now() - saved.savedAt > 2 * 60 * 60 * 1000 || !saved.choices || typeof saved.choices !== 'object') return;
    const choices = saved.choices;
    const includesHay = ['medium', 'large'].includes(choices.displaySize) ||
      (!choices.displaySize && ['The Porch', 'The Estate'].includes(choices.display));
    const lines = [
      choices.display && `Display: ${choices.display}`,
      choices.palette && `Palette: ${choices.palette}`,
      choices.service && `Fulfillment: ${choices.service}`,
      choices.installationZip && `Requested installation/delivery ZIP: ${choices.installationZip}`,
      includesHay && 'Hay bales: 2 included with the display',
      choices.artwork && `Vinyl artwork: ${choices.artwork}`,
      choices.artwork === 'Yes' && choices.quantity && `Vinyl-wrapped pumpkins: ${choices.quantity}`,
      choices.artwork === 'Yes' && choices.pumpkinColor && `Pumpkin color: ${choices.pumpkinColor}`,
      choices.artwork === 'Yes' && choices.vinylColor && `Vinyl color: ${choices.vinylColor}`,
      choices.artwork === 'Yes' && choices.artworkSelected && 'Artwork file: selected on the product page (file not transferred)',
      choices.housePhotoSelected && 'House photo: selected on the product page (file not transferred)',
      choices.removal && `Removal: ${choices.removal}`,
      choices.custom && 'Further customization: Consultation requested',
      typeof choices.notes === 'string' && choices.notes.trim() && `Your vision: ${choices.notes.trim()}`
    ];
    const message = lines.filter(Boolean).join('\n');
    if (timing && typeof choices.week === 'string' && choices.week &&
        (!timing.value || timing.value === timing.dataset.prefillValue)) {
      timing.value = choices.week;
      timing.dataset.prefillValue = timing.value;
    }
    if (body && message && (!body.value || body.value === body.dataset.prefillValue)) {
      body.value = message;
      body.dataset.prefillValue = message;
    }
    if (notice && message) notice.hidden = false;
  };
  document.addEventListener('palette-install:consultation-updated', apply);
  apply();
}

function setupProductJourney(form) {
  if (form.dataset.journeyBound === 'true') return;
  form.dataset.journeyBound = 'true';
  const monogramFields = form.querySelector('[data-monogram-fields]');
  const monogramInputs = monogramFields ? monogramFields.querySelectorAll('input, select') : [];
   const dateLabel = form.querySelector('[data-date-label]');
   const weekSelect = form.querySelector('[data-requested-week]');
    if (weekSelect?.tagName === 'SELECT' && weekSelect.options.length === 1) {
      const [year, month, day] = studioTodayIso().split('-').map(Number);
      const today = new Date(Date.UTC(year, month - 1, day));
      const daysUntilMonday = (8 - today.getUTCDay()) % 7 || 7;
      const monday = new Date(Date.UTC(year, month - 1, day + daysUntilMonday));
      const format = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
     for (let index = 0; index < 52; index++) {
        const start = new Date(monday.getTime() + index * 7 * 86400000);
        const end = new Date(start.getTime() + 6 * 86400000);
        const label = `Week of ${format.format(start)} – ${format.format(end)}`;
       weekSelect.add(new Option(label, label));
     }
   }
    if (weekSelect) setupRequestedWeekAvailability(form);
  const setVisibility = () => {
    const service = form.querySelector('[data-service]:checked');
    const isDelivery = service && service.dataset.service === 'delivery';
    const hasMonogram = form.querySelector('[data-monogram-choice="yes"]:checked');
    const customRequest = form.querySelector('[data-custom-request]');
    const customNote = form.querySelector('[data-custom-request-note]');
    if (customNote && customRequest) customNote.hidden = !customRequest.checked;
    const outsideNote = form.querySelector('[data-outside-area-note]');
    if (outsideNote) {
      const zip = form.querySelector('[data-installation-zip]')?.value?.trim() || '';
      outsideNote.querySelector('[data-unavailable-zip]').textContent = zip;
      outsideNote.hidden = serviceAreaForZip(zip) !== 'outside';
    }
    if (monogramFields) monogramFields.hidden = !hasMonogram;
    monogramInputs.forEach(input => { input.disabled = !hasMonogram; input.required = !!hasMonogram; });
    if (dateLabel) dateLabel.innerHTML = isDelivery
       ? '03 / Requested delivery week'
       : '03 / Requested delivery &amp; installation week';
  };
  form.querySelectorAll('[data-service], [data-monogram-choice], [data-custom-request]').forEach(input => input.addEventListener('change', setVisibility));
  form.querySelector('[data-installation-zip]')?.addEventListener('input', setVisibility);
  const saveChoices = () => saveConsultationDraft(productConsultationChoices(form));
  form.addEventListener('change', saveChoices);
  form.querySelector('[name="properties[General Notes]"]')?.addEventListener('input', saveChoices);
  form.querySelectorAll('[data-consultation-link]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    try { openSpecialInquiry(form, productConsultationChoices(form)); }
    catch (problem) { productFormError(form, problem.message); }
  }));
  form.querySelector('[data-custom-request]')?.addEventListener('change', event => {
    if (!event.currentTarget.checked) return;
    try { openSpecialInquiry(form, productConsultationChoices(form)); }
    catch (problem) { productFormError(form, problem.message); }
  });
  setVisibility();
}

function setupCompositionBrief(form) {
  if (form.dataset.briefBound === 'true') return;
  form.dataset.briefBound = 'true';
  const brief = form.querySelector('[data-composition-brief]');
  if (!brief) return;
  const update = () => {
    const paletteGroup = Array.from(form.querySelectorAll('.variant-picker__group'))
      .find(group => group.querySelector('.variant-picker__label')?.textContent.toLowerCase().includes('palette'));
    const palette = paletteGroup?.querySelector('input[type="radio"]:checked')?.value ||
      form.querySelector('[data-product-palette] input:checked')?.value || 'Choose a palette';
    const data = new FormData(form);
    const service = data.get('properties[Service]') || 'Yours to choose';
    const monogram = data.get('properties[Vinyl Artwork]');
    const artwork = form.querySelector('[data-artwork-file]')?.files?.[0];
    const pumpkin = data.get('properties[Pumpkin Color Preference]');
    const vinyl = data.get('properties[Vinyl Color Preference]');
    const week = data.get('properties[Requested Week]') || 'Yours to choose';
    const removal = data.get('properties[Removal]');
    brief.querySelector('[data-brief-palette]').textContent = palette;
    brief.querySelector('[data-brief-service]').textContent = service;
    brief.querySelector('[data-brief-monogram]').textContent =
      monogram === 'Yes'
        ? `Vinyl-wrapped pumpkin${artwork?.name ? ` · ${artwork.name}` : ''}${pumpkin && vinyl ? ` · ${pumpkin} / ${vinyl}` : ''}`
        : monogram === 'No' ? 'No vinyl artwork' : 'Yours to choose';
    brief.querySelector('[data-brief-week]').textContent = week;
    brief.querySelector('[data-brief-removal]').textContent =
      removal === 'Yes' ? 'Requested' : removal === 'No' ? 'Not requested' : 'Yours to choose';
  };
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();
}

function calculateCompositionEstimate(baseCents, additions, baseLabel = 'Display · base') {
  const validPrice = value => Number.isSafeInteger(Number(value)) && Number(value) > 0;
  let knownCents = validPrice(baseCents) ? Number(baseCents) : 0;
  const pending = validPrice(baseCents) ? [] : ['Base display'];
  const rows = [{ label: baseLabel, priceCents: validPrice(baseCents) ? Number(baseCents) : null }];
  additions.forEach(({ label, priceCents, quantity = 1, included = false }) => {
    if (included) {
      rows.push({ label, priceCents: 0, included: true });
      return;
    }
    const count = Number(quantity);
    if (!validPrice(priceCents) || !Number.isSafeInteger(count) || count < 1) {
      pending.push(label);
      rows.push({ label, priceCents: null });
      return;
    }
    const amount = Number(priceCents) * count;
    knownCents += amount;
    rows.push({ label: count > 1 ? `${label} × ${count}` : label, priceCents: amount });
  });
  return { knownCents, pending, rows };
}

function resolveBaseEstimateCents(variantPrice, draftEstimateCents, isComposer) {
  if (Number.isSafeInteger(Number(variantPrice)) && Number(variantPrice) > 0) return Number(variantPrice);
  if (isComposer && Number.isSafeInteger(Number(draftEstimateCents)) && Number(draftEstimateCents) > 0) {
    return Number(draftEstimateCents);
  }
  return null;
}

function resolveServiceEstimateCents(availableId, livePrice, referencePrice) {
  const price = availableId ? Number(livePrice) : Number(referencePrice);
  return Number.isSafeInteger(price) && price > 0 ? price : null;
}

function setupProductEstimate(form) {
  if (form.dataset.estimateBound === 'true') return;
  form.dataset.estimateBound = 'true';
  const estimate = form.querySelector('[data-composition-estimate]');
  const products = form.querySelector('[data-service-products]');
  if (!estimate || !products) return;
  const moneyFormat = window.shopMoneyFormat || '${{amount}}';
  const update = () => {
    const selectedVariant = form.querySelector('select[name="id"]')?.selectedOptions?.[0];
    const selectedScaleName = form.dataset.selectedScaleName;
    const isComposer = !!form.closest('[data-package-browser]');
    const basePrice = resolveBaseEstimateCents(selectedVariant?.dataset.price, form.dataset.baseEstimateCents, isComposer);
    const additions = [];
    const deliveryEstimate = resolveServiceEstimateCents(
      products.dataset.deliveryId, products.dataset.deliveryPrice, products.dataset.expectedServiceFee);
    const removalEstimate = resolveServiceEstimateCents(
      products.dataset.removalId, products.dataset.removalPrice, products.dataset.expectedServiceFee);
    if (form.querySelector('[data-service]:checked')) {
      const label = form.querySelector('[data-service]:checked')?.value === 'Custom installation'
        ? 'Delivery & installation service'
        : 'Delivery service';
      additions.push({ label: products.dataset.deliveryId ? label : `${label} · estimate`, priceCents: deliveryEstimate });
    }
    if (form.querySelector('[data-service="install"]:checked')) {
      additions.push({ label: 'Custom installation · setup', included: true });
    }
    if (['medium', 'large'].includes(products.dataset.displaySize)) {
      additions.push({ label: 'Hay bales · pair', included: true });
    }
    if (form.querySelector('[data-monogram-choice="yes"]:checked')) {
      const vinylUnitCents = Number(products.dataset.monogramEstimateCents);
      const vinylUnitLabel = Number.isSafeInteger(vinylUnitCents) && vinylUnitCents > 0
        ? ` · ${formatMoney(vinylUnitCents, moneyFormat)} per pumpkin` : '';
      additions.push({
        label: `Vinyl artwork${vinylUnitLabel}${products.dataset.monogramId ? '' : ' · estimate'}`,
        priceCents: products.dataset.monogramEstimateCents,
        quantity: form.querySelector('[data-monogram-quantity]')?.value,
      });
    }
    if (form.querySelector('input[name="properties[Removal]"][value="Yes"]:checked')) {
      additions.push({ label: products.dataset.removalId ? 'Removal · not included' : 'Removal · estimate', priceCents: removalEstimate });
    }
    form.querySelectorAll('input[name="addons[]"]:checked').forEach(input => {
      additions.push({ label: input.closest('.addon-option')?.querySelector('strong')?.textContent || 'Finishing touch', priceCents: input.dataset.addonPrice });
    });
    if (form.querySelector('[data-custom-request]:checked')) {
      additions.push({ label: 'Further customization', priceCents: 0 });
    }
    const result = calculateCompositionEstimate(basePrice, additions, selectedScaleName ? `${selectedScaleName} · base` : 'Display · base');
    const rows = estimate.querySelector('[data-estimate-rows]');
    rows.replaceChildren(...result.rows.map(row => {
      const line = document.createElement('div');
      line.className = 'composition-price-estimate__row';
      const title = document.createElement('span');
      title.textContent = row.label;
      const amount = document.createElement('strong');
      amount.textContent = row.included ? 'Included' : row.priceCents === null ? 'Rate pending' : formatMoney(row.priceCents, moneyFormat);
      line.append(title, amount);
      return line;
    }));
    estimate.querySelector('[data-estimate-total]').textContent = result.pending.includes('Base display') && result.knownCents === 0
      ? 'Rate pending' : formatMoney(result.knownCents, moneyFormat);
    const vinylIsReference = !!form.querySelector('[data-monogram-choice="yes"]:checked') &&
      !products.dataset.monogramId && Number(products.dataset.monogramEstimateCents) > 0;
    const serviceIsReference = (!products.dataset.deliveryId && !!form.querySelector('[data-service]:checked') && deliveryEstimate !== null) ||
      (!products.dataset.removalId && !!form.querySelector('input[name="properties[Removal]"][value="Yes"]:checked') && removalEstimate !== null);
    const referenceNote = `${isComposer && !selectedVariant?.value ? 'Draft display prices are estimates until a priced display is available. ' : ''}${serviceIsReference ? 'Delivery and selected removal rates are reference estimates until their services are available. ' : ''}${vinylIsReference ? 'Vinyl artwork is a reference estimate per pumpkin; it cannot be ordered until the add-on is available. ' : ''}`;
    estimate.querySelector('[data-estimate-note]').textContent = result.pending.length
      ? `${result.pending.join(', ')} ${result.pending.length === 1 ? 'is' : 'are'} not included in this subtotal. ${referenceNote}Taxes and any other Shopify checkout charges are shown before payment.`
      : `${referenceNote}Delivery is charged for both fulfillment choices; removal is separate. Taxes and any other Shopify checkout charges are shown before payment.`;
  };
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();
}

function newCompositionId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
  return `composition-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// Keep the storage key so carts started before a theme update can finish safely.
const PENDING_UPLOAD_KEY = 'palette-pending-artwork-composition';
const MAX_ARTWORK_SIZE = 20 * 1024 * 1024;
const MAX_HOUSE_PHOTO_SIZE = 20 * 1024 * 1024;

function selectedHousePhoto(form) {
  const photo = form.querySelector('[data-house-photo-file]')?.files?.[0];
  if (!photo) return null;
  const mime = /\.jpe?g$/i.test(photo.name) ? 'image/jpeg'
    : /\.png$/i.test(photo.name) ? 'image/png' : '';
  if (!mime || (photo.type && photo.type !== mime) ||
      photo.size < 1 || photo.size > MAX_HOUSE_PHOTO_SIZE) {
    throw new Error('Choose a JPG or PNG house photo 20 MB or smaller, or leave the optional photo empty.');
  }
  return photo;
}

function productFormError(form, message) {
  form.querySelectorAll('#product-form-error, [data-review-error]').forEach(container => {
    container.textContent = message;
    container.classList.toggle('hidden', !message);
  });
}

function focusFirstInvalidComposerField(form) {
  const root = form.closest('[data-package-browser]');
  if (root) {
    root.dataset.reviewStage = 'build';
    root.dataset.mobilePane = 'build';
    root.querySelectorAll('[data-pane-tab]').forEach(tab => {
      const active = tab.dataset.paneTab === 'build';
      tab.setAttribute('aria-pressed', String(active));
    });
  }
  const invalid = form.querySelector(':invalid');
  if (!invalid) return '';
  const label = invalid.labels?.[0]?.textContent ||
    invalid.closest('label')?.textContent ||
    invalid.closest('fieldset')?.querySelector('legend')?.textContent ||
    invalid.getAttribute('aria-label') ||
    invalid.name?.replace(/^properties\[|\]$/g, '').replace(/[_-]+/g, ' ') ||
    'the missing required choice';
  invalid.focus({ preventScroll: true });
  invalid.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
  return label.replace(/\s+/g, ' ').trim();
}

function designSignature(form) {
  return JSON.stringify(Array.from(new FormData(form).entries())
    .filter(([key]) => key !== 'properties[_Composition ID]')
    .map(([key, value]) => [key, value && typeof value === 'object' && 'size' in value
      ? [value.name, value.size, value.type, value.lastModified] : value]));
}

function showDraftCartPreview(form, design) {
  const dialog = form.closest('[data-package-browser]')?.querySelector('[data-cart-layout-dialog]');
  if (!dialog || typeof dialog.showModal !== 'function') {
    throw new Error('The cart layout preview is unavailable in this browser. Please try a current browser.');
  }
  if (dialog.dataset.closeBound !== 'true') {
    dialog.dataset.closeBound = 'true';
    dialog.querySelectorAll('[data-cart-layout-close]').forEach(button =>
      button.addEventListener('click', () => dialog.close()));
  }
  const put = (selector, value) => { dialog.querySelector(selector).textContent = value; };
  const money = cents => Number.isSafeInteger(Number(cents)) && Number(cents) > 0
    ? formatMoney(Number(cents), window.shopMoneyFormat || '${{amount}}') : 'Rate pending';
  put('[data-draft-cart-scale]', design.scale);
  put('[data-draft-cart-palette]', design.palette);
  put('[data-draft-cart-service]', design.service);
  put('[data-draft-cart-week]', `${design.week} · not reserved`);
  put('[data-draft-cart-artwork]', design.artwork === 'Yes'
    ? `${design.artworkQuantity} pumpkin${design.artworkQuantity === 1 ? '' : 's'} · ${design.pumpkinColor} pumpkin · ${design.vinylColor} vinyl · ${design.artworkFile} (not uploaded)`
    : 'No vinyl artwork');
  put('[data-draft-cart-house-photo]', design.housePhotoFile ? `${design.housePhotoFile} (not uploaded)` : 'Not added');
  put('[data-draft-cart-removal]', design.removal === 'Yes' ? 'Requested' : 'Not requested');
  put('[data-draft-cart-notes]', design.notes || 'No additional notes');
  const additions = [
    { label: design.service === 'Custom installation' ? 'Delivery & installation service · estimate' : 'Delivery service · estimate',
      priceCents: design.deliveryEstimateCents }
  ];
  if (design.artwork === 'Yes') additions.push({
    label: 'Vinyl-wrapped pumpkin · estimate', priceCents: design.vinylEstimateCents,
    quantity: design.artworkQuantity
  });
  if (design.removal === 'Yes') additions.push({
    label: 'Removal · estimate', priceCents: design.deliveryEstimateCents
  });
  const estimate = calculateCompositionEstimate(design.baseEstimateCents, additions, `${design.scale} · base`);
  const lines = dialog.querySelector('[data-draft-cart-lines]');
  lines.replaceChildren(...estimate.rows.map(row => {
    const line = document.createElement('div');
    line.className = 'cart-layout-dialog__line';
    const label = document.createElement('span');
    label.textContent = row.label;
    const price = document.createElement('strong');
    price.textContent = row.priceCents === null ? 'Rate pending' : money(row.priceCents);
    line.append(label, price);
    return line;
  }));
  put('[data-draft-cart-total]', estimate.knownCents > 0 ? money(estimate.knownCents) : 'Rate pending');
  put('[data-draft-cart-note]', estimate.pending.length
    ? `${estimate.pending.join(', ')} ${estimate.pending.length === 1 ? 'is' : 'are'} excluded until priced. This is a reference estimate, not an order. Nothing was added to the Shopify cart.`
    : 'Reference estimates may change. Taxes and other checkout charges are not included. Nothing was added to the Shopify cart; this preview cannot place an order or reserve a week.');
  if (!dialog.open) dialog.showModal();
}

function previewCartDesign(form) {
  const installationZip = String(new FormData(form).get('properties[Installation ZIP]') || '').trim();
  const zipStatus = serviceAreaForZip(installationZip);
  if (zipStatus === 'outside') {
    throw new Error(`We don’t currently deliver or install to ZIP ${installationZip}. Fill out the consultation form instead of ordering.`);
  }
  const requestedWeek = String(new FormData(form).get('properties[Requested Week]') || '');
  if (requestedWeek && !requestedWeekOpen(requestedWeek)) {
    throw new Error('This week has already started. Please select an upcoming week.');
  }
  if (!form.checkValidity()) {
    const missingField = focusFirstInvalidComposerField(form);
    throw new Error(`Please complete ${missingField || 'the highlighted choices'} before previewing your cart.`);
  }
  if (form.querySelector('[data-custom-request]')?.checked) {
    throw new Error('A special request needs a consultation before it can be included in a cart preview.');
  }
  if (zipStatus !== 'within') {
    throw new Error('Enter a valid five-digit installation or delivery ZIP code.');
  }
  const data = new FormData(form);
  const artwork = form.querySelector('[data-artwork-file]')?.files?.[0];
  const housePhoto = selectedHousePhoto(form);
  const vinylArtwork = String(data.get('properties[Vinyl Artwork]') || '');
  if (vinylArtwork === 'Yes') {
    const expectedMime = /\.png$/i.test(artwork?.name || '') ? 'image/png'
      : /\.pdf$/i.test(artwork?.name || '') ? 'application/pdf' : '';
    if (!artwork || !expectedMime || (artwork.type && artwork.type !== expectedMime) ||
        artwork.size < 1 || artwork.size > MAX_ARTWORK_SIZE) {
      throw new Error('Choose a PNG or PDF artwork file 20 MB or smaller before previewing.');
    }
    if (!Number.isInteger(Number(data.get('properties[Vinyl-wrapped Pumpkins]'))) ||
        Number(data.get('properties[Vinyl-wrapped Pumpkins]')) < 1 ||
        !['White', 'Orange'].includes(data.get('properties[Pumpkin Color Preference]')) ||
        !['White', 'Black', 'Gold'].includes(data.get('properties[Vinyl Color Preference]'))) {
      throw new Error('Choose the artwork quantity, pumpkin color, and vinyl color before previewing.');
    }
  }
  const root = form.closest('[data-package-browser]');
  const card = root?.querySelector('[data-composer-scale][aria-pressed="true"]');
  const palette = String(data.get('properties[Palette]') || '');
  if (!card || !palette || !['small', 'medium', 'large'].includes(card.dataset.displaySize)) {
    throw new Error('Choose a palette and display size before previewing.');
  }
  const services = form.querySelector('[data-service-products]');
  const preview = {
    scale: card.dataset.scaleName,
    palette,
    service: String(data.get('properties[Service]') || ''),
    week: String(data.get('properties[Requested Week]') || ''),
    artwork: vinylArtwork,
    artworkQuantity: vinylArtwork === 'Yes' ? Number(data.get('properties[Vinyl-wrapped Pumpkins]')) : 0,
    artworkFile: vinylArtwork === 'Yes' ? artwork.name : '',
    housePhotoFile: housePhoto?.name || '',
    pumpkinColor: vinylArtwork === 'Yes' ? String(data.get('properties[Pumpkin Color Preference]')) : '',
    vinylColor: vinylArtwork === 'Yes' ? String(data.get('properties[Vinyl Color Preference]')) : '',
    removal: String(data.get('properties[Removal]') || ''),
    notes: String(data.get('properties[General Notes]') || '').trim(),
    baseEstimateCents: Number(form.querySelector('[data-base-variant]')?.selectedOptions[0]?.dataset.price) > 0
      ? Number(form.querySelector('[data-base-variant]').selectedOptions[0].dataset.price)
      : Number(card.dataset.baseEstimateCents) || 0,
    deliveryEstimateCents: Number(services?.dataset.expectedServiceFee) || 0,
    vinylEstimateCents: Number(services?.dataset.monogramEstimateCents) || 0
  };
  showDraftCartPreview(form, preview);
}

function configuredCartItems(form) {
  const installationZip = String(new FormData(form).get('properties[Installation ZIP]') || '').trim();
  const zipStatus = serviceAreaForZip(installationZip);
  if (zipStatus === 'outside') {
    throw new Error(`We don’t currently deliver or install to ZIP ${installationZip}. Fill out the consultation form instead of ordering.`);
  }
  if (!form.checkValidity()) {
    const missingField = focusFirstInvalidComposerField(form);
    throw new Error(`Please complete ${missingField || 'the highlighted choices'} before approving your design.`);
  }
  if (form.querySelector('[data-custom-request]')?.checked) {
    throw new Error('Further customization needs a consultation before this design can be ordered. Please request a consultation.');
  }
  if (zipStatus !== 'within') {
    throw new Error('Enter a valid five-digit installation or delivery ZIP code.');
  }
  const data = new FormData(form);
  const masterId = String(data.get('id') || '');
  const selected = Array.from(form.querySelector('select[name="id"]').options).find(option => option.value === masterId);
  if (!selected || selected.disabled || Number(selected.dataset.price) <= 0) {
    throw new Error('This package is not priced and available yet. Please choose an available package.');
  }
  const requestedWeek = String(data.get('properties[Requested Week]') || '').trim();
  const weekControl = form.querySelector('[data-requested-week]');
  const validWeek = weekControl?.options
    ? Array.from(weekControl.options).some(option => option.value === requestedWeek && option.value)
    : Array.from(form.querySelectorAll('[data-requested-week]')).some(input =>
        input.type === 'radio' && input.checked && !input.disabled && input.value === requestedWeek);
  if (!requestedWeek || !validWeek) {
    throw new Error('Please select an upcoming week.');
  }
  if (!requestedWeekOpen(requestedWeek)) {
    throw new Error('This week has already started. Please select an upcoming week.');
  }
  const service = data.get('properties[Service]');
  const monogram = data.get('properties[Vinyl Artwork]');
  const removal = data.get('properties[Removal]');
  const hayBales = data.get('properties[Hay Bales]');
  const serviceProducts = form.querySelector('[data-service-products]');
  const displaySize = serviceProducts?.dataset.displaySize;
  if (!['Custom installation', 'Delivery only'].includes(service) || !monogram || !['Yes', 'No'].includes(removal)) {
    throw new Error('Please complete the service, vinyl artwork, and removal choices.');
  }
  if (!['small', 'medium', 'large'].includes(displaySize) ||
      hayBales !== (displaySize === 'small' ? 'No' : 'Yes')) {
    throw new Error('The hay-bale inclusion does not match this display. Please refresh and try again.');
  }
  if (Number(data.get('quantity')) !== 1) throw new Error('Each composition must have exactly one base package.');
  const artwork = form.querySelector('[data-artwork-file]')?.files?.[0];
  const housePhoto = selectedHousePhoto(form);
  const monogramQuantity = Number(data.get('properties[Vinyl-wrapped Pumpkins]') || 0);
  const pumpkinColor = String(data.get('properties[Pumpkin Color Preference]') || '').trim();
  const vinylColor = String(data.get('properties[Vinyl Color Preference]') || '').trim();
  if (monogram === 'Yes') {
    const expectedMime = /\.png$/i.test(artwork?.name || '') ? 'image/png'
      : /\.pdf$/i.test(artwork?.name || '') ? 'application/pdf' : '';
    if (!artwork || !expectedMime || (artwork.type && artwork.type !== expectedMime) ||
        artwork.size < 1 || artwork.size > MAX_ARTWORK_SIZE) {
      throw new Error('Upload a PNG or PDF artwork file 20 MB or smaller.');
    }
    if (!Number.isInteger(monogramQuantity) || monogramQuantity < 1 ||
        !['White', 'Orange'].includes(pumpkinColor) ||
        !['White', 'Black', 'Gold'].includes(vinylColor)) {
      throw new Error('Choose the number of pumpkins, a white or orange pumpkin, and white, black, or gold vinyl.');
    }
  }

  const compositionId = newCompositionId();
  const properties = {
    '_Composition ID': compositionId,
    'Requested Week': requestedWeek,
    'Service': service,
    'Installation ZIP': installationZip,
    'Vinyl Artwork': monogram,
    'Removal': removal,
    'Hay Bales': hayBales
  };
  if (housePhoto) properties['_House Photo Expected'] = 'Yes';
  const palette = String(data.get('properties[Palette]') || '').trim();
  const offeredPalettes = Array.from(form.querySelectorAll('[data-composer-palette], [data-product-palette] input[name="properties[Palette]"]'));
  if (offeredPalettes.length && !offeredPalettes.some(input => input.value === palette)) {
    throw new Error('Please choose an available palette before approving your design.');
  }
  if (palette) properties.Palette = palette;
  const notes = String(data.get('properties[General Notes]') || '').trim();
  if (notes) properties['General Notes'] = notes;
  if (monogram === 'Yes') {
    properties['Vinyl-wrapped Pumpkins'] = String(monogramQuantity);
    properties['Pumpkin Color Preference'] = pumpkinColor;
    properties['Vinyl Color Preference'] = vinylColor;
  }
  const items = [{ id: masterId, quantity: 1, properties }];
  const addService = (id, quantity, label, kind) => {
    if (!id) throw new Error(`${label} is not available to order yet. Please choose another option or contact us.`);
    items.push({ id, quantity, properties: { '_Composition ID': compositionId, '_Service Kind': kind } });
  };
  const expectedFee = Number(serviceProducts?.dataset.expectedServiceFee);
  const deliveryPrice = Number(serviceProducts?.dataset.deliveryPrice);
  if (!Number.isSafeInteger(expectedFee) || expectedFee <= 0 ||
      !serviceProducts.dataset.deliveryId || !Number.isSafeInteger(deliveryPrice) ||
      deliveryPrice !== expectedFee) {
    throw new Error('The delivery service product or price does not match this display size. Please contact us.');
  }
  properties['_Service Fee Tier'] = displaySize;
  properties['_Expected Service Fee'] = String(expectedFee);
  properties['_Delivery Variant ID'] = String(serviceProducts.dataset.deliveryId);
  addService(serviceProducts.dataset.deliveryId, 1, 'Delivery', 'delivery');
  if (monogram === 'Yes') {
    if (!serviceProducts.dataset.monogramId ||
        Number(serviceProducts.dataset.monogramPrice) !== APPROVED_VINYL_UNIT_PRICE_CENTS) {
      throw new Error('Vinyl artwork must be available at $25 per pumpkin before it can be added to this design.');
    }
    properties['_Monogram Variant ID'] = String(serviceProducts.dataset.monogramId || '');
    properties['_Monogram Unit Price'] = String(serviceProducts.dataset.monogramPrice || '');
    addService(serviceProducts?.dataset.monogramId, monogramQuantity, 'Vinyl artwork', 'monogram');
  }
  if (removal === 'Yes') {
    const removalPrice = Number(serviceProducts.dataset.removalPrice);
    if (!serviceProducts.dataset.removalId || !Number.isSafeInteger(removalPrice) ||
        removalPrice !== expectedFee) {
      throw new Error('The removal service product or price does not match this display size. Please contact us.');
    }
    properties['_Removal Variant ID'] = String(serviceProducts.dataset.removalId);
    addService(serviceProducts.dataset.removalId, 1, 'Removal', 'removal');
  }
  form.querySelectorAll('[name="addons[]"]:checked').forEach(addon => {
    items.push({ id: addon.value, quantity: 1, properties: { '_Composition ID': compositionId, '_Service Kind': 'extra' } });
  });
  return { items, compositionId };
}

async function cartJson() {
  const response = await fetch((window.cartUrl || '/cart') + '.js');
  if (!response.ok) throw new Error('Could not load your design selection. Please try again.');
  return response.json();
}

function cartContainsComposition(cart, id) {
  return cart.items.some(item => item.properties && item.properties['_Composition ID'] === id);
}

class CartReviewRequired extends Error {
  constructor(message) {
    super(message);
    this.name = 'CartReviewRequired';
  }
}

async function addCompositionToCart(configured) {
  let response;
  try {
    response = await fetch((window.cartAddUrl || '/cart/add') + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: configured.items })
    });
  } catch {
    // A lost response is not proof that Shopify rejected the cart update.
  }
  if (response?.ok) return;
  const cart = await cartJson().catch(() => null);
  if (cart && cartContainsComposition(cart, configured.compositionId)) return;
  const body = response ? await response.json().catch(() => ({})) : {};
  throw new CartReviewRequired(body.description || 'We could not confirm your selection. Review your composition before trying again so you do not add the same design twice.');
}

async function removeComposition(compositionId) {
  const cart = await cartJson();
  const lines = cart.items.filter(item => item.properties && item.properties['_Composition ID'] === compositionId);
  if (!lines.length) throw new Error('The original design is no longer in your selection. Review your composition before continuing.');
  const updates = Object.fromEntries(lines.map(item => [item.key, 0]));
  const response = await fetch((window.cartUrl || '/cart') + '/update.js', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ updates })
  });
  if (!response.ok) throw new Error('Could not replace the original design in your selection.');
}

async function replaceComposition(oldId, newId) {
  try {
    await removeComposition(oldId);
  } catch {
    // Never delete the new group to "roll back": Shopify may have removed
    // the old group and lost its response. Preserve at least one version.
    const cart = await cartJson().catch(() => null);
    if (cart && !cartContainsComposition(cart, oldId) && cartContainsComposition(cart, newId)) return;
    throw new CartReviewRequired('The change was interrupted. Both versions may be in your selection. Review and remove any extra design before checkout.');
  }
}

function artworkExtrasComplete(cart, pending) {
  const group = cart.items.filter(item => item.properties?.['_Composition ID'] === pending.compositionId &&
    item.properties?.['_Service Kind']);
  const tally = (items, variantKey, quantityKey, kindKey) => {
    const counts = new Map();
    items.forEach(item => {
      const key = `${item[variantKey]}:${item.properties[kindKey]}`;
      counts.set(key, (counts.get(key) || 0) + Number(item[quantityKey]));
    });
    return counts;
  };
  const expected = tally(pending.extras, 'id', 'quantity', '_Service Kind');
  const actual = tally(group, 'variant_id', 'quantity', '_Service Kind');
  return expected.size === actual.size && Array.from(expected).every(([key, count]) => actual.get(key) === count);
}

async function finishPendingUpload(cartForm) {
  const serialized = sessionStorage.getItem(PENDING_UPLOAD_KEY);
  if (!serialized) return;
  cartForm.dataset.cartNeedsReview = 'true';
  let pending;
  try {
    pending = JSON.parse(serialized);
    if (!pending?.compositionId || !Array.isArray(pending.extras) || !pending.extras.length) throw new Error();
  } catch {
    sessionStorage.removeItem(PENDING_UPLOAD_KEY);
    throw new CartReviewRequired('We could not confirm the uploaded files. Please review your composition before checkout.');
  }
  const cart = await cartJson();
  const base = cart.items.find(item => item.properties?.['_Composition ID'] === pending.compositionId &&
    !item.properties?.['_Service Kind']);
  if (!base) {
    sessionStorage.removeItem(PENDING_UPLOAD_KEY);
    throw new CartReviewRequired('Your uploaded design was not added to the selection. Please return to the design and upload your files again.');
  }
  const artworkUrl = String(base.properties['Artwork File'] || '');
  if (pending.artworkRequired !== false &&
      !/^https:\/\/cdn\.shopify\.com\/|^\/\/cdn\.shopify\.com\//i.test(artworkUrl)) {
    sessionStorage.removeItem(PENDING_UPLOAD_KEY);
    throw new CartReviewRequired('The artwork file did not reach the order. Remove this composition and upload it again before checkout.');
  }
  const housePhotoUrl = String(base.properties['House Photo'] || '');
  if (pending.housePhotoRequired &&
      (base.properties['_House Photo Expected'] !== 'Yes' ||
       !/^https:\/\/cdn\.shopify\.com\/|^\/\/cdn\.shopify\.com\//i.test(housePhotoUrl))) {
    sessionStorage.removeItem(PENDING_UPLOAD_KEY);
    throw new CartReviewRequired('The house photo did not reach the order. Remove this composition and upload it again before checkout.');
  }
  if (!artworkExtrasComplete(cart, pending)) {
    const existing = cart.items.some(item => item.properties?.['_Composition ID'] === pending.compositionId &&
      item.properties?.['_Service Kind']);
    if (pending.started || existing) {
      throw new CartReviewRequired('Your files arrived, but the paid services could not be verified. Remove this composition and try again before checkout.');
    }
    // Mark the attempt before sending it: an interrupted response must not trigger a duplicate charge on reload.
    pending.started = true;
    sessionStorage.setItem(PENDING_UPLOAD_KEY, JSON.stringify(pending));
    let response;
    try {
      response = await fetch((window.cartAddUrl || '/cart/add') + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: pending.extras })
      });
    } catch {
      // Verify the cart rather than retrying a request whose outcome is unknown.
    }
    const verified = await cartJson().catch(() => null);
    if (!verified || !artworkExtrasComplete(verified, pending)) {
      const description = response && !response.ok ? (await response.json().catch(() => ({}))).description : '';
      throw new CartReviewRequired(description || 'We could not confirm the paid services. Remove this composition and try again before checkout.');
    }
  }
  if (pending.editId) await replaceComposition(pending.editId, pending.compositionId);
  sessionStorage.removeItem(PENDING_UPLOAD_KEY);
  window.location.replace(window.paletteInstallCartPageUrl || window.cartUrl || '/cart');
}

async function loadEditingComposition(form) {
  const id = new URLSearchParams(window.location.search).get('edit');
  if (!id) return;
  const cart = await cartJson();
  const group = cart.items.filter(item => item.properties && item.properties['_Composition ID'] === id);
  const base = group.find(item => !item.properties['_Service Kind'] && String(item.product_id) === form.dataset.productId);
  if (!base) throw new Error('This design is no longer in your selection. Return to your composition to review the details.');
  const select = form.querySelector('select[name="id"]');
  if (!Array.from(select.options).some(option => option.value === String(base.variant_id))) {
    throw new Error('The original palette is no longer available. Return to your composition to review the details.');
  }
  form.dataset.editCompositionId = id;
  select.value = String(base.variant_id);
  const selector = form.querySelector('variant-selects');
  const variants = selector && JSON.parse(selector.querySelector('[type="application/json"]').textContent);
  const variant = variants && variants.find(item => String(item.id) === String(base.variant_id));
  if (variant) {
    selector.querySelectorAll('.variant-picker__group').forEach((groupNode, index) => {
      const radio = Array.from(groupNode.querySelectorAll('input[type="radio"]')).find(input => input.value === variant.options[index]);
      if (radio) radio.checked = true;
    });
    selector.dispatchEvent(new Event('change', { bubbles: true }));
  }
  const properties = {
    ...base.properties,
    'Vinyl Artwork': base.properties['Vinyl Artwork'] || base.properties.Monogram,
    'Vinyl-wrapped Pumpkins': base.properties['Vinyl-wrapped Pumpkins'] || base.properties['Monogrammed Pumpkins']
  };
  for (const [name, value] of Object.entries(properties)) {
    const radio = Array.from(form.elements).find(element => element.name === `properties[${name}]` && element.type === 'radio' && element.value === value);
    if (radio) radio.checked = true;
  }
  form.querySelector('[data-product-palette] input:checked')?.dispatchEvent(new Event('change', { bubbles: true }));
  form.querySelector('[data-service]:checked')?.dispatchEvent(new Event('change', { bubbles: true }));
  form.querySelector('[data-monogram-choice]:checked')?.dispatchEvent(new Event('change', { bubbles: true }));
  // The requested week may have expired since the original order; require a new choice then.
  const week = form.querySelector('[data-requested-week]');
  if (Array.from(week.options).some(option =>
    option.value === properties['Requested Week'] && !option.disabled && requestedWeekOpen(option.value))) {
    week.value = properties['Requested Week'];
  }
  for (const [name, value] of Object.entries(properties)) {
    const input = Array.from(form.elements).find(element => element.name === `properties[${name}]` && element.type !== 'radio' && element.type !== 'file');
    if (input && name !== 'Requested Week') input.value = value;
  }
  week.dispatchEvent(new Event('change', { bubbles: true }));
  const extras = group.filter(item => item.properties['_Service Kind'] === 'extra').map(item => String(item.variant_id));
  form.querySelectorAll('[name="addons[]"]').forEach(addon => { addon.checked = extras.includes(addon.value); });
  form.querySelectorAll('[data-approve-design]').forEach(approve => {
    if (!approve.disabled) approve.textContent = 'Approve changes';
  });
  productFormError(form, '');
}

function validateCartGroups(cartForm) {
  const error = cartForm.querySelector('[data-cart-validation-error]') || (() => {
    const node = document.createElement('p');
    node.dataset.cartValidationError = 'true';
    node.setAttribute('role', 'alert');
    node.style.color = 'var(--color-accent)';
    cartForm.querySelector('.cart-footer').prepend(node);
    return node;
  })();
  error.textContent = '';
  if (cartForm.dataset.cartNeedsReview === 'true') {
    error.textContent = 'Your artwork and paid services are still being checked. Please wait or review this composition before checkout.';
    return false;
  }
  const groups = {};
  for (const item of cartForm.querySelectorAll('[data-cart-item]')) {
    if (!item.dataset.compositionId &&
        (item.dataset.service || item.dataset.hay || item.dataset.monogram || item.dataset.removal)) {
      error.textContent = 'A composition is missing its private grouping ID. Please remove it and add it again before checkout.';
      return false;
    }
  }
  cartForm.querySelectorAll('[data-cart-item][data-composition-id]').forEach((item) => {
    const id = item.dataset.compositionId;
    if (!id) return;
    (groups[id] ||= []).push(item);
  });
  for (const [id, items] of Object.entries(groups)) {
    const base = items.filter(item => !item.dataset.serviceKind);
    if (base.length !== 1 || Number(base[0].dataset.itemQuantity) !== 1 ||
        Number(base[0].querySelector('.quantity__input')?.value) !== 1) {
      error.textContent = `Composition ${id} must have exactly one base display.`;
      return false;
    }
    if (base[0].dataset.artworkRequired === 'true' && base[0].dataset.artworkPresent !== 'true') {
      error.textContent = 'Artwork is missing from this vinyl-wrapped pumpkin. Remove the composition and upload the file again before checkout.';
      return false;
    }
    if (base[0].dataset.housePhotoRequired === 'true' && base[0].dataset.housePhotoPresent !== 'true') {
      error.textContent = 'The house photo is missing from this display. Remove the composition and upload it again before checkout.';
      return false;
    }
    const expected = [];
    if (!['Custom installation', 'Delivery only'].includes(base[0].dataset.service)) {
      error.textContent = 'Choose a valid fulfillment method before checkout.';
      return false;
    }
    const zipStatus = serviceAreaForZip(base[0].dataset.installationZip);
    if (zipStatus !== 'within') {
      error.textContent = zipStatus === 'outside'
        ? 'Outside our service area? Please request a consultation instead of checking out.'
        : 'Please edit your design and enter a valid five-digit installation or delivery ZIP code.';
      return false;
    }
    if (!['Yes', 'No'].includes(base[0].dataset.hay)) {
      error.textContent = 'The hay-bale selection is missing. Please edit or replace this composition.';
      return false;
    }
    expected.push(['delivery', 1]);
    if (base[0].dataset.monogram === 'Yes') expected.push(['monogram', Number(base[0].dataset.monogramQty)]);
    if (base[0].dataset.removal === 'Yes') expected.push(['removal', 1]);
    const actual = items.filter(item => item.dataset.serviceKind && item.dataset.serviceKind !== 'extra').map(item => [
      item.dataset.serviceKind, Number(item.dataset.itemQuantity)
    ]);
    if (actual.length !== expected.length || expected.some(([kind, qty]) =>
      actual.filter(([actualKind]) => actualKind === kind).reduce((sum, [, n]) => sum + n, 0) !== qty)) {
      error.textContent = 'A composition is missing or has mismatched paid service lines. Please remove it and add it again, or contact us before checkout.';
      return false;
    }
    if (items.some(item => item.dataset.serviceKind === 'extra' && Number(item.dataset.itemQuantity) !== 1)) {
      error.textContent = 'Edit the design to change its finishing touches.';
      return false;
    }
  }
  return true;
}

const APPROVED_SERVICE_FEES_BY_TIER = Object.freeze({
  small: 2500,
  medium: 5000,
  large: 8500
});
const APPROVED_VINYL_UNIT_PRICE_CENTS = 2500;

async function validateCartServiceFees() {
  const cart = await cartJson();
  const groups = new Map();
  cart.items.forEach(item => {
    const compositionId = item.properties?.['_Composition ID'];
    if (!compositionId) return;
    if (!groups.has(compositionId)) groups.set(compositionId, []);
    groups.get(compositionId).push(item);
  });
  for (const [compositionId, items] of groups) {
    const base = items.find(item => !item.properties?.['_Service Kind']);
    if (!base) throw new Error('A grouped composition is missing its base display. Review your cart before checkout.');
    const properties = base.properties || {};
    const tier = properties['_Service Fee Tier'];
    const approvedFee = APPROVED_SERVICE_FEES_BY_TIER[tier];
    const expectedFee = Number(properties['_Expected Service Fee']);
    if (!approvedFee || expectedFee !== approvedFee) {
      throw new Error('This composition has no valid approved service-fee tier. Edit or remove it before checkout.');
    }
    if (properties['Hay Bales'] !== (tier === 'small' ? 'No' : 'Yes')) {
      throw new Error('The hay-bale inclusion does not match this display size. Edit or remove it before checkout.');
    }
    const serviceItems = items.filter(item => item.properties?.['_Service Kind'] && item.properties['_Service Kind'] !== 'extra');
    const delivery = serviceItems.filter(item => item.properties['_Service Kind'] === 'delivery');
    const removal = serviceItems.filter(item => item.properties['_Service Kind'] === 'removal');
    const monogram = serviceItems.filter(item => item.properties['_Service Kind'] === 'monogram');
    const unitPrice = item => Number(item.final_price ?? item.price);
    const variantMatches = (item, expectedId) => expectedId && String(item.variant_id ?? item.id) === String(expectedId);
    if (delivery.length !== 1 || !variantMatches(delivery[0], properties['_Delivery Variant ID']) ||
        unitPrice(delivery[0]) !== approvedFee || Number(delivery[0].quantity) !== 1) {
      throw new Error('The delivery service product or price does not match this display size. Edit or remove this composition before checkout.');
    }
    if (properties.Removal === 'Yes') {
      if (removal.length !== 1 || !variantMatches(removal[0], properties['_Removal Variant ID']) ||
          unitPrice(removal[0]) !== approvedFee || Number(removal[0].quantity) !== 1) {
        throw new Error('The removal service product or price does not match this display size. Edit or remove this composition before checkout.');
      }
    } else if (removal.length) {
      throw new Error('This composition contains an unrequested removal charge. Review your cart before checkout.');
    }
    if (properties['Vinyl Artwork'] === 'Yes') {
      const vinylQuantity = Number(properties['Vinyl-wrapped Pumpkins']);
      const vinylPrice = Number(properties['_Monogram Unit Price']);
      if (monogram.length !== 1 || !variantMatches(monogram[0], properties['_Monogram Variant ID']) ||
          vinylPrice !== APPROVED_VINYL_UNIT_PRICE_CENTS ||
          unitPrice(monogram[0]) !== vinylPrice || Number(monogram[0].quantity) !== vinylQuantity) {
        throw new Error('The vinyl artwork service product or quantity does not match this composition. Edit or remove it before checkout.');
      }
    } else if (monogram.length) {
      throw new Error('This composition contains an unrequested vinyl artwork charge. Review your cart before checkout.');
    }
  }
  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-gallery-image]').forEach((thumbnail) => {
    thumbnail.addEventListener('click', () => {
      const main = document.querySelector('[data-main-image]');
      if (main) {
        main.src = thumbnail.dataset.galleryImage;
        main.alt = thumbnail.dataset.galleryAlt || '';
      }
    });
  });
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNav.classList.toggle('hidden');
    });
  }

  setupVariantSelectors();
  document.querySelectorAll('[data-product-form]').forEach(setupProductPalette);
  document.querySelectorAll('[data-product-form]').forEach(setupProductJourney);
  document.querySelectorAll('[data-product-form]').forEach(setupCompositionBrief);
  document.querySelectorAll('[data-product-form]').forEach(setupProductEstimate);
  document.querySelectorAll('[data-consultation-form]').forEach(setupConsultationForm);
  document.querySelectorAll('[data-consultation-dialog]').forEach(setupSpecialInquiryDialog);
  const cartForm = document.querySelector('#cart');
  if (cartForm) {
    finishPendingUpload(cartForm).catch(error => {
      document.documentElement.classList.remove('cart-finalizing');
      cartForm.dataset.cartNeedsReview = 'true';
      const notice = cartForm.querySelector('[data-cart-validation-error]') || document.createElement('p');
      notice.dataset.cartValidationError = 'true';
      notice.setAttribute('role', 'alert');
      notice.style.color = 'var(--color-accent)';
      notice.textContent = error.message || 'The file uploads could not be verified. Review your composition before checkout.';
      cartForm.querySelector('.cart-footer').prepend(notice);
    });
    cartForm.querySelectorAll('[data-remove-composition]').forEach((button) => {
      button.addEventListener('click', async () => {
        const id = button.dataset.removeComposition;
        const updates = {};
        cartForm.querySelectorAll(`[data-composition-id="${CSS.escape(id)}"]`).forEach(item => {
          updates[item.dataset.lineKey] = 0;
        });
        button.disabled = true;
        try {
          const response = await fetch((window.cartUrl || '/cart') + '/update.js', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ updates })
          });
          if (response.ok) {
            window.location.reload();
          } else {
            throw new Error('The composition could not be removed. Please try again.');
          }
        } catch (removeError) {
          const error = cartForm.querySelector('[data-cart-validation-error]') || document.createElement('p');
          error.dataset.cartValidationError = 'true';
          error.setAttribute('role', 'alert');
          error.style.color = 'var(--color-accent)';
          error.textContent = removeError.message || 'A network error prevented removal. Please try again.';
          cartForm.querySelector('.cart-footer').prepend(error);
          button.disabled = false;
        }
      });
    });
    cartForm.addEventListener('submit', async (event) => {
      if (cartForm.dataset.cartValidationPassed === 'true') {
        delete cartForm.dataset.cartValidationPassed;
        return;
      }
      if (!validateCartGroups(cartForm)) {
        event.preventDefault();
        return;
      }
      if (event.submitter?.name !== 'checkout') return;
      event.preventDefault();
      const error = cartForm.querySelector('[data-cart-validation-error]');
      try {
        await validateCartServiceFees();
        if (error) error.textContent = '';
        cartForm.dataset.cartValidationPassed = 'true';
        cartForm.requestSubmit(event.submitter);
      } catch (validationError) {
        const notice = error || (() => {
          const node = document.createElement('p');
          node.dataset.cartValidationError = 'true';
          node.setAttribute('role', 'alert');
          node.style.color = 'var(--color-accent)';
          cartForm.querySelector('.cart-footer').prepend(node);
          return node;
        })();
        notice.textContent = validationError.message || 'We could not verify the paid services. Review the composition before checkout.';
      }
    });
  }
  if (!document.querySelector('[data-package-browser]') && !document.querySelector('variant-selects') &&
      new URLSearchParams(window.location.search).has('palette')) {
    const form = document.querySelector('[data-product-form]');
    if (form) {
      const error = form.querySelector('#product-form-error');
      if (error) {
        error.textContent = 'This size does not offer palette choices yet. Please choose another size.';
        error.classList.remove('hidden');
      }
      const submit = form.querySelector('[data-approve-design]');
      if (submit) submit.disabled = true;
    }
  }

  // Quantity updates
  const quantityInputs = document.querySelectorAll('.quantity');
  quantityInputs.forEach(wrapper => {
    const btnMinus = wrapper.querySelector('[name="minus"]');
    const btnPlus = wrapper.querySelector('[name="plus"]');
    const input = wrapper.querySelector('input');

    if (btnMinus && btnPlus && input) {
      btnMinus.addEventListener('click', (e) => {
        e.preventDefault();
        if (Number(input.value) > Number(input.min || 0)) {
          input.stepDown();
          if (wrapper.closest('#cart')) wrapper.closest('form').requestSubmit(wrapper.closest('form').querySelector('[name="update"]'));
        }
      });
      btnPlus.addEventListener('click', (e) => {
        e.preventDefault();
        input.stepUp();
        if (wrapper.closest('#cart')) wrapper.closest('form').requestSubmit(wrapper.closest('form').querySelector('[name="update"]'));
      });
    }
  });

  // Approval is local to the current form values; changes invalidate it.
  const bindApproval = (productForm) => {
    if (productForm.dataset.approvalBound === 'true') return;
    productForm.dataset.approvalBound = 'true';
    const approveButtons = Array.from(productForm.querySelectorAll('[data-approve-design]'));
    const submit = productForm.querySelector('[data-cart-submit]');
    const approvalStatus = productForm.querySelector('[data-approval-status]');
    if (!approveButtons.length || !submit || !approvalStatus) {
      productForm.addEventListener('submit', event => event.preventDefault());
      return;
    }
    const resetApproval = () => {
      if (productForm.dataset.cartSubmitting === 'true') return;
      if (productForm.dataset.cartNeedsReview === 'true') {
        approvalStatus.hidden = true;
        return;
      }
      productForm.dataset.approvedSignature = '';
      approvalStatus.hidden = true;
      submit.hidden = true;
      approveButtons.forEach(button => { button.hidden = false; });
      productFormError(productForm, '');
    };
    productForm.addEventListener('input', resetApproval);
    productForm.addEventListener('change', resetApproval);
    const submitApprovedDesign = async (configured) => {
      if (productForm.dataset.cartSubmitting === 'true') return;
      productForm.dataset.cartSubmitting = 'true';
      submit.disabled = true;
      submit.textContent = 'Preparing your design…';
      const cartUrl = window.paletteInstallCartPageUrl || window.cartUrl || '/cart';
      const requireCartReview = (message) => {
        productForm.dataset.cartSubmitting = 'false';
        productForm.dataset.cartNeedsReview = 'true';
        approveButtons.forEach(button => { button.disabled = true; });
        approvalStatus.hidden = true;
        productFormError(productForm, message);
        submit.textContent = 'Review your composition';
        submit.disabled = false;
        submit.type = 'button';
        submit.addEventListener('click', () => { window.location.href = cartUrl; }, { once: true });
      };
      try {
        if (configured.items[0].properties['Vinyl Artwork'] === 'Yes' ||
            configured.items[0].properties['_House Photo Expected'] === 'Yes') {
          const compositionInput = productForm.querySelector('[data-composition-id-input]');
          const housePhotoExpected = productForm.querySelector('[data-house-photo-expected]');
          if (!compositionInput || !housePhotoExpected) throw new Error('The file uploads could not be prepared. Please try again.');
          sessionStorage.setItem(PENDING_UPLOAD_KEY, JSON.stringify({
            compositionId: configured.compositionId,
            extras: configured.items.slice(1),
            editId: productForm.dataset.editCompositionId || null,
            artworkRequired: configured.items[0].properties['Vinyl Artwork'] === 'Yes',
            housePhotoRequired: configured.items[0].properties['_House Photo Expected'] === 'Yes'
          }));
          compositionInput.value = configured.compositionId;
          housePhotoExpected.disabled = configured.items[0].properties['_House Photo Expected'] !== 'Yes';
          // Shopify's multipart product form stores both file bytes as line-item properties.
          // JSON Cart API requests would only send filenames, not the uploads.
          HTMLFormElement.prototype.submit.call(productForm);
          return;
        }
        await addCompositionToCart(configured);
        if (productForm.dataset.editCompositionId) {
          await replaceComposition(productForm.dataset.editCompositionId, configured.compositionId);
        }
        window.location.href = cartUrl;
      } catch (error) {
        if (error instanceof CartReviewRequired) {
          requireCartReview(error.message);
          return;
        }
        productFormError(productForm, error.message || 'Your selection could not be updated. Please try again.');
        productForm.dataset.cartSubmitting = 'false';
        submit.disabled = false;
        submit.textContent = 'Review your composition';
      }
    };
    const approveDesign = () => {
      try {
        if (productForm.closest('[data-package-browser]')?.dataset.cartPreviewOnly === 'true') {
          throw new Error('This design cannot be added to the Shopify cart until its display and required services are available. No items were added.');
        }
        const configured = configuredCartItems(productForm);
        productForm.dataset.approvedSignature = designSignature(productForm);
        approvalStatus.hidden = false;
        submit.hidden = false;
        approveButtons.forEach(button => { button.hidden = true; });
        productFormError(productForm, '');
        // Use the validated snapshot directly. A synthetic form submission can
        // fire other form listeners and invalidate approval before cart addition.
        void submitApprovedDesign(configured);
      } catch (error) {
        productFormError(productForm, error.message);
        if (error.message.includes('Fill out the consultation form') &&
            serviceAreaForZip(productForm.querySelector('[data-installation-zip]')?.value) === 'outside') {
          productForm.querySelector('[data-outside-area-note] a')?.focus();
        }
      }
    };
    approveButtons.forEach(button => button.addEventListener('click', approveDesign));
    productForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (productForm.dataset.cartSubmitting === 'true') return;
      if (!productForm.dataset.approvedSignature || productForm.dataset.approvedSignature !== designSignature(productForm)) {
        resetApproval();
        productFormError(productForm, 'Please approve your updated design before reviewing your composition.');
        return;
      }
      let configured;
      try {
        configured = configuredCartItems(productForm);
      } catch (error) {
        resetApproval();
        productFormError(productForm, error.message);
        return;
      }
      void submitApprovedDesign(configured);
    });
    loadEditingComposition(productForm).catch(error => {
      approveButtons.forEach(button => { button.disabled = true; });
      productFormError(productForm, error.message);
    });
  };
  document.querySelectorAll('[data-product-form]').forEach(bindApproval);
  document.addEventListener('shopify:section:load', () => {
    document.querySelectorAll('[data-product-form]').forEach(bindApproval);
  });
});

document.addEventListener('shopify:section:load', () => {
  setupVariantSelectors();
  document.querySelectorAll('[data-product-form]').forEach(setupProductPalette);
  document.querySelectorAll('[data-product-form]').forEach(setupProductJourney);
  document.querySelectorAll('[data-product-form]').forEach(setupCompositionBrief);
  document.querySelectorAll('[data-product-form]').forEach(setupProductEstimate);
  document.querySelectorAll('[data-consultation-form]').forEach(setupConsultationForm);
  document.querySelectorAll('[data-consultation-dialog]').forEach(setupSpecialInquiryDialog);
  syncPaletteGalleries(document.querySelector('variant-selects'));
});

// Section scripts can listen for readiness while this deferred asset is still
// executing. Announce it only after all shared helpers have been defined.
window.paletteInstallThemeReady = true;
document.dispatchEvent(new Event('palette-install:theme-ready'));
