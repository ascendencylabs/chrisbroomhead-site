# chrisbroomhead-site

Personal-brand website for Chris Broomhead: consultations, booking, free guide, community waitlist.

- Stack: Astro 7 + Tailwind 4, static output. Based on AstroWind (see CREDITS.md).
- Offers, prices, contact and socials live in `src/data/site.ts`. Prices must match the live Calendly event types.
- Forms insert into the Supabase `leads` table (insert-only anon key, RLS enforced).
- Lead magnet source: `lead-magnet/consultation-bloodwork-brief.html` → printed to `public/downloads/` with headless Chrome.

```bash
npm install
npm run dev
npm run build            # production (site + base from src/config.yaml)
SITE_URL=https://ascendencylabs.github.io BASE_PATH=/chrisbroomhead-site npm run build   # GitHub Pages preview
```

Deploys to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`.
