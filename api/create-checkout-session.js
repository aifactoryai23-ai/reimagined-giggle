// api/create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const { plan } = req.body;
    const { userId } = req.headers; // или возьми из Clerk при создании
    if (!userId) return res.status(400).json({ error: "Missing user ID" });

    const prices = {
      pro_individual: "price_XXXX_individual", // 👉 подставь свои Stripe Price ID
      pro_agency: "price_XXXX_agency",
    };

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: prices[plan],
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/pricing`,
      metadata: {
        userId,
        plan,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ error: err.message });
  }
}

