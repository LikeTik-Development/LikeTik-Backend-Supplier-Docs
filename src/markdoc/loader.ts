import Markdoc, { type RenderableTreeNode, type Node } from "@markdoc/markdoc";
import yaml from "yaml";
import { markdocConfig } from "./schema.ts";

/* ── Types ───────────────────────────────────────────────────────────────── */

export interface Subsection {
  id: string;
  title: string;
}

export interface DocFrontmatter {
  id: string;
  title: string;
  group: string;
  order: number;
  comingSoon?: boolean;
}

export interface ParsedDoc {
  frontmatter: DocFrontmatter;
  content: RenderableTreeNode;
  subsections: Subsection[];
  rawContent: string;
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/**
 * Slugify a string for use as an anchor id.
 * Lowercase, replace non-alphanum with hyphens, collapse consecutive hyphens, trim hyphens.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Recursively extract raw text from a Markdoc AST node.
 */
function extractText(node: Node): string {
  if (node.attributes?.content != null) return String(node.attributes.content);
  return node.children.map(extractText).join("");
}

/**
 * Walk the entire AST and collect all text content for search indexing.
 */
function extractPlainText(ast: Node): string {
  const parts: string[] = [];

  function walk(node: Node): void {
    if (node.attributes?.content != null) {
      parts.push(String(node.attributes.content));
    }
    for (const child of node.children) {
      walk(child);
    }
  }

  walk(ast);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

/**
 * Walk the AST to find all h3 headings and extract them as subsections.
 */
function extractSubsections(ast: Node): Subsection[] {
  const subsections: Subsection[] = [];

  function walk(node: Node): void {
    if (node.type === "heading" && node.attributes?.level === 3) {
      const title = extractText(node);
      if (title) {
        subsections.push({ id: slugify(title), title });
      }
    }
    for (const child of node.children) {
      walk(child);
    }
  }

  walk(ast);
  return subsections;
}

/* ── Main parser ─────────────────────────────────────────────────────────── */

/**
 * Parse a raw markdown string with YAML frontmatter into a Markdoc render tree.
 * Extracts frontmatter, subsections from h3 headings, and plain text for search.
 */
export function parseDoc(raw: string): ParsedDoc {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Missing YAML frontmatter in doc file");
  }

  const frontmatter = yaml.parse(match[1]) as DocFrontmatter;
  const body = match[2];

  const ast = Markdoc.parse(body);
  const subsections = extractSubsections(ast);
  const rawContent = extractPlainText(ast);
  const content = Markdoc.transform(ast, markdocConfig);

  return { frontmatter, content, subsections, rawContent };
}
