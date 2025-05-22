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
  return transactions;
}
