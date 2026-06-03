export const SETTINGS_SCHEMA = [
  { key: "site.phone",        label: "Phone Number",        group: "Contact",  type: "STRING",  default: "+91 99119 82666" },
  { key: "site.email",        label: "Email Address",       group: "Contact",  type: "STRING",  default: "ropoxindustry11@gmail.com" },
  { key: "site.address",      label: "Address",             group: "Contact",  type: "STRING",  default: "KH NO 3/18, PL NO 79, Nangloi, Kotla Vihar Phase 1, New Delhi" },
  { key: "site.whatsapp",     label: "WhatsApp Number",     group: "Contact",  type: "STRING",  default: "919911982666" },
  { key: "site.tagline",      label: "Site Tagline",        group: "Branding", type: "STRING",  default: "Premium Results, Smart Pricing" },
  { key: "site.company",      label: "Company Name",        group: "Branding", type: "STRING",  default: "Ropox Industries" },
  { key: "home.offers_count", label: "Max Offers on Home",  group: "Display",  type: "NUMBER",  default: "4" },
  { key: "home.show_offers",  label: "Show Offers on Home", group: "Display",  type: "BOOLEAN", default: "true" },
] as const;
