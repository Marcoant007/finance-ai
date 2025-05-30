import type { Transaction } from "@/app/utils/interface/transaction-interface";
import { parse } from "csv-parse/sync";
import { buildTransactionProcessingChain } from "../build-transaction";
import { mapHeaders } from "@/app/upload/_actions/upload-transaction/csv/mapper/global-mapper-header";
import { parseCsvRow } from "./parse-csv-rows";

export async function parseCsv(buffer: Buffer): Promise<Transaction[]> {
  const content = buffer.toString("utf-8").replace(/^\uFEFF/, "");

  const rawRecords = parse(content, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, string>[];

  if (!rawRecords.length) return [];

  const headerMap = mapHeaders(Object.keys(rawRecords[0]));
  console.log("HEADER MAP: ", headerMap);
  const handlerChain = buildTransactionProcessingChain();

  const transactions: Transaction[] = [];

  for (const raw of rawRecords) {
    const partial = parseCsvRow(raw, headerMap);
    const finalized = await handlerChain.handle(partial);
    transactions.push(finalized);
  }

  return transactions;
}
