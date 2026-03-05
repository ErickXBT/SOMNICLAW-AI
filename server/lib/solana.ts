import { Connection, PublicKey } from "@solana/web3.js";

const PRIMARY_RPC = process.env.SOLANA_RPC || "";
const FALLBACK_RPC = "https://api.mainnet-beta.solana.com";

let primaryConnection: Connection | null = null;
let fallbackConnection: Connection | null = null;

export function getConnection(): Connection {
  if (!primaryConnection && PRIMARY_RPC) {
    primaryConnection = new Connection(PRIMARY_RPC, "confirmed");
  }
  if (!fallbackConnection) {
    fallbackConnection = new Connection(FALLBACK_RPC, "confirmed");
  }
  return primaryConnection || fallbackConnection;
}

export async function getConnectionWithFallback(): Promise<Connection> {
  const conn = getConnection();
  try {
    await conn.getLatestBlockhash();
    return conn;
  } catch (err: any) {
    console.warn("[Solana] Primary RPC failed, switching to fallback:", err?.message);
    if (!fallbackConnection) {
      fallbackConnection = new Connection(FALLBACK_RPC, "confirmed");
    }
    return fallbackConnection;
  }
}

export const TREASURY_WALLET_ADDRESS = "6WiXumkgZMMYDVMqspZ7NDumiMTcz4AtnPLunafv1cCa";

export function getTreasuryWallet(): PublicKey {
  return new PublicKey(TREASURY_WALLET_ADDRESS);
}

export const DEPLOY_FEE_LAMPORTS = 20_000_000;
