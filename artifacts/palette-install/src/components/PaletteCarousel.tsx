import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import { palettes, paletteGallery } from '../lib/data';

type PaletteCarouselProps = {
  paletteId: string;
};

export function PaletteCarousel({ paletteId }: PaletteCarouselProps) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const selectedPalette = palettes.find(item => item.id === paletteId);
  const images = paletteGallery.filter(item => item.paletteId === paletteId);
  const currentImage = images[index];

  const move = (direction: number) => {
    if (images.length > 1) setIndex(current => (current + direction + images.length) % images.length);
  };

  return (
    <div className="palette-carousel" role="region" aria-roledescription="carousel" aria-label="Palette photographs for the selected color story">
      <div className="palette-carousel-heading">
        <div>
          <span className="eyebrow">From the studio</span>
          <h4>{selectedPalette ? selectedPalette.name : 'Picture your palette'}</h4>
        </div>
        <Link href="/gallery" className="text-link">View gallery <ChevronRight size={14} aria-hidden="true" /></Link>
      </div>

      {currentImage ? (
        <>
          <div
            className="palette-carousel-stage"
            onTouchStart={event => { touchStart.current = event.touches[0].clientX; }}
            onTouchEnd={event => {
              if (touchStart.current === null) return;
              const distance = touchStart.current - event.changedTouches[0].clientX;
              if (Math.abs(distance) > 45) move(distance > 0 ? 1 : -1);
              touchStart.current = null;
            }}
          >
            <img key={currentImage.id} src={currentImage.previewImage} alt={currentImage.alt} />
            <span className="palette-carousel-photo-tag">Palette photograph</span>
          </div>
          <div className="palette-carousel-footer">
            <div className="palette-carousel-caption" aria-live="polite">
              <span className="eyebrow">{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
              <span>{currentImage.caption}</span>
            </div>
            {images.length > 1 && (
              <div className="palette-carousel-controls">
                <button type="button" onClick={() => move(-1)} aria-label="Previous palette photograph"><ArrowLeft size={18} aria-hidden="true" /></button>
                <button type="button" onClick={() => move(1)} aria-label="Next palette photograph"><ArrowRight size={18} aria-hidden="true" /></button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="palette-carousel-study">
          <div className="palette-carousel-study-swatch" aria-hidden="true">
            {(selectedPalette?.colors ?? palettes[0].colors).map((color, swatchIndex) => (
              <span key={`${color}-${swatchIndex}`} style={{ backgroundColor: color }} />
            ))}
          </div>
          <span className="eyebrow">{selectedPalette ? 'Palette study' : 'Your color story begins here'}</span>
          <p className="palette-carousel-study-title">
            {selectedPalette ? selectedPalette.name : 'A more beautiful arrival.'}
          </p>
          <p className="palette-carousel-study-description">
            {selectedPalette
              ? `${selectedPalette.description}. Palette photography for this color story is coming soon.`
              : 'Choose a color direction to see its matching palette photograph.'}
          </p>
        </div>
      )}
    </div>
  );
}