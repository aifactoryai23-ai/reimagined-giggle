import { Webhook } from "svix";
import { buffer } from "micro";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: { bodyParser: false },
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const payloadBuffer = await buffer(req);
    const body = payloadBuffer.toString();

    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];

    if (!svix_id || !svix_timestamp || !svix_signature)
      return res.status(400).json({ error: "Missing Svix headers" });

    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    let event;
    try {
      event = webhook.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("❌ Clerk webhook verification failed:", err.message);
      return res.status(400).json({ error: "Invalid signature" });
    }

    const { type, data } = event;
    console.log("✅ Webhook received:", type);

    // ------------------------------------------------------
    // 1️⃣ USER CREATED or UPDATED
    // ------------------------------------------------------
    if (type === "user.created" || type === "user.updated") {
      const userId = data.id;
      const email =
        data.email_addresses?.[0]?.email_address || data.email || null;
      const first_name = data.first_name || null;
      const last_name = data.last_name || null;
      const full_name =
        [first_name, last_name].filter(Boolean).join(" ") || null;
      const image_url =
        data.image_url || data.profile_image_url || data.image || null;

      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id, credits_remaining, subscription_status")
        .eq("id", userId)
        .maybeSingle();

      if (!existingProfile) {
        console.log(`🆕 Creating profile with 2 free credits for ${userId}`);
        const { error } = await supabase.from("profiles").insert({
          id: userId,
          email,
          first_name,
          last_name,
          full_name,
          image_url,
          credits_remaining: 2,
          generation_count: 0,
          subscription_status: "free",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        if (error) console.error("❌ Insert error:", error.message);
      } else {
        const { error } = await supabase
          .from("profiles")
          .update({
            email,
            first_name,
            last_name,
            full_name,
            image_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
        if (error) console.error("❌ Update error:", error.message);
      }
    }

    // ------------------------------------------------------
    // 2️⃣ SESSION CREATED
    // ------------------------------------------------------
    if (type === "session.created") {
      const userId = data.user_id;
      console.log(`👋 Session created for ${userId}`);
      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            last_login: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
      if (error) console.error("❌ Upsert last_login failed:", error.message);
    }

    // ------------------------------------------------------
    // 3️⃣ STRIPE SUBSCRIPTION CREATED / UPDATED
    // ------------------------------------------------------
    if (type === "subscription.created" || type === "subscription.updated") {
      const userId = data.user_id || data.id || null;
      const planName =
        data.plan_name ||
        data.subscription_plan ||
        data.plan_id ||
        "unknown";

      console.log(`💳 Subscription event for ${userId} → ${planName}`);

      let creditsToAdd = 0;
      let newStatus = "free";

      if (/pro/i.test(planName) && /individual/i.test(planName)) {
        creditsToAdd = 23;
        newStatus = "pro_individual";
      } else if (/agency/i.test(planName)) {
        creditsToAdd = 198;
        newStatus = "pro_agency";
      } else if (/custom/i.test(planName)) {
        creditsToAdd = 999;
        newStatus = "custom";
      }

      const { data: profile, error: selErr } = await supabase
        .from("profiles")
        .select("credits_remaining")
        .eq("id", userId)
        .maybeSingle();

      if (selErr) console.error("❌ Fetch profile error:", selErr.message);

      if (profile) {
        const updatedCredits =
          (profile.credits_remaining || 0) + creditsToAdd;

        const { error: updErr } = await supabase
          .from("profiles")
          .update({
            credits_remaining: updatedCredits,
            subscription_status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        if (updErr)
          console.error("❌ Failed to update credits/subscription:", updErr.message);
        else
          console.log(
            `✅ Updated ${userId}: +${creditsToAdd} credits (${newStatus})`
          );
      }
    }

    // ------------------------------------------------------
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Handler error:", err);
    return res.status(500).json({ error: err.message });
  }
}
