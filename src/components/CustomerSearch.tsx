"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CustomerSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              router.push("?");
            }}
            className="text-gray-500 hover:text-gray-700 px-4 py-2"
          >
            Clear
          </button>
        )}
      </form>
    </div>
  );
}
