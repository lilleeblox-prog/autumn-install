import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { FallOrderForm } from '@/components/forms/fall-order-form';

const heroPath = '/images/hero-fall.png';

export default function Fall() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <Navigation />

      {/* ── Hero — full-bleed editorial ──────────────────────── */}
      <section className="relative h-[100dvh] overflow-hidden">

        {/* Photo */}
        <motion.div
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroPath})` }}
          />
        </motion.div>

        {/* Gradient — heavier at bottom where text sits */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

        {/* Content — anchored bottom-left */}
        <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-6 lg:px-14 pb-14 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            {/* Eyebrow */}
            <span className="font-mono text-[0.68rem] tracking-[0.18em] uppercase text-primary block mb-5">
              Fall 2026 · Tennessee · Waitlist open
            </span>

            {/* Headline */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.04] text-white mb-6">
              The season starts<br className="hidden sm:block" /> at your door.
            </h1>

            {/* Sub */}
            <p className="text-white/75 text-lg leading-relaxed max-w-xl mb-10">
              Organic pumpkins, heirloom gourds, and hay bales, arranged at your front door so your home feels ready the moment autumn arrives. A small number of homes per neighborhood, each one done by hand.
            </p>

            {/* CTA row */}
            <div className="flex items-center gap-6 flex-wrap">
              <a
                href="#reserve"
                className="font-mono text-[0.78rem] tracking-[0.08em] uppercase bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-[17px] transition-colors inline-flex items-center gap-2"
              >
                Reserve your spot
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <span className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-white/50">
                No payment now
              </span>
            </div>
          </motion.div>
        </div>

        {/* Bottom-right status chip */}
        <div className="absolute bottom-14 md:bottom-20 right-6 lg:right-14 hidden md:flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
          <span className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-white/60">
            Ordering opens mid-August
          </span>
        </div>
      </section>

      {/* ── What we do + How it works ─────────────────────────── */}
      <section className="py-28 md:py-36 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* What we do */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-7"
            >
              <div>
                <span className="font-mono text-[0.68rem] tracking-[0.16em] uppercase text-muted-foreground block mb-4">
                  The service
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-medium">
                  Pumpkins, gourds, hay bales. All of it handled.
                </h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  We select the pumpkins, source the gourds and hay bales, and arrange everything at your front door. You never touch a thing. When autumn ends, we come back and collect it all if you want us to.
                </p>
                <ul className="space-y-2.5 pt-1">
                  {[
                    'Organic pumpkins and heirloom gourds, arranged for your specific entry',
                    'Hay bales for height, structure, and that unmistakable fall feel',
                    'Planter styling with fall foliage and seasonal fillers',
                    'Full delivery and installation. We bring everything.',
                    'Optional removal mid-to-end of November so your entry is clear for December 1st',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <span className="mt-[5px] w-1 h-1 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm pt-1">
                  Every pumpkin and gourd is sourced fresh for the season. We do not offer storage. Add the removal service and we collect everything mid-to-end of November so your entry is clear and ready for December 1st.
                </p>
              </div>
            </motion.div>

            {/* How it works */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-7"
            >
              <div>
                <span className="font-mono text-[0.68rem] tracking-[0.16em] uppercase text-muted-foreground block mb-4">
                  The process
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-medium">
                  How it unfolds.
                </h2>
              </div>
              <div className="space-y-0">
                {[
                  {
                    period: 'Now through Mid-August',
                    active: true,
                    body: 'Your spot is held the moment you join. We reach out when ordering opens with everything you need to get started.',
                  },
                  {
                    period: 'Mid-August 2026',
                    active: true,
                    body: 'Ordering opens. We reach out to walk you through your package options and schedule your install.',
                  },
                  {
                    period: 'Late September – October',
                    active: false,
                    body: 'Our team arrives with your pumpkins, gourds, and all the fall pieces. We arrange everything at your door by hand.',
                  },
                  {
                    period: 'Mid–End of November (optional)',
                    active: false,
                    body: 'We come back to collect your pumpkins, gourds, and hay bales so your entry is clear and ready for December 1st. Nothing to bag up, nothing to store.',
                  },
                ].map((step, i) => (
                  <div key={i} className="flex gap-5 py-5 border-b border-border last:border-0">
                    <div className="pt-1 shrink-0">
                      <div className={`w-2 h-2 rounded-full mt-1 ${step.active ? 'bg-primary' : 'bg-border'}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium mb-1 ${step.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.period}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Reserve form ─────────────────────────────────────── */}
      <section id="reserve" className="py-28 md:py-36 bg-card scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left: context */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:sticky lg:top-28"
            >
              <span className="font-mono text-[0.68rem] tracking-[0.16em] uppercase text-muted-foreground block mb-5">
                Fall 2026 · Waitlist
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-medium leading-snug mb-5">
                Your pumpkins, your gourds,<br /> your fall — reserved.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We install a small number of homes per neighborhood each fall so every display gets the attention it deserves. Reserve your spot now and we reach out in mid-August with your fall package options: pumpkins, gourds, hay bales, and everything in between.
              </p>
              <div className="space-y-3">
                {[
                  'Your fall install spot is held immediately',
                  'No payment until fall packages open in mid-August',
                  'We reach out directly with your fall package options',
                ].map((point) => (
                  <div key={point} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                    {point}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="bg-background border border-border p-8 md:p-10">
                <FallOrderForm
                  serviceType="waitlist"
                  title="Reserve Your Spot"
                  description="Your fall install spot is held the moment you submit. We reach out in mid-August with your package options — pumpkins, gourds, and all the seasonal details."
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
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
