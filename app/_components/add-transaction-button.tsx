"use client";

import { ArrowDownUpIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import UpsertTransactionalDialog from "./upsert-transaction-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface AddTransactionButtonProps {
  userCardAddTransactions?: boolean;
}

const AddTransactionButton = ({
  userCardAddTransactions,
}: AddTransactionButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-full"
              onClick={() => setDialogIsOpen(true)}
              disabled={!userCardAddTransactions}
            >
              <ArrowDownUpIcon />
              Adicionar Transação
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {!userCardAddTransactions &&
              "Você atingiu o limite de transações. Atualize seu plano para adicionar mais transações."}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <UpsertTransactionalDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </>
  );
};

export default AddTransactionButton;
