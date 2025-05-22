import type { Transaction } from "@/app/utils/interface/transaction-interface";
import { SetDefaultValuesHandler } from "./handlers/default-handlers";
import { ValidateCategoryHandler } from "./handlers/validate-category-handler";
import { EnrichWithIAHandler } from "./handlers/enrich-with-ia-handler";
import { FinalizeTransactionHandler } from "./handlers/finalize-transaction-handler";

export function buildTransactionProcessingChain(): {
  handle(transaction: Partial<Transaction>): Promise<Transaction>;
} {
  const setDefaults = new SetDefaultValuesHandler();
  const validateCategory = new ValidateCategoryHandler();
  const enrichWithIA = new EnrichWithIAHandler();
  const finalize = new FinalizeTransactionHandler();

  setDefaults.setNext(validateCategory).setNext(enrichWithIA).setNext(finalize);

  return setDefaults as unknown as {
    handle(transaction: Partial<Transaction>): Promise<Transaction>;
  };
}
