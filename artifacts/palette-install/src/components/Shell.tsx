import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className={`site-shell${location === '/' ? ' site-shell--builder' : ''}`}>
      <header className="container-wide topbar">
        <Link href="/" className="wordmark" data-testid="link-home">
          palette<span>/</span>install
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/process" className={location === '/process' ? 'active' : ''}>Process</Link>
          <Link href="/?compose=1" data-testid="link-compose">Compose</Link>
          <Link href="/gallery" className={location === '/gallery' ? 'active' : ''}>Gallery</Link>
          <Link href="/faq" className={location === '/faq' ? 'active' : ''}>FAQ</Link>
          <Link href="/contact" className={location === '/contact' ? 'active' : ''}>Contact</Link>
        </nav>
        <div className="topbar-note">
          <span className="status-dot" aria-hidden="true" />
          The autumn studio / Preview
        </div>
        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open mobile menu"
          data-testid="button-open-menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Nav Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`} aria-hidden={!mobileMenuOpen}>
        <div className="mobile-drawer-header">
          <Link href="/" className="wordmark" onClick={() => setMobileMenuOpen(false)}>
            palette<span>/</span>install
          </Link>
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close mobile menu"
            data-testid="button-close-menu"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="mobile-drawer-nav">
          <Link href="/process" className={location === '/process' ? 'active' : ''}>Process</Link>
          <Link href="/?compose=1" data-testid="link-compose-mobile">Compose</Link>
          <Link href="/gallery" className={location === '/gallery' ? 'active' : ''}>Gallery</Link>
          <Link href="/faq" className={location === '/faq' ? 'active' : ''}>FAQ</Link>
          <Link href="/contact" className={location === '/contact' ? 'active' : ''}>Contact</Link>
        </nav>
      </div>

      <main className="main-content">
        {children}
      </main>

      {location !== '/' && <footer className="footer container-wide">
        <div className="footer-brand">
          <Link href="/" className="wordmark">
            palette<span>/</span>install
          </Link>
          <p>A bespoke pumpkin and gourd installation studio designed for residential and commercial entries.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <span className="footer-col-title">Studio</span>
            <Link href="/studio">About</Link>
            <Link href="/process">Process</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">Offerings</span>
            <Link href="/?compose=1">Compose</Link>
            <Link href="/packages">Packages</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/faq">FAQ</Link>
          </div>
        </div>
      </footer>}
    </div>
  );
}
