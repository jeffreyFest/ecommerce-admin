import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import PageHeader from "@/components/PageHeader";
import StatsCard from "@/components/StatsCard";
import LowStockAlert from "@/components/LowStockAlert";
import RevenueChart from "@/components/charts/RevenueChart";
import OrderStatusChart from "@/components/charts/OrderStatusChart";
import TopProductsChart from "@/components/charts/TopProductsChart";
import RecentOrders from "@/components/RecentOrders";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch all stats
  const [
    totalProducts,
    totalOrders,
    totalCustomers,
    revenueData,
    recentOrders,
    ordersByStatus,
    topProducts,
  ] = await Promise.all([
    // Total counts
    prisma.product.count(),
    prisma.order.count(),
    prisma.customer.count(),

    // Total revenue
    prisma.order.aggregate({
      _sum: { total: true },
    }),

    // Recent orders
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
      },
    }),

    // Orders by status
    prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    }),

    // Top products by sales
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true, total: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  // Get product names for top products
  const topProductsWithNames = await Promise.all(
    topProducts.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { name: true },
      });
      return {
        name: product?.name ?? "Unknown",
        sales: item._sum.quantity ?? 0,
        revenue: item._sum.total?.toNumber() ?? 0,
      };
    })
  );

  // Get low stock products properly
  // Get low stock products properly
const lowStock = await prisma.$queryRaw<
  {
    id: string;
    name: string;
    stock: number;
    lowStockThreshold: number;
  }[]
>`
  SELECT id, name, stock, "lowStockThreshold"
  FROM products
  WHERE stock <= "lowStockThreshold"
`;


  // Format order status data for chart
  const statusColors: Record<string, string> = {
    PENDING: "#fbbf24",
    CONFIRMED: "#3b82f6",
    PROCESSING: "#8b5cf6",
    SHIPPED: "#6366f1",
    DELIVERED: "#22c55e",
    CANCELLED: "#ef4444",
    REFUNDED: "#6b7280",
  };

  const orderStatusData = ordersByStatus.map((item) => ({
    name: item.status,
    value: item._count.status,
    color: statusColors[item.status] ?? "#6b7280",
  }));

  // Format recent orders for component
  const formattedRecentOrders = recentOrders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.total.toNumber(),
    createdAt: order.createdAt,
    customer: {
      firstName: order.customer.firstName,
      lastName: order.customer.lastName,
    },
  }));

  // Mock monthly revenue data (in real app, you'd query this from orders)
  const monthlyRevenue = [
    { month: "Jan", revenue: 4500 },
    { month: "Feb", revenue: 5200 },
    { month: "Mar", revenue: 4800 },
    { month: "Apr", revenue: 6100 },
    { month: "May", revenue: 5900 },
    { month: "Jun", revenue: 7200 },
  ];

  const totalRevenue = revenueData._sum.total?.toNumber() ?? 0;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${session.user?.name ?? "Admin"}`}
      />

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="mb-6">
          <LowStockAlert products={lowStock} />
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          subtitle="All time"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          subtitle="All time"
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatsCard
          title="Total Products"
          value={totalProducts}
          subtitle="Active in store"
        />
        <StatsCard
          title="Total Customers"
          value={totalCustomers}
          subtitle="Registered users"
          trend={{ value: 5.1, isPositive: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <RevenueChart data={monthlyRevenue} />
        <OrderStatusChart data={orderStatusData} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-6">
        <TopProductsChart data={topProductsWithNames} />
        <RecentOrders orders={formattedRecentOrders} />
      </div>
    </>
  );
}
