"use client";

import { Button } from "@/app/_components/ui/button";
import { createStripeCheckout } from "../_actions";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const AcquirePlanButton = () => {
  const { user } = useUser();

  const handleAcquirePlanClick = async () => {
    const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!PUBLISHABLE_KEY) {
      throw new Error("Stripe publishable key is not defined");
    }

    const { sessionId } = await createStripeCheckout();
    const stripe = await loadStripe(PUBLISHABLE_KEY);

    if (!stripe) {
      throw new Error("Stripe is not defined");
    }

    await stripe.redirectToCheckout({ sessionId });
  };

  const hasPremiumPlan = user?.publicMetadata.subscriptionPlan === "premium";

  if (hasPremiumPlan) {
    const STRIPE_CUSTOMER_PORTAL_URL =
      process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL;
    if (!STRIPE_CUSTOMER_PORTAL_URL) {
      throw new Error("Stripe customer portal URL is not defined");
    }
    const URL_USER_EMAIL = `${STRIPE_CUSTOMER_PORTAL_URL}?prefilled_email=${user.emailAddresses[0].emailAddress}`;
    return (
      <Button className="w-full rounded-full font-bold" variant="link">
        <Link href={URL_USER_EMAIL}> Gerenciar Plano</Link>
      </Button>
    );
  }
  return (
    <Button
      onClick={handleAcquirePlanClick}
      className="w-full rounded-full font-bold"
    >
      Adquirir plano
    </Button>
  );
};

export default AcquirePlanButton;
