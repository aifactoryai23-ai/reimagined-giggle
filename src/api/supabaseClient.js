// ✅ Supabase Client (с автоматической самопроверкой окружения и безопасным import Clerk)
import { createClient } from "@supabase/supabase-js";

console.log("🧩 [SupabaseClient] initializing...");

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 🧠 Автоматическая проверка окружения
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "🚨 [SupabaseClient] Missing environment variables!\n" +
      "You must define:\n" +
      "  ✅ VITE_SUPABASE_URL\n" +
      "  ✅ VITE_SUPABASE_ANON_KEY\n\n" +
      "➡️  Go to Vercel → Project → Settings → Environment Variables\n" +
      "   and add them for Production + Preview environments."
  );
} else {
  console.log("✅ [SupabaseClient] URL:", SUPABASE_URL);
}

// 🔧 Вспомогательная функция
function buildStorageUploadUrl(bucket, path) {
  return `${SUPABASE_URL}/storage/v1/object/${encodeURIComponent(bucket)}/${path}`;
}

async function storageUpload({ bucket, path, file, options = {} }) {
  const headers = new Headers();
  headers.set("apikey", SUPABASE_ANON_KEY);

  if (options.headers && options.headers.Authorization) {
    headers.set("Authorization", options.headers.Authorization);
  } else {
    headers.set("Authorization", `Bearer ${SUPABASE_ANON_KEY}`);
  }

  if (options.upsert) headers.set("x-upsert", "true");

  const contentType =
    file?.type?.length ? file.type : "application/octet-stream";
  headers.set("Content-Type", contentType);

  const url = buildStorageUploadUrl(bucket, path);
  console.log("📤 [SupabaseClient] Upload →", url);

  const resp = await fetch(url, {
    method: "POST",
    headers,
    body: file,
  });

  if (!resp.ok) {
    let message = await resp.text();
    try {
      const j = JSON.parse(message);
      message = j?.message || j?.error || message;
    } catch {}
    console.error("❌ [SupabaseClient] Upload error:", message);
    return { data: null, error: { message } };
  }

  const json = await resp.json();
  console.log("✅ [SupabaseClient] Uploaded successfully:", json);
  return { data: json, error: null };
}

// 📦 Твой старый анонимный клиент (оставляем для обратной совместимости)
export const supabaseCompat = {
  storage: {
    from(bucket) {
      return {
        upload: (path, file, options) =>
          storageUpload({ bucket, path, file, options }),
      };
    },
  },
};

// ✅ Новый полноценный клиент Supabase (для .createSignedUrl и т.п.)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ✅ Совместимая с Clerk 5.x версия
export async function getSupabaseWithAuth() {
  let token = null;

  if (typeof window !== "undefined") {
    try {
      if (window.Clerk?.session) {
        token = await window.Clerk.session.getToken({ template: "supabase" });
        console.log("✅ [SupabaseClient] Got Clerk token via window.Clerk");
      } else {
        console.warn("[SupabaseClient] window.Clerk not ready yet");
      }
    } catch (err) {
      console.warn("[SupabaseClient] Clerk getToken failed:", err);
    }
  }

  const authHeader = token
    ? { Authorization: `Bearer ${token}` }
    : { Authorization: `Bearer ${SUPABASE_ANON_KEY}` };

  // 3️⃣ Возвращаем объект с методом upload
  return {
    storage: {
      from(bucket) {
        return {
          upload: (path, file, options = {}) =>
            storageUpload({
              bucket,
              path,
              file,
              options: { ...options, headers: authHeader },
            }),
        };
      },
    },
  };
}
