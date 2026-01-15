"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function StatusFilter({}) {
  return (
    <form>
      <select>
        <option value="">All</option>
        <option value="ACTIVE">Active</option>
        <option value="DRAFT">Draft</option>
        <option value="ARCHIVED">Pending</option>
      </select>
      ;
    </form>
  );
}

//  <option value="PENDING">Pending</option>
//         <option value="CONFIRMED">Confirmed</option>
//         <option value="PROCESSING">Processing</option>
//         <option value="SHIPPED">Shipped</option>
//         <option value="DELIVERED">Delivered</option>
//         <option value="CANCELLED">Cancelled</option>
//         <option value="REFUNDED">Refunded</option>
