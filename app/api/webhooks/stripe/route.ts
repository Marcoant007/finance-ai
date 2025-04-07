import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: Request) => {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const STRIPE_WEBHOOK_SECRET_KEY = process.env.STRIPE_WEBHOOK_SECRET_KEY;

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe keys are not defined" },
      { status: 400 },
    );
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
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

  switch (event.type) {
    case "invoice.paid": {
      const { customer, subscription, subscription_details } =
        event.data.object;
      const clerkUserId = subscription_details?.metadata?.clerk_user_id;
      if (!clerkUserId) {
        return NextResponse.error();
      }
      await clerkClient().users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: customer,
          stripeSubscriptionId: subscription,
        },
        publicMetadata: {
          subscriptionPlan: "premium",
        },
      });
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id,
      );
      const clerkUserId = subscription.metadata?.clerk_user_id;

      if (!clerkUserId) {
        console.warn(
          "Subscription deleted, but no clerk_user_id metadata found",
        );
        return NextResponse.error();
      }

      await clerkClient().users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: null,
          stripeSubscriptionId: null,
        },
        publicMetadata: {
          subscriptionPlan: null,
        },
      });

      break;
    }
  }

  return NextResponse.json({ received: true });
};
