"use client";

import { Button } from "@/app/_components/ui/button";
import { createStripeCheckout } from "../_actions";
import { loadStripe } from "@stripe/stripe-js";

const AcquirePlanButton = () => {
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

  return (
    <Button
      onClick={handleAcquirePlanClick}
      className="w-full rounded-full font-bold"
    >
      Adquirir Plano{" "}
    </Button>
  );
};

export default AcquirePlanButton;
