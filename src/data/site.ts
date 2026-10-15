// Single source of truth for everything a visitor can buy, book or follow.
// Prices are copied from the live Calendly booking pages (checked 16 Oct 2026).
// Calendly takes payment at booking via the Chris Broomhead Coaching Stripe account.

export const CALENDLY_PROFILE = 'https://calendly.com/chrisbroomheadconsultation';

export interface Offer {
  slug: string;
  name: string;
  shortName: string;
  duration: string;
  price: number;
  priceLabel: string;
  url: string;
  summary: string;
  includes: string[];
  prep: string;
  forWhom: string;
  existingClientsOnly?: boolean;
  highlight?: boolean;
}

export const OFFERS: Offer[] = [
  {
    slug: 'initial-consultation-suitability-assessment',
    name: 'Initial Consultation — Suitability Assessment',
    shortName: 'Suitability call',
    duration: '15 min',
    price: 0,
    priceLabel: 'Free',
    url: `${CALENDLY_PROFILE}/initial-consultation-suitability-assessment`,
    summary: 'A short call to check whether a private session is right for your situation, and which format fits.',
    includes: [
      'Review of your objectives and current status',
      'A clear recommendation on which consultation format fits',
      'No protocols are designed on this call',
    ],
    prep: 'Have a short summary of your situation, goals and background ready.',
    forWhom: 'You are not sure which session you need.',
  },
  {
    slug: 'plan-design',
    name: 'Protocol Design Consultation — 15 Min',
    shortName: 'Protocol design · 15 min',
    duration: '15 min',
    price: 50,
    priceLabel: '£50',
    url: `${CALENDLY_PROFILE}/plan-design`,
    summary: 'One precise question, answered properly. A structured session on a single protocol element.',
    includes: [
      'Targeted guidance on one protocol element',
      'Selection, dosing architecture, sequencing or ancillary support',
      'Written summary of recommendations after the call',
    ],
    prep: 'Send relevant bloodwork, current protocols or history to the email in your confirmation.',
    forWhom: 'You have one specific, well-defined question.',
  },
  {
    slug: 'consultation-30mins',
    name: 'Private Consultation — 30 Min',
    shortName: 'Private consultation · 30 min',
    duration: '30 min',
    price: 100,
    priceLabel: '£100',
    url: `${CALENDLY_PROFILE}/consultation-30mins`,
    summary: 'A full review of your current approach, with a written protocol summary within 48 hours.',
    includes: [
      'Pre-call review of your bloodwork and protocol history',
      'Compound selection, dosing architecture, sequencing and refinement',
      'Detailed written protocol summary within 48 hours',
    ],
    prep: 'Submit bloodwork, current protocols and usage history at least 48 hours before the call.',
    forWhom: 'You are already running a protocol and want expert analysis of it.',
    highlight: true,
  },
  {
    slug: '60mincoachingcall',
    name: 'Private Consultation — Comprehensive (60 Min)',
    shortName: 'Comprehensive · 60 min',
    duration: '60 min',
    price: 150,
    priceLabel: '£150',
    url: `${CALENDLY_PROFILE}/60mincoachingcall`,
    summary:
      'Complete protocol architecture across multiple systems, with a structured written protocol within 72 hours.',
    includes: [
      'Detailed pre-call review of all documentation',
      'Multi-system review: hormonal, metabolic, recovery, cognition, longevity',
      'Phased programme design and side-effect review',
      'Structured written protocol within 72 hours',
    ],
    prep: 'Submit bloodwork, current protocols, medical history and questions at least 72 hours before.',
    forWhom: 'Your case is complex, or you want the full system designed at once.',
  },
  {
    slug: 'follow-up-review',
    name: 'Follow-Up Review',
    shortName: 'Follow-up review',
    duration: '15 min',
    price: 50,
    priceLabel: '£50',
    url: `${CALENDLY_PROFILE}/follow-up-review`,
    summary: 'Protocol adjustments, progress review or new bloodwork after a previous consultation.',
    includes: ['Progress and bloodwork review', 'Protocol adjustments', 'Clarification of earlier recommendations'],
    prep: 'Note the approximate date of your previous consultation.',
    forWhom: 'You have already had a paid consultation.',
    existingClientsOnly: true,
  },
];

export const offerBySlug = (slug: string): Offer => {
  const offer = OFFERS.find((o) => o.slug === slug);
  if (!offer) throw new Error(`Unknown offer: ${slug}`);
  return offer;
};

export const CONTACT = {
  name: 'Christopher Broomhead',
  tradingAs: 'Chris Broomhead Coaching',
  email: 'admin@chrisbroomheadcoaching.com',
  phoneDisplay: '+44 7521 052843',
  phoneHref: 'tel:+447521052843',
  location: 'United Kingdom',
};

export const SOCIALS = [
  {
    label: 'Instagram',
    handle: '@chris_broomhead_research',
    href: 'https://www.instagram.com/chris_broomhead_research/',
    icon: 'tabler:brand-instagram',
  },
];

// Public, insert-only endpoint. Row-level security on `leads` allows the anon
// role to INSERT and nothing else, so this key cannot read any lead.
export const LEADS_ENDPOINT = {
  url: 'https://pcmxjixolgqjpdnsjczd.supabase.co/rest/v1/leads',
  anonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjbXhqaXhvbGdxanBkbnNqY3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTMzNTgsImV4cCI6MjA5MDYyOTM1OH0.kvTCgkhxHX1W4fwCO_7Tm1tx0tFdcl4VHbmgP2F5mC8',
};

export const LEAD_MAGNET = {
  title: 'The Consultation Bloodwork Brief',
  file: '/downloads/consultation-bloodwork-brief.pdf',
  guideId: 'consultation-bloodwork-brief',
};
