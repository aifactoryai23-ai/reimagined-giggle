// api/images/list.js
import { supabaseAdmin } from "../utils/supabaseAdmin.js";

const BUCKET = "images";
const SIGN_TTL = 60 * 60 * 2; // 2 часа

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(400).json({ error: "Missing userId header" });
    }

    // ✅ выбираем нужные поля
    const { data: rows, error } = await supabaseAdmin
      .from("images")
      .select("id, created_at, original_url, result_url, prompt")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ DB fetch error:", error);
      return res.status(500).json({ error: "Failed to fetch images" });
    }

    console.log("🖼️ Gallery items from DB:", rows);

    // создаём подписанные ссылки
    const out = await Promise.all(
      rows.map(async (r) => {
        const beforeSigned = r.original_url
          ? await supabaseAdmin.storage.from(BUCKET).createSignedUrl(r.original_url, SIGN_TTL)
          : { data: { signedUrl: null } };

        const afterSigned = r.result_url
          ? await supabaseAdmin.storage.from(BUCKET).createSignedUrl(r.result_url, SIGN_TTL)
          : { data: { signedUrl: null } };

        return {
          id: r.id,
          created_at: r.created_at,
          prompt: r.prompt,
          before_url: beforeSigned.data?.signedUrl,
          after_url: afterSigned.data?.signedUrl,
        };
      })
    );

    return res.status(200).json({ data: out });
  } catch (err) {
    console.error("❌ list.js unexpected error:", err);
    return res.status(500).json({ error: "Unexpected error", details: err.message });
  }
}

