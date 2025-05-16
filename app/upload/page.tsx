import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import { TransactionsUploader } from "../_components/transactions-uploader";
import { FileText } from "lucide-react";

const ImportPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-border bg-muted p-6 shadow-lg">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileText className="h-8 w-8" />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-foreground">
              Importar Fatura
            </h2>
            <p className="text-sm text-muted-foreground">
              Envie um arquivo CSV, PDF ou OFX para importar suas transações.
            </p>
          </div>

          <TransactionsUploader />
        </div>
      </div>
    </>
  );
};

export default ImportPage;
