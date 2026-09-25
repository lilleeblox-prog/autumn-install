import { Link } from 'wouter';
import { ArrowDownRight } from 'lucide-react';
import { packages } from '../lib/data';

export default function Packages() {
  return (
    <div className="container-wide">
      <div className="page-header">
        <div className="eyebrow">The collection / A sense of scale</div>
        <h1>Made for the space.</h1>
        <p>From a single doorstep to a sweeping entrance, choose the proportion that suits your architecture. The color story comes next.</p>
      </div>

      <section className="page-section" style={{ paddingTop: 0 }}>
        <div className="package-grid">
          {packages.map((pkg) => (
            <Link href={`/packages/${pkg.id}`} className="package-card" key={pkg.id} data-testid={`link-pkg-${pkg.id}`}>
              <div className="package-info">
                <span className="package-title">{pkg.name}</span>
                <span className="package-room">{pkg.room}</span>
                <span className="package-action">Explore Scale <ArrowDownRight size={12} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
