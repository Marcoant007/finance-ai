import type { Transaction } from "@/app/utils/interface/transaction-interface";
import { AbstractTransactionHandler } from "./abstract-transaction-handler";

export class FinalizeTransactionHandler extends AbstractTransactionHandler {
  async handle(transaction: Partial<Transaction>): Promise<Transaction> {
    if (!transaction.name || typeof transaction.name !== "string") {
      throw new Error("Transação inválida: campo 'name' obrigatório");
    }

    if (
      typeof transaction.amount !== "number" ||
      Number.isNaN(transaction.amount)
    ) {
      throw new Error("Transação inválida: campo 'amount' obrigatório");
    }

    if (
      !(transaction.date instanceof Date) ||
      Number.isNaN(transaction.date.getTime())
    ) {
      throw new Error("Transação inválida: campo 'date' obrigatório");
    }

    if (
      !transaction.type ||
      !transaction.category ||
      !transaction.paymentMethod
    ) {
      throw new Error("Transação inválida: campos obrigatórios ausentes");
    }

    return {
      name: transaction.name,
      amount: transaction.amount,
      date: transaction.date,
      type: transaction.type,
      category: transaction.category,
      paymentMethod: transaction.paymentMethod,
    };
  }
}
