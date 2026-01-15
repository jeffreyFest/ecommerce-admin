import prisma from "@/lib/db";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { OrderStatus } from "@prisma/client";

export default async function CustomerDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      addresses: true,
      orders: {
        include: {
          orderItems: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!customer) {
    return (
      <div className="bg-white p-8 rounded shadow text-center">
        <p className="text-gray-500">Customer not found</p>
        <Link
          href="/dashboard/customers"
          className="text-blue-500 hover:underline"
        >
          Back to Customers
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

  // Calculate total spent
  const totalSpent = customer.orders.reduce(
    (sum, order) => sum + order.total.toNumber(),
    0
  );

  return (
    <>
      <PageHeader
        title={`${customer.firstName} ${customer.lastName}`}
        description={`Customer since ${customer.createdAt.toLocaleDateString()}`}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600 text-sm">Total Orders</p>
          <p className="text-2xl font-bold">{customer.orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600 text-sm">Total Spent</p>
          <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600 text-sm">Addresses</p>
          <p className="text-2xl font-bold">{customer.addresses.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="font-medium">{customer.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Phone</p>
              <p className="font-medium">{customer.phone ?? "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-4">
            Addresses ({customer.addresses.length})
          </h2>
          {customer.addresses.length === 0 ? (
            <p className="text-gray-500">No addresses saved</p>
          ) : (
            <div className="space-y-4">
              {customer.addresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-3 rounded border ${
                    address.isDefault
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  {address.isDefault && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded mb-2 inline-block">
                      Default
                    </span>
                  )}
                  <p>{address.street}</p>
                  <p className="text-gray-600">
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="text-gray-600">{address.country}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white p-6 rounded shadow mt-6">
        <h2 className="text-lg font-bold mb-4">
          Order History ({customer.orders.length})
        </h2>

        {customer.orders.length === 0 ? (
          <p className="text-gray-500">No orders yet</p>
        ) : (
          <div className="divide-y">
            {customer.orders.map((order) => (
              <div
                key={order.id}
                className="py-4 flex justify-between items-center"
              >
                <div>
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="font-medium text-blue-500 hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {order.orderItems.length} items •{" "}
                    {order.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <span className="font-medium">
                    ${order.total.toNumber().toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <Link
          href="/dashboard/customers"
          className="text-blue-500 hover:underline"
        >
          ← Back to Customers
        </Link>
      </div>
    </>
  );
}
