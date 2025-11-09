// api/utils/supabaseAdmin.js
import { createClient } from "@supabase/supabase-js";

// ⚠️ Используем SERVICE_ROLE_KEY, а не anon, т.к. нужен доступ на insert в RLS-защищённые таблицы
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
