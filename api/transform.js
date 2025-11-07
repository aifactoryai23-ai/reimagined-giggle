import axios from "axios";
import { createClient } from "@supabase/supabase-js";

export const config = {
  runtime: "nodejs",
  maxDuration: 180, // до 3 минут на генерацию
};

const BFL_API_URL = "https://api.bfl.ai/v1";
const BFL_API_KEY = process.env.BFL_API_KEY;

// ⚙️ Supabase Admin клиент
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!BFL_API_KEY) {
    return res.status(500).json({ error: "BFL API key not configured" });
  }

  try {
    const { prompt, beforePath, size = "1024x1024" } = req.body;

    const normalizedPrompt = String(prompt || "").trim();
    if (!normalizedPrompt) {
      return res.status(400).json({ error: "Missing prompt text" });
    }

    if (!beforePath) {
      return res.status(400).json({ error: "Missing beforePath" });
    }

    // 🧩 1️⃣ Загружаем изображение из Supabase
    console.log(`📥 Downloading original from Supabase: ${beforePath}`);
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("images")
      .download(beforePath);

    if (downloadError || !fileData) {
      console.error("❌ Supabase download error:", downloadError);
      return res.status(400).json({
        error: "Failed to fetch original image from Supabase",
        details: downloadError?.message,
      });
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const imageBase64 = Buffer.from(arrayBuffer).toString("base64");

    console.log("🧠 Starting Flux Kontext Pro image generation...");

    // 🧩 2️⃣ Отправляем в BFL API
    const requestPayload = {
      prompt: normalizedPrompt,
      input_image: imageBase64,
    };

    let initialResponse;
    try {
      initialResponse = await axios.post(
        `${BFL_API_URL}/flux-kontext-pro`,
        requestPayload,
        {
          headers: {
            accept: "application/json",
            "x-key": BFL_API_KEY,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );
    } catch (err) {
      const text = err.response?.data || err.message || "";
      console.error("❌ BFL initial error:", text);
      return res.status(502).json({
        error: "AI generation request failed",
        details: text,
      });
    }

    const { id: requestId, polling_url: pollingUrl } = initialResponse.data;
    if (!pollingUrl) throw new Error("No polling URL from BFL API");

    console.log(`Request ID: ${requestId}, Polling URL: ${pollingUrl}`);

    // 🔄 3️⃣ Polling результата
    let status = "Pending";
    let result = null;
    let attempts = 0;
    const maxAttempts = 180;

    while (
      status !== "Ready" &&
      status !== "Error" &&
      status !== "Failed" &&
      attempts < maxAttempts
    ) {
      await new Promise((r) => setTimeout(r, 500));

      const pollResponse = await axios.get(pollingUrl, {
        headers: {
          accept: "application/json",
          "x-key": BFL_API_KEY,
        },
        timeout: 10000,
      });

      status = pollResponse.data.status;
      result = pollResponse.data;

      console.log(`Polling attempt ${attempts + 1}: Status = ${status}`);

      if (status === "Ready") break;
      if (status === "Error" || status === "Failed") {
        throw new Error(
          `Generation failed: ${result.error || "Unknown error"}`
        );
      }

      attempts++;
    }

    if (attempts >= maxAttempts)
      throw new Error("Generation timeout - too many polling attempts");
    if (status !== "Ready")
      throw new Error(`Unexpected final status: ${status}`);

    // 📥 4️⃣ Получаем готовое изображение
    const imageUrl = result.result?.sample;
    if (!imageUrl) throw new Error("No image URL in result");

    console.log("Downloading generated image...");
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 30000,
    });

    const editedImageBase64 = Buffer.from(imageResponse.data).toString("base64");
    const dataUrl = `data:image/png;base64,${editedImageBase64}`;

    console.log("✅ Flux Kontext Pro generation complete");

    return res.status(200).json({
      imageUrl: dataUrl,
      model: "flux-kontext-pro",
      requestId,
      usage: { credits_used: 1 },
    });
  } catch (err) {
    console.error("❌ Flux transform error:", err);
    res.status(500).json({
      error: "Image transformation failed",
      details: err.message || err.toString(),
    });
  }
}
