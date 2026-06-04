/**
 * Declarative schema for the Content Manager.
 * Each section maps to one `PageSection` row (page="home", sectionKey=<key>),
 * with the editable values stored in the JSON `content` column.
 * The admin UI and the public site both read from this schema so defaults
 * and field definitions never drift.
 */

export type ContentFieldType = "text" | "textarea" | "url" | "image" | "boolean";

export interface ContentField {
  key: string;
  label: string;
  type: ContentFieldType;
  placeholder?: string;
}

export interface ContentSection {
  key: string; // sectionKey in PageSection
  label: string;
  description: string;
  fields: ContentField[];
  defaults: Record<string, string | boolean>;
}

export const CONTENT_SECTIONS: ContentSection[] = [
  {
    key: "hero",
    label: "Hero Section",
    description: "The main banner at the top of the homepage.",
    fields: [
      { key: "badge", label: "Badge Text", type: "text" },
      { key: "heading", label: "Heading (line 1)", type: "text" },
      { key: "highlight", label: "Heading Highlight (line 2)", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "primaryBtnText", label: "Primary Button Text", type: "text" },
      { key: "primaryBtnLink", label: "Primary Button Link", type: "url", placeholder: "/products" },
      { key: "secondaryBtnText", label: "Secondary Button Text", type: "text" },
      { key: "secondaryBtnLink", label: "Secondary Button Link", type: "url", placeholder: "/distributor" },
      { key: "productImage1", label: "Product Image 1 (90g card)", type: "image" },
      { key: "productImage2", label: "Product Image 2 (1kg card)", type: "image" },
      { key: "backgroundImage", label: "Background Image (optional)", type: "image" },
      { key: "visible", label: "Show this section", type: "boolean" },
    ],
    defaults: {
      badge: "Premium Results, Smart Pricing",
      heading: "Premium Results.",
      highlight: "Smart Pricing.",
      description: "Powerful stain removal, long-lasting freshness, and reliable cleaning performance for every household.",
      primaryBtnText: "Try Rinzoo Today",
      primaryBtnLink: "/products",
      secondaryBtnText: "Become a Distributor",
      secondaryBtnLink: "/distributor",
      productImage1: "/images/pack-compare.jpeg",
      productImage2: "/images/pack-compare.jpeg",
      backgroundImage: "",
      visible: true,
    },
  },
  {
    key: "features",
    label: "Homepage — Features",
    description: '"Why Families Choose Rinzoo" section heading and visibility.',
    fields: [
      { key: "badge", label: "Badge Text", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "visible", label: "Show this section", type: "boolean" },
    ],
    defaults: {
      badge: "Why Families Choose Rinzoo",
      heading: "Premium Performance, Every Wash",
      description: "Engineered for Indian households that want the best clean without overspending.",
      visible: true,
    },
  },
  {
    key: "challenge",
    label: "₹8 Challenge",
    description: "The promotional challenge banner.",
    fields: [
      { key: "badge", label: "Badge Text", type: "text" },
      { key: "heading", label: "Heading (line 1)", type: "text" },
      { key: "highlight", label: "Heading Highlight (line 2)", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "btnText", label: "Button Text", type: "text" },
      { key: "btnLink", label: "Button Link", type: "url", placeholder: "/products" },
      { key: "image1", label: "Trial Pack Image (90g)", type: "image" },
      { key: "image2", label: "Family Pack Image (1kg)", type: "image" },
      { key: "visible", label: "Show this section", type: "boolean" },
    ],
    defaults: {
      badge: "The ₹8 Challenge",
      heading: "Pehle ₹8,",
      highlight: "Pasand Aaye To ₹85",
      description: "Try the 90g pack for just ₹8. Experience the quality yourself. Upgrade to the 1kg family pack if you love the results.",
      btnText: "Take the ₹8 Challenge",
      btnLink: "/products",
      image1: "/images/pack-compare.jpeg",
      image2: "/images/image.png",
      visible: true,
    },
  },
  {
    key: "productShowcase",
    label: "Product Showcase",
    description: '"Choose Your Rinzoo Pack" section.',
    fields: [
      { key: "badge", label: "Badge Text", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "image1", label: "Trial Pack Image", type: "image" },
      { key: "image2", label: "Family Pack Image", type: "image" },
      { key: "visible", label: "Show this section", type: "boolean" },
    ],
    defaults: {
      badge: "Product Showcase",
      heading: "Choose Your Rinzoo Pack",
      image1: "/images/pack-compare.jpeg",
      image2: "/images/image.png",
      visible: true,
    },
  },
  {
    key: "whyDifferent",
    label: "Why Rinzoo Is Different",
    description: "Premium-clean comparison section.",
    fields: [
      { key: "badge", label: "Badge Text", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "imageUrl", label: "Section Image", type: "image" },
      { key: "visible", label: "Show this section", type: "boolean" },
    ],
    defaults: {
      badge: "Why Rinzoo Is Different",
      heading: "Premium Clean, Without Premium Pricing",
      description: "Same powerful results you expect from premium brands — at a price that respects your budget.",
      imageUrl: "https://images.unsplash.com/photo-1635274605638-d44babc08a4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHdoaXRlJTIwZm9sZGVkJTIwY2xvdGhlcyUyMGxhdW5kcnl8ZW58MXwwfHx8MTc4MDUwMjE4Mnww&ixlib=rb-4.1.0&q=80&w=800",
      visible: true,
    },
  },
  {
    key: "about",
    label: "About Section",
    description: "About Ropox Industries block on the homepage.",
    fields: [
      { key: "badge", label: "Badge Text", type: "text" },
      { key: "heading", label: "Heading (line 1)", type: "text" },
      { key: "highlight", label: "Heading Highlight (line 2)", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "imageUrl", label: "Section Image", type: "image" },
      { key: "visible", label: "Show this section", type: "boolean" },
    ],
    defaults: {
      badge: "About Ropox Industries",
      heading: "Built On Trust,",
      highlight: "Driven By Quality",
      description: "Ropox Industries was founded with a simple mission — to bring premium-grade household care within reach of every Indian family. Rinzoo is our flagship promise: world-class cleaning performance manufactured to the highest quality standards.",
      imageUrl: "https://images.unsplash.com/photo-1610891015188-5369212db097?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxkZXRlcmdlbnQlMjBmYWN0b3J5JTIwbWFudWZhY3R1cmluZ3xlbnwxfDB8fHwxNzgwNTAyMTgyfDA&ixlib=rb-4.1.0&q=80&w=800",
      visible: true,
    },
  },
  {
    key: "distributor",
    label: "Distributor Section",
    description: "Distributor call-to-action shown across the site.",
    fields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "btnText", label: "Button Text", type: "text" },
      { key: "btnLink", label: "Button Link", type: "url", placeholder: "/distributor" },
      { key: "visible", label: "Show this section", type: "boolean" },
    ],
    defaults: {
      heading: "Become a Distributor",
      description: "Partner with Ropox Industries and grow your business with a trusted brand that delivers quality, value and support.",
      btnText: "Join Now",
      btnLink: "/distributor",
      visible: true,
    },
  },
  {
    key: "offers",
    label: "Offers Section",
    description: '"Limited-Time Savings" heading on the homepage.',
    fields: [
      { key: "badge", label: "Badge Text", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "visible", label: "Show this section", type: "boolean" },
    ],
    defaults: { badge: "Special Offers", heading: "Limited-Time Savings", visible: true },
  },
  {
    key: "footer",
    label: "Footer Content",
    description: "Footer brand blurb and tagline.",
    fields: [
      { key: "blurb", label: "Brand Blurb", type: "textarea" },
      { key: "tagline", label: "Bottom Tagline", type: "text" },
    ],
    defaults: {
      blurb: "Premium detergent powder by Ropox Industries. Powerful cleaning, fabric-friendly freshness — at a price every household can trust.",
      tagline: "Rinzoo — Premium Results, Smart Pricing",
    },
  },
  {
    key: "branding",
    label: "Branding (Logo)",
    description: "The Rinzoo logo shown in the header and footer across the whole site.",
    fields: [
      { key: "logoUrl", label: "Logo Image", type: "image" },
    ],
    defaults: {
      logoUrl: "/images/logo.png",
    },
  },
];

export type SectionContent = Record<string, string | boolean>;

/** Merge stored DB values over the schema defaults for one section. */
export function mergeSectionDefaults(key: string, stored?: Record<string, unknown> | null): SectionContent {
  const section = CONTENT_SECTIONS.find((s) => s.key === key);
  if (!section) return (stored as SectionContent) ?? {};
  return { ...section.defaults, ...(stored ?? {}) } as SectionContent;
}
