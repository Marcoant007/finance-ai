"use client";

import { Button } from "@/app/_components/ui/button";
import { useUser } from "@clerk/nextjs";
import { loadStripe } from "@stripe/stripe-js";
import { createStripeCheckout } from "../_actions";

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
      <Button asChild className="w-full rounded-full font-bold" variant="link">
        <a href={URL_USER_EMAIL} target="_blank" rel="noopener noreferrer">
          Gerenciar Plano
        </a>
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
