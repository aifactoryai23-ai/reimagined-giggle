// /api/upload-proxy.js
import { supabaseAdmin } from "./utils/supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, fileName, fileData } = req.body;

    if (!userId || !fileName || !fileData) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const buffer = Buffer.from(fileData, "base64");
    const path = `${userId}/${fileName}`;

    const { data, error } = await supabaseAdmin.storage
      .from("images")
      .upload(path, buffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.error("❌ Supabase upload error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ Uploaded successfully:", data);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ Upload proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
}
