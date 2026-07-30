import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { FallOrderForm } from '@/components/forms/fall-order-form';
const heroPath = '/images/hero-doorway.jpg';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function Fall() {
  // Today is July 30, 2026 — orders open mid-August
  const ordersOpen = false;

  return (
    <div className="min-h-[100dvh]">
      <Navigation />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center pt-24 overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroPath})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.2,
                },
              },
            }}
            className="max-w-3xl space-y-6"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block px-3 py-1 text-xs font-medium tracking-wide uppercase bg-primary text-primary-foreground rounded-sm mb-6">
                Fall 2026 — Booking Opens Mid-August
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-serif font-medium leading-[1.05] tracking-tight"
            >
              Fall is coming. Your door should be ready.
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              We deliver and install your fall setup — pumpkins, wreaths, dried botanicals — so your home looks warm
              and welcoming the moment the season turns. We install a set number of homes per neighborhood.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24"
          >
            <div className="space-y-6">
              <h2 className="text-4xl font-serif font-medium">What we do</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  We take care of everything from curation to installation. You don't need to own a single pumpkin or
                  store a single wreath. We bring it all, set it up beautifully, and take it back at the end of the
                  season if you want us to.
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="list-disc">Custom wreath design in warm autumn tones</li>
                  <li className="list-disc">Organic pumpkin and gourd arrangements</li>
                  <li className="list-disc">Dried botanical accents and seasonal greenery</li>
                  <li className="list-disc">Planter styling with fall textures</li>
                  <li className="list-disc">Full delivery and professional installation</li>
                  <li className="list-disc">Optional end-of-season removal (add-on)</li>
                </ul>
                <p className="text-sm pt-2">
                  <strong className="text-foreground">Note:</strong> We do not offer storage — all materials are
                  delivered fresh each season and removed if you choose the removal add-on.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-serif font-medium">How it works</h2>
              <div className="space-y-4">
                <div className="border-l-2 border-primary pl-6 py-2">
                  <p className="font-medium mb-1">Now — Mid-August</p>
                  <p className="text-sm text-muted-foreground">
                    Reserve your address. We hold your spot and reach out when booking opens mid-August.
                  </p>
                </div>
                <div className="border-l-2 border-primary/40 pl-6 py-2">
                  <p className="font-medium mb-1">Mid-August 2026</p>
                  <p className="text-sm text-muted-foreground">
                    Orders open. We confirm your details and schedule your install date.
                  </p>
                </div>
                <div className="border-l-2 border-muted pl-6 py-2">
                  <p className="font-medium mb-1">Early September</p>
                  <p className="text-sm text-muted-foreground">
                    We arrive, set everything up, and leave your entrance looking beautiful.
                  </p>
                </div>
                <div className="border-l-2 border-muted pl-6 py-2">
                  <p className="font-medium mb-1">Late November (optional)</p>
                  <p className="text-sm text-muted-foreground">
                    We come back to remove everything — nothing left for you to deal with.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Forms */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-medium mb-3">Reserve your address</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                We install a fixed number of homes per neighborhood. Submit your address below — we'll confirm
                availability for your zip code when ordering opens mid-August.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-card border border-border rounded-sm p-8 md:p-10">
                <FallOrderForm
                  serviceType="waitlist"
                  title="Reserve Your Address"
                  description="Reserve your spot now. Full package details become available when ordering opens mid-August — we'll reach out directly to confirm availability in your zip code."
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center text-sm text-muted-foreground">
          <p>© 2026 Made to Welcome. Seasonal décor delivery &amp; installation.</p>
        </div>
      </footer>
    </div>
  );
}
