"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") ?? "";

  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="flex gap-4 items-center">
        <label className="text-gray-600">Filter by status:</label>
        <select
          value={currentStatus}
          onChange={(e) => updateURL("status", e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Orders</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REFUNDED">Refunded</option>
        </select>

        {currentStatus && (
          <button
            onClick={() => updateURL("status", "")}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
