import { Connection, PublicKey } from "@solana/web3.js";

const RPC_URL = process.env.SOLANA_RPC;

if (!RPC_URL) {
  console.error("[Solana] WARNING: SOLANA_RPC environment variable is not set. Using public RPC as fallback.");
}

const ACTIVE_RPC = RPC_URL || "https://api.mainnet-beta.solana.com";

console.log("[Solana] Using RPC:", ACTIVE_RPC.replace(/api-key=.*/, "api-key=***"));

export const connection = new Connection(ACTIVE_RPC, {
  commitment: "confirmed",
  disableRetryOnRateLimit: false,
});

export function getConnection(): Connection {
  return connection;
}

export async function getConnectionWithFallback(): Promise<Connection> {
  return connection;
}

export const TREASURY_WALLET_ADDRESS = "6WiXumkgZMMYDVMqspZ7NDumiMTcz4AtnPLunafv1cCa";

export function getTreasuryWallet(): PublicKey {
  return new PublicKey(TREASURY_WALLET_ADDRESS);
}

export const DEPLOY_FEE_LAMPORTS = 20_000_000;
