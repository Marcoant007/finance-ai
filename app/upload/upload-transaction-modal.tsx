"use client";

import { useState } from "react";
import { FileText, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Transaction } from "../utils/interface/transaction-interface";
import { Button } from "../_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../_components/ui/dialog";
import { TransactionsUploader } from "./_components/transactions-uploader";

export function UploadTransactionsModal() {
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const router = useRouter();

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <FileText className="mr-2 h-4 w-4" />
        Importar Fatura
      </Button>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) setTransactions([]);
        }}
      >
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Importar Fatura</DialogTitle>
          </DialogHeader>

          {transactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4 py-6 text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <UploadCloud className="h-12 w-12 text-primary" />
              </motion.div>
              <p className="text-sm text-muted-foreground">
                Arraste ou selecione um arquivo CSV ou OFX para importar.
              </p>

              <TransactionsUploader onSuccess={setTransactions} />
            </motion.div>
          ) : (
            <>
              <ul className="space-y-2 pt-4">
                {transactions.map((transaction, i) => (
                  <li
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={i}
                    className="rounded-md bg-card px-4 py-2 shadow-sm"
                  >
                    <div className="font-medium">{transaction.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex justify-end">
                <Button onClick={() => router.push("/transactions")}>
                  Ver Transações
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
