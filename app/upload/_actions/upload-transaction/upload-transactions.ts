"use server";

import { upsertTransaction } from "@/app/transactions/_actions/add-transaction";
import type { Transaction } from "@/app/utils/interface/transaction-interface";
import { parseCsv } from "./csv/parser/parse-csv";
import { parseOfx } from "./ofx/parse-ofx";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";

export async function uploadTransactionsFile(
  formData: FormData,
): Promise<
  | { success: true; transactions: Transaction[] }
  | { success: false; error: string }
> {
  const file = formData.get("file") as File | null;

  if (!file) return error("Arquivo não encontrado");

  const extension = getExtension(file.name);
  if (!["csv", "ofx"].includes(extension))
    return error("Formato de arquivo não suportado");

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const transactions = await parseFile(buffer, extension);
    await processTransactions(transactions);
    return { success: true, transactions };
  } catch (err) {
    return handleProcessingError(err);
  }
}

function getExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

function error(msg: string) {
  return { success: false, error: msg } as const;
}

async function parseFile(
  buffer: Buffer,
  extension: string,
): Promise<Transaction[]> {
  return extension === "csv" ? await parseCsv(buffer) : await parseOfx(buffer);
}

async function processTransactions(transactions: Transaction[]) {
  for (const tx of transactions) {
    validateTransactionEnums(tx);
    await upsertTransaction({
      ...tx,
      type: tx.type as TransactionType,
      category: tx.category as TransactionCategory,
      paymentMethod: tx.paymentMethod as TransactionPaymentMethod,
    });
  }
}

function validateTransactionEnums(transaction: Transaction) {
  if (
    !isValidEnumValue(TransactionCategory, transaction.category) ||
    !isValidEnumValue(TransactionType, transaction.type) ||
    !isValidEnumValue(TransactionPaymentMethod, transaction.paymentMethod)
  ) {
    throw new Error(`Tipo inválido em: ${transaction.name}`);
  }
}

function isValidEnumValue<T extends Record<string, string | number>>(
  enumObj: T,
  value: unknown,
): value is T[keyof T] {
  return Object.values(enumObj).includes(value as T[keyof T]);
}

function failureResult(msg: string) {
  return { success: false, error: msg } as const;
}

function handleProcessingError(err: unknown) {
  const rawMessage = err instanceof Error ? err.message : String(err);
  const isCsvParseError =
    rawMessage.includes("Invalid") || rawMessage.includes("CSV");

  console.error("❌ Erro ao processar o arquivo:", err);

  return failureResult(
    isCsvParseError
      ? "Erro no formato do CSV. Verifique se os valores estão entre aspas corretamente."
      : "Erro ao processar o arquivo.",
  );
}
