import PageHeader from "@/components/PageHeader";
import OrderFilters from "@/components/OrderFilters";
import prisma from "@/lib/db";
import { OrderStatus } from "@prisma/client";
import Link from "next/link";

type OrderPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const { status } = await searchParams;

  const orders = await prisma.order.findMany({
    where: {
      ...(status && { status: status as OrderStatus }),
    },
    include: {
      customer: true,
      orderItems: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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
      <PageHeader title="Orders" description="View and manage orders" />

      <OrderFilters />

      <p className="mb-4 text-gray-600">{orders.length} orders found</p>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="font-bold text-lg hover:text-blue-500"
                  >
                    {order.orderNumber}
                  </Link>
                  <p className="text-gray-600">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-sm ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-2 flex gap-6 text-sm text-gray-600">
                <p>Items: {order.orderItems.length}</p>
                <p>Total: ${order.total.toNumber().toFixed(2)}</p>
                <p>Date: {order.createdAt.toLocaleDateString()}</p>
              </div>

              <div className="mt-3">
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className="text-blue-500 hover:underline text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
