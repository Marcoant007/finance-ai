import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: Request) => {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const STRIPE_WEBHOOK_SECRET_KEY = process.env.STRIPE_WEBHOOK_SECRET_KEY;

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe keys are not defined" },
      { status: 401 },
    );
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    console.log("Missing signature");
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  const text = await request.text();
  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  });

  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    STRIPE_WEBHOOK_SECRET_KEY,
  );

  if (event.type !== "invoice.paid") {
    return NextResponse.json({ error: "Event ignored" }, { status: 200 });
  }

  const invoice = event.data.object as Stripe.Invoice;
  const subscriptionId = invoice.subscription as string;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const clerkUserId = subscription.metadata?.clerk_user_id;

  if (!clerkUserId) {
    console.log("Missing Clerk user ID");
    return NextResponse.json(
      { error: "Missing Clerk user ID" },
      { status: 400 },
    );
  }

  await clerkClient.users.updateUser(clerkUserId, {
    privateMetadata: {
      stripeCustomerId: invoice.customer as string,
      stripeSubscriptionId: subscription.id,
    },
    publicMetadata: { subscriptionPlan: "premium" },
  });

  return NextResponse.json({ received: true });
};
