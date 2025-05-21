"use client";

import { useState } from "react";
import { uploadTransactionsFile } from "../actions/upload-transaction";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { Transaction } from "../utils/interface/transaction-interface";

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
        onSuccess(result.transactions);
      } else {
        alert(result.error || "Erro ao importar transações");
      }
    } catch (err) {
      alert("Erro inesperado ao importar transações");
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
        {loading ? "Importando..." : "Importar transações"}
      </Button>
    </div>
  );
}
