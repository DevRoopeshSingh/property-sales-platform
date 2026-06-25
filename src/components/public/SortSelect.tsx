"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface SortSelectProps {
  currentSort: string;
}

export default function SortSelect({ currentSort }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <select
      value={currentSort}
      onChange={handleChange}
      className="input w-auto text-sm py-2 px-3 cursor-pointer"
      aria-label="Sort properties"
    >
      <option value="newest">Newest First</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="featured">Featured First</option>
    </select>
  );
}
