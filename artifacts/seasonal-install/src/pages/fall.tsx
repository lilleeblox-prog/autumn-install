import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { FallOrderForm } from '@/components/forms/fall-order-form';
const heroHomePath = '/images/hero-fall_2.jpg';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function Fall() {
  // Today is July 30, 2026 - orders open mid-August
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
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroHomePath})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
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
              <span className="inline-block px-3 py-1 text-xs font-medium tracking-wide uppercase bg-primary/10 text-primary border border-primary/20 rounded-sm mb-6">
                Fall 2026
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-serif font-medium leading-[1.05] tracking-tight"
            >
              Fall installation service
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Warm terracotta, dried botanicals, organic pumpkins, and rich autumn wreaths that welcome guests to your
              door.
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
              <h2 className="text-4xl font-serif font-medium">What's included</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Our fall service brings the warmth of autumn to your entrance with carefully curated seasonal décor
                  that complements your home's architecture.
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="list-disc">Custom wreath design in warm autumn tones</li>
                  <li className="list-disc">Organic pumpkin and gourd arrangements</li>
                  <li className="list-disc">Dried botanical accents and seasonal greenery</li>
                  <li className="list-disc">Planter styling with fall textures</li>
                  <li className="list-disc">Professional installation and setup</li>
                  <li className="list-disc">Seasonal removal and storage</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-serif font-medium">Timeline</h2>
              <div className="space-y-4">
                <div className="border-l-2 border-primary pl-6 py-2">
                  <p className="font-medium mb-1">Mid-August 2026</p>
                  <p className="text-sm text-muted-foreground">Orders open for fall service</p>
                </div>
                <div className="border-l-2 border-muted pl-6 py-2">
                  <p className="font-medium mb-1">Early September</p>
                  <p className="text-sm text-muted-foreground">Installations begin</p>
                </div>
                <div className="border-l-2 border-muted pl-6 py-2">
                  <p className="font-medium mb-1">Late November</p>
                  <p className="text-sm text-muted-foreground">Seasonal removal and storage</p>
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
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Waitlist Form */}
            <div className="bg-card border border-border rounded-sm p-8 md:p-10">
              <FallOrderForm
                serviceType="waitlist"
                title="Join the Waitlist"
                description="Be the first to know when fall orders open in mid-August. We'll reach out with availability and pricing."
              />
            </div>

            {/* Order Form */}
            <div className="bg-card border border-border rounded-sm p-8 md:p-10 relative">
              {!ordersOpen && (
                <div className="absolute top-4 right-4 px-3 py-1 text-xs font-medium tracking-wide uppercase bg-muted text-muted-foreground border border-border rounded-sm">
                  Opens mid-August
                </div>
              )}
              <FallOrderForm
                serviceType="order"
                title="Reserve Your Spot"
                description={
                  ordersOpen
                    ? "Submit your fall installation inquiry and we'll confirm availability within 24 hours."
                    : "Orders will open mid-August 2026. Fill out this form to express interest, and we'll contact you when booking opens."
                }
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center text-sm text-muted-foreground">
          <p>© 2026 Evergreen & Ember. Seasonal décor installation services.</p>
        </div>
      </footer>
    </div>
  );
}
