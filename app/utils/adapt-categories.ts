import type { TransactionCategory } from "@prisma/client";
import type { Transaction } from "@/app/utils/interface/transaction-interface";

const validCategories = new Set<TransactionCategory>([
  "HOUSING",
  "TRANSPORTATION",
  "FOOD",
  "ENTERTAINMENT",
  "HEALTH",
  "UTILITY",
  "SALARY",
  "EDUCATION",
  "OTHER",
  "SIGNATURE",
  "FOOD_DELIVERY",
  "GAMING",
  "SERVICES",
]);

export function adaptTransactionFields(
  transaction: Partial<Transaction>,
): Partial<Transaction> {
  return {
    ...transaction,
    paymentMethod: "CREDIT_CARD",
    category: isValidCategory(transaction.category)
      ? transaction.category
      : undefined,
  };
}

function isValidCategory(category: unknown): category is TransactionCategory {
  if (typeof category !== "string") return false;
  return validCategories.has(category.toUpperCase() as TransactionCategory);
}
