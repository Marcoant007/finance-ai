import type { Transaction } from "@/app/utils/interface/transaction-interface";

export function finalizeTransaction(
  transaction: Partial<Transaction>,
): Transaction {
  if (!transaction.name || typeof transaction.name !== "string") {
    throw new Error("Transação inválida: nome ausente");
  }

  if (
    typeof transaction.amount !== "number" ||
    Number.isNaN(transaction.amount)
  ) {
    throw new Error("Transação inválida: valor ausente ou inválido");
  }

  if (
    !(transaction.date instanceof Date) ||
    Number.isNaN(transaction.date.getTime())
  ) {
    throw new Error("Transação inválida: data inválida");
  }

  if (!transaction.type || typeof transaction.type !== "string") {
    transaction.type = "EXPENSE";
  }

  if (!transaction.category || typeof transaction.category !== "string") {
    transaction.category = "OTHER";
  }

  if (
    !transaction.paymentMethod ||
    typeof transaction.paymentMethod !== "string"
  ) {
    transaction.paymentMethod = "CREDIT_CARD";
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
