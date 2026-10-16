# Third-party credits

This site combines code from three MIT-licensed Astro templates:

- **AstroWind** (arthelokyo/astrowind) — project scaffold, Tailwind design system, layout, header/footer, FAQ, steps and call-to-action widgets, SEO metadata. Licence: LICENSE.md.
- **AstroPaper** (satnaing/astro-paper) — focus-visible outline and :target scroll-margin accessibility rules (src/assets/styles/tailwind.css).
- **Astro Theme Cactus** (chrismwilliams/astro-theme-cactus) — skip-to-content link pattern (src/layouts/Layout.astro).

## Design and motion (October 2026 redesign)

Libraries installed from npm (bundled, self-hosted):

| Package                                                                                 | Used for                                                                     | Licence                                                                                                        |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [lenis](https://github.com/darkroomengineering/lenis) 1.3.27 (darkroom.engineering)     | Weighted smooth scrolling (`src/scripts/motion.ts`)                          | MIT                                                                                                            |
| [gsap](https://gsap.com) 3.15.0 incl. ScrollTrigger and SplitText (GreenSock / Webflow) | Pinned "how it works" stage, scroll-lit words, parallax, masked line reveals | GSAP Standard "no charge" licence — <https://gsap.com/standard-license> (free for commercial sites since 3.13) |
| Bricolage Grotesque (Mathieu Triay) via Fontsource                                      | Display and body type                                                        | SIL Open Font License 1.1                                                                                      |
| JetBrains Mono (JetBrains) via Fontsource                                               | Labels, data, metadata                                                       | SIL Open Font License 1.1                                                                                      |

Techniques re-implemented from scratch (no code copied), with the source of the idea:

- **WebGL hero field** (`src/scripts/field.ts`): a hand-written WebGL point-sprite shader of an alpha helix (3.6 residues per turn, 1.5 Å rise, i→i+4 hydrogen bonds) with a cursor-reactive particle haze. Approach informed by the three.js points examples ([mrdoob/three.js](https://github.com/mrdoob/three.js), MIT); no three.js code is used.
- **Cursor spotlight panels** and **marquee** (`src/assets/styles/cb.css`): the "magic card" spotlight and marquee ideas from [Magic UI](https://github.com/magicuidesign/magicui) (MIT), rebuilt in plain CSS custom properties.
- **Magnetic buttons, masked line reveals, scroll-velocity marquee, pinned scrollytelling, cross-document View Transitions**: standard Awwwards-calibre patterns (Locomotive / Studio Freight / darkroom.engineering lineage), written for this site in `src/scripts/motion.ts` and `cb.css`.
- **Specimen plates, § numbered sections, ledger tables**: original art direction ("dark scientific editorial").

Photography: all photographs are of Chris Broomhead, from his own shoot (originals in `~/Desktop/Photos for content/`). No stock images.

## AstroPaper licence

```
MIT License

Copyright (c) 2023 Sat Naing

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Astro Theme Cactus licence

```
MIT License

Copyright (c) 2022 Chris Williams

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
