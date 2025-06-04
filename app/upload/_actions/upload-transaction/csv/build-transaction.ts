import type { Transaction } from "@/app/utils/interface/transaction-interface";
import { NormalizeTransactionHandler } from "./handlers/normalize-handler";
import { EnrichTransactionWithIAHandler } from "./handlers/enrich-with-ia-handler";
import { FinalizeTransactionHandler } from "./handlers/finalize-transaction-handler";

export function buildTransactionProcessingChain(): {
  handle(transaction: Partial<Transaction>): Promise<Transaction>;
} {
  const normalize = new NormalizeTransactionHandler();
  const enrich = new EnrichTransactionWithIAHandler();
  const finalize = new FinalizeTransactionHandler();

  normalize.setNext(enrich).setNext(finalize);

  return {
    handle: (transaction) =>
      normalize.handle(transaction) as Promise<Transaction>,
  };
}
