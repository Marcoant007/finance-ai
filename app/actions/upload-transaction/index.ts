"use server";

import { upsertTransaction } from "../add-transaction";
import { parseCsv } from "./csv/parse-csv";

export async function uploadTransactionsFile(formData: FormData) {
  console.log("uploadTransactionsFile", formData);
  const file = formData.get("file") as File;
  if (!file) {
    return {
      success: false,
      error: "Arquivo não encontrado",
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split(".").pop()?.toLocaleLowerCase();

  // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
  let transactions;

  console.log(extension);

  try {
    if (extension === "csv") {
      transactions = await parseCsv(buffer);
    } else if (extension === "ofx") {
      // transactions = await parseOfx(buffer);
    } else if (extension === "pdf") {
      // transactions = await parsePdf(buffer);
    } else {
      return {
        success: false,
        error: "Formato de arquivo não suportado",
      };
    }

    console.log("transactions: ", transactions);

    if (transactions !== undefined && transactions.length > 0) {
      for (const tx of transactions) {
        try {
          await upsertTransaction(tx);
        } catch (err) {
          console.error("❌ Erro ao salvar transação:", tx, err);
        }
      }
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Erro ao processar o arquivo",
    };
  }
}
