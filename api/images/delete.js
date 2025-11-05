// api/images/delete.js
import { supabaseAdmin } from "../utils/supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userId = req.headers["x-user-id"];
    const { id } = req.body || {};

    if (!userId || !id) {
      return res.status(400).json({ error: "Missing id or userId" });
    }

    console.log(`🗑️ Deleting image ${id} for user ${userId}`);

    // Проверяем, что запись принадлежит пользователю
    const { data: record, error: fetchErr } = await supabaseAdmin
      .from("images")
      .select("id, user_id, original_url, result_url")
      .eq("id", id)
      .single();

    if (fetchErr || !record) {
      return res.status(404).json({ error: "Image not found" });
    }
    if (record.user_id !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Удаляем запись из таблицы
    const { error: delErr } = await supabaseAdmin.from("images").delete().eq("id", id);
    if (delErr) throw delErr;

    // Удаляем файлы из хранилища
    const toRemove = [record.original_url, record.result_url].filter(Boolean);
    if (toRemove.length > 0) {
      const { error: storageErr } = await supabaseAdmin.storage
        .from("images")
        .remove(toRemove);
      if (storageErr) console.warn("⚠️ Failed to remove storage files:", storageErr);
    }

    console.log(`✅ Deleted image ${id}`);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Delete error:", err);
    return res.status(500).json({ error: "Internal error", details: err.message });
  }
}
