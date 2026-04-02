import { useState, useCallback } from "react";
import { PAGINATION } from "@/utils/constants";

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

/**
 * Manages pagination state (page, limit, search, sort).
 * Pass the returned params to your service function.
 */
export function usePagination(options: UsePaginationOptions = {}) {
  const [page, setPage] = useState(options.initialPage ?? PAGINATION.DEFAULT_PAGE);
  const [limit, setLimit] = useState(options.initialLimit ?? PAGINATION.DEFAULT_LIMIT);
  const [search, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const setSearch = useCallback((value: string) => {
    setSearchValue(value);
    setPage(1); // Reset to first page on search
  }, []);

  const reset = useCallback(() => {
    setPage(PAGINATION.DEFAULT_PAGE);
    setLimit(PAGINATION.DEFAULT_LIMIT);
    setSearchValue("");
    setSortBy(undefined);
    setSortOrder("asc");
  }, []);

  return {
    params: { page, limit, search, sortBy, sortOrder },
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    setPage,
    setLimit,
    setSearch,
    setSortBy,
    setSortOrder,
    reset,
  };
}
