import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import prisma from "@/lib/db";
import PageHeader from "@/components/PageHeader";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();
  const totalCustomers = await prisma.customer.count();
  const revenue = await prisma.order.aggregate({ _sum: { total: true } });

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your store"
      ></PageHeader>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Total Products</p>
          <p className="text-2xl font-bold">{totalProducts}</p>
        </div>

        <div className="bg-white shadow p-4 rounded ">
          <p className="text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Total Customers</p>
          <p className="text-2xl font-bold">{totalCustomers}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold">
            ${revenue._sum.total?.toNumber().toFixed(2) ?? "0.00"}
          </p>
        </div>

      </div>
    </>
  );
}
