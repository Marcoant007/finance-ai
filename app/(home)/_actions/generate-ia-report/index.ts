"use server";

import { db } from "@/app/_lib/prisma";

export const generateIAReport = async (month: string) => {
  const transaction = await db.transaction.findMany({
    where: {
      date: {
        gte: new Date(`2025-${month}-01`),
        lte: new Date(`2025-${month}-31`),
      },
    },
  });
  console.log(transaction);
};
