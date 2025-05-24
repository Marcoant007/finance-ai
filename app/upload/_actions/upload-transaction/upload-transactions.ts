"use server";

import { upsertTransaction } from "@/app/transactions/_actions/add-transaction";
import type { Transaction } from "@/app/utils/interface/transaction-interface";
import { parseCsv } from "./csv/parser/parse-csv";
import { parseOfx } from "./ofx/parse-ofx";

export async function uploadTransactionsFile(
  formData: FormData,
): Promise<
  | { success: true; transactions: Transaction[] }
  | { success: false; error: string }
> {
  const file = formData.get("file") as File | null;

  if (!file) {
    return { success: false, error: "Arquivo não encontrado" };
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (!extension || !["csv", "ofx"].includes(extension)) {
    return { success: false, error: "Formato de arquivo não suportado" };
  }

  try {
    const transactions =
      extension === "csv" ? await parseCsv(buffer) : await parseOfx(buffer);

    for (const transaction of transactions) {
      try {
        await upsertTransaction(transaction);
      } catch (err) {
        console.error("❌ Erro ao salvar transação:", err);
        throw new Error(
          `Erro ao salvar transação: ${transaction.name} - ${transaction.amount} - ${transaction.date}`,
        );
      }
    }

    return { success: true, transactions };
  } catch (error: unknown) {
    let rawMessage = "";

    if (error instanceof Error) {
      rawMessage = error.message;
    }

    const isCsvParseError =
      rawMessage.includes("Invalid") || rawMessage.includes("CSV");

    console.error("❌ Erro ao processar o arquivo:", error);

    return {
      success: false,
      error: isCsvParseError
        ? "Erro no formato do CSV. Verifique se os valores estão entre aspas corretamente."
        : "Erro ao processar o arquivo.",
    };
  }
}
