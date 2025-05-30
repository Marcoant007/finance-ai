import type { Transaction } from "@/app/utils/interface/transaction-interface";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { AbstractTransactionHandler } from "./abstract-transaction-handler";
import { detectTransactionDataWithIA } from "@/app/(home)/_actions/category-ia";

export class EnrichTransactionWithIAHandler extends AbstractTransactionHandler {
  async handle(
    transaction: Partial<Transaction>,
  ): Promise<Partial<Transaction>> {
    const needsType = !this.isValid(transaction.type, TransactionType);
    const needsCategory =
      !transaction.category ||
      transaction.category === "OTHER" ||
      !this.isValid(transaction.category, TransactionCategory);

    const needsPayment = !this.isValid(
      transaction.paymentMethod,
      TransactionPaymentMethod,
    );

    const enriched: Partial<Transaction> = {
      name: transaction.name,
      amount: transaction.amount,
      date: transaction.date,
      type: transaction.type,
      category: transaction.category,
      paymentMethod: transaction.paymentMethod,
    };

    const rawCategory =
      transaction.category && transaction.category !== "OTHER"
        ? transaction.category
        : undefined;

    console.log("EnrichTransaction: ", enriched);

    if (needsType || needsCategory || needsPayment) {
      const dataIaResponse = await detectTransactionDataWithIA(
        transaction.name ?? "",
        rawCategory,
      );

      if (needsType) {
        enriched.type = dataIaResponse.type;
      }

      if (needsCategory) {
        enriched.category = dataIaResponse.category;
      }

      if (needsPayment) {
        enriched.paymentMethod = dataIaResponse.paymentMethod;
      }
    }

    return super.handle(enriched);
  }

  private isValid<T extends string>(
    value: unknown,
    enumType: Record<string, T>,
  ): value is T {
    return (
      typeof value === "string" &&
      (Object.values(enumType) as string[]).includes(value)
    );
  }
}
