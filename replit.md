# SOMNICLAW Website

A React-based landing page for the SOMNICLAW AI crypto project with a minimal cinematic AI theme (#0B0B0F near-black base, #8B0000 deep red accents, subtle ambient particles), featuring a Generative AI interface powered by OpenAI's gpt-image-1 model, a SOMNICLAW AI health assistant (gpt-4o-mini with streaming), and a Solana Launchpad with Phantom wallet integration.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Backend**: Express v5 (TypeScript, run with tsx)
- **AI**: OpenAI gpt-image-1 via Replit AI Integrations
- **Blockchain**: Solana Web3.js, SPL Token (mainnet-beta)
- **Wallet**: Phantom wallet integration via window.solana
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/vite`), Radix UI primitives
- **Animations**: Motion (Framer Motion), Three.js particle background
- **Charts**: Recharts (token distribution)
- **Icons**: Lucide React, MUI Icons
- **Font**: Poppins Bold (Google Fonts) for headlines
- **Polyfills**: vite-plugin-node-polyfills (Buffer, crypto for Solana libs)

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
      LaunchpadPage.tsx   # /launchpad (Solana token launchpad with Phantom wallet)
      GenerativeAiPage.tsx # /generative-ai (full AI image generation UI)
      WhitelistPage.tsx   # /whitelist (Web3 whitelist gate with X/wallet verification)
  styles/               # CSS files (Tailwind, theme, fonts, custom)
  main.tsx              # Entry point with React Router setup
server/
  index.ts              # Express backend (API + static file serving in prod)
index.html
vite.config.ts
```

## Architecture

### Backend (server/index.ts) — Single Server Architecture
- Express v5 on port 3000 (configurable via PORT env var)
- Serves Vite-built static files from `dist/` with SPA fallback
- `/api/generate-image` — POST endpoint for AI image generation (prompt + optional reference image)
- `/api/chat` — POST endpoint for SOMNICLAW AI health assistant (gpt-4o-mini)
- `/api/launch` — POST mock token launch (validates name/symbol/description, returns contract address)
- `/api/ai-score` — POST AI risk analysis (returns score, risk level, whale interest, metrics)
- `/api/health` — GET health check ("SOMNICLAW AI ONLINE")
- Rate limiting: 30 req/min per IP on launch/score endpoints
- Global crash protection: uncaughtException + unhandledRejection handlers

### AI Chat System (server/lib/)
- `systemPrompt.ts` — Base system prompt for SOMNICLAW ASSISTANT (sleep/health guidance)
- `modeHandler.ts` — 4 consultation modes: clinical (0.3), calm (0.5), data (0.4), friendly (0.7)
- `riskDetector.ts` — Emergency keyword detection (chest pain, suicide, etc.) with immediate safety response
- `memoryStore.ts` — In-memory conversation store per sessionId with TTL cleanup and message limits

### Frontend
- Vite builds static assets to `dist/`, Express serves them
- React Router v7 (`react-router` package, NOT `react-router-dom`)

### Launchpad (/launchpad)
- Phantom wallet connect/disconnect with auto-reconnect
- SOL balance display
- Token creation form (name, ticker, description, logo, socials)
- SPL Token mint on Solana mainnet-beta (1B supply, 9 decimals)
- Success modal with Solscan/Dexscreener links
- Send SOL modal
- Recent launches sidebar
- Toast notification system

## Routing

- Uses `react-router` (v7) with `BrowserRouter`
- Routes configured in `src/main.tsx`
- `/` — Homepage (App component)
- `/assistant` — Somniclaw Assistant page
- `/launchpad` — Somniclaw Launchpad page (Solana token deployment)
- `/generative-ai` — Somniclaw Generative AI page

## Development

- `npm run dev` — builds frontend then starts Express (single server on port 5000)
- `npm run build` — builds frontend to `dist/`
- `npm run start` — production mode (same as dev but with NODE_ENV=production)

## Deployment

- Target: Autoscale
- Build: `npm run build`
- Run: `npm run start` (Express serves both API and static frontend)

## Replit Configuration

- Workflow: "Start application" → `npm run dev`
- Vite: `allowedHosts: true`, `host: '0.0.0.0'` for Replit proxy compatibility
- AI Integration: `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL` env vars auto-configured
- Node polyfills: `vite-plugin-node-polyfills` provides Buffer/crypto for Solana browser libs

## Notes

- Three.js `ParticleBackground` component gracefully handles environments without WebGL support
- Express v5 uses `/{*path}` syntax for catch-all routes (not `*`)
- gpt-image-1 always returns b64_json format (no response_format parameter needed)
- Phantom wallet detection uses `window.solana?.isPhantom`; redirects to phantom.app if not installed
