# SOMNICLAW Website

A React-based landing page for the SOMNICLAW AI crypto project with a cyberpunk neon theme, featuring a Generative AI interface powered by OpenAI's gpt-image-1 model.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Backend**: Express v5 (TypeScript, run with tsx)
- **AI**: OpenAI gpt-image-1 via Replit AI Integrations
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
      GenerativeAiPage.tsx # /generative-ai (full AI image generation UI)
  styles/               # CSS files (Tailwind, theme, fonts, custom)
  main.tsx              # Entry point with React Router setup
server/
  index.ts              # Express backend (API + static file serving in prod)
index.html
vite.config.ts
```

## Architecture

### Backend (server/index.ts)
- Express v5 on port 3001 (dev) or 5000 (prod)
- `/api/generate-image` — POST endpoint for AI image generation (prompt + optional reference image)
- `/api/health` — GET health check
- In production, serves Vite-built static files from `dist/` with SPA fallback

### Frontend
- Vite dev server on port 5000 with proxy forwarding `/api/*` to backend on port 3001
- React Router v7 (`react-router` package, NOT `react-router-dom`)

## Routing

- Uses `react-router` (v7) with `BrowserRouter`
- Routes configured in `src/main.tsx`
- `/` — Homepage (App component)
- `/assistant` — Somniclaw Assistant page
- `/launchpad` — Somniclaw Launchpad page
- `/generative-ai` — Somniclaw Generative AI page

## Development

- `npm run dev` — starts Vite dev server + Express backend concurrently
- `npm run build` — builds frontend to `dist/`
- `npm run start` — production mode (Express serves API + static files)

## Deployment

- Target: Autoscale
- Build: `npm run build`
- Run: `npm run start` (Express serves both API and static frontend on port 5000)

## Replit Configuration

- Workflow: "Start application" → `npm run dev`
- Vite: `allowedHosts: true`, `host: '0.0.0.0'` for Replit proxy compatibility
- AI Integration: `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL` env vars auto-configured

## Notes

- Three.js `ParticleBackground` component gracefully handles environments without WebGL support
- Express v5 uses `/{*path}` syntax for catch-all routes (not `*`)
- gpt-image-1 always returns b64_json format (no response_format parameter needed)
