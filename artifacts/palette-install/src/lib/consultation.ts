import { packages, palettes } from './data';

const STORAGE_KEY = 'palette-install-consultation-v1';
const MAX_AGE_MS = 2 * 60 * 60 * 1000;

export type ConsultationChoices = {
  size: string;
  palette: string;
  fulfillment: string;
  monogram: string;
  monogramCount: string;
  pumpkinColor: string;
  vinylColor: string;
  artworkSelected: boolean;
  requestedWeek: string;
  removal: string;
  notes: string;
  furtherCustomization: boolean;
};

export function saveConsultationChoices(choices: ConsultationChoices): boolean {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ savedAt: Date.now(), choices }));
    return true;
  } catch {
    return false;
  }
}

export function readConsultationChoices(): ConsultationChoices | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const { savedAt, choices } = JSON.parse(stored) as { savedAt: number; choices: ConsultationChoices };
    if (typeof savedAt !== 'number' || Date.now() - savedAt < 0 || Date.now() - savedAt > MAX_AGE_MS ||
        !choices || typeof choices !== 'object' || typeof choices.notes !== 'string' ||
        typeof choices.requestedWeek !== 'string' || !packages.some(pkg => pkg.id === choices.size)) {
      return null;
    }
    return choices;
  } catch {
    return null;
  }
}

export function consultationMessage(choices: ConsultationChoices): string {
  const pkg = packages.find(item => item.id === choices.size);
  const palette = palettes.find(item => item.id === choices.palette);
  const lines = [
    pkg && `Display: ${pkg.name}`,
    palette && `Palette: ${palette.name}`,
    choices.fulfillment === 'installation' ? 'Fulfillment: Custom installation' :
      choices.fulfillment === 'delivery' ? 'Fulfillment: Delivery only' : null,
    pkg?.includesHayBales && 'Hay bales: 2 included with the display',
    choices.monogram === 'no' ? 'Vinyl artwork: No' : null,
    choices.monogram === 'yes' && `Vinyl artwork: Yes${choices.monogramCount ? `, ${choices.monogramCount} pumpkin(s)` : ''}`,
    choices.monogram === 'yes' && choices.pumpkinColor && `Pumpkin color: ${choices.pumpkinColor}`,
    choices.monogram === 'yes' && choices.vinylColor && `Vinyl color: ${choices.vinylColor}`,
    choices.monogram === 'yes' && choices.artworkSelected && 'Artwork file: selected in the builder (file not transferred)',
    choices.removal === 'yes' ? 'Removal: Requested' : choices.removal === 'no' ? 'Removal: Not requested' : null,
    choices.furtherCustomization && 'Further customization: Consultation requested',
    choices.notes.trim() && `Your vision: ${choices.notes.trim()}`,
  ];
  return lines.filter(Boolean).join('\n');
}