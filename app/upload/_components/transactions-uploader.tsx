"use client";

import { useState } from "react";
import { Input } from "../../_components/ui/input";
import { Button } from "../../_components/ui/button";
import type { Transaction } from "../../utils/interface/transaction-interface";
import { toast } from "sonner";
import { uploadTransactionsFile } from "../_actions/upload-transaction/upload-transactions";
import { Loader2Icon } from "lucide-react";

interface Props {
  onSuccess: (transactions: Transaction[]) => void;
}

export function TransactionsUploader({ onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadTransactionsFile(formData);

      if (result.success) {
        toast.success("Transações importadas com sucesso!");
        onSuccess(result.transactions);
      } else {
        toast.error(result.error || "Erro ao importar transações");
      }
    } catch (err) {
      toast.error("Erro inesperado ao importar transações");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="file"
        accept=".csv,.ofx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <Button disabled={!file || loading} onClick={handleUpload}>
        {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Importando..." : "Importar transações"}
      </Button>
    </div>
  );
}
