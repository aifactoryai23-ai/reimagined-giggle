// api/images/save.js
import { supabaseAdmin } from "../utils/supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userId = req.headers["x-user-id"];
    const { beforePath, afterPath, prompt, parentId } = req.body || {};

    if (!userId || !beforePath || !afterPath) {
      return res.status(400).json({
        error: "Missing userId, beforePath, or afterPath",
      });
    }

    console.log("📦 Saving image for user:", userId);

    // 1️⃣ Проверяем профиль пользователя
    const { data: profile, error: profErr } = await supabaseAdmin
      .from("profiles")
      .select("credits_remaining, max_generations, subscription_status")
      .eq("id", userId)
      .single();

    if (profErr || !profile) {
      console.error("❌ Profile fetch error:", profErr);
      return res
        .status(500)
        .json({ error: "Failed to load user profile", details: profErr?.message });
    }

    let {
      credits_remaining = 0,
      max_generations = 2,
      subscription_status = "free",
    } = profile;

    if (credits_remaining <= 0 && subscription_status === "free") {
      console.warn(`⚠️ User ${userId} has no credits left`);
      return res.status(402).json({
        error: "No credits remaining. Please upgrade your plan.",
      });
    }

    // 2️⃣ Подготавливаем новую запись
    const newRecord = {
      user_id: userId,
      original_url: beforePath,
      result_url: afterPath,
      prompt: prompt || "",
      parent_id: parentId || null, // 👈 добавлено
      created_at: new Date().toISOString(),
    };

    // 3️⃣ Вставляем запись в таблицу images
    const { data: inserted, error: insErr } = await supabaseAdmin
      .from("images")
      .insert([newRecord])
      .select("*")
      .single();

    if (insErr) {
      console.error("❌ Insert error:", insErr);
      return res.status(500).json({
        error: "Failed to save image record",
        details: insErr.message,
      });
    }

    console.log("✅ Saved image:", inserted);

    // 4️⃣ Обновляем кредиты
    const newCredits =
      subscription_status === "premium"
        ? credits_remaining
        : Math.max(credits_remaining - 1, 0);

    const { error: updateErr } = await supabaseAdmin
      .from("profiles")
      .update({
        credits_remaining: newCredits,
        last_login: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateErr) {
      console.warn("⚠️ Failed to update profile credits:", updateErr);
    } else {
      console.log(`📊 Updated credits for ${userId}: ${newCredits}/${max_generations}`);
    }

    // 5️⃣ Возвращаем ответ
    return res.status(200).json({
      success: true,
      data: inserted,
      credits_remaining: newCredits,
    });
  } catch (err) {
    console.error("❌ save.js unexpected error:", err);
    return res.status(500).json({
      error: "Unexpected error",
      details: err.message,
    });
  }
}
