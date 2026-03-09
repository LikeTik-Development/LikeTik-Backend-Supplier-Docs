import { useMemo } from "react";
import { searchDocs, type SearchResult } from "@/search/index.ts";

/**
 * React hook wrapping FlexSearch full-text search.
 *
 * Returns an array of search results matching the given query string.
 * FlexSearch is synchronous and fast enough for the document count
 * in this project (<100 documents), so no debouncing is needed.
 *
 * @param query - The search query string
 * @returns Array of matching SearchResult objects with id, title, and slug
 */
export function useSearch(query: string): SearchResult[] {
  return useMemo(() => searchDocs(query), [query]);
}
