import type { Transaction } from "@/app/utils/interface/transaction-interface";

export interface TransactionHandler {
  setNext(handler: TransactionHandler): TransactionHandler;
  handle(transaction: Partial<Transaction>): Promise<Partial<Transaction>>;
}
