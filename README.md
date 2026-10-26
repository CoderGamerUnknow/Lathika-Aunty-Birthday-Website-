# Happy Birthday, Lathika Aunty

A cinematic, interactive birthday tribute to **Lathika Aunty**, a Grade 10
mathematics teacher who cares for her students like her own children.

The experience opens with a mathematical build-up and a general birthday
greeting, then reveals a birthday dashboard with live Grade 10 mathematics
demonstrations, a tribute, and a personal birthday letter from the students.

## Highlights

- **Staged mathematics intro** — a GSAP-timed unit circle, sine wave, equations,
  and a 0–100% progress sequence lead into “Happy Birthday”.
- **Five interactive theorem labs**
  - Unit circle with live sine/cosine waves
  - Quadratic parabola with a travelling “wish” star and turning point
  - Coordinate-geometry heart constellation and midpoint chord
  - Tangent–radius circle theorem with a moving point of contact
  - Polygon interior-angle theorem that adds a side on every click
- **Celebratory math confetti** — canvas confetti made of π, θ, √, Δ, ∞ and
  geometric shapes, triggered by the theorem buttons.
- **GSAP scroll-triggered reveals** with Lenis smooth scrolling.
- **Respectful tribute** — three light-hearted mathematical “proofs” of the
  teacher’s kindness, patience, and belief in her students.
- **Birthday wish** — a personal letter and a geometric cake with animated
  candle flames.
- **Responsive and accessible** — works from 320px phones to wide desktops,
  supports keyboard focus, honours `prefers-reduced-motion`, and provides a skip
  control for the intro.

## Tech Stack

- React 18 + Vite
- GSAP + ScrollTrigger
- Lenis smooth scroll (`@studio-freight/lenis`)
- Framer Motion (custom cursor)
- SCSS modules and hand-built SVG artwork

No external images are required. Fonts are loaded from Google Fonts with local
serif/sans-serif fallbacks.

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Production Build

```bash
npm run build
npm run preview
```

The production files are written to `dist/`.

## Project Structure

```text
src/
  components/
    CelebrationCanvas.jsx     math-symbol confetti
    GeometricCake.jsx         SVG birthday cake
    Layout.jsx                loader gate, nav, footer, cursor
    MathCursor.jsx            gold orbit cursor
    NavBar.jsx                smooth-scroll section navigation
    Scroll.jsx                Lenis + ScrollTrigger container
    SiteBackground.jsx        graph-paper backdrop and formulas
    math/                     demo data, icons, stage and five live SVG scenes
  hooks/
    usePrefersReducedMotion.js
  pages/
    home/                     dashboard, tribute, birthday letter
    loader/                   GSAP math intro
  index.css                   design tokens and global styles
  main.jsx                    application entry point
```

## Note

This is a personal, student-made birthday tribute. All illustrations and
visualizations are generated in code, so the site has no third-party image
dependencies.
