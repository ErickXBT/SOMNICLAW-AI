# SOMNICLAW Website

A React-based landing page for the SOMNICLAW project, built from a Figma design.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/vite`), Radix UI primitives
- **Animations**: Motion (Framer Motion), Three.js particle background
- **Charts**: Recharts (token distribution)
- **Icons**: Lucide React, MUI Icons

## Project Structure

```
src/
  app/
    App.tsx              # Root component
    components/          # Page sections and UI
      ui/                # Low-level reusable components (shadcn-style)
      figma/             # Figma-specific components
      Hero.tsx, Roadmap.tsx, TokenDistribution.tsx, etc.
  styles/               # CSS files (Tailwind, theme, fonts, custom)
  main.tsx              # Entry point
index.html
vite.config.ts
```

## Development

- Runs on port 5000 (bound to 0.0.0.0 for Replit proxy)
- `npm run dev` — starts the Vite dev server
- `npm run build` — builds to `dist/`

## Replit Configuration

- Workflow: "Start application" → `npm run dev` on port 5000
- Deployment: Static site, build with `npm run build`, serve from `dist/`
- `vite.config.ts` has `allowedHosts: true` and `host: '0.0.0.0'` for Replit proxy compatibility

## Notes

- Three.js `ParticleBackground` component gracefully handles environments without WebGL support
