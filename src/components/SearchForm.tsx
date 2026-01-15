"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";


type SearchFormProps = {
    placeholder: string;
    
};

export default function SearchForm({ placeholder }: SearchFormProps) {
      const router = useRouter();
      const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`?search=${encodeURIComponent(search)}`);
    } else {
      router.push("?");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        className="border rounded px-3 py-2 flex-1"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
      />



      <button
        type="submit"
        className="bg-blue-500 rounded text-white px-4 py-2 hover:bg-blue-600"
      >
        {" "}
        Search
      </button>
    </form>
  );
}
