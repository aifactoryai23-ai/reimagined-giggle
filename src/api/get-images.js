import { supabase } from "../src/api/supabaseClient.js";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  const { userId } = getAuth(req);

  const { data, error } = await supabase
    .from("images")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error });
  }

  return res.status(200).json(data);
}
