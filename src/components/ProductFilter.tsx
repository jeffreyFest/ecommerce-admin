"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Category = {
  id: string;
  name: string;
};

type ProductFiltersProps = {
  categories: Category[];
};

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const currentStatus = searchParams.get("status") ?? "";
  const currentCategory = searchParams.get("category") ?? "";

  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL("search", search);
  };

  const clearFilters = () => {
    setSearch("");
    router.push("?");
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, SKU, or description..."
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {/* Filters */}
      <div className="flex gap-4">
        {/* Status Filter */}
        <select
          value={currentStatus}
          onChange={(e) => updateURL("status", e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        {/* Category Filter */}
        <select
          value={currentCategory}
          onChange={(e) => updateURL("category", e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="text-gray-500 hover:text-gray-700 px-4 py-2"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
