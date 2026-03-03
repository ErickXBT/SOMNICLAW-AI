import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI, { toFile } from "openai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

const isDev = process.env.NODE_ENV !== "production";

if (!isDev) {
  const distPath = path.resolve(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("/{*path}", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
const PORT = isDev ? 3001 : 5000;
const HOST = isDev ? "localhost" : "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Backend server running on http://${HOST}:${PORT}`);
});
