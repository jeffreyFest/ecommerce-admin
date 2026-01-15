"use server";

import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { ProductStatus } from "@prisma/client";

export async function EditProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const sku = formData.get("sku") as string;
  const price = formData.get("price");
  const costPrice = formData.get("costPrice") as string;
  const stock = formData.get("stock") as string;
  const status = formData.get("status") as ProductStatus;
  const categoryId = formData.get("categoryId") as string;

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      sku,
      price: Number(price),
      costPrice: Number(costPrice),
      stock: Number(stock),
      status,
      categoryId,
    },
  });

  redirect("/dashboard/product");
}
