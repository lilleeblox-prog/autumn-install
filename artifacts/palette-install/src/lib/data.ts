export type Package = {
  id: string;
  name: string;
  priceCents: number;
  serviceFeeCents: number;
  subtitle: string;
  room: string;
  description: string;
  contents: string[];
  includesHayBales: boolean;
  image: string;
};

export const packages: Package[] = [
  {
    id: 'small',
    name: 'The Stoop',
    priceCents: 42500,
    serviceFeeCents: 2500,
    subtitle: 'For a smaller welcome',
    room: 'Perfect for a single door or narrow stoop.',
    description: 'A curated selection of heirloom varieties styled elegantly for intimate entryways. We select distinctive gourds that provide scale and texture without overwhelming the space.',
    contents: ['6 Large Pumpkins', '6 Medium Pumpkins', '6 White Pumpkins', 'Assortment of Specialty Pumpkins', 'Assortment of Pie Pumpkins'],
    includesHayBales: false,
    image: '/package-images/package-small.webp'
  },
  {
    id: 'medium',
    name: 'The Porch',
    priceCents: 82500,
    serviceFeeCents: 5000,
    subtitle: 'For a layered entrance',
    room: 'Substantial symmetric or asymmetrical entry.',
    description: 'Designed for standard porches and stoops, offering a balanced mix of large focal pumpkins, medium stackers, and specialized accent gourds for a layered, architectural look.',
    contents: ['8 Large Pumpkins', '8 Medium Pumpkins', '8 White Pumpkins', 'Assortment of Specialty Pumpkins', 'Assortment of Pie Pumpkins', '2 Hay Bales'],
    includesHayBales: true,
    image: '/package-images/package-medium.webp'
  },
  {
    id: 'large',
    name: 'The Estate',
    priceCents: 125000,
    serviceFeeCents: 8500,
    subtitle: 'For a sweeping first impression',
    room: 'Expansive installation for wide steps or commercial facades.',
    description: 'A grand, sweeping statement. This expansive composition utilizes our most magnificent heirlooms, creating an immersive seasonal moment tailored for grand entrances or storefronts.',
    contents: ['2 Grand Prize Pumpkins', '10 Large Pumpkins', '8 Medium Pumpkins', '8 White Pumpkins', '16 Specialty Pumpkins', '2 Hay Bales', 'assortment of minis', 'Ornamental Gourds', 'Assortment of Pie Pumpkins'],
    includesHayBales: true,
    image: '/package-images/package-large.webp'
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
    id: 'countryside',
    name: 'Autumn in the Countryside',
    description: 'Burnt orange, soft white, and deep garden greens',
    colors: ['#bd7439', '#f0e8da', '#819080', '#415a50'],
    code: '01 / rustic + layered',
  },
  {
    id: 'classic-harvest',
    name: 'Classic Harvest',
    description: 'Harvest orange, warm ivory, and golden gourds',
    colors: ['#d67621', '#f0e6d3', '#cfaf6b', '#995623'],
    code: '02 / warm + traditional',
  },
  {
    id: 'coastal-cowgirl',
    name: 'Coastal Cowgirl',
    description: 'Blush peach, ghost white, and sea-glass sage',
    colors: ['#dba99a', '#f0e9dc', '#a5b9a6', '#6e8b75'],
    code: '03 / soft + unexpected',
  },
];

export type GalleryItem = {
  id: string;
  paletteId: string;
  image: string;
  previewImage: string;
  alt: string;
  caption: string;
};

export const paletteGallery: GalleryItem[] = [
  {
    id: 'countryside-photo',
    paletteId: 'countryside',
    image: '/palette-images/autumn-in-the-countryside.webp',
    previewImage: '/palette-images/autumn-in-the-countryside-landscape.webp',
    alt: 'Close-up of orange, white, and green pumpkins in the Autumn in the Countryside palette',
    caption: 'Autumn in the Countryside / Palette photograph',
  },
  {
    id: 'classic-harvest-photo',
    paletteId: 'classic-harvest',
    image: '/palette-images/classic-harvest.webp',
    previewImage: '/palette-images/classic-harvest-landscape.webp',
    alt: 'Close-up of orange, ivory, and golden gourds in the Classic Harvest palette',
    caption: 'Classic Harvest / Palette photograph',
  },
  {
    id: 'coastal-cowgirl-photo',
    paletteId: 'coastal-cowgirl',
    image: '/palette-images/coastal-cowgirl.webp',
    previewImage: '/palette-images/coastal-cowgirl-landscape.webp',
    alt: 'Close-up of blush, white, and sage pumpkins in the Coastal Cowgirl palette',
    caption: 'Coastal Cowgirl / Palette photograph',
  },
];

export const faqs = [
  {
    question: "Does the photo show my exact finished display?",
    answer: "Package photos are scale references, while the palette photos show close-up color inspiration, not finished installations. Your chosen palette sets the color direction; individual heirloom varieties may vary with the harvest."
  },
  {
    question: "What is the difference between delivery and installation?",
    answer: "With custom installation, the display is styled at your entry. With delivery only, the curated pumpkins and gourds are dropped off for you to arrange. The builder lets you choose either option."
  },
  {
    question: "Is my requested week a confirmed booking?",
    answer: "No. The week is a preference for your brief, not a reserved date. Scheduling and availability will be confirmed separately; add a specific event date to your notes if one matters."
  },
  {
    question: "Can I add vinyl artwork or arrange removal?",
    answer: "Yes. Choose a PNG or PDF artwork file, the number of pumpkins, a white or orange pumpkin, and white, black, or gold vinyl. When placing an order in Shopify, upload the artwork there so it reaches the studio. You can also request post-season removal."
  },
  {
    question: "How long do the pumpkins last?",
    answer: "Longevity varies with weather, sun exposure, and the pumpkins themselves. Keep your display out of prolonged standing water where possible, and check individual pieces regularly for softness or damage."
  },
  {
    question: "Do I need to be home for the installation?",
    answer: "Access and placement details would be confirmed with you before an installation. You can add entry instructions or an event date to the notes in your brief."
  }
];
