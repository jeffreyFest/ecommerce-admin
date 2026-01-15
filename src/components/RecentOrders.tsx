import { OrderStatus } from "@prisma/client";
import Link from "next/link";

type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  customer: {
    firstName: string;
    lastName: string;
  };
};

type RecentOrdersProps = {
  orders: Order[];
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
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
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Recent Orders</h3>
        <Link
          href="/dashboard/orders"
          className="text-blue-500 hover:underline text-sm"
        >
          View All
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No orders yet</p>
      ) : (
        <div className="divide-y">
          {orders.map((order) => (
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
                  {order.customer.firstName} {order.customer.lastName}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-1 rounded text-xs ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
                <p className="text-sm font-medium mt-1">
                  ${order.total.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
