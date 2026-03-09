import FlexSearch from "flexsearch";
import type { ParsedDoc } from "@/markdoc/loader.ts";

/* ── Types ───────────────────────────────────────────────────────────────── */

interface SearchDoc {
  id: string;
  title: string;
  content: string;
  slug: string;
}

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
}

/* ── FlexSearch Document index ───────────────────────────────────────────── */

const index = new FlexSearch.Document({
  document: {
    id: "id",
    index: ["title", "content"],
    store: ["title", "slug"],
  },
  tokenize: "forward",
});

/* ── Build index from parsed docs ────────────────────────────────────────── */

export function buildSearchIndex(docs: ParsedDoc[]): void {
  docs.forEach((doc) => {
    index.add({
      id: doc.frontmatter.id,
      title: doc.frontmatter.title,
      content: doc.rawContent,
      slug: doc.frontmatter.id,
    });
  });
}

/* ── Query the index ─────────────────────────────────────────────────────── */

export function searchDocs(query: string): SearchResult[] {
  if (!query.trim()) return [];

  const results = index.search(query, 10, { enrich: true }) as any[];

  // FlexSearch returns results per field; flatten and deduplicate by id
  const seen = new Set<string>();
  const output: SearchResult[] = [];

  for (const fieldResult of results) {
    for (const entry of fieldResult.result) {
      const id = String(entry.id);
      if (seen.has(id)) continue;
      seen.add(id);

      const doc = entry.doc as unknown as { title: string; slug: string };
      output.push({
        id,
        title: doc.title,
        slug: doc.slug,
      });
    }
  }

  return output;
}
