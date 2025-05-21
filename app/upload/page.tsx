"use client";

import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "../_components/navbar";
import { TransactionsUploader } from "../_components/transactions-uploader";
import { Button } from "../_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../_components/ui/dialog";
import type { Transaction } from "../utils/interface/transaction-interface";

export default function ImportPage() {
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const router = useRouter();

  return (
    <>
      <Navbar />

      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-border bg-muted p-6 shadow-lg">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileText className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Importar Fatura
            </h2>
            <p className="text-sm text-muted-foreground">
              Envie um arquivo CSV ou OFX para importar suas transações.
            </p>
          </div>

          <TransactionsUploader
            onSuccess={(txs) => {
              setTransactions(txs);
              setOpen(true);
            }}
          />
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transações importadas</DialogTitle>
          </DialogHeader>

          <ul className="space-y-2">
            {transactions.map((tx, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <li key={i} className="rounded-md bg-card px-4 py-2 shadow-sm">
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
        </DialogContent>
      </Dialog>
    </>
  );
}
