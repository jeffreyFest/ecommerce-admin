import prisma from "@/lib/db";
import { EditProduct } from "../../action/editproduct";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const productDetail = await prisma.product.findUnique({
    where: { id },
  });

  const categories = await prisma.category.findMany();

  if (!productDetail) {
    return (
      <div className="bg-white p-8 rounded shadow text-center">
        <p className="text-gray-500">Product not found</p>
        <Link
          href="/dashboard/product"
          className="text-blue-500 hover:underline"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Edit Product"
        description={`Editing: ${productDetail.name}`}
      />

      <div className="bg-white p-6 rounded shadow max-w-2xl">
        <form action={EditProduct} className="space-y-4">
          <input type="hidden" name="id" value={productDetail.id} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              defaultValue={productDetail.name}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={productDetail.description ?? ""}
              rows={3}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU *
              </label>
              <input
                type="text"
                name="sku"
                defaultValue={productDetail.sku}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                defaultValue={productDetail.status}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                defaultValue={productDetail.price.toNumber()}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost Price
              </label>
              <input
                type="number"
                name="costPrice"
                step="0.01"
                defaultValue={productDetail.costPrice?.toNumber() ?? 0}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                step="1"
                defaultValue={productDetail.stock}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="categoryId"
                defaultValue={productDetail.categoryId ?? ""}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
            <Link
              href={`/dashboard/product/${productDetail.id}`}
              className="px-6 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <div className="mt-6">
        <Link
          href="/dashboard/product"
          className="text-blue-500 hover:underline"
        >
          ← Back to Products
        </Link>
      </div>
    </>
  );
}
