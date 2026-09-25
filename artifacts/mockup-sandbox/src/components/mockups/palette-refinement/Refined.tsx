import './_group.css';
import './_refined.css';
import RefinedContent from './_RefinedContent';

/**
 * Primary Palette Install preview. Its content and copy are isolated from the
 * Current reference frame so future edits affect only this preview.
 */
export default function Refined() {
  return (
    <div className="palette-refined-frame">
      <RefinedContent />
    </div>
  );
}