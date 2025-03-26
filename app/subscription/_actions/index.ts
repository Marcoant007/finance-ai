"use server";

import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const createStripeCheckout = async () => {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const STRIPE_PRICE_ID = process.env.STRIPE_PREMIUM_PLAN_PRICE_ID;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not defined");
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  });

  const sessionCheckout = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
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
    success_url: "http://localhost:3000/",
    cancel_url: `${APP_URL}/`,
  });

  return { sessionId: sessionCheckout.id };
};
