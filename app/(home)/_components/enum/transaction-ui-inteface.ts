import {
  TransactionCategoryEnum,
  TransactionPaymentMethodEnum,
  TransactionTypeEnum,
} from "./transaction-type-enum";

export interface TransactionUI {
  id: string;
  name: string;
  amount: number;
  date: Date;
  type: TransactionTypeEnum;
  paymentMethod: TransactionPaymentMethodEnum;
  category: TransactionCategoryEnum;
}
