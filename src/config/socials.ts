// Every social profile, in one place. The site renders an entry only when
// `verified` (ownership confirmed by Chris) AND `showOnSite` are both true.
// Switch one on or off here; footer, contact, links page, home and about update.
//
// Facts as of 16 Oct 2026 (from Chris):
// - Instagram: his, story-only account. Shown; no peptide copy next to it.
// - Substack: profile exists, no publication yet. Shown.
// - YouTube @ChrisBroomhead: confirmed his. Shown.
// - TikTok: his active account is @steroid.school.c. Kept OFF the consultation
//   site on purpose (steroid-named account vs clinical positioning / UK rules).
// - LinkedIn and X: his, but handles not confirmed yet. Hidden.

export interface Social {
  id: 'instagram' | 'substack' | 'youtube' | 'tiktok' | 'linkedin' | 'x';
  label: string;
  handle: string;
  url: string;
  icon: string;
  verified: boolean;
  showOnSite: boolean;
}

export const SOCIAL_PROFILES: Social[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@chris_broomhead_research',
    url: 'https://www.instagram.com/chris_broomhead_research/',
    icon: 'tabler:brand-instagram',
    verified: true,
    showOnSite: true,
  },
  {
    id: 'substack',
    label: 'Substack',
    handle: '@chrisbroomhead',
    url: 'https://substack.com/@chrisbroomhead',
    icon: 'tabler:news',
    verified: true,
    showOnSite: true,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    handle: '@ChrisBroomhead',
    url: 'https://www.youtube.com/@ChrisBroomhead',
    icon: 'tabler:brand-youtube',
    verified: true,
    showOnSite: true,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    handle: '@steroid.school.c',
    url: 'https://www.tiktok.com/@steroid.school.c',
    icon: 'tabler:brand-tiktok',
    verified: true,
    showOnSite: false,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'chrisbroomhead',
    url: 'https://www.linkedin.com/in/chrisbroomhead',
    icon: 'tabler:brand-linkedin',
    verified: false,
    showOnSite: true,
  },
  {
    id: 'x',
    label: 'X',
    handle: '',
    url: '',
    icon: 'tabler:brand-x',
    verified: false,
    showOnSite: true,
  },
];

/** Profiles that may appear on the site. */
export const VISIBLE_SOCIALS: Social[] = SOCIAL_PROFILES.filter((s) => s.verified && s.showOnSite && s.url);

export const socialById = (id: Social['id']): Social | undefined => SOCIAL_PROFILES.find((s) => s.id === id);
