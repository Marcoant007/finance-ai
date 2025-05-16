"use client";

import { useState } from "react";
import { uploadTransactionsFile } from "../actions/upload-transaction";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function TransactionsUploader() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadTransactionsFile(formData);

    console.log(result);
    // if (result.success) {
    //     Toast({
    //         title: "Importação concluída"
    //     });
    // } else {
    //     Toast({
    //         variant: "destructive",
    //         title: "Erro ao importar transações",
    //     });
    // }
  };

  return (
    <div className="space-y-4">
      <Input type="file" accept=".csv,.pdf,.ofx" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file}>
        Importar transações
      </Button>
    </div>
  );
}
