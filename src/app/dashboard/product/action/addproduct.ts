"use server";

import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export async function CreateProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const sku = formData.get("sku") as string;
  const price = formData.get("price") as string;
  const stock = formData.get("stock") as string;
  const categoryId = formData.get("categoryId") as string;

  await prisma.product.create({
    data: {
      name,
      description,
      sku,
      price: Number(price),
      stock: Number(stock),
      categoryId,
    },
  });

  redirect("/dashboard/product");
}
