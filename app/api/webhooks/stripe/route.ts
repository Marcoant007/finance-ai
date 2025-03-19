import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: Request) => {
  const signature = request.headers.get("stripe-signature");
  if (!signature)
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRETS_KEY!, {
    apiVersion: "2025-02-24.acacia",
  });

  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );

  if (event.type !== "invoice.paid")
    return NextResponse.json({ error: "Event ignored" }, { status: 200 });

  const invoice = event.data.object as Stripe.Invoice;
  const clerkUserId = invoice.metadata?.clerk_user_id;
  if (!clerkUserId)
    return NextResponse.json(
      { error: "Missing Clerk user ID" },
      { status: 400 },
    );

  await clerkClient.users.updateUser(clerkUserId, {
    privateMetadata: {
      stripeCustomerId: invoice.customer as string,
      stripeSubscriptionId: invoice.subscription as string,
    },
    publicMetadata: { subscriptionPlan: "premium" },
  });

  return NextResponse.json({ received: true });
};
