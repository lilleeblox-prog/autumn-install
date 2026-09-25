import { Link, useSearch } from 'wouter';
import { ArrowDownRight, ChevronRight, Check } from 'lucide-react';
import { packages, palettes } from '../lib/data';
import { useState, useEffect, useRef } from 'react';
import { PaletteCarousel } from '../components/PaletteCarousel';
import { saveConsultationChoices, type ConsultationChoices } from '../lib/consultation';
import type { MouseEvent } from 'react';

const MAX_ARTWORK_FILE_BYTES = 20 * 1024 * 1024;
const VINYL_PUMPKIN_PRICE_CENTS = 2500;
const formatPrice = (cents: number) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0,
}).format(cents / 100);

const weeks = [
  { date: 'Sep 28', value: 'Week of Sep 28, 2026' },
  { date: 'Oct 5', value: 'Week of Oct 5, 2026' },
  { date: 'Oct 12', value: 'Week of Oct 12, 2026' },
  { date: 'Oct 19', value: 'Week of Oct 19, 2026' },
  { date: 'Oct 26', value: 'Week of Oct 26, 2026' },
];

export default function Home() {
  const search = useSearch();
  const [mobilePane, setMobilePane] = useState<'build' | 'preview'>('build');
  const builderRef = useRef<HTMLElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState<string>('medium');
  const [expandedSize, setExpandedSize] = useState<string | null>(null);
  const [palette, setPalette] = useState<string>('');

  const [fulfillment, setFulfillment] = useState<'installation' | 'delivery' | ''>('');
  const [monogram, setMonogram] = useState<'yes' | 'no' | ''>('');
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [monogramCount, setMonogramCount] = useState('');
  const [monogramPumpkinColor, setMonogramPumpkinColor] = useState('');
  const [monogramVinylColor, setMonogramVinylColor] = useState('');
  const [requestedWeek, setRequestedWeek] = useState('');
  const [removal, setRemoval] = useState<'yes' | 'no' | ''>('');
  const [notes, setNotes] = useState('');
  const [furtherCustomization, setFurtherCustomization] = useState(false);
  const [consultationTransferError, setConsultationTransferError] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [approvedSignature, setApprovedSignature] = useState<string | null>(null);
  const selectedPackage = packages.find(pkg => pkg.id === size);
  const includesHayBales = selectedPackage?.includesHayBales ?? false;
  const pumpkinCount = Number(monogramCount);
  const pricedPumpkinCount = monogram === 'yes' && Number.isInteger(pumpkinCount) && pumpkinCount > 0 ? pumpkinCount : 0;
  const serviceFeeCents = selectedPackage?.serviceFeeCents ?? 0;
  const knownSubtotal = (selectedPackage?.priceCents ?? 0) + pricedPumpkinCount * VINYL_PUMPKIN_PRICE_CENTS
    + (fulfillment ? serviceFeeCents : 0) + (removal === 'yes' ? serviceFeeCents : 0);
  const pendingCharges = [
    ...(monogram === 'yes' && !pricedPumpkinCount ? ['Vinyl pumpkin quantity'] : []),
    ...(furtherCustomization ? ['Further customization'] : []),
  ];
  const designSignature = JSON.stringify({
    size, palette, fulfillment, monogram,
    artworkFile: artworkFile ? { name: artworkFile.name, size: artworkFile.size, lastModified: artworkFile.lastModified } : null,
    monogramCount, monogramPumpkinColor, monogramVinylColor,
    requestedWeek, removal, notes, furtherCustomization,
  });
  const isApproved = approvedSignature === designSignature;
  const consultationChoices: ConsultationChoices = {
    size, palette, fulfillment, monogram, monogramCount,
    pumpkinColor: monogramPumpkinColor, vinylColor: monogramVinylColor,
    artworkSelected: !!artworkFile, requestedWeek, removal, notes, furtherCustomization,
  };

  useEffect(() => {
    saveConsultationChoices(consultationChoices);
  }, [designSignature]);

  const carryChoicesToConsultation = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!saveConsultationChoices(consultationChoices)) {
      event.preventDefault();
      setConsultationTransferError('Your selections could not be carried to the consultation draft. Please try again in this tab.');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(search);
    const sizeParam = params.get('size');
    if (sizeParam && packages.some(p => p.id === sizeParam)) {
      setSize(sizeParam);
    }
    const previewRequested = params.get('view') === 'preview';
    setMobilePane(previewRequested ? 'preview' : 'build');
    const frame = requestAnimationFrame(() => {
      if (previewRequested) {
        previewRef.current?.scrollTo({ top: 0, behavior: 'instant' });
        return;
      }
      if (sizeParam && packages.some(p => p.id === sizeParam)) {
        document.getElementById('field-size')?.scrollIntoView({ block: 'start', behavior: 'instant' });
      } else {
        editorRef.current?.scrollTo({ top: 0, behavior: 'instant' });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [search]);

  const scrollToField = (id: string) => {
    setMobilePane('build');
    requestAnimationFrame(() => document.getElementById(`field-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const scrollToSummary = () => {
    setMobilePane('preview');
    requestAnimationFrame(() => {
      if (window.matchMedia('(max-width: 900px)').matches) {
        builderRef.current?.querySelector<HTMLButtonElement>('[data-testid="button-view-preview"]')?.focus({ preventScroll: true });
      }
      document.getElementById('order-summary')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!palette) newErrors.palette = "Please select a palette.";
    if (!size) newErrors.size = "Please select a scale.";
    if (!monogram) newErrors.monogram = "Please choose whether you want your artwork vinyl-wrapped.";

    if (monogram === 'yes') {
      if (!artworkFile) {
        newErrors.artworkFile = "Please upload your artwork as a PNG or PDF.";
      } else {
        const extension = artworkFile.name.split('.').pop()?.toLowerCase();
        const expectedType = extension === 'png' ? 'image/png' : extension === 'pdf' ? 'application/pdf' : '';
        if (!expectedType || (artworkFile.type && artworkFile.type !== expectedType)) {
          newErrors.artworkFile = "Please choose a valid PNG or PDF file.";
        } else if (artworkFile.size < 1 || artworkFile.size > MAX_ARTWORK_FILE_BYTES) {
          newErrors.artworkFile = "Your artwork file must be 20 MB or smaller.";
        }
      }
      const countNum = Number(monogramCount);
      if (!monogramCount || isNaN(countNum) || countNum < 1 || !Number.isInteger(countNum)) {
        newErrors.monogramCount = "Please enter a valid positive number.";
      }
      if (!['White', 'Orange'].includes(monogramPumpkinColor)) newErrors.monogramPumpkinColor = "Please choose a pumpkin color.";
      if (!['White', 'Black', 'Gold'].includes(monogramVinylColor)) newErrors.monogramVinylColor = "Please choose a vinyl color.";
    }

    if (!fulfillment) newErrors.fulfillment = "Please select a fulfillment method.";
    if (!weeks.some(week => week.value === requestedWeek)) newErrors.requestedWeek = "Please select one of the listed weeks.";
    if (!removal) newErrors.removal = "Please select a removal option.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorId = Object.keys(newErrors)[0];
      setMobilePane('build');
      setTimeout(() => {
        const el = document.getElementById(`field-${firstErrorId}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el?.querySelector<HTMLElement>('input, select, textarea, button:not(.summary-action)')?.focus({ preventScroll: true });
      }, 0);
      return false;
    }
    return true;
  };

  const handleApprove = () => {
    if (!validate()) return;
    setApprovedSignature(designSignature);
  };

  return (
      <section
         id="builder"
          ref={builderRef}
         className="builder-screen"
         data-mobile-pane={mobilePane}
           aria-label="Compose your seasonal installation"
       >
         <nav className="builder-screen-tabs" aria-label="Builder views">
            <button type="button" aria-pressed={mobilePane === 'build'} onClick={() => setMobilePane('build')} data-testid="button-view-build">Create your look</button>
            <button type="button" aria-pressed={mobilePane === 'preview'} onClick={() => setMobilePane('preview')} data-testid="button-view-preview">See your design</button>
         </nav>
         <div className="builder-screen-body">
            <div className="builder-screen-editor" ref={editorRef} aria-label="Create your display">
        <div className="section-header">
            <h1>An entrance<br /><em>to remember.</em></h1>
             <p>Compose a seasonal welcome with the care you would give any other room. Begin with a color story; we’ll take it from there.</p>
        </div>

            <div id="builder-options" className="builder-options">

            <div id="field-palette" className="builder-step">
              <div className="builder-step-header">
                  <span className="eyebrow">01 / The palette</span>
                  <h2>Set the tone.</h2>
                  <p>Every entry has its own atmosphere. Choose the color story that feels at home in yours.</p>
              </div>
                 <div className="palette-choice-options">
                  <div className="builder-grid-2">
                    {palettes.map(pal => (
                      <button
                        key={pal.id}
                        type="button"
                        aria-pressed={palette === pal.id}
                        data-testid={`button-select-palette-${pal.id}`}
                        className={`builder-card ${palette === pal.id ? 'active' : ''}`}
                        onClick={() => { setPalette(pal.id); setErrors(e => ({...e, palette: ''})); }}
                      >
                        <div className="builder-card-content">
                          <div className="builder-palette-colors">
                            {pal.colors.map(c => <div key={c} className="builder-palette-color" style={{ background: c }} />)}
                          </div>
                          <span className="builder-card-title">{pal.name}</span>
                          <span className="builder-card-desc">{pal.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.palette && <span className="builder-step-error">{errors.palette}</span>}
                  {palette && (
                    <div className="builder-step-actions">
                      <button type="button" className="text-link" onClick={() => scrollToField('size')}>
                        Next: Select Scale <ArrowDownRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
            </div>

            <div id="field-size" className="builder-step">
              <div className="builder-step-header">
                  <span className="eyebrow">02 / The proportion</span>
                  <h2>Find your scale.</h2>
                  <p>Consider the architecture of your entrance and choose the scale that suits your space.</p>
              </div>
              <div className="builder-grid-3">
                {packages.map(pkg => (
                   <div key={pkg.id} className="builder-package-option">
                     <button
                       type="button"
                       aria-pressed={size === pkg.id}
                       aria-expanded={expandedSize === pkg.id}
                       aria-controls={`package-contents-${pkg.id}`}
                       data-testid={`button-select-size-${pkg.id}`}
                       className={`builder-card ${size === pkg.id ? 'active' : ''}`}
                       onClick={() => {
                         setSize(pkg.id);
                         setExpandedSize(current => current === pkg.id ? null : pkg.id);
                         setErrors(e => ({...e, size: ''}));
                       }}
                     >
                       {pkg.id === 'medium' && <span className="builder-card-popular">Most popular</span>}
                       <span className="builder-card-content">
                         <span className="builder-card-title">{pkg.name}</span>
                         <span className="builder-card-desc">{pkg.room}</span>
                         <span className="builder-card-disclosure">{expandedSize === pkg.id ? 'Hide what’s included' : 'See what’s included'} <ChevronRight size={14} aria-hidden="true" /></span>
                       </span>
                     </button>
                     <div id={`package-contents-${pkg.id}`} className="builder-package-details" hidden={expandedSize !== pkg.id}>
                       <span className="eyebrow">Included in {pkg.name}</span>
                       <ul>{pkg.contents.map(item => <li key={item}>{item}</li>)}</ul>
                    </div>
                   </div>
                ))}
              </div>
              {errors.size && <span className="builder-step-error">{errors.size}</span>}

              {size && (
                <div className="builder-step-actions">
                  <button type="button" className="text-link" onClick={() => scrollToField('details')}>
                    Next: Put your signature on it <ArrowDownRight size={14} />
                  </button>
                </div>
              )}
            </div>

             <div id="field-details" className="builder-step builder-details">
              <div className="builder-step-header">
                  <span className="eyebrow">03 / The details</span>
                  <h2>Put your signature on it.</h2>
                  <p>Upload your own artwork and we’ll wrap it in vinyl on a pumpkin. Choose the pumpkin and vinyl colors that bring your design to life.</p>
              </div>

              {/* Custom vinyl artwork */}
               <div id="field-monogram">
                 <label className="eyebrow" style={{ display: 'block', marginBottom: '16px' }}>Add a vinyl-wrapped artwork pumpkin?</label>
                <div className="builder-radio-group">
                  <button
                    type="button"
                    className="builder-radio-card"
                    aria-pressed={monogram === 'yes'}
                    onClick={() => { setMonogram('yes'); setErrors(e => ({...e, monogram: ''})); }}
                  >
                    <strong>Yes, add my artwork</strong>
                    <span className="builder-radio-desc">Wrap my uploaded design in vinyl on a pumpkin</span>
                  </button>
                  <button
                    type="button"
                    className="builder-radio-card"
                    aria-pressed={monogram === 'no'}
                    onClick={() => {
                      setMonogram('no');
                      setArtworkFile(null);
                      setMonogramCount('');
                      setMonogramPumpkinColor('');
                      setMonogramVinylColor('');
                      setErrors(e => ({...e, monogram: '', artworkFile: '', monogramCount: '', monogramPumpkinColor: '', monogramVinylColor: ''}));
                    }}
                  >
                    <strong>No thanks</strong>
                    <span className="builder-radio-desc">No custom vinyl artwork</span>
                  </button>
                </div>
                {errors.monogram && <span className="builder-field-error">{errors.monogram}</span>}
              </div>

              {/* Vinyl artwork details */}
              {monogram === 'yes' && (
                <div className="builder-subfields artwork-details-grid">
                  <div id="field-artworkFile" className="artwork-upload-field">
                    <label htmlFor="artwork-file" className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>Upload your artwork (PNG or PDF)</label>
                    <input
                      id="artwork-file"
                      type="file"
                      accept=".png,.pdf,image/png,application/pdf"
                      required
                      className="builder-input"
                      aria-describedby="artwork-file-hint"
                      aria-invalid={!!errors.artworkFile}
                      onChange={e => {
                        const file = e.target.files?.[0] ?? null;
                        if (!file) {
                          setArtworkFile(null);
                          return;
                        }
                        const extension = file.name.split('.').pop()?.toLowerCase();
                        const expectedType = extension === 'png' ? 'image/png' : extension === 'pdf' ? 'application/pdf' : '';
                        if (!expectedType || (file.type && file.type !== expectedType)) {
                          setArtworkFile(null);
                          e.target.value = '';
                          setErrors(err => ({...err, artworkFile: 'Please choose a valid PNG or PDF file.'}));
                       } else if (file.size < 1 || file.size > MAX_ARTWORK_FILE_BYTES) {
                          setArtworkFile(null);
                          e.target.value = '';
                          setErrors(err => ({...err, artworkFile: 'Your artwork file must be 20 MB or smaller.'}));
                        } else {
                          setArtworkFile(file);
                          setErrors(err => ({...err, artworkFile: ''}));
                        }
                      }}
                    />
                    <p id="artwork-file-hint" className="builder-field-hint">Choose a PNG or PDF no larger than 20 MB. This design preview keeps the selected file in your browser; it does not upload it with a Shopify order.</p>
                    {artworkFile && <p className="builder-field-hint">Selected file: {artworkFile.name}</p>}
                    {errors.artworkFile && <span className="builder-field-error">{errors.artworkFile}</span>}
                  </div>

                  <div id="field-monogramCount">
                    <label htmlFor="monogram-count" className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>How many pumpkins?</label>
                    <input
                      id="monogram-count"
                      type="number"
                      min="1"
                      className="builder-input"
                      placeholder="e.g. 2"
                      value={monogramCount}
                      onChange={e => {
                        setMonogramCount(e.target.value);
                        setErrors(err => ({...err, monogramCount: ''}));
                      }}
                    />
                    {errors.monogramCount && <span className="builder-field-error">{errors.monogramCount}</span>}
                  </div>

                  <div id="field-monogramPumpkinColor">
                    <label htmlFor="monogram-pumpkin-color" className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>Pumpkin Color</label>
                    <div className="builder-select-wrap">
                    <select
                      id="monogram-pumpkin-color"
                      className="builder-input builder-select"
                      value={monogramPumpkinColor}
                      onChange={e => {
                        setMonogramPumpkinColor(e.target.value);
                        setErrors(err => ({...err, monogramPumpkinColor: ''}));
                      }}
                    >
                      <option value="">Choose a pumpkin color</option>
                      <option value="White">White</option>
                      <option value="Orange">Orange</option>
                    </select>
                    </div>
                    {errors.monogramPumpkinColor && <span className="builder-field-error">{errors.monogramPumpkinColor}</span>}
                  </div>

                  <div id="field-monogramVinylColor">
                    <label htmlFor="monogram-vinyl-color" className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>Vinyl Color</label>
                    <div className="builder-select-wrap">
                    <select
                      id="monogram-vinyl-color"
                      className="builder-input builder-select"
                      value={monogramVinylColor}
                      onChange={e => {
                        setMonogramVinylColor(e.target.value);
                        setErrors(err => ({...err, monogramVinylColor: ''}));
                      }}
                    >
                      <option value="">Choose a vinyl color</option>
                      <option value="White">White</option>
                      <option value="Black">Black</option>
                      <option value="Gold">Gold</option>
                    </select>
                    </div>
                    {errors.monogramVinylColor && <span className="builder-field-error">{errors.monogramVinylColor}</span>}
                  </div>
                </div>
              )}

               <div id="field-notes" style={{ marginTop: '32px' }}>
                 <label htmlFor="general-notes" className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>Your vision (optional)</label>
                 <textarea
                   id="general-notes"
                   placeholder="The feeling, colors, event, or little details you're imagining..."
                   className="builder-input"
                   rows={3}
                   value={notes}
                   onChange={e => setNotes(e.target.value)}
                   style={{ resize: 'vertical' }}
                 />
                 <p className="builder-field-hint">Tell us what would make this feel unmistakably yours.</p>
               </div>

                <div className="builder-consultation-option">
                  <span className="eyebrow">Beyond the builder</span>
                  <h3>Have something more in mind?</h3>
                  <p>For a different scale, setting, or one-of-a-kind detail, further customization starts with a consultation. Scope and pricing are discussed before anything is confirmed.</p>
                  <button
                    type="button"
                    className="builder-consultation-choice"
                    aria-pressed={furtherCustomization}
                    onClick={() => setFurtherCustomization(value => !value)}
                    data-testid="button-further-customization"
                  >
                    <span className="builder-consultation-check" aria-hidden="true">{furtherCustomization ? <Check size={15} /> : null}</span>
                    <span>{furtherCustomization ? 'I’d like to discuss a custom design' : 'I’d like something further customized'}</span>
                  </button>
                  {furtherCustomization && (
                    <div className="builder-consultation-guidance">
                      <p>A consultation is required for this request. Add details in “Your vision”; your chosen details will appear in the consultation draft.</p>
                      <Link href="/contact?consultation=1" onClick={carryChoicesToConsultation} className="text-link">Continue to consultation draft <ChevronRight size={16} aria-hidden="true" /></Link>
                      {consultationTransferError && <p role="alert" className="builder-field-error">{consultationTransferError}</p>}
                    </div>
                  )}
                </div>

               <div className="builder-logistics-heading">
                  <span className="eyebrow">04 / The arrival</span>
                  <h3>Bring it to life.</h3>
                  <p>Tell us how you’d like the composition to arrive, and when you hope to welcome it.</p>
               </div>
               <div id="field-fulfillment">
                 <label className="eyebrow" style={{ display: 'block', marginBottom: '16px' }}>Fulfillment method</label>
                 <div className="builder-radio-group">
                   <button
                     type="button"
                     className="builder-radio-card"
                     aria-pressed={fulfillment === 'installation'}
                      onClick={() => { setFulfillment('installation'); setErrors(e => ({...e, fulfillment: ''})); }}
                   >
                     <strong>Custom Installation</strong>
                      <span className="builder-radio-desc">Our team sets up your display</span>
                   </button>
                   <button
                     type="button"
                     className="builder-radio-card"
                     aria-pressed={fulfillment === 'delivery'}
                     onClick={() => { setFulfillment('delivery'); setErrors(e => ({...e, fulfillment: ''})); }}
                   >
                     <strong>Delivery Only</strong>
                      <span className="builder-radio-desc">Curated drop-off for you to arrange</span>
                   </button>
                 </div>
                 {errors.fulfillment && <span className="builder-field-error">{errors.fulfillment}</span>}
               </div>
               {/* Scheduling week */}
               <div id="field-requestedWeek" style={{ marginTop: '24px' }}>
                  <span id="requested-week-label" className="eyebrow" style={{ display: 'block', marginBottom: '16px' }}>
                   {fulfillment === 'delivery' ? 'Requested Delivery Week' : 'Requested Delivery & Installation Week'}
                  </span>
                  <div className="builder-week-grid" role="group" aria-labelledby="requested-week-label">
                    {weeks.map(week => (
                      <button
                        key={week.value}
                        type="button"
                        className="builder-radio-card builder-week-card"
                        aria-label={week.value}
                        aria-pressed={requestedWeek === week.value}
                        onClick={() => {
                          setRequestedWeek(week.value);
                          setErrors(err => ({ ...err, requestedWeek: '' }));
                        }}
                      >
                        <strong>{week.date}</strong>
                      </button>
                    ))}
                  </div>
                   <p className="builder-field-hint">We’ll confirm your delivery or installation date and time as your requested week approaches. If you need a specific date for an event, please let us know in your design notes above.</p>
                 {errors.requestedWeek && <span className="builder-field-error">{errors.requestedWeek}</span>}
              </div>

              {/* Removal */}
               <div id="field-removal" style={{ marginTop: '24px' }}>
                <label className="eyebrow" style={{ display: 'block', marginBottom: '16px' }}>Removal Service</label>
                <div className="builder-radio-group">
                  <button
                    type="button"
                    className="builder-radio-card"
                    aria-pressed={removal === 'yes'}
                    onClick={() => { setRemoval('yes'); setErrors(e => ({...e, removal: ''})); }}
                  >
                    <strong>Schedule Removal</strong>
                    <span className="builder-radio-desc">We clear everything post-season</span>
                  </button>
                  <button
                    type="button"
                    className="builder-radio-card"
                    aria-pressed={removal === 'no'}
                    onClick={() => { setRemoval('no'); setErrors(e => ({...e, removal: ''})); }}
                  >
                    <strong>I'll Handle It</strong>
                    <span className="builder-radio-desc">No removal service needed</span>
                  </button>
                </div>
                {errors.removal && <span className="builder-field-error">{errors.removal}</span>}
              </div>

            </div>

          </div>
           <div className="builder-screen-exit-cta">
               <span className="eyebrow">Your signature details</span>
               <p>Approve your choices here, then see your full design brief on the right.</p>
               <button
                 type="button"
                 className="summary-action"
                 onClick={handleApprove}
                 disabled={isApproved}
                 aria-describedby="approval-preview-note"
                 data-testid="button-approve-design"
               >
                 {isApproved ? <><Check size={14} /> Design approved</> : 'Approve design'}
               </button>
               <button type="button" className="text-link" onClick={scrollToSummary} data-testid="button-review-builder-brief">Review your design <ChevronRight size={16} aria-hidden="true" /></button>
               <p id="approval-preview-note" className="summary-note">
                 {furtherCustomization
                   ? 'A consultation is needed to confirm this custom request. Approval here does not place an order or reserve a date.'
                   : 'Studio preview only. Approval does not open a cart or reserve a date. Shopify ordering opens after the catalog and availability are reviewed.'}
               </p>
               {isApproved && <p className="summary-approval-status" role="status">Your design is approved on this screen. Changing any choice will require you to approve it again.</p>}
                {furtherCustomization && <Link href="/contact?consultation=1" onClick={carryChoicesToConsultation} className="summary-consultation-link">View consultation draft <ChevronRight size={16} aria-hidden="true" /></Link>}
           </div>
         </div>

          <aside className="builder-screen-preview" aria-label="Live visual and composition brief">
            <div className="builder-screen-preview-scroll" ref={previewRef}>
           <div className="builder-screen-preview-intro">
               <div className="eyebrow">Your composition / Live study</div>
               <h2>The view from here.</h2>
              <p>Your choices appear here as you make them. Photographs show palette or scale inspiration, not a rendering of your finished display.</p>
           </div>
           <div className="builder-screen-live-line" aria-live="polite">
              <div><span className="eyebrow">Your colors</span><strong>{palettes.find(p => p.id === palette)?.name || 'Yours to choose'}</strong></div>
              <div><span className="eyebrow">Your scale</span><strong>{packages.find(p => p.id === size)?.name || 'Yours to choose'}</strong></div>
               <div><span className="eyebrow">Your signature</span><strong>{monogram === 'yes' ? artworkFile?.name || 'Artwork to upload' : monogram === 'no' ? 'No vinyl artwork' : 'Yours to choose'}</strong></div>
           </div>
           <div className="builder-screen-preview-gallery">
             <PaletteCarousel key={palette || 'unselected'} paletteId={palette} />
           </div>
           <div className="builder-screen-preview-recap">
           <div id="order-summary" className="builder-summary">
            <div className="summary-header">
                 <span className="eyebrow">The design you've made</span>
                <h3>Review your design</h3>
            </div>

            <div className="summary-items-list">
              <div className="summary-item">
                <span className="summary-label">Palette</span>
                <span className="summary-value">
                  {palette ? palettes.find(p => p.id === palette)?.name : 'Not selected'}
                </span>
              </div>

              <div className="summary-item">
                <span className="summary-label">Scale</span>
                <span className="summary-value">
                  {size ? packages.find(p => p.id === size)?.name : 'Not selected'}
                </span>
              </div>

              <div className="summary-item">
                 <span className="summary-label">Vinyl-wrapped artwork</span>
                <span className="summary-value">
                   {monogram === 'yes' ? `${artworkFile?.name || 'Artwork not selected'} (${monogramCount || '0'} pumpkins)` : monogram === 'no' ? 'None' : 'Not selected'}
                </span>
              </div>

              {monogram === 'yes' && (
                <>
                  <div className="summary-item">
                   <span className="summary-label">Pumpkin Color</span>
                    <span className="summary-value">
                     {monogramPumpkinColor || 'Not specified'}
                    </span>
                  </div>
                  <div className="summary-item">
                   <span className="summary-label">Vinyl Color</span>
                    <span className="summary-value">
                     {monogramVinylColor || 'Not specified'}
                    </span>
                  </div>
                </>
              )}

               {notes && (
                 <div className="summary-item">
                   <span className="summary-label">Your Vision</span>
                   <span className="summary-value">{notes}</span>
                 </div>
               )}
                {furtherCustomization && (
                  <div className="summary-item">
                    <span className="summary-label">Further customization</span>
                    <span className="summary-value">Consultation required</span>
                  </div>
                )}
               <div className="summary-item">
                 <span className="summary-label">Fulfillment</span>
                 <span className="summary-value">
                   {fulfillment === 'installation' ? 'Custom Installation' : fulfillment === 'delivery' ? 'Delivery Only' : 'Not selected'}
                 </span>
               </div>
                {includesHayBales && (
                  <div className="summary-item">
                    <span className="summary-label">Hay bales</span>
                    <span className="summary-value">A pair included</span>
                  </div>
                )}
              <div className="summary-item">
                 <span className="summary-label">{fulfillment === 'delivery' ? 'Delivery Week' : 'Delivery & Install Week'}</span>
                <span className="summary-value">
                   {requestedWeek || 'Not selected'}
                </span>
              </div>

              <div className="summary-item">
                 <span className="summary-label">Removal</span>
                <span className="summary-value">
                   {removal === 'yes' ? 'Requested' : removal === 'no' ? 'Will handle myself' : 'Not selected'}
                </span>
              </div>
            </div>

            <section className="builder-price-recap" aria-label="Live price breakdown" data-testid="builder-price-recap">
              <span className="eyebrow">Your custom design</span>
              <div className="builder-price-row"><span>{selectedPackage?.name ?? 'Display'} · base</span><strong>{selectedPackage ? formatPrice(selectedPackage.priceCents) : 'Choose a size'}</strong></div>
              {monogram === 'yes' && (
                <div className="builder-price-row">
                  <span>Vinyl-wrapped pumpkins · {pricedPumpkinCount || 'quantity needed'} × $25</span>
                  <strong>{pricedPumpkinCount ? formatPrice(pricedPumpkinCount * VINYL_PUMPKIN_PRICE_CENTS) : 'Pending'}</strong>
                </div>
              )}
              {fulfillment && <div className="builder-price-row"><span>Delivery · {selectedPackage?.name ?? 'display'}</span><strong>{formatPrice(serviceFeeCents)}</strong></div>}
              {fulfillment === 'installation' && <div className="builder-price-row"><span>Custom installation · setup</span><strong>Included</strong></div>}
              {includesHayBales && <div className="builder-price-row"><span>Hay bales · pair</span><strong>Included</strong></div>}
              {removal === 'yes' && <div className="builder-price-row"><span>Removal · separately charged</span><strong>{formatPrice(serviceFeeCents)}</strong></div>}
              {furtherCustomization && <div className="builder-price-row"><span>Further customization</span><strong>Consultation</strong></div>}
              <div className="builder-price-total" aria-live="polite">
                <span>Known subtotal</span><strong>{formatPrice(knownSubtotal)}</strong>
              </div>
              <p>{pendingCharges.length
                ? `${pendingCharges.join(', ')} ${pendingCharges.length === 1 ? 'is' : 'are'} not included until priced. This is not a final total.`
                : 'Delivery applies to both fulfillment options. Removal is charged separately at the same size-based fee. Taxes and any additional Shopify checkout charges are not included.'}</p>
            </section>
          </div>
           </div>
            </div>
         </aside>
        </div>
      </section>
  );
}
