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

    // ✅ выбираем только активные (не удалённые) записи
    const { data: rows, error } = await supabaseAdmin
      .from("images")
      .select("id, created_at, original_url, result_url, prompt, deleted")
      .eq("user_id", userId)
      .neq("deleted", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ DB fetch error:", error);
      return res.status(500).json({ error: "Failed to fetch images" });
    }

    console.log("🖼️ Gallery items from DB:", rows);

    const sanitizeStoragePath = (value) => {
      if (typeof value !== "string") return "";
      const trimmed = value.trim();
      if (!trimmed) return "";
      if (/^https?:\/\//i.test(trimmed)) return "";
      return trimmed.replace(/^images\//, "");
    };

    const rowsSafe = Array.isArray(rows) ? rows : [];

    // создаём подписанные ссылки для before/after
    const out = await Promise.all(
      rowsSafe.map(async (r) => {
        const originalPath = sanitizeStoragePath(r.original_url);
        const resultPath = sanitizeStoragePath(r.result_url);

        const beforeSigned = await (async () => {
          if (!originalPath) return { data: { signedUrl: null } };
          try {
            return await supabaseAdmin.storage
              .from(BUCKET)
              .createSignedUrl(originalPath, SIGN_TTL);
          } catch (signErr) {
            console.warn("⚠️ Could not sign original", originalPath, signErr);
            return { data: { signedUrl: null } };
          }
        })();

        const afterSigned = await (async () => {
          if (!resultPath) return { data: { signedUrl: null } };
          try {
            return await supabaseAdmin.storage
              .from(BUCKET)
              .createSignedUrl(resultPath, SIGN_TTL);
          } catch (signErr) {
            console.warn("⚠️ Could not sign result", resultPath, signErr);
            return { data: { signedUrl: null } };
          }
        })();

        return {
          id: r.id,
          created_at: r.created_at,
          prompt: r.prompt,
          before_url: beforeSigned.data?.signedUrl,
          after_url: afterSigned.data?.signedUrl,
          original_url: originalPath || r.original_url,
          result_url: resultPath || r.result_url,
        };
      })
    );

    return res.status(200).json({ data: out });
  } catch (err) {
    console.error("❌ list.js unexpected error:", err);
    return res.status(500).json({
      error: "Unexpected error",
      details: err.message,
    });
  }
}
