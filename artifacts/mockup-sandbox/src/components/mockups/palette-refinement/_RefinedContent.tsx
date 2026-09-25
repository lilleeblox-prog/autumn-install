import './_group.css';
import { ArrowDownRight, ChevronRight, Plus, Check } from 'lucide-react';
import { packages, faqs, palettes, paletteGallery } from './_refinedData';
import { useState, useEffect, type AnchorHTMLAttributes, type ReactNode } from 'react';

type LocalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const MAX_ARTWORK_FILE_BYTES = 20 * 1024 * 1024;

function Link({ href, onClick, ...props }: LocalLinkProps) {
  return <a href={href} onClick={(event) => { event.preventDefault(); onClick?.(event); }} {...props} />;
}

function Shell({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = window.location.pathname;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="site-shell">
      <header className="container-wide topbar">
        <Link href="/" className="wordmark" data-testid="link-home">palette<span>/</span>install</Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/?compose=1" data-testid="link-compose">Compose</Link>
          <Link href="/packages" className={location.startsWith('/packages') ? 'active' : ''}>Packages</Link>
          <Link href="/gallery" className={location === '/gallery' ? 'active' : ''}>Gallery</Link>
          <Link href="/process" className={location === '/process' ? 'active' : ''}>Process</Link>
          <Link href="/studio" className={location === '/studio' ? 'active' : ''}>Studio</Link>
          <Link href="/faq" className={location === '/faq' ? 'active' : ''}>FAQ</Link>
          <Link href="/contact" className={location === '/contact' ? 'active' : ''}>Contact</Link>
        </nav>
        <div className="topbar-note"><span className="status-dot" aria-hidden="true" />Preview Mode</div>
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)} aria-label="Open mobile menu" data-testid="button-open-menu">
          <span aria-hidden="true">☰</span>
        </button>
      </header>
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`} aria-hidden={!mobileMenuOpen}>
        <div className="mobile-drawer-header">
          <Link href="/" className="wordmark" onClick={() => setMobileMenuOpen(false)}>palette<span>/</span>install</Link>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Close mobile menu" data-testid="button-close-menu">×</button>
        </div>
        <nav className="mobile-drawer-nav">
          <Link href="/" className={location === '/' ? 'active' : ''}>Home</Link>
          <Link href="/?compose=1" data-testid="link-compose-mobile">Compose</Link>
          <Link href="/packages">Packages</Link><Link href="/gallery">Gallery</Link><Link href="/process">Process</Link>
          <Link href="/studio">Studio</Link><Link href="/faq">FAQ</Link><Link href="/contact">Contact</Link>
        </nav>
      </div>
      <main className="main-content">{children}</main>
      <footer className="footer container-wide">
        <div className="footer-brand">
          <Link href="/" className="wordmark">palette<span>/</span>install</Link>
          <p>A bespoke pumpkin and gourd installation studio designed for residential and commercial entries.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col"><span className="footer-col-title">Studio</span><Link href="/studio">About</Link><Link href="/process">Process</Link><Link href="/contact">Contact</Link></div>
          <div className="footer-col"><span className="footer-col-title">Offerings</span><Link href="/?compose=1">Compose</Link><Link href="/packages">Packages</Link><Link href="/gallery">Gallery</Link><Link href="/faq">FAQ</Link></div>
        </div>
      </footer>
    </div>
  );
}

function availableWeeks() {
  const today = new Date();
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - ((today.getDay() + 6) % 7));
  const format = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return Array.from({ length: 52 }, (_, index) => {
    const start = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index * 7);
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
    return `Week of ${format.format(start)} – ${format.format(end)}`;
  });
}

export default function RefinedContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [size, setSize] = useState<string>('');
  const [palette, setPalette] = useState<string>('');

  const [fulfillment, setFulfillment] = useState<'installation' | 'delivery' | ''>('');
  const [hayBales, setHayBales] = useState<'yes' | 'no' | ''>('');
  const [monogram, setMonogram] = useState<'yes' | 'no' | ''>('');
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [monogramCount, setMonogramCount] = useState('');
  const [monogramPumpkinColor, setMonogramPumpkinColor] = useState('');
  const [monogramVinylColor, setMonogramVinylColor] = useState('');
  const [requestedWeek, setRequestedWeek] = useState('');
  const [removal, setRemoval] = useState<'yes' | 'no' | ''>('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [showFloatingOrder, setShowFloatingOrder] = useState(false);
  const weeks = availableWeeks();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const options = document.getElementById('builder-options');
      const summary = document.getElementById('order-summary');
      if (!options || !summary) return;
      const optionsRect = options.getBoundingClientRect();
      const summaryRect = summary.getBoundingClientRect();
      setShowFloatingOrder(optionsRect.top < window.innerHeight - 90 && optionsRect.bottom > 90 && summaryRect.top > window.innerHeight - 90);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sizeParam = params.get('size');
    if (sizeParam && packages.some(p => p.id === sizeParam)) {
      setSize(sizeParam);
    }
    if (sizeParam || params.get('compose') === '1') {
      setTimeout(() => {
        const builder = document.getElementById('builder');
        if (builder) {
          const y = builder.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'instant' });
        }
      }, 100);
    }
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!palette) newErrors.palette = "Please select a palette.";
    if (!size) newErrors.size = "Please select a scale.";
    if (!fulfillment) newErrors.fulfillment = "Please select a fulfillment method.";
    if (fulfillment === 'delivery' && !hayBales) newErrors.hayBales = "Please select a hay bales option.";
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

    if (!requestedWeek || !weeks.includes(requestedWeek)) newErrors.requestedWeek = "Please select an upcoming week.";
    if (!removal) newErrors.removal = "Please select a removal option.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorId = Object.keys(newErrors)[0];
      const el = document.getElementById(`field-${firstErrorId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
         const input = el.querySelector('input, select, textarea, button:not(.summary-action)');
        if (input) (input as HTMLElement).focus();
      }
      return false;
    }
    return true;
  };

  const handleCopy = async () => {
    if (!validate()) return;

    const sizeName = packages.find(p => p.id === size)?.name || 'Not selected';
    const paletteName = palettes.find(p => p.id === palette)?.name || 'Not selected';

    let text = `Palette Install Brief\n--------------------\n`;
    text += `Palette: ${paletteName}\n`;
    text += `Scale: ${sizeName}\n`;
    text += `Fulfillment: ${fulfillment === 'installation' ? 'Custom Installation' : 'Delivery Only'}\n`;

    if (fulfillment === 'delivery') {
      text += `Include Hay Bales: ${hayBales === 'yes' ? 'Yes' : 'No'}\n`;
    }

    text += `Vinyl-wrapped artwork: ${monogram === 'yes' ? 'Yes' : 'No'}\n`;

    if (monogram === 'yes') {
      text += `  Artwork file: ${artworkFile?.name || 'Not selected'}\n`;
      text += `  Pumpkins: ${monogramCount}\n`;
      text += `  Pumpkin Color: ${monogramPumpkinColor}\n`;
      text += `  Vinyl Color: ${monogramVinylColor}\n`;
    }

    text += `Requested Week: ${requestedWeek}\n`;
    text += `Removal Service: ${removal === 'yes' ? 'Yes' : 'No'}\n`;

    if (notes) {
      text += `General Notes: ${notes}\n`;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      window.prompt('Copy your composition brief:', text);
    }
  };

  const selectedGalleryImages = palette ? paletteGallery.filter(g => g.paletteId === palette) : [];
  const selectedPaletteInfo = palette ? palettes.find(p => p.id === palette) : null;

  return (
    <Shell>
    <>
      <section className="container-wide hero">
        <div className="hero-text-content">
          <div className="eyebrow">A premium pumpkin display, designed for your entry</div>
          <h1>Curate your<br /><em>arrival.</em></h1>
          <p className="hero-copy">
            A bespoke pumpkin and gourd installation designed for your stoop, porch, or storefront.
            Choose your palette, scale, and fulfillment preferences.
          </p>
          <div className="hero-actions">
            <button
              onClick={() => {
                const b = document.getElementById('builder');
                if(b) window.scrollTo({ top: b.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
              }}
              className="primary-button"
              data-testid="button-start-composing"
            >
              Start composing <ArrowDownRight size={15} strokeWidth={1.7} />
            </button>
            <button
              onClick={() => {
                const h = document.getElementById('how-it-works');
                if(h) window.scrollTo({ top: h.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
              }}
              className="text-link"
              data-testid="button-how-it-works"
            >
              How it works <ChevronRight size={14} />
            </button>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <div className="hero-image" aria-label="A completed premium pumpkin installation on a front porch" role="img">
             <img src="/__mockup/package-images/package-medium.webp" alt="Symmetrical front-door pumpkin display" />
            <div className="hero-image-caption">Plate 01 / The Porch</div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="container-narrow page-section border-top">
        <div className="section-header" style={{ maxWidth: '100%', marginBottom: '64px' }}>
          <div className="eyebrow">02 / Curating your installation</div>
          <h2>The Process</h2>
          <p style={{ fontSize: '18px', lineHeight: 1.6, color: 'hsl(var(--foreground))', maxWidth: '600px' }}>
            A seasonal display is an extension of your home's architecture. We approach each installation as a unique composition.
          </p>
        </div>
        <div className="process-grid">
          <div className="process-step">
            <h3>Palette & Scale</h3>
            <p>Choose a color direction for your entry first, then a package scale that fits the space. The final display is composed around those choices.</p>
          </div>
          <div className="process-step">
            <h3>Details & Timing</h3>
              <p>Choose your fulfillment preference, upload artwork to be vinyl-wrapped on a pumpkin, and request a week that suits your schedule.</p>
          </div>
          <div className="process-step">
            <h3>The Brief</h3>
            <p>Review your composition summary. During this preview phase, you can copy your brief to share or save.</p>
          </div>
          <div className="process-step">
            <h3>Installation</h3>
             <p>Once package details and pricing are approved, checkout will take place in Shopify. We will schedule with you closer to your requested week.</p>
          </div>
        </div>
      </section>

      <section id="builder" className="container-wide page-section border-top">
        <div className="section-header">
          <div className="eyebrow">03 / The Builder</div>
          <h2>Compose your installation.</h2>
          <p>Choose your palette, select a scale, and finalize your details.</p>
        </div>

        <div className="builder-layout">
           <div id="builder-options" className="builder-options">

            <div id="field-palette" className="builder-step">
              <div className="builder-step-header">
                <h3>1. Choose Palette</h3>
                <p>Start with the seasonal color direction that feels right for your entry.</p>
              </div>
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

              <div className="inline-gallery-section">
                <div className="inline-gallery-header">
                  <span className="eyebrow">Palette Preview</span>
                  <Link href="/gallery" className="text-link">Full Gallery <ChevronRight size={14} /></Link>
                </div>

                <div className="palette-gallery-container">
                  {!palette ? (
                    <div className="empty-gallery-prompt">
                      <div className="prompt-content">
                        <span className="serif">Awaiting Selection</span>
                        <p>Select a palette to view its installation gallery.</p>
                      </div>
                    </div>
                  ) : selectedGalleryImages.length > 0 ? (
                    <div className="editorial-gallery-grid">
                      {selectedGalleryImages.map((item, idx) => (
                        <div key={item.id} className={`editorial-gallery-item ${idx % 2 === 0 ? 'align-top' : 'align-bottom'}`}>
                          <div className="editorial-image-wrapper">
                            <img src={item.image} alt={item.caption} />
                          </div>
                          <div className="editorial-caption">{item.caption}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="palette-study-container">
                      <div className="palette-study-content">
                        <h3 className="serif">{selectedPaletteInfo?.name} / Study</h3>
                        <div className="study-colors">
                          {selectedPaletteInfo?.colors.map(c => (
                            <div key={c} className="study-color-swatch" style={{ background: c }} />
                          ))}
                        </div>
                        <p className="study-description">{selectedPaletteInfo?.description}</p>
                        <div className="study-disclosure">
                          <span className="status-dot"></span> Palette study / Installation photography coming soon
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div id="field-size" className="builder-step">
              <div className="builder-step-header">
                <h3>2. Select Scale</h3>
                <p>Choose a volume that suits your entry's footprint.</p>
              </div>
              <div className="builder-grid-3">
                {packages.map(pkg => (
                  <button
                    key={pkg.id}
                    type="button"
                    aria-pressed={size === pkg.id}
                    data-testid={`button-select-size-${pkg.id}`}
                    className={`builder-card ${size === pkg.id ? 'active' : ''}`}
                    onClick={() => { setSize(pkg.id); setErrors(e => ({...e, size: ''})); }}
                  >
                    <img src={pkg.image} alt={pkg.name} className="builder-card-img" />
                    <div className="builder-card-content">
                      <span className="builder-card-title">{pkg.name}</span>
                      <span className="builder-card-reference">Scale reference / palette may vary</span>
                      <span className="builder-card-desc">{pkg.room}</span>
                    </div>
                  </button>
                ))}
              </div>
              {errors.size && <span className="builder-step-error">{errors.size}</span>}
            </div>

             <div className="builder-step builder-details">
              <div className="builder-step-header">
                <h3>3. Fulfillment & Details</h3>
                <p>Configure your delivery preferences, optional vinyl-wrapped artwork, and timing.</p>
              </div>

              {/* Fulfillment */}
              <div id="field-fulfillment" className="builder-field">
                <label className="eyebrow" style={{ display: 'block', marginBottom: '16px' }}>Fulfillment Method</label>
                <div className="builder-radio-group">
                  <button
                    type="button"
                    className="builder-radio-card"
                    aria-pressed={fulfillment === 'installation'}
                    onClick={() => { setFulfillment('installation'); setErrors(e => ({...e, fulfillment: ''})); }}
                  >
                    Custom Installation
                  </button>
                  <button
                    type="button"
                    className="builder-radio-card"
                    aria-pressed={fulfillment === 'delivery'}
                    onClick={() => { setFulfillment('delivery'); setErrors(e => ({...e, fulfillment: ''})); }}
                  >
                    Delivery Only
                  </button>
                </div>
                {errors.fulfillment && <span className="builder-field-error">{errors.fulfillment}</span>}
              </div>

              {/* Hay Bales (only if delivery) */}
              {fulfillment === 'delivery' && (
                <div id="field-hayBales" className="builder-field builder-subfield">
                  <label className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>Include Hay Bales?</label>
                  <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))', marginBottom: '16px', marginTop: 0 }}>
                    If the entry has no stairs, we recommend hay bales on either side to add height and hierarchy.
                  </p>
                  <div className="builder-radio-group">
                    <button
                      type="button"
                      className="builder-radio-card"
                      aria-pressed={hayBales === 'yes'}
                      onClick={() => { setHayBales('yes'); setErrors(e => ({...e, hayBales: ''})); }}
                    >
                      Yes, please
                    </button>
                    <button
                      type="button"
                      className="builder-radio-card"
                      aria-pressed={hayBales === 'no'}
                      onClick={() => { setHayBales('no'); setErrors(e => ({...e, hayBales: ''})); }}
                    >
                      No thanks
                    </button>
                  </div>
                  {errors.hayBales && <span className="builder-field-error">{errors.hayBales}</span>}
                </div>
              )}

              {/* Custom vinyl artwork */}
              <div id="field-monogram" className="builder-field" style={{ marginTop: '24px' }}>
                <h3 className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>Put your signature on it</h3>
                <p className="builder-field-hint" style={{ marginTop: 0, marginBottom: '16px' }}>Upload your artwork and we’ll wrap it in vinyl on a pumpkin.</p>
                <div className="builder-radio-group">
                  <button
                    type="button"
                    className="builder-radio-card"
                    aria-pressed={monogram === 'yes'}
                    onClick={() => { setMonogram('yes'); setErrors(e => ({...e, monogram: ''})); }}
                  >
                    Yes, add my artwork
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
                    No custom vinyl artwork
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
                        <option value="">Choose a color</option>
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
                        <option value="">Choose a color</option>
                        <option value="White">White</option>
                        <option value="Black">Black</option>
                        <option value="Gold">Gold</option>
                      </select>
                    </div>
                    {errors.monogramVinylColor && <span className="builder-field-error">{errors.monogramVinylColor}</span>}
                  </div>
                </div>
              )}

               {/* Scheduling week */}
               <div id="field-requestedWeek" className="builder-field">
                 <label htmlFor="requested-week" className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>
                   {fulfillment === 'delivery' ? 'Requested Delivery Week' : 'Requested Delivery & Installation Week'}
                </label>
                 <select
                   id="requested-week"
                  className="builder-input"
                   value={requestedWeek}
                  onChange={e => {
                     setRequestedWeek(e.target.value);
                     setErrors(err => ({...err, requestedWeek: ''}));
                  }}
                 >
                   <option value="">Select a week</option>
                   {weeks.map(week => <option key={week} value={week}>{week}</option>)}
                 </select>
                 <p className="builder-field-hint">We’ll schedule with you as your week gets closer. Need a specific date for an event or party? Let us know in the notes below.</p>
                 {errors.requestedWeek && <span className="builder-field-error">{errors.requestedWeek}</span>}
              </div>

              {/* Removal */}
               <div id="field-removal" className="builder-field">
                <label className="eyebrow" style={{ display: 'block', marginBottom: '16px' }}>Removal Service</label>
                <div className="builder-radio-group">
                  <button
                    type="button"
                    className="builder-radio-card"
                    aria-pressed={removal === 'yes'}
                    onClick={() => { setRemoval('yes'); setErrors(e => ({...e, removal: ''})); }}
                  >
                    Yes, schedule removal
                  </button>
                  <button
                    type="button"
                    className="builder-radio-card"
                    aria-pressed={removal === 'no'}
                    onClick={() => { setRemoval('no'); setErrors(e => ({...e, removal: ''})); }}
                  >
                    No, I will handle removal
                  </button>
                </div>
                {errors.removal && <span className="builder-field-error">{errors.removal}</span>}
              </div>

              {/* General Notes */}
               <div id="field-notes" className="builder-field">
                <label htmlFor="general-notes" className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>General Notes (Optional)</label>
                <textarea
                  id="general-notes"
                   placeholder="Event or party date, specific requests, access details..."
                  className="builder-input"
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

            </div>

          </div>

           <div id="order-summary" className="builder-summary">
            <div className="summary-header">
               <span className="eyebrow">Your order</span>
               <h3>Your composition</h3>
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
                <span className="summary-label">Fulfillment</span>
                <span className="summary-value">
                  {fulfillment === 'installation' ? 'Custom Installation' : fulfillment === 'delivery' ? 'Delivery Only' : 'Not selected'}
                </span>
              </div>

              {fulfillment === 'delivery' && (
                <div className="summary-item">
                  <span className="summary-label">Hay Bales</span>
                  <span className="summary-value">
                    {hayBales === 'yes' ? 'Requested' : hayBales === 'no' ? 'No' : 'Not selected'}
                  </span>
                </div>
              )}

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

              <div className="summary-item">
                 <span className="summary-label">{fulfillment === 'delivery' ? 'Delivery Week' : 'Delivery & Install Week'}</span>
                <span className="summary-value">
                   {requestedWeek || 'Not selected'}
                </span>
              </div>

              <div className="summary-item">
                <span className="summary-label">Removal</span>
                <span className="summary-value">
                  {removal === 'yes' ? 'Requested' : removal === 'no' ? 'No' : 'Not selected'}
                </span>
              </div>

              {notes && (
                <div className="summary-item">
                  <span className="summary-label">General Notes</span>
                  <span className="summary-value" style={{ fontSize: '14px', lineHeight: 1.5, opacity: 0.8 }}>
                    {notes}
                  </span>
                </div>
              )}
            </div>

             <div className="summary-footer">
               <button type="button" className="summary-action" onClick={handleCopy} data-testid="button-copy-brief">
                {copied ? <><Check size={14} /> Brief Copied</> : 'Copy Brief'}
              </button>
              <p className="summary-note" style={{ marginTop: '16px' }}>
                This is a preview, not an order. Prices and checkout will be available in Shopify after the draft products are approved.
              </p>
            </div>
          </div>
        </div>
         {showFloatingOrder && (
           <div className="floating-order" aria-label="Live order summary">
             <div className="floating-order-content">
               <span className="floating-order-title">Your order <span className="status-dot" /></span>
               <div className="floating-order-details" aria-live="polite">
                 <span>{palette ? palettes.find(p => p.id === palette)?.name : 'Choose a palette'}</span>
                 <span>{size ? packages.find(p => p.id === size)?.name : 'Choose a scale'}</span>
                 {fulfillment && <span>{fulfillment === 'installation' ? 'Custom installation' : 'Delivery only'}</span>}
                 {fulfillment === 'delivery' && hayBales && <span>Hay bales: {hayBales}</span>}
                  {monogram && <span>Artwork: {monogram === 'yes' ? `${artworkFile?.name || 'file not selected'} · ${monogramCount || '—'} pumpkins` : 'none'}</span>}
                 {requestedWeek && <span>{requestedWeek}</span>}
                 {removal && <span>Removal: {removal}</span>}
                 {notes && <span>Notes added</span>}
               </div>
             </div>
             <button type="button" className="floating-order-action" onClick={() => document.getElementById('order-summary')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
               View full order <ChevronRight size={16} aria-hidden="true" />
             </button>
           </div>
         )}
      </section>

      <section className="container-wide page-section border-top">
        <div className="section-header">
          <div className="eyebrow">Our Studio</div>
          <h2>Architectural styling for the season.</h2>
          <p>Palette Install approaches the seasonal entry as an extension of the spaces within. Select a considered display for a residential porch, stoop, or storefront.</p>
        </div>
        <Link href="/studio" className="primary-button" style={{ display: 'inline-flex' }}>Learn More</Link>
      </section>

      <section className="container-wide page-section border-top">
        <div className="section-header">
          <div className="eyebrow">04 / Information</div>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-list" style={{ maxWidth: '800px' }}>
          {faqs.map((faq, index) => (
            <div className={`faq-item ${openFaqIndex === index ? 'open' : ''}`} key={index}>
              <button
                className="faq-question"
                onClick={() => toggleFaq(index)}
                aria-expanded={openFaqIndex === index}
              >
                <span>{faq.question}</span>
                <Plus size={24} className="faq-icon" />
              </button>
              <div className="faq-answer">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-wide page-section border-top">
        <div className="cta-banner">
          <h2 className="serif">Ready to transform your entry?</h2>
          <p>
            Use the configurator above to start curating your space. The Shopify storefront will provide a final checkout flow when the theme is installed.
          </p>
          <button
            onClick={() => {
              const b = document.getElementById('builder');
              if(b) window.scrollTo({ top: b.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
            }}
            className="primary-button"
          >
            Start Composing
          </button>
        </div>
      </section>
    </>
    </Shell>
  );
}
