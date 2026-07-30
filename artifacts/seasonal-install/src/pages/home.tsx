import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navigation } from '@/components/navigation';

const heroPath = '/images/hero-doorway.jpg';

const galleryImages = [
  { src: '/images/hero-doorway.jpg', alt: 'Classic Colonial Entry — Nashville, TN' },
  { src: '/images/portfolio-fall-1.png', alt: 'Modern Farmhouse Walkway — Franklin, TN' },
  { src: '/images/portfolio-fall-2.png', alt: 'Rustic Timber Porch — Brentwood, TN' },
  { src: '/images/portfolio-fall-3.png', alt: 'White Brick Entry — Belle Meade, TN' },
];

const timelineSteps = [
  {
    num: '01',
    title: 'Join the waitlist',
    body: 'Reserve your spot now. Waitlist members get first access when booking opens mid-August.',
    tag: 'Open now',
    active: true,
  },
  {
    num: '02',
    title: 'Place your order',
    body: 'Choose your package and delivery week. Spots are limited and go quickly each year.',
    tag: 'Opens mid-August',
    active: false,
  },
  {
    num: '03',
    title: 'We deliver & style',
    body: 'Our team arrives, arranges your display, and leaves your entry ready for guests.',
    tag: 'Late Sept – Oct',
    active: false,
  },
  {
    num: '04',
    title: 'Optional removal',
    body: 'Add end-of-season pickup and your display disappears as quietly as it arrived.',
    tag: 'November · add-on',
    active: false,
  },
];

export default function Home() {
  const [galleryIdx, setGalleryIdx] = useState(0);

  return (
    <div className="min-h-[100dvh]">
      <Navigation />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="min-h-[100dvh] flex flex-col lg:flex-row">

        {/* Sidebar — desktop only */}
        <aside className="hidden lg:flex flex-col justify-between w-64 shrink-0 border-r border-border pt-20 pb-10 px-8 bg-background">
          <span className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-primary font-medium">
            Now serving Tennessee
          </span>
          <div className="space-y-7 pb-2">
            {[
              { label: 'Current season', value: 'FALL 2026', open: false },
              { label: 'Booking opens',  value: 'MID AUGUST', open: false },
              { label: 'Waitlist',       value: 'OPEN NOW',   open: true  },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-sm text-muted-foreground mb-2">{item.label}</p>
                <span
                  className={`font-mono text-[0.72rem] tracking-[0.05em] px-3 py-2 inline-block ${
                    item.open
                      ? 'bg-secondary/15 text-secondary'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* Photo + floating card */}
        <div className="flex-1 flex flex-col lg:block lg:relative">

          {/* Background photo */}
          <div className="relative h-[62vh] lg:h-auto lg:absolute lg:inset-0 overflow-hidden flex-none">
            <motion.div
              initial={{ scale: 1.06, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover"
                style={{ backgroundImage: `url(${heroPath})`, backgroundPosition: 'center 28%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/65" />
            </motion.div>

            {/* Mobile: eyebrow text at bottom of photo */}
            <div className="lg:hidden absolute bottom-5 left-6">
              <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-white/70">
                Now Serving Tennessee · Fall 2026 · Waitlist Open
              </span>
            </div>
          </div>

          {/* Floating card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="
              relative z-10
              mx-4 -mt-14 mb-10
              lg:absolute lg:right-14 lg:top-1/2 lg:-translate-y-1/2 lg:w-[420px]
              lg:mx-0 lg:mt-0 lg:mb-0
              bg-background shadow-2xl p-8 lg:p-9
            "
          >
            <p className="font-serif text-[1.2rem] leading-[1.42] text-muted-foreground mb-4">
              <strong className="text-foreground font-semibold">An essence of fall.</strong>{' '}
              Natural pumpkins, bespoke arrangements, installed right at your doorway.
            </p>

            <p className="text-sm font-medium text-primary mb-5">Currently accepting new addresses.</p>

            <ol className="space-y-3.5 mb-6">
              {[
                'Register below to reserve your address',
                "We'll confirm your delivery window and pricing",
                'Our designer arrives and installs your display by hand',
              ].map((step, i) => (
                <li key={i} className="flex gap-3.5 text-sm leading-snug">
                  <span className="font-mono text-[0.7rem] text-muted-foreground shrink-0 w-5 pt-0.5">
                    0{i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <p className="text-xs text-muted-foreground leading-relaxed border-t border-dashed border-border pt-4 mb-6">
              Each display is delivered and installed by hand, with optional end-of-season removal
              — we take everything with us.
            </p>

            <Link
              href="/fall"
              data-testid="button-cta-fall"
              className="flex items-center justify-center w-full font-mono text-[0.78rem] tracking-[0.08em] uppercase bg-primary text-primary-foreground hover:bg-primary/90 py-[17px] transition-colors"
            >
              Join the waitlist <ArrowRight className="ml-2 w-3.5 h-3.5" />
            </Link>
            <p className="text-center text-[0.72rem] text-muted-foreground mt-3">
              No payment now — just your spot in line.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="py-24 md:py-28 bg-background border-y border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-primary block mb-3">
              How it works
            </span>
            <h2 className="text-3xl md:text-[2.4rem] font-serif font-medium leading-tight">
              Four steps from signup to your doorstep.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0 relative">
            {/* Dashed connector — desktop only */}
            <div
              className="hidden lg:block absolute top-[22px] left-0 right-0 h-px"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, rgba(33,29,25,0.22) 0 8px, transparent 8px 16px)',
              }}
            />

            {timelineSteps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="lg:pr-8 relative z-10"
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-mono text-sm font-medium mb-6 ${
                    step.active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-foreground text-background'
                  }`}
                >
                  {step.num}
                </div>
                <h3 className="font-serif font-medium text-[1.1rem] mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{step.body}</p>
                <span
                  className={`font-mono text-[0.63rem] tracking-[0.06em] uppercase px-2.5 py-1 border inline-block ${
                    step.active
                      ? 'border-primary/40 text-primary bg-primary/10'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  {step.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ──────────────────────────────────────────── */}
      <section className="py-24 md:py-28 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <span className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-primary block mb-3">
              Recent work
            </span>
            <h2 className="text-3xl md:text-[2.4rem] font-serif font-medium">See it at the door.</h2>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Viewport */}
            <div className="overflow-hidden shadow-2xl aspect-[3/2]">
              <div
                className="flex h-full transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${galleryIdx * 100}%)` }}
              >
                {galleryImages.map((img) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    className="w-full flex-none h-full object-cover"
                  />
                ))}
              </div>
            </div>

            {/* Prev / Next */}
            <button
              onClick={() => setGalleryIdx((i) => (i - 1 + galleryImages.length) % galleryImages.length)}
              className="absolute -left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setGalleryIdx((i) => (i + 1) % galleryImages.length)}
              className="absolute -right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2.5 mt-5">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIdx(i)}
                  className={`w-2 h-2 rounded-full transition-colors border-0 p-0 ${
                    i === galleryIdx ? 'bg-primary' : 'bg-border'
                  }`}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>

            {/* Caption */}
            <p className="text-center font-mono text-[0.72rem] text-muted-foreground mt-3 tracking-wide">
              {galleryImages[galleryIdx].alt}
            </p>
          </div>
        </div>
      </section>

      {/* ── Dark CTA ─────────────────────────────────────────── */}
      <section className="py-24 md:py-28 bg-foreground">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
            className="space-y-5"
          >
            <span className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-primary block">
              Reserve your spot
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium leading-tight max-w-2xl mx-auto"
              style={{ color: 'hsl(36 40% 96%)' }}
            >
              Fall 26 just launched and we've reserved limited spots. Availability is limited.
            </h2>
            <p className="text-base md:text-lg leading-relaxed max-w-lg mx-auto" style={{ color: '#cfc6b8' }}>
              Ordering opens mid-August and waitlist members get first pick of delivery dates. It takes
              about a minute.
            </p>
            <div className="pt-3">
              <Link
                href="/fall"
                data-testid="button-cta-bottom-fall"
                className="inline-flex items-center font-mono text-[0.8rem] tracking-[0.06em] uppercase bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-[17px] transition-colors"
              >
                Get first pick <ArrowRight className="ml-2 w-3.5 h-3.5" />
              </Link>
              <p className="text-[0.78rem] mt-3" style={{ color: '#7a6a5e' }}>
                No payment now — just your spot in line.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Other seasons ────────────────────────────────────── */}
      <section className="py-20 md:py-24 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <span className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-muted-foreground block mb-3">
              Other seasons
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-medium leading-snug max-w-md">
              We install year-round — winter and summer are coming.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                season: 'Winter',
                label: 'Winter 2026–27',
                description:
                  'Balsam garlands, lanterns, and seasonal evergreens. A welcome that holds through the holidays.',
                status: 'Not yet open',
                href: '/winter',
              },
              {
                season: 'Summer',
                label: 'Summer 2027',
                description:
                  'Bright botanicals, fresh arrangements, and sun-ready displays for your front entry.',
                status: 'Not yet open',
                href: '/summer',
              },
            ].map((item) => (
              <motion.div
                key={item.season}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="border border-border p-7 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="font-mono text-[0.63rem] tracking-[0.06em] uppercase px-2.5 py-1 border border-border text-muted-foreground shrink-0">
                    {item.status}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif font-medium text-[1.15rem] mb-2">{item.season} installs</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
                <Link
                  href={item.href}
                  className="mt-auto inline-flex items-center font-mono text-[0.72rem] tracking-[0.06em] uppercase text-muted-foreground hover:text-foreground transition-colors gap-1.5"
                >
                  Learn more <ArrowRight className="w-3 h-3" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 bg-background">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 flex items-center justify-between flex-wrap gap-4">
          <span className="font-serif text-lg font-medium">Made to Welcome</span>
          <span className="font-mono text-[0.75rem] text-muted-foreground tracking-wide">
            Serving Tennessee · Fall 2026
          </span>
        </div>
      </footer>
    </div>
  );
}
