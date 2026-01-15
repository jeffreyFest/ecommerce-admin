import prisma from "@/lib/db";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteProductAction } from "../action/deleteproduct";
import RoleGate from "@/components/RoleGate";
import PageHeader from "@/components/PageHeader";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      orderItems: {
        include: {
          order: {
            include: {
              customer: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
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
      <PageHeader title={product.name} description={`SKU: ${product.sku}`}>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/product/${product.id}/edit`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit Product
          </Link>
          <RoleGate allowedRoles={["ADMIN"]} userRole={session?.user?.role}>
            <form action={deleteProductAction.bind(null, product.id)}>
              <button
                type="submit"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete Product
              </button>
            </form>
          </RoleGate>
        </div>
      </PageHeader>

      <div className="grid grid-cols-2 gap-6">
        {/* Product Details */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Product Details</h2>

          <div className="space-y-3">
            <div>
              <p className="text-gray-600 text-sm">Name</p>
              <p className="font-medium">{product.name}</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm">Description</p>
              <p>{product.description ?? "No description"}</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm">Price</p>
              <p className="font-medium">
                ${product.price.toNumber().toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-gray-600 text-sm">Cost Price</p>
              <p>${product.costPrice?.toNumber().toFixed(2) ?? "N/A"}</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm">Stock</p>
              <p
                className={
                  product.stock < product.lowStockThreshold
                    ? "text-red-500 font-bold"
                    : ""
                }
              >
                {product.stock} units
                {product.stock < product.lowStockThreshold && " (Low Stock!)"}
              </p>
            </div>

            <div>
              <p className="text-gray-600 text-sm">Status</p>
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

            <div>
              <p className="text-gray-600 text-sm">Category</p>
              <p>{product.category?.name ?? "None"}</p>
            </div>
          </div>
        </div>

        {/* Orders containing this product */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-4">
            Orders ({product.orderItems.length})
          </h2>

          {product.orderItems.length === 0 ? (
            <p className="text-gray-500">No orders contain this product</p>
          ) : (
            <div className="space-y-3">
              {product.orderItems.map((item) => (
                <div key={item.id} className="border-b pb-3">
                  <Link
                    href={`/dashboard/orders/${item.order.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {item.order.orderNumber}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {item.order.customer.firstName}{" "}
                    {item.order.customer.lastName}
                  </p>
                  <p className="text-sm">
                    Qty: {item.quantity} × $
                    {item.unitPrice.toNumber().toFixed(2)} = $
                    {item.total.toNumber().toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
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
