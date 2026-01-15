"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ProductData = {
  name: string;
  sales: number;
  revenue: number;
};

type TopProductsChartProps = {
  data: ProductData[];
};

export default function TopProductsChart({ data }: TopProductsChartProps) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-bold mb-4">Top Selling Products</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" stroke="#6b7280" fontSize={12} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#6b7280"
              fontSize={12}
              width={120}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                name === "revenue" ? `$${value.toFixed(2)}` : value,
                name === "revenue" ? "Revenue" : "Units Sold",
              ]}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="sales" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
