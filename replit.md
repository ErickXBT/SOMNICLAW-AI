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
    App.tsx              # Root component (homepage)
    components/          # Page sections and UI
      ui/                # Low-level reusable components (shadcn-style)
      figma/             # Figma-specific components
      OurProduct.tsx     # Product cards section with links to sub-pages
      Hero.tsx, Roadmap.tsx, TokenDistribution.tsx, etc.
    pages/               # Route pages
      AssistantPage.tsx   # /assistant
      LaunchpadPage.tsx   # /launchpad
      GenerativeAiPage.tsx # /generative-ai
  styles/               # CSS files (Tailwind, theme, fonts, custom)
  main.tsx              # Entry point with React Router setup
index.html
vite.config.ts
```

## Routing

- Uses `react-router` (v7) with `BrowserRouter`
- Routes configured in `src/main.tsx`
- `/` — Homepage (App component)
- `/assistant` — Somniclaw Assistant page
- `/launchpad` — Somniclaw Launchpad page
- `/generative-ai` — Somniclaw Generative AI page

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
