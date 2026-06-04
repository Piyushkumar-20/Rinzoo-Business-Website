export const SETTINGS_SCHEMA = [
  // Contact
  { key: "site.phone",        label: "Contact Number",      group: "Contact",  type: "STRING",  default: "+91 99119 82666" },
  { key: "site.whatsapp",     label: "WhatsApp Number",     group: "Contact",  type: "STRING",  default: "919911982666" },
  { key: "site.email",        label: "Email Address",       group: "Contact",  type: "STRING",  default: "ropoxindustry11@gmail.com" },
  { key: "site.address",      label: "Address",             group: "Contact",  type: "STRING",  default: "KH NO 3/18, PL NO 79, Nangloi, Kotla Vihar Phase 1, New Delhi" },
  // Branding
  { key: "site.company",      label: "Company Name",        group: "Branding", type: "STRING",  default: "Ropox Industries" },
  { key: "site.tagline",      label: "Tagline",             group: "Branding", type: "STRING",  default: "Premium Results, Smart Pricing" },
  // Social links
  { key: "social.youtube",    label: "YouTube Link",        group: "Social",   type: "STRING",  default: "" },
  { key: "social.facebook",   label: "Facebook Link",       group: "Social",   type: "STRING",  default: "" },
  { key: "social.instagram",  label: "Instagram Link",      group: "Social",   type: "STRING",  default: "" },
  { key: "social.twitter",    label: "X / Twitter Link",    group: "Social",   type: "STRING",  default: "" },
  { key: "social.linkedin",   label: "LinkedIn Link",       group: "Social",   type: "STRING",  default: "" },
  // Display
  { key: "home.offers_count", label: "Max Offers on Home",  group: "Display",  type: "NUMBER",  default: "4" },
  { key: "home.show_offers",  label: "Show Offers on Home", group: "Display",  type: "BOOLEAN", default: "true" },
] as const;
