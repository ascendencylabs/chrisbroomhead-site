// Digital guides for the (hidden) shop at /shop.
//
// Only education-only guides belong here. The compound-specific user guides
// (dosing guides for named products, including prescription-only medicines)
// are deliberately NOT listed: advertising medicines to the UK public is
// prohibited (Human Medicines Regulations 2012, Part 14; CAP Code 12.12).
//
// A product can be bought only when it has BOTH a `price` and a `paymentLink`.
// Until then its page shows "Join the list for launch" and records demand in
// Supabase `leads` (source `stream:shop`, guide = product slug).

export interface Product {
  slug: string;
  title: string;
  subtitle: string;
  /** Free products are delivered by the existing lead form, not Stripe. */
  free: boolean;
  /** GBP, whole pounds. `null` until Chris sets the price. */
  price: number | null;
  /** Stripe Payment Link from the CB Coaching Stripe account. Empty until created. */
  paymentLink: string;
  format: string;
  pages: number | null;
  /** What the guide covers, section by section. Written from the source document. */
  contents: { title: string; detail: string }[];
  forWhom: string;
  notFor: string;
  /** Internal link for free products (where the download lives). */
  href?: string;
  /** What must happen to the source file before this can be sold. Not shown publicly. */
  reviewNote: string;
}

export const PRODUCTS: Product[] = [
  {
    slug: 'consultation-bloodwork-brief',
    title: 'The Consultation Bloodwork Brief',
    subtitle: 'What to test, how to prepare for the draw, and what to gather before any protocol conversation.',
    free: true,
    price: 0,
    paymentLink: '',
    format: 'PDF',
    pages: 6,
    contents: [
      { title: 'Why bloodwork comes first', detail: 'Why the starting point is your markers, not a compound.' },
      {
        title: 'The marker panel',
        detail: 'Metabolic, cardiovascular, hormones, thyroid, liver and kidney, blood and nutrients.',
      },
      { title: 'How to prepare for the draw', detail: 'Timing, fasting, training and the biotin rule.' },
      { title: 'The history checklist', detail: 'Eight things to have written down before a consultation.' },
    ],
    forWhom: 'Anyone about to book a consultation, or about to order bloodwork.',
    notFor: 'Anyone looking for an interpretation of their own results. That needs the full picture.',
    href: '/free-guide',
    reviewNote: 'Live. Already published as the free lead magnet.',
  },
  {
    slug: 'peptide-fundamentals',
    title: 'Peptide Fundamentals',
    subtitle:
      'How peptides work, why most of what you read about them is unreliable, and how a protocol is designed. Education, not a shopping list.',
    free: false,
    price: null,
    paymentLink: '',
    format: 'PDF',
    pages: null,
    contents: [
      {
        title: 'How peptides actually work',
        detail: 'Receptor binding, signalling cascades, and why the route of administration changes the outcome.',
      },
      {
        title: 'The information problem',
        detail: 'Why forum threads, influencer videos and weekend-certified coaches give such inconsistent answers.',
      },
      {
        title: 'The protocol design framework',
        detail:
          'Bloodwork first, one primary objective, mechanism-led decisions, knowing when to stop, and combining with restraint.',
      },
      { title: 'Five expensive mistakes', detail: 'The patterns that waste money and muddy the data.' },
    ],
    forWhom: 'People who want to understand the subject properly before they make any decision.',
    notFor: 'Anyone wanting doses, sources or product recommendations. This guide contains none.',
    reviewNote:
      'Source: ~/cb-system/output/lead-magnets/peptide-primer.pdf. Before sale, remove the "Big 5" compound section ' +
      '(names prescription-only medicines), the supplier/sourcing, injection and dosing sections, the Ascendency Biotech ' +
      'branding, shop links and the unverified credential lines, and retitle to "Peptide Fundamentals".',
  },
];

export const productBySlug = (slug: string): Product | undefined => PRODUCTS.find((p) => p.slug === slug);

export const isPurchasable = (p: Product): boolean =>
  !p.free && p.price !== null && p.paymentLink.startsWith('https://');
