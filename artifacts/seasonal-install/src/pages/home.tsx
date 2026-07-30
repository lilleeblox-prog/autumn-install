import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, Truck, Wrench, Trash2 } from 'lucide-react';
import { useListFeaturedPortfolioItems } from '@workspace/api-client-react';
import { Navigation } from '@/components/navigation';
import { SeasonBadge } from '@/components/season-badge';
import { Button } from '@/components/ui/button';
const heroPath = '/images/hero-doorway.jpg';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function Home() {
  const { data: featuredItems, isLoading } = useListFeaturedPortfolioItems();
  const fallFeatured = featuredItems?.filter((item) => item.season === 'fall') ?? [];

  return (
    <div className="min-h-[100dvh]">
      <Navigation />

      {/* Hero */}
      <section className="relative min-h-[100dvh] flex items-center pt-24 overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="max-w-3xl space-y-8"
          >
            <motion.div variants={fadeInUp} className="inline-block">
              <SeasonBadge season="fall" className="mb-6" />
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-[1.05] tracking-tight text-balance"
            >
              Your front door, made to welcome.
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl"
            >
              We deliver, arrange, and install beautiful seasonal décor at your front door — so it looks effortless
              without any effort on your part. Fall 2026 spots are filling up. Reserve yours before mid-August.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" data-testid="button-cta-fall">
                <Link href="/fall">
                  Claim a Fall Spot <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" data-testid="button-cta-portfolio">
                <Link href="/portfolio">See Our Work</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 md:py-32 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24"
          >
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-serif font-medium leading-tight">
                We take care of everything
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We show up with everything your front door needs — pumpkins, wreaths, botanicals, planters — and leave
                it looking like the cover of a magazine. You don't lift a finger. When the season ends, just let us
                know and we'll come back to take it all away.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: Truck,
                  title: 'Delivered to your door',
                  description: 'We source and bring every piece — no trips to the farm stand, no hauling pumpkins.',
                },
                {
                  icon: Wrench,
                  title: 'Professional installation',
                  description:
                    'Our team arranges and installs everything so it looks beautiful from every angle.',
                },
                {
                  icon: Trash2,
                  title: 'Optional removal',
                  description:
                    "When the season's over, add removal and we'll pick everything up. Nothing left behind.",
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-4"
                >
                  <div className="shrink-0 mt-0.5 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif font-medium text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Season Selector */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-medium mb-4">Seasonal offerings</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're taking fall 2026 orders starting mid-August. Winter and summer coming soon.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                season: 'fall' as const,
                title: 'Fall 2026',
                status: 'Booking opens mid-August — spots are limited',
                description:
                  'Warm terracotta, dried botanicals, organic pumpkins, and rich autumn wreaths. Our most popular season.',
                available: true,
                highlight: true,
              },
              {
                season: 'winter' as const,
                title: 'Winter',
                status: 'Coming Soon — join the waitlist',
                description: 'Fresh evergreen, frosted branches, warm lighting, and seasonal greenery.',
                available: false,
                highlight: false,
              },
              {
                season: 'summer' as const,
                title: 'Summer',
                status: 'Coming Soon — join the waitlist',
                description: 'Bright blooms, natural textures, coastal elegance, and breezy botanicals.',
                available: false,
                highlight: false,
              },
            ].map((item, idx) => (
              <motion.div
                key={item.season}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={`/${item.season}`}
                  className="block group"
                  data-testid={`card-season-${item.season}`}
                >
                  <div
                    className={`bg-card border rounded-sm p-8 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                      item.highlight ? 'border-primary/40 shadow-sm' : 'border-border'
                    }`}
                  >
                    {item.highlight && (
                      <div className="inline-block px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase bg-primary text-primary-foreground rounded-sm mb-4">
                        Now Booking
                      </div>
                    )}
                    <SeasonBadge season={item.season} className={item.highlight ? '' : 'mb-4'} />
                    <h3 className="text-2xl font-serif font-medium mb-2 mt-3">{item.title}</h3>
                    <p
                      className={`text-sm font-medium mb-4 ${item.highlight ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      {item.status}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Portfolio — fall only */}
      <section className="py-24 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-medium mb-4">A few recent installs</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every home gets a setup designed to fit its style and scale.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-sm" />
              ))}
            </div>
          ) : fallFeatured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fallFeatured.slice(0, 3).map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group cursor-pointer"
                  data-testid={`card-portfolio-${item.id}`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-muted mb-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-medium text-lg mb-1">{item.title}</h3>
                    {item.location && <p className="text-sm text-muted-foreground">{item.location}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Portfolio coming soon.</div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mt-12"
          >
            <Button asChild variant="outline" size="lg" data-testid="button-view-all-portfolio">
              <Link href="/portfolio">See More Work</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <p className="text-sm font-medium tracking-widest uppercase text-primary">Fall 2026 is almost here</p>
            <h2 className="text-4xl md:text-6xl font-serif font-medium leading-tight text-balance">
              Don't wake up to a bare front door in September.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Orders open mid-August and we only take on a limited number of homes each season. Get on our list now
              and we'll reach out as soon as booking opens.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button asChild size="lg" data-testid="button-cta-bottom-fall">
                <Link href="/fall">
                  Get on the List <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
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
