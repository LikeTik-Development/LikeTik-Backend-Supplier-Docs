import Markdoc, { type Config, type Node, type RenderableTreeNode, type Schema, Tag } from "@markdoc/markdoc";

/* ── Helpers ──────────────────────────────────────────────────────────────── */

/** Recursively extract raw text from a Markdoc AST node tree. */
function extractText(node: Node): string {
  if (node.attributes?.content != null) return String(node.attributes.content);
  return node.children.map(extractText).join("");
}

/** Slugify text into a URL-safe anchor id. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

/* ── Node overrides ───────────────────────────────────────────────────────── */

const heading: Schema = {
  render: "Heading",
  children: ["inline"],
  attributes: {
    level: { type: Number, required: true },
  },
  transform(node, config) {
    const children = node.transformChildren(config);
    const text = extractText(node);
    const id = slugify(text);
    return new Tag("Heading", { level: node.attributes.level, id }, children);
  },
};

const paragraph: Schema = {
  render: "Paragraph",
  children: ["inline"],
};

const fence: Schema = {
  render: "CodeBlock",
  attributes: {
    language: { type: String },
    content: { type: String },
  },
  transform(node, _config) {
    const rawContent = node.attributes.content as string ?? "";
    const language = node.attributes.language ?? "text";

    // Count lines on raw content BEFORE trimming
    const lineCount = rawContent.split("\n").length;

    // Trim trailing newline for display
    const code = rawContent.replace(/\n$/, "");

    // Mermaid diagram
    if (language === "mermaid") {
      return new Tag("MermaidDiagram", { chart: code }, []);
    }

    // Long JSON/HTTP blocks -> collapsible
    if (lineCount > 15 && (language === "json" || language === "http")) {
      return new Tag("CollapsibleCodeBlock", { code, language, lineCount }, []);
    }

    // Standard code block
    return new Tag("CodeBlock", { code, language }, []);
  },
};

const code: Schema = {
  render: "InlineCode",
  attributes: {
    content: { type: String },
  },
};

const table: Schema = {
  render: "Table",
  children: ["thead", "tbody"],
};

const thead: Schema = {
  render: "TableHead",
  children: ["tr"],
};

const tbody: Schema = {
  render: "TableBody",
  children: ["tr"],
};

const tr: Schema = {
  render: "TableRow",
  children: ["th", "td"],
};

const th: Schema = {
  render: "TableHeader",
  attributes: {
    align: { type: String },
    width: { type: String },
  },
};

const td: Schema = {
  render: "TableCell",
  attributes: {
    align: { type: String },
    colspan: { type: Number },
    rowspan: { type: Number },
  },
};

const list: Schema = {
  render: "List",
  children: ["item"],
  attributes: {
    ordered: { type: Boolean },
  },
};

const item: Schema = {
  render: "ListItem",
  children: ["inline", "paragraph", "list"],
};

const link: Schema = {
  render: "Link",
  children: ["inline"],
  attributes: {
    href: { type: String, required: true },
    title: { type: String },
  },
};

const blockquote: Schema = {
  render: "Blockquote",
  children: ["paragraph", "list", "heading"],
  transform(node, config) {
    const children = node.transformChildren(config);

    // Detect callout patterns in first child's text content
    const firstText = extractFirstTextFromChildren(node);

    const calloutPatterns: Array<{ plain: string; type: string }> = [
      { plain: "Note:", type: "note" },
      { plain: "Tip:", type: "tip" },
      { plain: "Important:", type: "important" },
      { plain: "Warning:", type: "warn" },
    ];

    for (const { plain, type } of calloutPatterns) {
      if (firstText.startsWith(plain)) {
        // Strip the bold label + colon from the rendered children
        const strippedChildren = stripCalloutLabel(children, plain);
        return new Tag("Callout", { type }, strippedChildren);
      }
    }

    return new Tag("Blockquote", {}, children);
  },
};

const hr: Schema = {
  render: "HorizontalRule",
};

const image: Schema = {
  render: "Image",
  attributes: {
    src: { type: String, required: true },
    alt: { type: String },
    title: { type: String },
  },
};

const strong: Schema = {
  render: "Strong",
  children: ["inline"],
};

const em: Schema = {
  render: "Emphasis",
  children: ["inline"],
};

/* ── Blockquote helpers ───────────────────────────────────────────────────── */

/**
 * Extract the first text content from a node's descendants
 * to detect callout patterns like **Note:** at the start.
 */
function extractFirstTextFromChildren(node: Node): string {
  for (const child of node.children) {
    const text = extractText(child);
    if (text.trim()) return text.trim();
  }
  return "";
}

/**
 * Strip the callout label (e.g. bold "Important:" tag + trailing space) from rendered children.
 * In the Markdoc AST, `> **Important:** text` becomes a Paragraph tag whose children are:
 *   [Strong("Important:"), " text"]
 * We remove the Strong tag containing the label and trim leading whitespace from the next text node.
 */
function stripCalloutLabel(children: ReturnType<Node["transformChildren"]>, plainLabel: string): typeof children {
  if (!Array.isArray(children) || children.length === 0) return children;

  // The first child is typically a Paragraph tag wrapping the inline content
  return children.map((child, idx) => {
    if (idx > 0) return child;
    if (child instanceof Tag && child.children) {
      const stripped = stripLabelFromInlineChildren(child.children as RenderableTreeNode[], plainLabel);
      return new Tag(child.name, child.attributes, stripped);
    }
    return child;
  }).filter((c): c is NonNullable<typeof c> => c != null);
}

/**
 * Remove the bold label tag and trim whitespace from inline children.
 */
function stripLabelFromInlineChildren(children: RenderableTreeNode[], plainLabel: string): RenderableTreeNode[] {
  if (!children || children.length === 0) return children;

  let found = false;
  const result: RenderableTreeNode[] = [];

  for (const child of children) {
    if (found) {
      // After removing the label, trim leading whitespace from the next string node
      if (typeof child === "string" && result.length === 0) {
        const trimmed = child.replace(/^\s+/, "");
        if (trimmed) result.push(trimmed);
      } else {
        result.push(child);
      }
      continue;
    }

    if (child instanceof Tag && child.children) {
      const innerText = tagToText(child);
      if (innerText.trim() === plainLabel.replace(/:$/, "").trim() + ":" || innerText.trim() === plainLabel.trim()) {
        // This is the bold tag containing "Important:" — skip it
        found = true;
        continue;
      }
    }

    if (typeof child === "string" && child.trim().startsWith(plainLabel)) {
      found = true;
      const stripped = child.slice(child.indexOf(plainLabel) + plainLabel.length).replace(/^\s+/, "");
      if (stripped) result.push(stripped);
      continue;
    }

    result.push(child);
  }

  return result;
}

/**
 * Extract plain text from a Tag tree (for pattern matching).
 */
function tagToText(tag: Tag): string {
  if (!tag.children) return "";
  return tag.children.map((c) => {
    if (typeof c === "string") return c;
    if (c instanceof Tag) return tagToText(c);
    return "";
  }).join("");
}

/* ── Export config ─────────────────────────────────────────────────────────── */

export const markdocConfig: Config = {
  nodes: {
    heading,
    paragraph,
    fence,
    code,
    table,
    thead,
    tbody,
    tr,
    td,
    th,
    list,
    item,
    link,
    blockquote,
    hr,
    image,
    strong,
    em,
  },
};
