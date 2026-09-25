export type Package = {
  id: string;
  name: string;
  subtitle: string;
  room: string;
  description: string;
  image: string;
};

export const packages: Package[] = [
  {
    id: 'small',
    name: 'Small Installation',
    subtitle: 'Small package layout',
    room: 'Perfect for a single door or narrow stoop.',
    description: 'A curated selection of heirloom varieties styled elegantly for intimate entryways. We select distinctive gourds that provide scale and texture without overwhelming the space.',
    image: '/__mockup/package-images/package-small.webp'
  },
  {
    id: 'medium',
    name: 'Medium Installation',
    subtitle: 'Medium package layout',
    room: 'Substantial symmetric or asymmetrical entry.',
    description: 'Designed for standard porches and stoops, offering a balanced mix of large focal pumpkins, medium stackers, and specialized accent gourds for a layered, architectural look.',
    image: '/__mockup/package-images/package-medium.webp'
  },
  {
    id: 'large',
    name: 'Large Installation',
    subtitle: 'Large package layout',
    room: 'Expansive installation for wide steps or commercial facades.',
    description: 'A grand, sweeping statement. This expansive composition utilizes our most magnificent heirlooms, creating an immersive seasonal moment tailored for grand entrances or storefronts.',
    image: '/__mockup/package-images/package-large.webp'
  }
];

export type Palette = {
  id: string;
  name: string;
  description: string;
  colors: string[];
  code: string;
};

export const palettes: Palette[] = [
  {
    id: 'heirloom',
    name: 'The Heirloom Mix',
    description: 'Muted greens, ghost whites, and pale peach',
    colors: ['#84926d', '#e8dfc6', '#dcb5a7', '#c6c0b5'],
    code: '01 / organic + subtle',
  },
  {
    id: 'classic',
    name: 'Classic Autumn',
    description: 'Vibrant oranges, deep reds, and natural straw',
    colors: ['#c55e42', '#d7ad4f', '#a74635', '#b8a274'],
    code: '02 / warm + traditional',
  },
  {
    id: 'midnight',
    name: 'Twilight Harvest',
    description: 'Charcoal, deep burgundy, and ghost white',
    colors: ['#35484b', '#704d58', '#e8dfc6', '#2e302d'],
    code: '03 / dark + moody',
  },
  {
    id: 'blush',
    name: 'Soft Blush',
    description: 'Peach, pale pink, and muted terracotta',
    colors: ['#dcb5a7', '#e0c7a8', '#bc7555', '#d7d3cb'],
    code: '04 / soft + elegant',
  },
];

export type GalleryItem = {
  id: string;
  paletteId: string;
  image: string;
  caption: string;
};

export const paletteGallery: GalleryItem[] = [
  {
    id: 'classic-small',
    paletteId: 'classic',
    image: '/__mockup/package-images/package-small.webp',
    caption: 'Classic Autumn / Stoop Scale',
  },
  {
    id: 'classic-medium',
    paletteId: 'classic',
    image: '/__mockup/package-images/package-medium.webp',
    caption: 'Classic Autumn / Porch Scale',
  },
  {
    id: 'heirloom-large',
    paletteId: 'heirloom',
    image: '/__mockup/package-images/package-large.webp',
    caption: 'The Heirloom Mix / Grand Scale',
  },
];

export const processSteps = [
  {
    id: 'select',
    title: 'Select',
    description: 'Choose your color palette first, then the package scale that fits your entry and a requested week.'
  },
  {
    id: 'compose',
    title: 'Compose',
    description: 'Our designers curate the ideal combination of heirlooms for your specific space, balancing color, scale, and texture.'
  },
  {
    id: 'install',
    title: 'Install',
    description: 'Our team thoughtfully styles the display at your location, ensuring every angle considers the architecture.'
  }
];

export const faqs = [
  {
    question: "How long do the pumpkins last?",
    answer: "Longevity varies with weather and exposure. Contact us for guidance on caring for your display."
  },
  {
    question: "Do I need to be home for the installation?",
    answer: "We will confirm access and installation details with you before the visit."
  }
];
