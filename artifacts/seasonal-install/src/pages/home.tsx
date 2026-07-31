import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { FallOrderForm } from '@/components/forms/fall-order-form';

const heroPath = '/images/hero-doorway.jpg';

const galleryImages = [
  { src: '/images/portfolio-fall-1.png', alt: 'Modern Farmhouse Walkway, Franklin TN', location: 'Franklin, TN' },
  { src: '/images/portfolio-fall-2.png', alt: 'Rustic Timber Porch, Brentwood TN', location: 'Brentwood, TN' },
  { src: '/images/portfolio-fall-3.png', alt: 'White Brick Entry, Belle Meade TN', location: 'Belle Meade, TN' },
];

const timelineSteps = [
  {
    num: '01',
    title: 'Reserve your door',
    body: 'Your door is held the moment you join. We take on a small number of homes per neighborhood so every install gets the attention it deserves.',
    tag: 'Open now',
    active: true,
  },
  {
    num: '02',
    title: 'Choose your package',
    body: 'When ordering opens, we reach out with everything you need: package options, available install dates, and all the details.',
    tag: 'Opens mid-August',
    active: false,
  },
  {
    num: '03',
    title: 'We arrive & style',
    body: 'Our team brings everything and arranges your display by hand, leaving your entry looking warm and ready for the season.',
    tag: 'Late Sept – Oct',
    active: false,
  },
  {
    num: '04',
    title: 'Optional removal',
    body: 'Add end-of-season pickup and everything is taken away as gently as it arrived. Nothing to store, nothing to manage.',
    tag: 'November · add-on',
    active: false,
  },
];

export default function Home() {
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showBottomForm, setShowBottomForm] = useState(false);

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
              { label: 'Current season', value: 'FALL 2026',  open: false },
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
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/70" />
            </motion.div>

            {/* Mobile eyebrow */}
            <div className="lg:hidden absolute bottom-5 left-6">
              <span className="font-mono text-[0.6rem] tracking-[0.14em] uppercase text-white/70">
                Now Serving Tennessee · Fall 2026 · Waitlist Open
              </span>
            </div>
          </div>

          {/* Floating card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="
              relative z-10
              mx-4 -mt-14 mb-10
              lg:absolute lg:right-14 lg:top-1/2 lg:-translate-y-1/2 lg:w-[400px]
              lg:mx-0 lg:mt-0 lg:mb-0
              bg-background shadow-2xl p-9 lg:p-10
            "
          >
            {/* Eyebrow */}
            <span className="font-mono text-[0.64rem] tracking-[0.14em] uppercase text-primary block mb-5">
              Fall 2026 · Tennessee
            </span>

            <AnimatePresence mode="wait">
              {!showForm ? (
                <motion.div
                  key="card-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Lede */}
                  <p className="font-serif text-[1.35rem] leading-[1.38] text-foreground mb-5">
                    Your home, dressed for the season.{' '}
                    <span className="text-muted-foreground">
                      We deliver, we arrange, we come back when it's over.
                    </span>
                  </p>

                  {/* Divider */}
                  <div className="border-t border-dashed border-border mb-5" />

                  <p className="text-sm text-muted-foreground leading-relaxed mb-7">
                    Fall 2026 waitlist is open now. Reserve your spot and we reach out in mid-August with everything you need to get started.
                  </p>

                  {/* CTA */}
                  <button
                    onClick={() => setShowForm(true)}
                    data-testid="button-cta-fall"
                    className="flex items-center justify-center w-full font-mono text-[0.78rem] tracking-[0.08em] uppercase bg-primary text-primary-foreground hover:bg-primary/90 py-[18px] transition-colors"
                  >
                    Reserve your door <ArrowRight className="ml-2 w-3.5 h-3.5" />
                  </button>
                  <p className="text-center text-[0.7rem] text-muted-foreground mt-3 tracking-wide">
                    No payment now. Just your door on the list.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="card-form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FallOrderForm
                    serviceType="waitlist"
                    title="Reserve Your Spot"
                    description="Your spot is held the moment you submit. We reach out in mid-August with package details."
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="py-28 md:py-32 bg-background border-y border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <span className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-primary block mb-4">
              How it works
            </span>
            <h2 className="text-3xl md:text-[2.5rem] font-serif font-medium leading-tight max-w-lg mx-auto">
              Four steps from your inbox to your doorstep.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0 relative">
            {/* Dashed connector — desktop only */}
            <div
              className="hidden lg:block absolute top-[22px] left-0 right-0 h-px"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, rgba(33,29,25,0.20) 0 8px, transparent 8px 16px)',
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
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-mono text-sm font-medium mb-7 ${
                    step.active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-foreground text-background'
                  }`}
                >
                  {step.num}
                </div>
                <h3 className="font-serif font-medium text-[1.1rem] mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.body}</p>
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
      <section className="py-28 md:py-32 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-primary block mb-4">
              Recent work
            </span>
            <h2 className="text-3xl md:text-[2.5rem] font-serif font-medium mb-4">
              The work.
            </h2>
            <p className="text-muted-foreground text-base max-w-xs mx-auto leading-relaxed">
              Every install is designed around the home in front of us.
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto">
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

            <button
              onClick={() => setGalleryIdx((i) => (i - 1 + galleryImages.length) % galleryImages.length)}
              className="absolute -left-5 top-1/2 -translate-y-1/2 w-11 h-11 bg-background shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setGalleryIdx((i) => (i + 1) % galleryImages.length)}
              className="absolute -right-5 top-1/2 -translate-y-1/2 w-11 h-11 bg-background shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="flex justify-center gap-3 mt-6">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIdx(i)}
                  className={`w-1.5 h-1.5 transition-colors border-0 p-0 ${
                    i === galleryIdx ? 'bg-primary' : 'bg-border'
                  }`}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>

            <p className="text-center font-mono text-[0.7rem] text-muted-foreground mt-4 tracking-wide">
              {galleryImages[galleryIdx].location}
            </p>
          </div>
        </div>
      </section>

      {/* ── All seasons brand section ─────────────────────────── */}
      <section className="py-28 md:py-36 bg-card border-b border-border overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left: brand statement */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:sticky lg:top-28"
            >
              <span className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-muted-foreground block mb-6">
                Every season
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-medium leading-[1.1] mb-7">
                All seasons,<br />
                curated by your<br />
                <em className="not-italic text-primary">favorite team.</em>
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
                Fall is just the beginning. We come back every season with the same team and the same care. Your door always feels ready.
              </p>
            </motion.div>

            {/* Right: winter + summer cards */}
            <div className="space-y-5">
              {[
                {
                  season: 'Winter',
                  year: '2026–27',
                  badge: '2026 ledger',
                  description:
                    'Custom garland installed and dressed for the season, then quietly removed when the holidays are over.',
                  href: '/winter',
                },
                {
                  season: 'Summer',
                  year: '2027',
                  badge: '2027 ledger',
                  description:
                    'Seasonal flag installs that make your home feel festive and finished from the moment summer arrives.',
                  href: '/summer',
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.season}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className="bg-background border border-border p-8 group"
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <p className="font-serif text-[1.5rem] font-medium leading-none mb-1.5">
                        {item.season}
                      </p>
                      <span className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-muted-foreground">
                        {item.year}
                      </span>
                    </div>
                    <span className="font-mono text-[0.6rem] tracking-[0.06em] uppercase px-2.5 py-1.5 border border-secondary/40 text-secondary shrink-0 mt-0.5">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {item.description}
                  </p>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.06em] uppercase text-muted-foreground hover:text-primary transition-colors"
                  >
                    Add your name <ArrowRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Dark CTA ─────────────────────────────────────────── */}
      <section className="py-28 md:py-36 bg-foreground">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left — copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <span className="font-mono text-[0.68rem] tracking-[0.18em] uppercase text-primary block">
                Fall 2026 · Tennessee
              </span>
              <h2
                className="text-3xl md:text-4xl lg:text-[3rem] font-serif font-medium leading-[1.1]"
                style={{ color: 'hsl(36 40% 96%)' }}
              >
                Welcome the fall season with a custom display.
              </h2>
              <div className="space-y-4 pt-2">
                {[
                  { num: '01', text: 'Register with our concierge to reserve your door' },
                  { num: '02', text: "If you secure a spot, we'll confirm your delivery window and details" },
                  { num: '03', text: 'On your week, our designer arrives and installs your bespoke display in person' },
                ].map(({ num, text }) => (
                  <div key={num} className="flex gap-4">
                    <span className="font-mono text-[0.68rem] tracking-[0.1em] shrink-0 mt-[3px]" style={{ color: '#7a6a5e' }}>{num}</span>
                    <p className="text-sm leading-relaxed" style={{ color: '#cfc6b8' }}>{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="bg-background p-8 md:p-10"
            >
              <FallOrderForm
                serviceType="waitlist"
                title="Reserve Your Spot"
                description="Your spot is held the moment you submit. We reach out in mid-August with package details."
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 bg-background">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 flex items-center justify-between flex-wrap gap-4">
          <span className="font-serif text-lg font-medium">Made to Welcome</span>
          <span className="font-mono text-[0.72rem] text-muted-foreground tracking-wide">
            Seasonal décor · Delivery &amp; installation · Tennessee
          </span>
        </div>
      </footer>
    </div>
  );
}
