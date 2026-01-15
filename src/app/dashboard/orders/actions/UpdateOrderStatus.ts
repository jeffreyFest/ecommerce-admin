"use server";

import prisma from "@/lib/db";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as OrderStatus;

  await prisma.order.update({
    where: { id },
    data: { status },
  });

  revalidatePath(`/dashboard/orders/${id}`);
}
