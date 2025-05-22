"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";
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

          <div className="mb-6 flex flex-col items-center text-center">
            <p className="text-sm text-muted-foreground">
              Envie um arquivo CSV ou OFX para importar suas transações.
            </p>
          </div>

          {transactions.length === 0 && (
            <TransactionsUploader
              onSuccess={(txs) => {
                setTransactions(txs);
              }}
            />
          )}

          {transactions.length > 0 && (
            <>
              <ul className="space-y-2 pt-4">
                {transactions.map((tx, i) => (
                  <li
                    key={i}
                    className="rounded-md bg-card px-4 py-2 shadow-sm"
                  >
                    <div className="font-medium">{tx.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString("pt-BR", {
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
