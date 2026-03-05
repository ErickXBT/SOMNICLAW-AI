# SOMNICLAW Website

A React-based landing page for the SOMNICLAW AI crypto project with a cinematic neon red theme (#070707 base, #FF1A1A/#8B0000 red accents), featuring a Generative AI interface powered by OpenAI's gpt-image-1 model, a SOMNICLAW AI assistant (gpt-4o-mini with streaming), and a Solana Launchpad with Phantom wallet integration and Helius RPC.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Backend**: Express v5 (TypeScript, run with tsx)
- **AI**: OpenAI gpt-image-1 via Replit AI Integrations
- **Blockchain**: Solana Web3.js, SPL Token (mainnet-beta), Helius RPC
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
  lib/
    solana.ts           # Solana connection (Helius primary, fallback to mainnet-beta)
    raydium.ts          # Raydium integration placeholder (pool/liquidity/LP lock)
    systemPrompt.ts     # Base system prompt for SOMNICLAW ASSISTANT
    modeHandler.ts      # 4 consultation modes
    riskDetector.ts     # Emergency keyword detection
    memoryStore.ts      # In-memory conversation store
index.html
vite.config.ts
```

## Architecture

### Backend (server/index.ts) — Single Server Architecture
- Express v5 on port 5000 (configurable via PORT env var)
- Serves Vite-built static files from `dist/` with SPA fallback
- `/api/generate-image` — POST endpoint for AI image generation (prompt + optional reference image)
- `/api/chat` — POST endpoint for SOMNICLAW AI assistant (gpt-4o-mini)
- `/api/create-token-transaction` — POST builds V0 VersionedTransaction for SPL token deploy (server-side)
- `/api/confirm-deploy` — POST saves token metadata JSON after frontend-confirmed on-chain deploy
- `/api/launch` — POST legacy mock token launch
- `/api/ai-score` — POST AI risk analysis (score, risk, whale interest, metrics, mint/freeze authority)
- `/api/health` — GET health check
- Rate limiting: 30 req/min per IP (deploy fee serves as spam protection)
- Global crash protection: uncaughtException + unhandledRejection handlers

### Solana Integration (server/lib/solana.ts)
- Primary RPC: Helius (via SOLANA_RPC env var)
- Fallback RPC: https://api.mainnet-beta.solana.com
- `getConnectionWithFallback()` tries primary, falls back on error
- Treasury wallet for deploy fees (0.02 SOL)
- Deploy fee: 20,000,000 lamports (0.02 SOL)

### Raydium Integration (server/lib/raydium.ts)
- Structural placeholder: `createPool()`, `addLiquidity()`, `lockLP()`
- Returns "coming soon" status — ready for Raydium SDK integration

### AI Chat System (server/lib/)
- `systemPrompt.ts` — Base system prompt for SOMNICLAW ASSISTANT (sleep/health guidance)
- `modeHandler.ts` — 4 consultation modes: clinical (0.3), calm (0.5), data (0.4), friendly (0.7)
- `riskDetector.ts` — Emergency keyword detection with safety response
- `memoryStore.ts` — In-memory conversation store per sessionId

### Frontend

### Launchpad (/launchpad)
- Backend-built V0 VersionedTransaction via `/api/create-token-transaction`
- Deploy flow: backend builds V0 tx → frontend simulates → Phantom signs → send raw tx → confirm on-chain → backend metadata
- Deploy progress tracker with step-by-step status (preparing/signing/confirming/success/failed)
- VersionedTransaction (V0 message format) for proper Phantom simulation — no "malicious dApp" warning
- SOMNI-prefixed CA formatting: `SOMNI-{first6}...{last4}`
- Deploy fee: 0.02 SOL
- Enhanced AI analysis: mint authority, freeze authority, supply distribution, liquidity ratio
- Phantom wallet connect/disconnect with mobile deep linking
- SOL balance display, Send SOL modal
- Recent launches sidebar with formatted CAs
- Toast notification system

## Routing

- Uses `react-router` (v7) with `BrowserRouter`
- Routes configured in `src/main.tsx`
- `/` — Homepage (App component)
- `/assistant` — Somniclaw Assistant page
- `/launchpad` — Somniclaw Launchpad page (Solana token deployment)
- `/generative-ai` — Somniclaw Generative AI page

## Environment Variables

- `AI_INTEGRATIONS_OPENAI_API_KEY` — OpenAI API key (auto-configured via Replit integration)
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — OpenAI base URL (auto-configured)
- `SOLANA_RPC` — Helius RPC URL for Solana mainnet access

## Development

- `npm run dev` — builds frontend then starts Express (single server on port 5000)
- `npm run build` — builds frontend to `dist/`
- `npm run start` — production mode

## Deployment

- Target: Autoscale
- Build: `npm run build`
- Run: `npm run start` (Express serves both API and static frontend)

## Notes

- Three.js `ParticleBackground` gracefully handles environments without WebGL support
- Express v5 uses `/{*path}` syntax for catch-all routes
- gpt-image-1 always returns b64_json format
- Phantom wallet detection uses `window.solana?.isPhantom`; redirects to phantom.app on mobile
- Token deploy builds transaction server-side, sends to client for Phantom signing
- Token metadata saved to `dist/token-metadata/{mintAddress}.json`
