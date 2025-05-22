# 📘 Fluxo de Processamento de Transações via CSV

Este módulo implementa um sistema de importação e tratamento de transações a partir de arquivos CSV, utilizando o padrão de projeto **Chain of Responsibility** para tornar o fluxo modular, escalável e de baixa dependência entre as partes.

---

## 📊 Objetivo

- Permitir a importação de CSVs com diferentes padrões de colunas (Inter, Nubank, etc.)
- Adaptar, enriquecer e validar transações dinamicamente
- Utilizar IA para completar informações ausentes (categoria, tipo, método de pagamento)

---

## 🗂️ Estrutura do Módulo

```
transactions/
├── chain/
│   └── build-transaction.ts
├── handlers/
│   ├── abstract-transaction-handler.ts
│   ├── set-default-values-handler.ts
│   ├── validate-category-handler.ts
│   ├── enrich-with-ia-handler.ts
│   └── finalize-transaction-handler.ts
├── parser/
│   ├── parse-csv.ts
│   ├── parse-csv-row.ts
│   └── map-headers.ts
└── ia/
    └── detect-transaction-data-with-ia.ts
```

---

## ⚙️ Funcionamento Geral

### Entrada:

```ts
await parseCsv(buffer: Buffer): Promise<Transaction[]>;
```

### Passos:

1. Lê o CSV em buffer
2. Normaliza os headers com `mapHeaders`
3. Converte linha a linha para `Partial<Transaction>` com `parseCsvRow`
4. Processa cada linha pela cadeia de responsabilidade
5. Retorna apenas `Transaction` válidas e completas

---

## ⚖️ Cadeia de Responsabilidade

```text
SetDefaultValuesHandler
   ↓
ValidateCategoryHandler
   ↓
EnrichWithIAHandler
   ↓
FinalizeTransactionHandler
```

### Responsabilidades:

| Handler                      | Função                                                            |
| ---------------------------- | ----------------------------------------------------------------- |
| `SetDefaultValuesHandler`    | Define `type = EXPENSE` e `paymentMethod = CREDIT_CARD`           |
| `ValidateCategoryHandler`    | Verifica se a categoria é válida; se não for, zera para uso da IA |
| `EnrichWithIAHandler`        | Preenche campos ausentes com IA (type, category, paymentMethod)   |
| `FinalizeTransactionHandler` | Garante que todos os campos obrigatórios existem e são válidos    |

---

## 🧑‍🧠 IA no Fluxo

A IA é utilizada **apenas quando necessário**, e responde com um JSON no formato:

```json
{
  "type": "EXPENSE",
  "category": "FOOD",
  "paymentMethod": "CREDIT_CARD"
}
```

A chamada à IA é feita via OpenAI, a partir do título da transação.

---

## ✅ Benefícios

- ✅ Modularidade: handlers são pequenos e reutilizáveis
- ✅ Extensível: fácil incluir novos tipos de tratamento
- ✅ Baixo acoplamento entre as etapas
- ✅ Tipagem forte com TypeScript sem usar `as` ou `!`

---

## 🚀 Exemplo de Uso

```ts
import { parseCsv } from "@/app/utils/transactions/parser/parse-csv";

const buffer = fs.readFileSync("fatura-inter.csv");
const transactions = await parseCsv(buffer);
```

---

## ⚛️ Futuras Extensões

- Suporte a arquivos OFX
- Handler de sanitização de descrição
- Handler de detecção de parcelamento / agrupamento de transações

---

> Desenvolvido com foco em escalabilidade e legibilidade para fluxo financeiro automatizado.
