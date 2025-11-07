import { supabase } from "@/lib/supabase";

export async function getModels() {
  const { data, error } = await supabase
    .storage
    .from("models")
    .list("", { limit: 100 });

  if (error) {
    console.error("Error loading models:", error);
    return [];
  }

  // Вернём публичные URL'ы
  return data.map((file) =>
    `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/models/${file.name}`
  );
}
