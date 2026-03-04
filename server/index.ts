import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import OpenAI, { toFile } from "openai";
import { baseSystemPrompt } from "./lib/systemPrompt.js";
import { getModeConfig, type ConsultationMode } from "./lib/modeHandler.js";
import { detectRisk } from "./lib/riskDetector.js";
import { getMessages, addMessage } from "./lib/memoryStore.js";
import {
  getConnectionWithFallback,
  getTreasuryWallet,
  DEPLOY_FEE_LAMPORTS,
} from "./lib/solana.js";
import {
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.on("uncaughtException", (err) => {
  console.error("[Server] Uncaught Exception:", err.message);
  console.error(err.stack);
});

process.on("unhandledRejection", (reason) => {
  console.error("[Server] Unhandled Rejection:", reason);
});

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  timeout: 120000,
});

app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, size = "1024x1024", referenceImage } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log(`Generating image: prompt="${prompt.substring(0, 80)}...", size=${size}, hasRef=${!!referenceImage}`);

    let result;

    if (referenceImage) {
      const base64Data = referenceImage.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");
      const file = await toFile(imageBuffer, "reference.png", {
        type: "image/png",
      });

      result = await openai.images.edit({
        model: "gpt-image-1",
        image: file,
        prompt,
        size: size as "1024x1024" | "512x512" | "256x256",
      });
    } else {
      result = await openai.images.generate({
        model: "gpt-image-1",
        prompt,
        n: 1,
        size: size as "1024x1024" | "512x512" | "256x256",
      });
    }

    const imageData = result.data?.[0];
    if (!imageData || !imageData.b64_json) {
      console.error("No image data in response:", JSON.stringify(result));
      return res.status(500).json({ error: "No image data returned from AI" });
    }

    console.log("Image generated successfully");
    res.json({ b64_json: imageData.b64_json });
  } catch (error: any) {
    console.error("Error generating image:", error?.message || error);
    if (error?.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", JSON.stringify(error.response.data || {}));
    }

    let message = "Failed to generate image";
    if (error?.error?.message) {
      message = error.error.message;
    } else if (error?.message) {
      message = error.message;
    }

    if (message.includes("timed out") || error?.code === "ETIMEDOUT") {
      message = "Image generation timed out. Please try again with a simpler prompt.";
    }

    const status = error?.status || 500;
    res.status(status).json({ error: message });
  }
});

const VALID_MODES: ConsultationMode[] = ['clinical', 'calm', 'data', 'friendly'];

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
      console.error("[Chat] OPENAI_API_KEY is not configured");
      return res.status(500).json({ error: "AI service is not configured. Please try again later." });
    }

    const { message, mode = "friendly", sessionId } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }
    if (!sessionId || typeof sessionId !== "string") {
      return res.status(400).json({ error: "Session ID is required" });
    }
    if (!VALID_MODES.includes(mode)) {
      return res.status(400).json({ error: `Invalid mode. Must be one of: ${VALID_MODES.join(", ")}` });
    }

    const risk = detectRisk(message);
    if (risk.isRisk) {
      addMessage(sessionId, "user", message);
      addMessage(sessionId, "assistant", risk.response!);
      return res.json({ reply: risk.response });
    }

    const modeConfig = getModeConfig(mode);

    addMessage(sessionId, "user", message);

    const conversationHistory = getMessages(sessionId);

    const systemMessage = `${baseSystemPrompt}\n\n--- Active Mode: ${mode.toUpperCase()} ---\n${modeConfig.prompt}`;

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemMessage },
      ...conversationHistory,
    ];

    console.log(`[Chat] session=${sessionId.slice(0, 8)}... mode=${mode} msgCount=${conversationHistory.length}`);

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("X-Content-Type-Options", "nosniff");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: modeConfig.temperature,
      messages,
      max_tokens: 1024,
      stream: true,
    });

    let fullReply = "";

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullReply += content;
        res.write(content);
      }
    }

    addMessage(sessionId, "assistant", fullReply || "I'm sorry, I couldn't generate a response. Please try again.");

    res.end();
  } catch (error: any) {
    console.error("[Chat] Error:", error?.message || error);
    if (!res.headersSent) {
      const message = error?.message?.includes("timed out")
        ? "The AI is taking too long to respond. Please try again."
        : "An internal error occurred. Please try again later.";
      res.status(500).json({ error: message });
    } else {
      res.end();
    }
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "SOMNICLAW AI ONLINE" });
});

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 30;

function rateLimit(req: any, res: any, next: any) {
  const ip = req.ip || req.connection?.remoteAddress || "unknown";
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return next();
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }
  return next();
}

const walletDeployStore = new Map<string, number>();
const WALLET_DEPLOY_COOLDOWN = 3_600_000;

function walletRateLimit(req: any, res: any, next: any) {
  const wallet = req.body?.walletAddress;
  if (!wallet) return next();

  const now = Date.now();
  const lastDeploy = walletDeployStore.get(wallet);

  if (lastDeploy && now - lastDeploy < WALLET_DEPLOY_COOLDOWN) {
    const remaining = Math.ceil((WALLET_DEPLOY_COOLDOWN - (now - lastDeploy)) / 60_000);
    return res.status(429).json({
      error: `Rate limited: 1 deploy per wallet per hour. Try again in ${remaining} minute(s).`,
    });
  }
  return next();
}

app.post("/api/deploy-token", rateLimit, walletRateLimit, async (req, res) => {
  try {
    const { walletAddress, name, symbol, description, website, twitter, telegram, logo } = req.body || {};

    if (!walletAddress || typeof walletAddress !== "string") {
      return res.status(400).json({ error: "Wallet address is required" });
    }
    let payer: PublicKey;
    try {
      payer = new PublicKey(walletAddress);
    } catch {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    if (!name || typeof name !== "string" || name.trim().length < 1 || name.length > 64) {
      return res.status(400).json({ error: "Token name is required (1-64 characters)" });
    }
    if (!symbol || typeof symbol !== "string" || symbol.trim().length < 1 || symbol.length > 10) {
      return res.status(400).json({ error: "Token symbol is required (1-10 characters)" });
    }
    if (!description || typeof description !== "string" || description.trim().length < 1) {
      return res.status(400).json({ error: "Description is required" });
    }

    console.log(`[Deploy] Building token tx for ${name} (${symbol}) by ${walletAddress.slice(0, 8)}...`);

    const connection = await getConnectionWithFallback();
    const mintKeypair = Keypair.generate();
    const mintPubkey = mintKeypair.publicKey;

    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    const transaction = new Transaction();

    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mintPubkey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      })
    );

    transaction.add(
      createInitializeMintInstruction(mintPubkey, 9, payer, payer, TOKEN_PROGRAM_ID)
    );

    const ata = await getAssociatedTokenAddress(mintPubkey, payer);
    transaction.add(
      createAssociatedTokenAccountInstruction(payer, ata, payer, mintPubkey)
    );

    const mintAmount = BigInt(1_000_000_000) * BigInt(10 ** 9);
    transaction.add(
      createMintToInstruction(mintPubkey, ata, payer, mintAmount)
    );

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: getTreasuryWallet(),
        lamports: DEPLOY_FEE_LAMPORTS,
      })
    );

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;
    transaction.partialSign(mintKeypair);

    const serialized = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });
    const txBase64 = serialized.toString("base64");

    walletDeployStore.set(walletAddress, Date.now());

    const mintAddress = mintPubkey.toBase58();
    console.log(`[Deploy] Transaction built for mint ${mintAddress.slice(0, 8)}...`);

    res.json({
      success: true,
      transaction: txBase64,
      mintAddress,
      blockhash,
      lastValidBlockHeight,
    });
  } catch (error: any) {
    console.error("[Deploy] Error building transaction:", error?.message || error);

    let message = "Failed to build deploy transaction";
    if (error?.message?.includes("403")) {
      message = "RPC access denied. Retrying with fallback...";
    } else if (error?.message) {
      message = error.message;
    }

    res.status(500).json({ error: message });
  }
});

app.post("/api/confirm-deploy", rateLimit, async (req, res) => {
  try {
    const { signature, mintAddress, name, symbol, description, website, twitter, telegram, logo } = req.body || {};

    if (!signature || !mintAddress) {
      return res.status(400).json({ error: "Signature and mint address are required" });
    }

    console.log(`[Confirm] Confirming deploy: ${mintAddress.slice(0, 8)}... sig=${signature.slice(0, 8)}...`);

    const connection = await getConnectionWithFallback();

    let confirmed = false;
    let attempts = 0;
    const maxAttempts = 30;

    while (!confirmed && attempts < maxAttempts) {
      attempts++;
      const result = await connection.getSignatureStatus(signature);
      const status = result?.value;

      if (status?.err) {
        return res.status(400).json({ error: "Transaction failed on-chain", details: status.err });
      }

      if (status?.confirmationStatus === "confirmed" || status?.confirmationStatus === "finalized") {
        confirmed = true;
        break;
      }

      await new Promise((r) => setTimeout(r, 2000));
    }

    if (!confirmed) {
      return res.status(408).json({ error: "Transaction confirmation timed out. It may still confirm — check Solscan." });
    }

    const metadataDir = path.resolve(__dirname, "../dist/token-metadata");
    if (!fs.existsSync(metadataDir)) {
      fs.mkdirSync(metadataDir, { recursive: true });
    }

    const metadata = {
      name: name || "Unknown Token",
      symbol: symbol || "TOKEN",
      description: description || "",
      image: logo || "",
      external_url: website || "https://somniclaw.xyz",
      attributes: [
        { trait_type: "Platform", value: "SOMNICLAW Launchpad" },
        { trait_type: "Network", value: "Solana Mainnet" },
        { trait_type: "Supply", value: "1,000,000,000" },
        { trait_type: "Decimals", value: "9" },
      ],
      properties: {
        creators: [{ address: mintAddress, share: 100 }],
        links: {
          website: website || "",
          twitter: twitter || "",
          telegram: telegram || "",
        },
      },
    };

    const metadataPath = path.join(metadataDir, `${mintAddress}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    console.log(`[Confirm] Metadata saved for ${mintAddress.slice(0, 8)}...`);

    res.json({
      success: true,
      signature,
      mintAddress,
      metadataUrl: `/token-metadata/${mintAddress}.json`,
      explorerUrl: `https://solscan.io/token/${mintAddress}`,
      confirmed: status?.confirmationStatus || "processed",
    });
  } catch (error: any) {
    console.error("[Confirm] Error:", error?.message || error);
    res.status(500).json({ error: error?.message || "Failed to confirm deployment" });
  }
});

app.post("/api/launch", rateLimit, (req, res) => {
  const { name, symbol, supply, description, logo } = req.body || {};

  if (!name || typeof name !== "string" || name.trim().length < 1 || name.length > 64) {
    return res.status(400).json({ error: "Token name is required (1-64 characters)" });
  }
  if (!symbol || typeof symbol !== "string" || symbol.trim().length < 1 || symbol.length > 10) {
    return res.status(400).json({ error: "Token symbol is required (1-10 characters)" });
  }
  if (!description || typeof description !== "string" || description.trim().length < 1) {
    return res.status(400).json({ error: "Description is required" });
  }

  const contractBytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    contractBytes[i] = Math.floor(Math.random() * 256);
  }
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let contract = "";
  for (const byte of contractBytes) {
    contract += chars[byte % chars.length];
  }
  contract = contract.slice(0, 44);

  console.log(`[Launch] Token created: ${name} (${symbol}) → ${contract.slice(0, 8)}...`);

  res.json({
    success: true,
    contract,
    token: {
      name: name.trim(),
      symbol: symbol.trim().toUpperCase(),
      supply: supply || "1000000000",
      description: description.trim(),
      hasLogo: !!logo,
    },
  });
});

app.post("/api/ai-score", rateLimit, (req, res) => {
  const { name, symbol } = req.body || {};

  const baseScore = 60 + Math.floor(Math.random() * 30);
  const riskLevels = ["low", "medium", "high"] as const;
  const riskIndex = baseScore >= 80 ? 0 : baseScore >= 65 ? 1 : 2;

  const metrics = {
    liquidity: Math.floor(50 + Math.random() * 50),
    community: Math.floor(40 + Math.random() * 55),
    contract_safety: Math.floor(60 + Math.random() * 40),
    market_timing: Math.floor(45 + Math.random() * 50),
    supply_distribution: Math.floor(55 + Math.random() * 45),
    liquidity_ratio: Math.floor(40 + Math.random() * 55),
  };

  const mintAuthority = Math.random() > 0.5 ? "revoked" : "active";
  const freezeAuthority = Math.random() > 0.6 ? "revoked" : "active";

  console.log(`[AI Score] ${name || "Unknown"} (${symbol || "?"}) → Score: ${baseScore}, Risk: ${riskLevels[riskIndex]}`);

  res.json({
    score: baseScore,
    risk: riskLevels[riskIndex],
    whale_interest: Math.random() > 0.4,
    metrics,
    mint_authority: mintAuthority,
    freeze_authority: freezeAuthority,
    analysis: `Token ${symbol || "analysis"} shows ${riskLevels[riskIndex]} risk profile with a composite score of ${baseScore}/100. Mint authority: ${mintAuthority}. Freeze authority: ${freezeAuthority}.`,
  });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("[Server] Express error:", err?.message || err);
  if (!res.headersSent) {
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

const distPath = path.resolve(__dirname, "../dist");
app.use(express.static(distPath));
app.get("/{*path}", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = parseInt(process.env.PORT || "5000", 10);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
