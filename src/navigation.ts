import { getPermalink } from './utils/permalinks';
import { CONTACT, SOCIALS } from './data/site';
import { STREAMS } from './config/streams';

export interface NavLink {
  text: string;
  href: string;
}

// Header: launched streams flagged `inHeader`, plus About. Hidden streams never
// appear here; flipping `launched` in src/config/streams.ts adds them.
const launched = STREAMS.filter((s) => s.launched);

export const headerLinks: NavLink[] = [
  ...launched
    .filter((s) => s.inHeader && s.id !== 'written-protocol')
    .map((s) => ({ text: s.label, href: getPermalink(s.path) })),
  { text: 'About', href: getPermalink('/about') },
];

export const menuLinks: NavLink[] = [
  { text: 'Home', href: getPermalink('/') },
  ...launched.map((s) => ({ text: s.label, href: getPermalink(s.path) })),
  { text: 'About', href: getPermalink('/about') },
  { text: 'Book a consultation', href: getPermalink('/book') },
  { text: 'Contact', href: getPermalink('/contact') },
];

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: 'Work with me',
    links: [
      { text: 'Consultations and prices', href: getPermalink('/work-with-me') },
      { text: 'Book a consultation', href: getPermalink('/book') },
      { text: 'Free suitability call', href: getPermalink('/book#suitability') },
      ...launched
        .filter((s) => !['consultations', 'free-guides', 'newsletter'].includes(s.id))
        .map((s) => ({ text: s.label, href: getPermalink(s.path) })),
    ],
  },
  {
    title: 'Free',
    links: launched
      .filter((s) => ['free-guides', 'newsletter'].includes(s.id))
      .map((s) => ({ text: s.label, href: getPermalink(s.path) })),
  },
  {
    title: 'Chris',
    links: [
      { text: 'About', href: getPermalink('/about') },
      { text: 'Contact', href: getPermalink('/contact') },
      { text: 'Links', href: getPermalink('/links') },
      { text: CONTACT.email, href: `mailto:${CONTACT.email}` },
      { text: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { text: 'Terms', href: getPermalink('/terms') },
  { text: 'Privacy', href: getPermalink('/privacy') },
];

export const socialLinks = SOCIALS;
