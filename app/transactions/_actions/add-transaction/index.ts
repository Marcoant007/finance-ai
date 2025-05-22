"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import type {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { addTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";

interface UpsertTransaction {
  id?: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
}

export const upsertTransaction = async (params: UpsertTransaction) => {
  addTransactionSchema.parse(params);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (params.id) {
    await db.transaction.upsert({
      where: { id: params.id },
      update: { ...params, userId },
      create: { ...params, userId },
    });
  } else {
    try {
      await db.transaction.create({
        data: { ...params, userId },
      });
    } catch (err) {
      console.error("❌ Erro ao criar transação:", err);
    }
  }

  revalidatePath("/transactions");
};
