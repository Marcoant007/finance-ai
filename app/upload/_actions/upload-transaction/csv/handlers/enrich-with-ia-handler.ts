import type { Transaction } from "@/app/utils/interface/transaction-interface";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { AbstractTransactionHandler } from "./abstract-transaction-handler";
import { detectTransactionDataWithIA } from "@/app/(home)/_actions/category-ia";

export class EnrichWithIAHandler extends AbstractTransactionHandler {
  async handle(
    transaction: Partial<Transaction>,
  ): Promise<Partial<Transaction>> {
    const needsType = !this.isValidType(transaction.type);
    const needsCategory = !this.isValidCategory(transaction.category);
    const needsPayment = !this.isValidPaymentMethod(transaction.paymentMethod);

    if (!needsType && !needsCategory && !needsPayment) {
      return super.handle(transaction);
    }

    const detectIaTransaction = await detectTransactionDataWithIA(
      transaction.name ?? "",
    );

    const enriched: Partial<Transaction> = {
      ...transaction,
      type: needsType ? detectIaTransaction.type : transaction.type,
      category: needsCategory
        ? detectIaTransaction.category
        : transaction.category,
      paymentMethod: needsPayment
        ? detectIaTransaction.paymentMethod
        : transaction.paymentMethod,
    };

    return super.handle(enriched);
  }

  private isValidType(value: unknown): value is TransactionType {
    return (
      typeof value === "string" &&
      Object.values(TransactionType).includes(value as TransactionType)
    );
  }

  private isValidCategory(value: unknown): value is TransactionCategory {
    return (
      typeof value === "string" &&
      Object.values(TransactionCategory).includes(value as TransactionCategory)
    );
  }

  private isValidPaymentMethod(
    value: unknown,
  ): value is TransactionPaymentMethod {
    return (
      typeof value === "string" &&
      Object.values(TransactionPaymentMethod).includes(
        value as TransactionPaymentMethod,
      )
    );
  }
}
