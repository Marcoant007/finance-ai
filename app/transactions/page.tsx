import { redirect } from "next/navigation";
import AddTransactionButton from "../_components/add-transaction-button";
import Navbar from "../_components/navbar";
import { DataTable } from "../_components/ui/data-table";
import { db } from "../_lib/prisma";
import { transactionColumns } from "./_columns";
import { auth } from "@clerk/nextjs/server";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import { ScrollArea } from "../_components/ui/scroll-area";

const Transactions = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const transactions = await db.transaction.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
  });

  const userAddTransactions = await canUserAddTransaction();

  return (
    <>
      <Navbar />
      <ScrollArea>
        <div className="space-y-6 overflow-hidden p-6">
          <div className="flex w-full items-center justify-between">
            <h1 className="text-2xl font-bold">Transações</h1>
            <AddTransactionButton
              userCardAddTransactions={userAddTransactions}
            />
          </div>
          <DataTable
            columns={transactionColumns}
            data={JSON.parse(JSON.stringify(transactions))}
          />
        </div>
      </ScrollArea>
    </>
  );
};

export default Transactions;
