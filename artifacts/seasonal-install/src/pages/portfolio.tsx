import { useState } from 'react';
import { motion } from 'framer-motion';
import { useListPortfolioItems } from '@workspace/api-client-react';
import { Navigation } from '@/components/navigation';
import { SeasonBadge } from '@/components/season-badge';
import { Button } from '@/components/ui/button';

type SeasonFilter = 'all' | 'fall' | 'winter' | 'summer';

export default function Portfolio() {
  const [filter, setFilter] = useState<SeasonFilter>('all');
  const { data: portfolioItems, isLoading } = useListPortfolioItems();

  const filteredItems = portfolioItems?.filter((item) => filter === 'all' || item.season === filter);

  return (
    <div className="min-h-[100dvh]">
      <Navigation />

      <section className="pt-32 pb-16 md:pt-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-medium mb-6">Our Work</h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Seasonal installations crafted with care, tailored to each home's unique character.
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {(['all', 'fall', 'winter', 'summer'] as const).map((season) => (
              <Button
                key={season}
                variant={filter === season ? 'default' : 'outline'}
                onClick={() => setFilter(season)}
                className="capitalize"
                data-testid={`button-filter-${season}`}
              >
                {season === 'all' ? 'All Seasons' : season}
              </Button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-sm" />
              ))}
            </div>
          ) : filteredItems && filteredItems.length > 0 ? (
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: Math.min(idx * 0.08, 0.4), ease: [0.16, 1, 0.3, 1] }}
                  className="group"
                  data-testid={`item-portfolio-${item.id}`}
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
                    <div className="flex-1">
                      <h3 className="font-serif font-medium text-lg mb-1">{item.title}</h3>
                      {item.location && <p className="text-sm text-muted-foreground mb-2">{item.location}</p>}
                      {item.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      )}
                    </div>
                    <SeasonBadge season={item.season} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-lg">
                {filter === 'all' ? 'No portfolio items available yet.' : `No ${filter} installations to show yet.`}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center text-sm text-muted-foreground">
          <p>© 2026 Evergreen & Ember. Seasonal décor installation services.</p>
        </div>
      </footer>
    </div>
  );
}
