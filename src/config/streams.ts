// Every way the site earns, in one place.
//
// To put a stream live: set `launched: true`. That single change adds it to the
// header/footer navigation, lets search engines index it (no `noindex`), and puts
// it in the sitemap. Leave it `false` and the page still builds and works at its
// URL, so it can collect waitlist demand from day one.
//
// `leadSource` is written to `leads.source` in Supabase for every form on that
// stream's page, so demand can be counted per stream.
//
// This file is imported by astro.config.ts (sitemap filter), so it must not
// import Astro virtual modules.

export type StreamId =
  | 'consultations'
  | 'written-protocol'
  | 'free-guides'
  | 'newsletter'
  | 'shop'
  | 'newsletter-members'
  | 'community'
  | 'programme'
  | 'practitioners'
  | 'membership'
  | 'bloodwork'
  | 'media'
  | 'story';

export interface Stream {
  id: StreamId;
  /** Page path without the base path, e.g. "/shop". */
  path: string;
  /** Label used in navigation. */
  label: string;
  /** One line used in the footer index and the internal streams page. */
  summary: string;
  launched: boolean;
  /** Show in the header when launched (the footer lists every launched stream). */
  inHeader?: boolean;
  /** Supabase `leads.source` tag for forms on this page. */
  leadSource: string;
  /** What Chris must supply or decide before switching `launched` to true. */
  needsToLaunch: string[];
}

export const STREAMS: Stream[] = [
  {
    id: 'consultations',
    path: '/work-with-me',
    label: 'Consultations',
    summary: 'Free suitability call and paid Zoom sessions from £50.',
    launched: true,
    inHeader: true,
    leadSource: 'stream:consultations',
    needsToLaunch: [],
  },
  {
    id: 'written-protocol',
    path: '/written-protocol',
    label: 'The written protocol',
    summary: 'What you receive in writing after every paid session.',
    launched: true,
    inHeader: true,
    leadSource: 'stream:written-protocol',
    needsToLaunch: [],
  },
  {
    id: 'free-guides',
    path: '/free-guide',
    label: 'Free guide',
    summary: 'The Consultation Bloodwork Brief, free PDF.',
    launched: true,
    inHeader: true,
    leadSource: 'stream:free-guides',
    needsToLaunch: [],
  },
  {
    id: 'newsletter',
    path: '/newsletter',
    label: "The Operator's Lab",
    summary: 'Free email newsletter: one mechanism, explained properly, per issue.',
    launched: true,
    inHeader: true,
    leadSource: 'stream:newsletter',
    needsToLaunch: [],
  },
  {
    id: 'shop',
    path: '/shop',
    label: 'Guides',
    summary: 'Paid, education-only digital guides.',
    launched: false,
    leadSource: 'stream:shop',
    needsToLaunch: [
      'A price for each guide (src/config/products.ts → price).',
      'A Stripe Payment Link per guide from the CB Coaching Stripe account (→ paymentLink).',
      'Compliance edit of each PDF before sale (see products.ts → reviewNote).',
    ],
  },
  {
    id: 'newsletter-members',
    path: '/newsletter/members',
    label: "Operator's Lab Members",
    summary: 'Paid tier of the newsletter: monthly long-form briefings.',
    launched: false,
    leadSource: 'stream:newsletter-members',
    needsToLaunch: [
      'Choose the platform (Substack, Kit or Ghost) and create the paid tier.',
      'Monthly and annual price.',
      'At least four free issues published first (per the launch plan).',
    ],
  },
  {
    id: 'community',
    path: '/community',
    label: 'Community',
    summary: 'Private community for people running their own protocols.',
    launched: false,
    leadSource: 'stream:community',
    needsToLaunch: [
      'Create the Skool group and paste its invite URL into src/config/streams.ts (communityUrl).',
      'Monthly price, or free.',
      'House rules and moderation plan.',
    ],
  },
  {
    id: 'programme',
    path: '/programme',
    label: 'Programme',
    summary: 'A structured, education-only peptide fundamentals programme.',
    launched: false,
    leadSource: 'stream:programme',
    needsToLaunch: [
      'Approve the curriculum outline on the page.',
      'Record the lessons, choose the course platform, set the price.',
    ],
  },
  {
    id: 'practitioners',
    path: '/practitioners',
    label: 'Clinics & speaking',
    summary: 'Training for clinics, PTs and practitioners, and speaking enquiries.',
    launched: false,
    leadSource: 'stream:practitioners',
    needsToLaunch: ['Confirm which formats you will accept and a day rate or "on enquiry".'],
  },
  {
    id: 'membership',
    path: '/membership',
    label: 'Protocol review',
    summary: 'Small, high-touch monthly protocol review for existing clients.',
    launched: false,
    leadSource: 'stream:membership',
    needsToLaunch: [
      'Monthly price and the number of places.',
      'Confirm what a month includes (the page lists check-in, data review, written update, questions between calls).',
      'A Calendly event or Stripe subscription link for sign-up.',
    ],
  },
  {
    id: 'bloodwork',
    path: '/bloodwork',
    label: 'Bloodwork',
    summary: 'Why bloodwork comes first, and where to get it done in the UK.',
    launched: false,
    leadSource: 'stream:bloodwork',
    needsToLaunch: [
      'Open affiliate accounts with UK test providers and add each link in src/config/partners.ts.',
      'Confirm the partner list is one you are happy to recommend.',
    ],
  },
  {
    id: 'media',
    path: '/media',
    label: 'Media',
    summary: 'Video, podcast and interviews.',
    launched: false,
    leadSource: 'stream:media',
    needsToLaunch: [
      'Verify ownership of each channel (youtube.com/@ChrisBroomhead is unverified) and add it in src/config/partners.ts → MEDIA_CHANNELS.',
      'At least one published episode or video to show.',
    ],
  },
  {
    id: 'story',
    path: '/story',
    label: 'Story',
    summary: 'The crash, the recovery, and what came after.',
    launched: false,
    leadSource: 'stream:story',
    needsToLaunch: ['Read the draft and approve or correct every line. It uses only facts from your own notes.'],
  },
];

/** The Skool invite link. Leave empty until the group exists. */
export const communityUrl = '';

export const streamById = (id: StreamId): Stream => {
  const s = STREAMS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown stream: ${id}`);
  return s;
};

/** Paths (and everything under them) that must stay out of the sitemap. */
export const HIDDEN_PATHS: string[] = STREAMS.filter((s) => !s.launched).map((s) => s.path);

/** Internal-only pages that are never listed anywhere. */
export const INTERNAL_PATHS: string[] = ['/streams'];

/** Normalise a pathname: drop `.html`, a trailing `/index` and trailing slashes. */
export const cleanPath = (p: string): string =>
  p
    .replace(/\.html$/, '')
    .replace(/\/index$/, '')
    .replace(/\/+$/, '') || '/';

const norm = cleanPath;

/** True when `pathname` (with or without base path) belongs to a hidden stream. */
export const isHiddenPath = (pathname: string): boolean => {
  const p = norm(pathname);
  return [...HIDDEN_PATHS, ...INTERNAL_PATHS].some((h) => p === h || p.endsWith(h) || p.includes(`${h}/`));
};
