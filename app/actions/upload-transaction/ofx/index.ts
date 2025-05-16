import ofx from "ofx-parser";
import type {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";

interface Transaction {
  name: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
}

export async function parseOfx(buffer: Buffer): Promise<Transaction[]> {
  const content = buffer.toString("utf-8");
  const data = ofx.parse(content);
  console.log(data);
  const transactions: Transaction[] = [];

  // biome-ignore lint/complexity/noForEach: <explanation>
  //   data.bankTransactions.forEach(tx => {
  //     transactions.push({
  //       name: tx.memo || tx.name || "Sem descrição",
  //       amount: Math.abs(tx.amount),
  //       type: tx.amount >= 0 ? "INCOME" : "EXPENSE",
  //       category: "OTHER",
  //       paymentMethod: "BANK_TRANSFER",
  //       date: new Date(tx.date),
  //     });
  //   });

  return transactions;
}
