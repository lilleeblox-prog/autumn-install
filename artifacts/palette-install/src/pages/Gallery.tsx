import { Link } from 'wouter';
import { paletteGallery } from '../lib/data';

export default function Gallery() {
  return (
    <div className="container-wide page-header-wrapper">
      <div className="page-header">
        <div className="eyebrow">The palettes / 01—03</div>
        <h1>Color stories, gathered.</h1>
        <p>Close-up photographs of the pumpkins and gourds in each color story. These are palette studies, not previews of finished entry installations.</p>
      </div>
      
      <div className="editorial-gallery-grid multi-grid" style={{ marginTop: '48px' }}>
        {paletteGallery.map((item, idx) => (
          <div key={item.id} className={`editorial-gallery-item layout-var-${idx % 3}`}>
            <div className="editorial-image-wrapper">
              <img src={item.image} alt={item.alt} />
            </div>
            <div className="editorial-caption"><span>{String(idx + 1).padStart(2, '0')} / {String(paletteGallery.length).padStart(2, '0')}</span><span>{item.caption}</span></div>
          </div>
        ))}
      </div>
      <div className="gallery-outro">
        <p>Explore these three color directions in the builder. The scale photographs there are separate references for proportion, not renderings of a finished display.</p>
        <Link href="/?compose=1" className="text-link">Explore the palettes <span aria-hidden="true">↗</span></Link>
      </div>
    </div>
  );
}
