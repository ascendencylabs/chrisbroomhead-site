import { getPermalink } from './utils/permalinks';
import { CONTACT, SOCIALS } from './data/site';

export const headerData = {
  links: [
    { text: 'Work with me', href: getPermalink('/work-with-me') },
    { text: 'Free guide', href: getPermalink('/free-guide') },
    { text: 'Community', href: getPermalink('/community') },
    { text: 'About', href: getPermalink('/about') },
    { text: 'Contact', href: getPermalink('/contact') },
  ],
  actions: [{ text: 'Book a consultation', href: getPermalink('/book') }],
};

export const footerData = {
  links: [
    {
      title: 'Work with me',
      links: [
        { text: 'Consultations and prices', href: getPermalink('/work-with-me') },
        { text: 'Book a consultation', href: getPermalink('/book') },
        { text: 'Free suitability call', href: getPermalink('/book#suitability') },
      ],
    },
    {
      title: 'Free',
      links: [
        { text: 'Consultation Bloodwork Brief', href: getPermalink('/free-guide') },
        { text: 'Community waitlist', href: getPermalink('/community') },
      ],
    },
    {
      title: 'Chris',
      links: [
        { text: 'About', href: getPermalink('/about') },
        { text: 'Contact', href: getPermalink('/contact') },
        { text: CONTACT.email, href: `mailto:${CONTACT.email}` },
        { text: CONTACT.phoneDisplay, href: CONTACT.phoneHref },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy', href: getPermalink('/privacy') },
  ],
  socialLinks: SOCIALS.map((s) => ({ ariaLabel: `${s.label} ${s.handle}`, icon: s.icon, href: s.href })),
  footNote: `© ${new Date().getFullYear()} ${CONTACT.name}, trading as ${CONTACT.tradingAs}. Educational and evidence-informed. Not medical advice.`,
};
