// api/stripe-webhook.js
import { supabaseAdmin } from "../utils/supabaseAdmin.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // важно — Stripe требует необработанный body
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;

        if (!userId) {
          console.warn("⚠️ No userId in Stripe session metadata");
          break;
        }

        // Определяем тарифный план
        const plan = session.metadata?.plan || "free";
        let max_generations = 2;
        if (plan === "pro_individual") max_generations = 25;
        if (plan === "pro_agency") max_generations = 200;

        // Обновляем профиль в Supabase
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: plan,
            credits_remaining: max_generations,
            max_generations,
          })
          .eq("id", userId);

        if (error) console.error("Supabase update error:", error);
        else console.log(`✅ Updated user ${userId} to plan: ${plan}`);
        break;
      }

      case "invoice.payment_failed": {
        const { customer_email } = event.data.object;
        console.warn(`❌ Payment failed for ${customer_email}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        if (userId) {
          await supabaseAdmin
            .from("profiles")
            .update({
              subscription_status: "free",
              credits_remaining: 2,
              max_generations: 2,
            })
            .eq("id", userId);
          console.log(`🔄 Downgraded ${userId} to Free plan`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("⚠️ Webhook processing error:", err);
    res.status(500).send("Internal webhook error");
  }
}
