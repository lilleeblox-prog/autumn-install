import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';

export function Navigation() {
  const [location] = useLocation();

  const links = [
    { href: '/fall',      label: 'Fall' },
    { href: '/winter',    label: 'Winter' },
    { href: '/summer',    label: 'Summer' },
    { href: '/contact',   label: 'Contact' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/88 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-[76px] flex items-center justify-between">
        <Link href="/" className="font-serif text-[1.1rem] font-medium tracking-tight" data-testid="link-home">
          Made to Welcome
        </Link>

        <div className="flex items-center gap-8">
          {links.map((link) => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`hidden md:block text-sm tracking-wide transition-colors relative ${
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-[26px] left-0 right-0 h-px bg-primary"
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </Link>
            );
          })}

          {/* CTA button */}
          <Link
            href="/fall"
            className="font-mono text-[0.72rem] tracking-[0.06em] uppercase bg-foreground text-background hover:bg-primary px-5 py-2.5 transition-colors"
            data-testid="link-nav-cta"
          >
            Add your name
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
