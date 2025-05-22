import type { Transaction } from "@/app/utils/interface/transaction-interface";
import { AbstractTransactionHandler } from "./abstract-transaction-handler";

export class SetDefaultValuesHandler extends AbstractTransactionHandler {
  async handle(
    transaction: Partial<Transaction>,
  ): Promise<Partial<Transaction>> {
    const withDefaults: Partial<Transaction> = {
      ...transaction,
      type: "EXPENSE",
      paymentMethod: "CREDIT_CARD",
    };

    return super.handle(withDefaults);
  }
}
