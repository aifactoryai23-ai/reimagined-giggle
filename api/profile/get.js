// api/profile/get.js
import { supabaseAdmin } from "../utils/supabaseAdmin.js";

// Отдаёт профиль пользователя (создаёт с дефолтами, если не найден)
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(400).json({ error: "Missing x-user-id header" });
    }

    // Пытаемся найти профиль
    let { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("id, subscription_status, credits_remaining, max_generations")
      .eq("id", userId)
      .single();

    // Если нет — создаём дефолтный (free: 2 кредита)
    if (error && error.code === "PGRST116") {
      const defaults = {
        id: userId,
        subscription_status: "free",
        credits_remaining: 2,
        max_generations: 2,
      };
      const { data: created, error: insErr } = await supabaseAdmin
        .from("profiles")
        .insert([defaults])
        .select("id, subscription_status, credits_remaining, max_generations")
        .single();
      if (insErr) {
        return res.status(500).json({ error: "Failed to create default profile" });
      }
      profile = created;
    } else if (error) {
      return res.status(500).json({ error: "Failed to load profile" });
    }

    return res.status(200).json({ data: profile });
  } catch (e) {
    console.error("profile/get error:", e);
    return res.status(500).json({ error: e.message || "Internal error" });
  }
}
