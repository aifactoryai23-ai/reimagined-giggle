// api/debug-env.js
export default async function handler(req, res) {
  return res.status(200).json({
    SUPABASE_URL: process.env.SUPABASE_URL || "❌ not found",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ exists" : "❌ not found",
    NODE_ENV: process.env.NODE_ENV,
  });
}
