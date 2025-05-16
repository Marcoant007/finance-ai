import { parse } from "csv-parse/sync";
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

interface CsvRecord {
  Nome: string;
  Valor: string;
  Data: string;
  Categoria: string;
  Cartão: string;
  "Forma de Pagamento": string;
}

export async function parseCsv(buffer: Buffer): Promise<Transaction[]> {
  const content = buffer.toString("utf-8");
  console.log("CSV Content:", content);

  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return records.map((record: CsvRecord) => {
    const amount = Number.parseFloat(
      record.Valor.replace(",", ".").replace("+", ""),
    );
    const isIncome = record.Valor.includes("+");

    return {
      name: record.Nome || "Sem descrição",
      amount: Math.abs(amount),
      type: isIncome ? "DEPOSIT" : "EXPENSE",
      category: "OTHER",
      paymentMethod: "CREDIT_CARD",
      date: new Date(record.Data),
    };
  });
}
