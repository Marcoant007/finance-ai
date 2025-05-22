import type { Transaction } from "@/app/utils/interface/transaction-interface";

const headerAliases: Record<keyof Transaction, string[]> = {
  name: [
    "title",
    "lancamento",
    "lançamento",
    "launch",
    "descricao",
    "descrição",
    "name",
  ],
  amount: ["valor", "amount", "value"],
  date: ["data", "date"],
  type: ["tipo", "type"],
  category: ["categoria", "category"],
  paymentMethod: ["forma de pagamento", "cartao", "cartão", "payment method"],
};

export function mapHeaders(
  headers: string[],
): Record<string, keyof Transaction> {
  const map: Record<string, keyof Transaction> = {};

  for (const header of headers) {
    const normalized = header.trim().toLowerCase();
    for (const [field, aliases] of Object.entries(headerAliases)) {
      if (aliases.includes(normalized)) {
        map[header] = field as keyof Transaction;
        break;
      }
    }
  }

  return map;
}
