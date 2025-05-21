"use server";

import type { Transaction } from "@/app/utils/interface/transaction-interface";
import { upsertTransaction } from "../add-transaction";
import { parseCsv } from "./csv/parse-csv";
import { parseOfx } from "./ofx";

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

    for (const tx of transactions) {
      try {
        await upsertTransaction(tx);
      } catch (err) {
        console.error("❌ Erro ao salvar transação:", tx, err);
      }
    }

    return { success: true, transactions };
  } catch (error) {
    console.error("❌ Erro ao processar o arquivo:", error);
    return { success: false, error: "Erro ao processar o arquivo" };
  }
}
