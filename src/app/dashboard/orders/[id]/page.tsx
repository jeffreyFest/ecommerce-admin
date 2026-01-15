import prisma from "@/lib/db";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { OrderStatus } from "@prisma/client";

export default async function OrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      shippingAddress: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return (
      <div className="bg-white p-8 rounded shadow text-center">
        <p className="text-gray-500">Order not found</p>
        <Link
          href="/dashboard/orders"
          className="text-blue-500 hover:underline"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "PROCESSING":
        return "bg-purple-100 text-purple-800";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "REFUNDED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <PageHeader
        title={`Order ${order.orderNumber}`}
        description={`Placed on ${order.createdAt.toLocaleDateString()}`}
      >
        <span
          className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </PageHeader>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>${order.subtotal.toNumber().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>${order.tax.toNumber().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>${order.shippingCost.toNumber().toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-3 font-bold">
              <span>Total</span>
              <span>${order.total.toNumber().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Customer</h2>
          <div className="space-y-2">
            <Link
              href={`/dashboard/customers/${order.customer.id}`}
              className="text-blue-500 hover:underline font-medium"
            >
              {order.customer.firstName} {order.customer.lastName}
            </Link>
            <p className="text-gray-600">{order.customer.email}</p>
            <p className="text-gray-600">
              {order.customer.phone ?? "No phone"}
            </p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
          {order.shippingAddress ? (
            <div className="space-y-1 text-gray-600">
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          ) : (
            <p className="text-gray-500">No shipping address</p>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-bold mb-4">
          Order Items ({order.orderItems.length})
        </h2>

        <div className="divide-y">
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              className="py-4 flex justify-between items-center"
            >
              <div>
                <Link
                  href={`/dashboard/product/${item.product.id}`}
                  className="font-medium text-blue-500 hover:underline"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-600">SKU: {item.product.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">
                  {item.quantity} × ${item.unitPrice.toNumber().toFixed(2)}
                </p>
                <p className="font-medium">
                  ${item.total.toNumber().toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/dashboard/orders"
          className="text-blue-500 hover:underline"
        >
          ← Back to Orders
        </Link>
      </div>
    </>
  );
}
