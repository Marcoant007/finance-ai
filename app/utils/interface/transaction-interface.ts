import type {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";

export interface Transaction {
  name: string;
  amount: number;
  date: Date;
  type: TransactionType;
  paymentMethod: TransactionPaymentMethod;
  category: TransactionCategory | string;
}
