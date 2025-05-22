import type { Transaction } from "@/app/utils/interface/transaction-interface";
import { TransactionCategory } from "@prisma/client";
import { AbstractTransactionHandler } from "./abstract-transaction-handler";

export class ValidateCategoryHandler extends AbstractTransactionHandler {
  async handle(
    transaction: Partial<Transaction>,
  ): Promise<Partial<Transaction>> {
    const isValid =
      typeof transaction.category === "string" &&
      Object.values(TransactionCategory).includes(
        transaction.category as TransactionCategory,
      );

    const updated: Partial<Transaction> = {
      ...transaction,
      category: isValid ? transaction.category : undefined,
    };

    return super.handle(updated);
  }
}
