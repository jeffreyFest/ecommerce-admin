import PageHeader from "@/components/PageHeader";
import ProductFilters from "@/components/ProductFilter";

import prisma from "@/lib/db";
import { ProductStatus } from "@prisma/client";
import Link from "next/link";

type ProductPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    category?: string;
  }>;
};

export default async function ProductPage({ searchParams }: ProductPageProps) {
  const { search, status, category } = await searchParams;

  const categories = await prisma.category.findMany();

  const products = await prisma.product.findMany({
    where: {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status && { status: status as ProductStatus }),
      ...(category && { categoryId: category }),
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <PageHeader title="Products" description="Manage your product inventory">
        <Link
          href="/dashboard/product/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Product
        </Link>
      </PageHeader>

      <ProductFilters categories={categories} />

      <p className="mb-4 text-gray-600">{products.length} products found</p>

      {products.length === 0 ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-gray-500">No products found</p>
          <p className="text-sm text-gray-400 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    href={`/dashboard/product/${product.id}`}
                    className="font-bold text-lg hover:text-blue-500"
                  >
                    {product.name}
                  </Link>
                  <p className="text-gray-600">SKU: {product.sku}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    product.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : product.status === "DRAFT"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {product.status}
                </span>
              </div>

              <div className="mt-2 flex gap-6 text-sm text-gray-600">
                <p>Price: ${product.price.toNumber().toFixed(2)}</p>
                <p>Stock: {product.stock}</p>
                <p>Category: {product.category?.name ?? "None"}</p>
              </div>

              <div className="mt-3 flex gap-2">
                <Link
                  href={`/dashboard/product/${product.id}`}
                  className="text-blue-500 hover:underline text-sm"
                >
                  View
                </Link>
                <Link
                  href={`/dashboard/product/${product.id}/edit`}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
