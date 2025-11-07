import { supabase } from "../src/api/supabaseClient.js";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = getAuth(req);
  const { id, file_path } = req.body;

  // Проверка владельца
  const { data: image } = await supabase
    .from("images")
    .select("user_id")
    .eq("id", id)
    .single();

  if (!image || image.user_id !== userId) {
    return res.status(403).json({ error: "Not allowed" });
  }

  // Удаление объекта из storage
  await supabase.storage.from("images").remove([file_path]);

  // Удаление записи
  await supabase.from("images").delete().eq("id", id);

  return res.status(200).json({ success: true });
}
