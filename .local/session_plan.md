# Objective
Upgrade the SOMNICLAW AI Launchpad into a fully functional Solana token launch system (pump.fun-style). Add Helius RPC connection with fallback, backend deploy API with wallet signing, token metadata generation, SOMNI-prefixed CA formatting, deploy fee (0.1 SOL), per-wallet rate limiting (1/hour), transaction status tracking UI, enhanced AI token analysis, and Raydium liquidity module (structural). All on Solana mainnet.

# Tasks

### T001: Create server-side Solana connection module + Raydium placeholder + deploy API endpoints
- **Blocked By**: []
- **Details**:
  - Create `server/lib/solana.ts`:
    - Import `Connection` from `@solana/web3.js`
    - Primary RPC from `process.env.SOLANA_RPC` (Helius)
    - Fallback RPC: `https://api.mainnet-beta.solana.com`
    - Export `getConnection()` function that returns Connection using primary RPC, with error handling to fall back
    - Export `TREASURY_WALLET` constant public key string (use a placeholder Solana address)
    - Export `DEPLOY_FEE_LAMPORTS` = 0.1 SOL in lamports
  - Create `server/lib/raydium.ts`:
    - Structural module with exported async functions: `createPool()`, `addLiquidity()`, `lockLP()`
    - Each function logs a message and returns `{ success: false, message: 'Raydium integration coming soon' }`
  - Update `server/index.ts`:
    - Import from `server/lib/solana.ts`
    - Add wallet-based rate limiting store (walletDeployStore Map, 1 deploy per wallet per hour)
    - Add `POST /api/deploy-token` endpoint:
      1. Accepts `{ walletAddress, name, symbol, description, website?, twitter?, telegram?, logo? }`
      2. Validates required fields + wallet address format
      3. Checks wallet deploy rate limit (1/hour)
      4. Uses `getConnection()` to build SPL token transaction:
         - Generate mint Keypair
         - SystemProgram.createAccount for mint
         - createInitializeMintInstruction (9 decimals)
         - createAssociatedTokenAccountInstruction
         - createMintToInstruction (1B supply)
         - SystemProgram.transfer for 0.1 SOL deploy fee to TREASURY_WALLET
      5. Partial sign with mint keypair
      6. Serialize transaction as base64
      7. Return `{ success: true, transaction: base64, mintAddress: string }`
      8. Wrap in try/catch with RPC fallback retry
    - Add `POST /api/confirm-deploy` endpoint:
      1. Accepts `{ signature, mintAddress, name, symbol, description, website?, twitter?, telegram?, logo? }`
      2. Confirms transaction on-chain
      3. Saves token metadata JSON to `dist/token-metadata/{mintAddress}.json` (create dir if needed)
      4. Returns `{ success: true, signature, mintAddress, metadataUrl, explorerUrl }`
    - Update `/api/ai-score` to include mint authority, freeze authority, supply distribution, liquidity ratio fields
  - Files: `server/lib/solana.ts`, `server/lib/raydium.ts`, `server/index.ts`
  - Acceptance: Server starts, new endpoints respond, no crashes

### T002: Update LaunchpadPage frontend with new deploy flow, transaction status UI, CA formatting
- **Blocked By**: [T001]
- **Details**:
  - Update `src/app/pages/LaunchpadPage.tsx`:
    - Remove client-side `Connection` import and `connection` constant (use backend API instead)
    - Remove direct `@solana/web3.js` and `@solana/spl-token` imports for token creation (keep PublicKey, Transaction, LAMPORTS_PER_SOL for wallet/send)
    - Add `formatCA(address)` function: returns `SOMNI-${address.slice(0,6)}...${address.slice(-4)}`
    - Add deploy status state: `type DeployStatus = 'idle' | 'preparing' | 'signing' | 'confirming' | 'success' | 'failed'`
    - Add `DeployProgress` component that shows step-by-step progress:
      - Step 1: Preparing transaction (preparing)
      - Step 2: Wallet signing (signing)
      - Step 3: Confirming on-chain (confirming)
      - Step 4: Complete (success)
      - Shows spinner for active step, check for completed, x for failed
    - Update `handleDeploy`:
      1. Set status to 'preparing', POST to `/api/deploy-token`
      2. Receive `{ transaction, mintAddress }` 
      3. Set status to 'signing', deserialize transaction, sign with Phantom
      4. Send signed transaction, set status to 'confirming'
      5. POST to `/api/confirm-deploy` with signature + token details
      6. Set status to 'success', show success modal
      7. On error set status to 'failed'
    - Show deploy fee in the info box: "Deploy Fee: 0.1 SOL"
    - Use `formatCA()` in recent launches list and success modal
    - Update success modal: show formatted CA, tx signature link, metadata URL
    - Update AI analysis display to show new fields
    - Keep the existing RPC-based connection for balance fetching and Send SOL (those stay client-side)
    - Keep all existing styling
  - Files: `src/app/pages/LaunchpadPage.tsx`
  - Acceptance: Full deploy flow works, status tracking displays, CA formatting shows
