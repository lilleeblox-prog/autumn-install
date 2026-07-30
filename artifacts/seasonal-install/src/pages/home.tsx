import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useListFeaturedPortfolioItems } from '@workspace/api-client-react';
import { Navigation } from '@/components/navigation';
import { SeasonBadge } from '@/components/season-badge';
import { Button } from '@/components/ui/button';
const heroFallPath = '/images/hero-home_2.jpg';

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
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroFallPath})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
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
              Your home, seasonally perfected
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl"
            >
              White-glove seasonal décor installation that transforms your entrance into a welcoming statement.
              No ladders, no storage, no stress.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" data-testid="button-cta-fall">
                <Link href="/fall">
                  Explore Fall Service <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" data-testid="button-cta-portfolio">
                <Link href="/portfolio">View Our Work</Link>
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
                Effortless seasonal style
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We bring the artistry. You enjoy the compliments. Our team curates, installs, and maintains seasonal
                décor tailored to your home's architecture and your aesthetic preferences.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { title: 'Curated Selection', description: "Seasonal arrangements designed for your home's character" },
                {
                  title: 'Professional Installation',
                  description: 'Our team handles setup and ensures everything looks flawless',
                },
                { title: 'Seasonal Refresh', description: 'We return to swap décor as seasons change' },
                { title: 'Full-Service Storage', description: 'No need to store anything — we take care of it all' },
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-4"
                >
                  <CheckCircle className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
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
            <h2 className="text-4xl md:text-5xl font-serif font-medium mb-4">Available Seasons</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the season you'd like to explore. Fall service opens mid-August 2026.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                season: 'fall' as const,
                title: 'Fall 2026',
                status: 'Orders open mid-August',
                description: 'Warm terracotta, dried botanicals, organic pumpkins, and rich autumn wreaths.',
                available: true,
              },
              {
                season: 'winter' as const,
                title: 'Winter',
                status: 'Coming Soon',
                description: 'Fresh evergreen, frosted branches, elegant lighting, and seasonal greenery.',
                available: false,
              },
              {
                season: 'summer' as const,
                title: 'Summer',
                status: 'Coming Soon',
                description: 'Bright blooms, natural textures, coastal elegance, and breezy botanicals.',
                available: false,
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
                  className={`block group ${item.available ? '' : 'cursor-pointer'}`}
                  data-testid={`card-season-${item.season}`}
                >
                  <div className="bg-card border border-border rounded-sm p-8 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <SeasonBadge season={item.season} className="mb-4" />
                    <h3 className="text-2xl font-serif font-medium mb-2">{item.title}</h3>
                    <p className="text-sm text-primary font-medium mb-4">{item.status}</p>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Portfolio */}
      <section className="py-24 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-medium mb-4">Our Work</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A curated selection of recent installations, crafted with care.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-sm" />
              ))}
            </div>
          ) : featuredItems && featuredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.slice(0, 6).map((item, idx) => (
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
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif font-medium text-lg mb-1">{item.title}</h3>
                      {item.location && <p className="text-sm text-muted-foreground">{item.location}</p>}
                    </div>
                    <SeasonBadge season={item.season} />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">No featured work available yet.</div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mt-12"
          >
            <Button asChild variant="outline" size="lg" data-testid="button-view-all-portfolio">
              <Link href="/portfolio">View Full Portfolio</Link>
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
            <h2 className="text-4xl md:text-6xl font-serif font-medium leading-tight text-balance">
              Ready to welcome every season in style?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Let us handle the details while you enjoy a home that feels effortlessly perfect, all year long.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button asChild size="lg" data-testid="button-cta-bottom-fall">
                <Link href="/fall">
                  Start with Fall <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
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
