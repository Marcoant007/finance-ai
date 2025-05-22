"use client";

import { UploadTransactionsModal } from "../upload-transaction-modal";

export function UploadTransactionsWrapper() {
  return (
    <div className="flex justify-end">
      <UploadTransactionsModal />
    </div>
  );
}
