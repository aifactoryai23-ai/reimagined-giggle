import Stripe from "stripe";
import { supabase } from "@/utils/supabaseAdmin";

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-09-30",
});

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export async function POST(req) {
  const buf = await buffer(req.body);
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("❌ Missing Stripe signature header");
    return new Response("Missing signature", { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Stripe signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log(`💳 Stripe event received: ${event.type}`);

  try {
    switch (event.type) {
      // 1️⃣ Successful initial checkout
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.client_reference_id; // передаётся при создании Checkout
        const planName =
          session.metadata?.plan_name ||
          session.display_items?.[0]?.plan?.nickname ||
          "unknown";

        console.log(`✅ Initial checkout completed for ${userId}: ${planName}`);

        await updateUserSubscription(userId, planName, "initial");
        break;
      }

      // 2️⃣ Subscription renewal (invoice payment succeeded)
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const userId =
          invoice.customer_email ||
          invoice.customer ||
          invoice.metadata?.user_id;
        const planName =
          invoice.lines?.data?.[0]?.plan?.nickname ||
          invoice.lines?.data?.[0]?.price?.nickname ||
          "unknown";

        console.log(`🔁 Subscription renewal for ${userId}: ${planName}`);

        await updateUserSubscription(userId, planName, "renewal");
        break;
      }

      // 3️⃣ Subscription cancelled
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const userId = sub.metadata?.user_id || sub.customer_email;
        console.log(`❌ Subscription cancelled for ${userId}`);

        await supabase
          .from("profiles")
          .update({
            subscription_status: "free",
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
        break;
      }

      default:
        console.log(`ℹ️ Unhandled Stripe event: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error("❌ Stripe webhook handler error:", err);
    return new Response("Server error", { status: 500 });
  }
}

/**
 * Update Supabase profile credits and plan
 * @param {string} userId
 * @param {string} planName
 * @param {'initial'|'renewal'} phase
 */
async function updateUserSubscription(userId, planName, phase = "initial") {
  if (!userId) {
    console.error("❌ Missing userId in updateUserSubscription()");
    return;
  }

  let creditsToAdd = 0;
  let newStatus = "free";

  // detect plan
  const isProIndividual = /pro/i.test(planName) && /individual/i.test(planName);
  const isProAgency = /agency/i.test(planName);
  const isCustom = /custom/i.test(planName);

  if (phase === "initial") {
    if (isProIndividual) {
      creditsToAdd = 23;
      newStatus = "pro_individual";
    } else if (isProAgency) {
      creditsToAdd = 198;
      newStatus = "pro_agency";
    } else if (isCustom) {
      creditsToAdd = 999;
      newStatus = "custom";
    }
  } else if (phase === "renewal") {
    if (isProIndividual) {
      creditsToAdd = 25;
      newStatus = "pro_individual";
    } else if (isProAgency) {
      creditsToAdd = 200;
      newStatus = "pro_agency";
    } else if (isCustom) {
      creditsToAdd = 1000;
      newStatus = "custom";
    }
  }

  const { data: profile, error: fetchErr } = await supabase
    .from("profiles")
    .select("credits_remaining")
    .eq("id", userId)
    .maybeSingle();

  if (fetchErr) {
    console.error("❌ Failed to fetch profile:", fetchErr.message);
    return;
  }

  if (!profile) {
    console.log(`ℹ️ No profile found for ${userId}, creating one...`);
    await supabase.from("profiles").insert({
      id: userId,
      credits_remaining: creditsToAdd,
      subscription_status: newStatus,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return;
  }

  const updatedCredits = (profile.credits_remaining || 0) + creditsToAdd;

  const { error: updateErr } = await supabase
    .from("profiles")
    .update({
      credits_remaining: updatedCredits,
      subscription_status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (updateErr) {
    console.error("❌ Failed to update subscription:", updateErr.message);
  } else {
    console.log(
      `✅ ${userId}: ${phase === "initial" ? "new" : "renewed"} ${newStatus} plan, +${creditsToAdd} credits (total ${updatedCredits})`
    );
  }
}
