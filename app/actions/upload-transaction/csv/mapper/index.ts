import { detectTransactionDataWithIA } from "@/app/(home)/_actions/category-ia";
import type {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";

interface RawTransaction {
  date: string;
  title: string;
  amount: string;
}

interface Transaction {
  name: string;
  amount: number;
  date: Date;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
}

export async function mapCsvToTransactions(
  csv: RawTransaction[],
): Promise<Transaction[]> {
  const transactions = await Promise.all(
    csv.map(async ({ title, amount, date }) => {
      const parsedAmount = amount.replace(",", ".");
      const numericAmount = Number.parseFloat(parsedAmount);
      const transactionDataAi = await detectTransactionDataWithIA(title);

      return {
        name: title,
        amount: Math.abs(numericAmount),
        date: new Date(date),
        ...transactionDataAi,
      };
    }),
  );

  return transactions;
}
