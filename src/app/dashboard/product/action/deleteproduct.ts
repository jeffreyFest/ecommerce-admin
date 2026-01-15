"use server";

import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export async function deleteProductAction(id: string) {
  await prisma.product.delete({
    where: { id },
  });

  redirect("/dashboard/product");
}
