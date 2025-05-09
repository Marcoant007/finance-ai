"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import type {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { addTransactionSchema } from "./schema";

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
    await db.transaction.create({
      data: { ...params, userId },
    });
  }

  revalidatePath("/transactions");
};
