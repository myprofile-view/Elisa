# ELISA — Cinematic Fashion Portfolio

A premium editorial-style static portfolio built for GitHub Pages using HTML, CSS and JavaScript.

## What is included
- Cinematic hero with image poster fallback, light beam, floating petals, grain and responsive navigation
- Video-ready hero and showreel modal
- Editorial manifesto, collection showcase, process timeline and contact CTA
- Scroll reveal animations, active navigation, responsive mobile layout, reduced-motion support
- AI-generated model poster in `assets/elisa-model-poster.jpg`

## Add real model movement (important)
The website is ready to play a real clip, but the MP4 is not included yet. To make Elisa's model move naturally:
1. Create or obtain a short fashion-film video you have the right to use (recommended 6–12 seconds, 16:9 or 9:16 crop, silent, MP4/H.264).
2. Name it exactly `elisa-couture-film.mp4`.
3. Upload it to this repository's `assets/` folder beside `elisa-model-poster.jpg`.
4. The hero will attempt to autoplay it muted and loop it. The “Watch the Film” button opens the same clip in a modal.
5. Keep the poster image for a graceful fallback on slow connections or when autoplay is blocked.

CSS motion is only atmospheric motion; it cannot make a still model truly breathe, turn her head, or move fabric. That requires an actual video clip.

## Publish on GitHub Pages
1. Create a GitHub repository, e.g. `elisa-fashion-portfolio`.
2. Upload `index.html`, `style.css`, `script.js`, and the `assets/` folder to the repository root.
3. Open **Settings → Pages**.
4. Under Build and deployment choose **Deploy from a branch**, branch `main`, folder `/(root)`, then Save.
5. Wait for GitHub Pages to show the public URL.

## Personalize before publishing
- Change `elisa@example.com` in `index.html` to Elisa's real contact email.
- Add real social links if desired.
- The collection tiles are CSS-designed art cards, not photographs of finished garments. Replace or enhance them with Elisa's own designs and licensed photos before presenting the portfolio as actual client work.
- Google Fonts needs an internet connection. A local system fallback is provided.

## Performance notes
For production, compress the video to a small H.264 MP4 (aim for 5–12 MB or less if possible), provide a poster, keep the clip muted for autoplay, and test on a phone using mobile data.
