import OpenAI from "openai";
import type {
  TransactionType,
  TransactionCategory,
  TransactionPaymentMethod,
} from "@prisma/client";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const VALID_TYPES: TransactionType[] = ["EXPENSE", "DEPOSIT", "INVESTMENT"];
const VALID_CATEGORIES: TransactionCategory[] = [
  "EDUCATION",
  "ENTERTAINMENT",
  "SERVICES",
  "FOOD",
  "HEALTH",
  "HOUSING",
  "OTHER",
  "SALARY",
  "TRANSPORTATION",
  "UTILITY",
  "FOOD_DELIVERY",
  "SIGNATURE",
  "GAMING",
];
const VALID_METHODS: TransactionPaymentMethod[] = [
  "CREDIT_CARD",
  "DEBIT_CARD",
  "BANK_TRANSFER",
  "BANK_SLIP",
  "CASH",
  "PIX",
  "OTHER",
];

export async function detectTransactionDataWithIA(title: string): Promise<{
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
}> {
  const prompt = `
Com base no título da transação abaixo, identifique:

Por default coloque a forma de pagamento como "CREDIT_CARD".

- O tipo da transação (TransactionType): EXPENSE, DEPOSIT ou INVESTMENT
- A categoria da transação (TransactionCategory): ${VALID_CATEGORIES.join(", ")}
- O método de pagamento (TransactionPaymentMethod): ${VALID_METHODS.join(", ")}

Retorne **apenas** no seguinte formato JSON:
{
  "type": "EXPENSE",
  "category": "FOOD",
  "paymentMethod": "CREDIT_CARD"
}

Título: "${title}"
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente financeiro especializado em classificar transações bancárias para sistemas de controle financeiro.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const raw = completion.choices[0].message.content?.trim() ?? "";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    console.log("🔍 Classificando transação:");
    console.log("📌 Título:", title);
    console.log("🧾 Resposta da IA (bruta):", raw);
    console.log("🧾 Resposta da IA (limpa):", cleaned);

    const parsed = JSON.parse(cleaned);

    const isValid =
      VALID_TYPES.includes(parsed.type) &&
      VALID_CATEGORIES.includes(parsed.category) &&
      VALID_METHODS.includes(parsed.paymentMethod);

    if (!isValid) {
      console.warn("⚠️ Classificação inválida detectada:", parsed);
      throw new Error("Resposta inválida da IA.");
    }

    console.log("✅ Classificação OK:", parsed);

    return parsed;
  } catch (error) {
    console.error("❌ Erro ao classificar transação com IA:", error);

    return {
      type: "EXPENSE",
      category: "OTHER",
      paymentMethod: "CREDIT_CARD",
    };
  }
}
