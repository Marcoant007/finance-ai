import type { Transaction } from "@/app/utils/interface/transaction-interface";
import pdf from "pdf-parse";

export async function parsePdf(buffer: Buffer): Promise<Transaction[]> {
  const data = await pdf(buffer);
  const text = data.text;
  const lines = text
    .split("\n")
    .filter((line: string) => /\d{2}\/\d{2}\/\d{4}/.test(line));
  const transactions: Transaction[] = [];

  for (const line of lines) {
    const [rawDate, ...rest] = line.trim().split(" ");
    const date = new Date(rawDate.split("/").reverse().join("-"));
    const amountStr = rest.pop();
    const name = rest.join(" ");
    if (amountStr !== undefined) {
      const value = Number.parseFloat(
        amountStr.replace(",", ".").replace("+", ""),
      );
      const isIncome = amountStr.includes("+");
      transactions.push({
        name,
        amount: Math.abs(value),
        type: isIncome ? "DEPOSIT" : "EXPENSE",
        category: "OTHER",
        paymentMethod: "CREDIT_CARD",
        date,
      });
    } else {
      console.error("Valor não encontrado na linha:", line);
    }
  }

  return transactions;
}
