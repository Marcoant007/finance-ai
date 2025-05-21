import type { Transaction } from "@/app/utils/interface/transaction-interface";
import { parse } from "csv-parse/sync";
import { mapCsvToTransactions } from "./mapper";

interface CsvRecord {
  title: string;
  amount: string;
  date: string;
  category: string;
  card: string;
  "Forma de Pagamento": string;
}

export async function parseCsv(buffer: Buffer): Promise<Transaction[]> {
  const content = buffer.toString("utf-8");

  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const rawRecords = records.map((record: CsvRecord) => ({
    title: record.title,
    amount: record.amount,
    date: record.date,
  }));

  return mapCsvToTransactions(rawRecords);
}
