import { createClient } from "@supabase/supabase-js";
console.log("[ENV CHECK]", process.env.VITE_SUPABASE_URL, !!process.env.SUPABASE_SERVICE_ROLE_KEY);

// создаём Supabase клиент с service key (доступ только на сервере)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const { userId, fileName } = req.query;

    if (!userId || !fileName) {
      return res.status(400).json({ error: "Missing userId or fileName" });
    }

    // создаём одноразовую ссылку для загрузки
    const { data, error } = await supabase.storage
      .from("images")
      .createSignedUploadUrl(`${userId}/${fileName}`);

    if (error) throw error;

    res.status(200).json(data); // вернём signedUrl
  } catch (err) {
    console.error("❌ create-upload-url error:", err);
    res.status(500).json({ error: err.message });
  }
}
