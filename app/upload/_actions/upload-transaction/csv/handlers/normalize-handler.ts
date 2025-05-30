import type { Transaction } from "@/app/utils/interface/transaction-interface";
import { AbstractTransactionHandler } from "./abstract-transaction-handler";

export class NormalizeTransactionHandler extends AbstractTransactionHandler {
  async handle(
    transaction: Partial<Transaction>,
  ): Promise<Partial<Transaction>> {
    console.log("NormalizeTransaction Before Normalized: ", transaction);

    const normalized: Partial<Transaction> = {
      name: transaction.name ?? "",
      amount: transaction.amount ?? 0,
      date: new Date(),
      type: transaction.type ?? "EXPENSE",
      paymentMethod: transaction.paymentMethod ?? "CREDIT_CARD",
      category: transaction.category ?? "OTHER",
    };

    console.log("NormalizeTransaction: ", normalized);

    return super.handle(normalized);
  }
}
