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

    console.log(`🗑️ Soft-deleting image ${id} for user ${userId}`);

    // 1️⃣ Проверяем, что запись принадлежит пользователю
    const { data: record, error: fetchErr } = await supabaseAdmin
      .from("images")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (fetchErr || !record) {
      return res.status(404).json({ error: "Image not found" });
    }
    if (record.user_id !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // 2️⃣ Мягкое удаление — просто ставим флаг deleted = true
    const { error: updateErr } = await supabaseAdmin
      .from("images")
      .update({ deleted: true })
      .eq("id", id);

    if (updateErr) {
      console.error("⚠️ Failed to soft delete:", updateErr);
      return res.status(500).json({ error: "Failed to soft delete record" });
    }

    console.log(`✅ Soft-deleted image record ${id}`);
    return res.status(200).json({ success: true, softDeleted: true });
  } catch (err) {
    console.error("❌ Delete error:", err);
    return res.status(500).json({
      error: "Internal error",
      details: err.message,
    });
  }
}
