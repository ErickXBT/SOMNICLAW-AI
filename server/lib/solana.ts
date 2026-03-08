import dotenv from "dotenv";
dotenv.config();

import { Connection, PublicKey } from "@solana/web3.js";

const RPC_URL = process.env.SOLANA_RPC || "https://api.mainnet-beta.solana.com";

console.log("[Solana] Using RPC:", RPC_URL.replace(/api-key=.*/, "api-key=***"));

export const connection = new Connection(RPC_URL, {
  commitment: "confirmed",
  disableRetryOnRateLimit: false,
});

export function getConnection(): Connection {
  return connection;
}

export async function getConnectionWithFallback(): Promise<Connection> {
  return connection;
}

export const TREASURY_WALLET_ADDRESS = "kyfW9HxBCjh9Kd5zQHVEv4mpZN5CWg7yEBm7nf98Juk";

export function getTreasuryWallet(): PublicKey {
  return new PublicKey(TREASURY_WALLET_ADDRESS);
}

export const DEPLOY_FEE_LAMPORTS = 20_000_000;
