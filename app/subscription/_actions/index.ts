"use server";

import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const createStripeCheckout = async () => {
  const STRIPE_SECRETS_KEY = process.env.STRIPE_SECRETS_KEY;
  const STRIPE_PRICE_ID = process.env.STRIPE_PREMIUM_PLAN_PRICE_ID;

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!STRIPE_SECRETS_KEY) {
    throw new Error("Stripe secret key is not defined");
  }

  const stripe = new Stripe(STRIPE_SECRETS_KEY, {
    apiVersion: "2025-02-24.acacia",
  });

  const sessionCheckout = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    success_url: "http://localhost:3000/dashboard",
    cancel_url: "http://localhost:3000/",
    subscription_data: {
      metadata: {
        clerk_user_id: userId,
      },
    },
    line_items: [
      {
        price: STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
  });

  return { sessionId: sessionCheckout.id };
};
