import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { WaitlistForm } from '@/components/forms/waitlist-form';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function Summer() {
  return (
    <div className="min-h-[100dvh]">
      <Navigation />

      <section className="pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            className="text-center mb-16 space-y-6"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block px-3 py-1 text-xs font-medium tracking-wide uppercase bg-accent/10 text-accent-foreground border border-accent/20 rounded-sm">
                Coming Soon
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-serif font-medium leading-[1.05] tracking-tight"
            >
              Summer service
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Bright blooms, natural textures, coastal elegance, and breezy botanicals that celebrate the warmth and
              light of summer.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16"
          >
            {/* Description */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-3xl font-serif font-medium">What to expect</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Our summer service will bring fresh, vibrant arrangements that celebrate the season's natural beauty
                  with understated elegance.
                </p>
                <p className="text-sm">Anticipated features:</p>
                <ul className="space-y-2 ml-6 text-sm">
                  <li className="list-disc">Fresh seasonal blooms and greenery</li>
                  <li className="list-disc">Natural fiber and linen accents</li>
                  <li className="list-disc">Coastal-inspired botanicals</li>
                  <li className="list-disc">Potted herbs and living arrangements</li>
                  <li className="list-disc">Professional installation and care</li>
                </ul>
                <p className="text-sm pt-4">
                  Register your address and we'll confirm availability in your area when summer service opens.
                </p>
              </div>
            </div>

            {/* Waitlist Form */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-sm p-8 md:p-10">
                <WaitlistForm
                  season="summer"
                  description="We'll confirm availability in your neighborhood when summer service launches."
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border py-12 mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center text-sm text-muted-foreground">
          <p>© 2026 Made to Welcome. Seasonal décor delivery &amp; installation.</p>
        </div>
      </footer>
    </div>
  );
}
