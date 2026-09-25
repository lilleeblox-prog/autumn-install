import { Link, useParams } from 'wouter';
import { ChevronRight } from 'lucide-react';
import { packages } from '../lib/data';

export default function PackageDetail() {
  const { id } = useParams();
  const pkg = packages.find((p) => p.id === id);

  if (!pkg) {
    return (
      <div className="container-wide page-header">
        <h1>Package not found</h1>
        <Link href="/packages" className="text-link"><ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back to Packages</Link>
      </div>
    );
  }

  return (
    <div className="container-wide">
      <div className="page-header" style={{ paddingBottom: '48px' }}>
        <Link href="/packages" className="text-link" style={{ marginBottom: '24px' }}><ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back to Offerings</Link>
        <div className="eyebrow">{pkg.subtitle}</div>
        <h1>{pkg.name}</h1>
        <p>{pkg.description}</p>
      </div>

      <section className="page-section" style={{ paddingTop: 0 }}>
        <div className="hero-image detail-image">
          <img src={pkg.image} alt={pkg.name} style={{ objectPosition: pkg.id === 'small' ? 'center 60%' : pkg.id === 'medium' ? 'center 80%' : 'center 75%' }} />
        </div>

        <div className="detail-next">
          <div>
            <span className="eyebrow">What this view shows</span>
            <h2>Start with the footprint. Make the rest yours.</h2>
            <p>The photograph gives a sense of the {pkg.name.toLowerCase()} scale, not a promise of exact pumpkins or colors. In the builder, pair it with one of three palette directions, choose installation or delivery, and add any monogram, timing, or removal preferences.</p>
            <p>Specific heirloom varieties depend on the harvest. Your selected scale will be carried into the builder.</p>
          </div>
          <Link href={`/?size=${pkg.id}`} className="primary-button">Compose with this scale <ChevronRight size={15} aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}
