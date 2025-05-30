import type { Transaction } from "@/app/utils/interface/transaction-interface";
import { TransactionPaymentMethod, TransactionType } from "@prisma/client";

export function parseCsvRow(
  row: Record<string, string>,
  headerMap: Record<string, keyof Transaction>,
): Partial<Transaction> {
  const transaction: Partial<Transaction> = {};

  for (const [csvKey, rawValue] of Object.entries(row)) {
    const field = headerMap[csvKey];
    if (!field || !rawValue.trim()) continue;

    const value = rawValue.trim();

    switch (field) {
      case "amount":
        transaction.amount = Number.parseFloat(
          value.replace("R$", "").replace(/\./g, "").replace(",", "."),
        );
        break;

      case "date":
        transaction.date = value.includes("/")
          ? new Date(value.split("/").reverse().join("-"))
          : new Date(value);
        break;

      case "name":
        transaction.name = value;
        break;

      case "type":
        if (Object.values(TransactionType).includes(value as TransactionType)) {
          transaction.type = value as TransactionType;
        }
        break;

      case "category":
        transaction.category = value;
        break;

      case "paymentMethod":
        if (
          Object.values(TransactionPaymentMethod).includes(
            value as TransactionPaymentMethod,
          )
        ) {
          transaction.paymentMethod = value as TransactionPaymentMethod;
        }
        break;
    }
  }

  console.log("Parsed CSV Transaction: ", transaction);
  return transaction;
}
