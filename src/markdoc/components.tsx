import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";

import { navigate, BASE } from "@/App.tsx";
import { CodeBlock } from "@/components/docs/CodeBlock.tsx";
import { CollapsibleCodeBlock } from "@/components/docs/CollapsibleBlock.tsx";
import { MermaidDiagram } from "@/components/docs/MermaidDiagram.tsx";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "@/components/docs/Table.tsx";
import { Callout, Blockquote } from "@/components/docs/Callout.tsx";

/* ── Typography ───────────────────────────────────────────────────────────── */

function Heading({
  level,
  id,
  children,
}: {
  level: number;
  id?: string;
  children: ReactNode;
}) {
  if (level === 2) {
    return (
      <h2 id={id} className="text-xl font-bold text-zinc-100 mt-10 mb-4 border-l-2 border-blue-500 pl-4">
        {children}
      </h2>
    );
  }
  if (level === 3) {
    return (
      <h3 id={id} className="text-lg font-semibold text-zinc-100 mt-8 mb-3">
        {children}
      </h3>
    );
  }
  if (level === 4) {
    return (
      <h4 id={id} className="text-base font-medium text-zinc-200 mt-6 mb-2">
        {children}
      </h4>
    );
  }
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  return (
    <Tag id={id} className="text-zinc-100 font-semibold mt-6 mb-3">
      {children}
    </Tag>
  );
}

function Paragraph({ children }: { children: ReactNode }) {
  return <p className="text-zinc-400 text-sm leading-relaxed mb-4">{children}</p>;
}

function InlineCode({ content, children }: { content?: string; children?: ReactNode }) {
  return (
    <code className="text-blue-400 font-mono text-[0.85em] bg-zinc-800/60 px-1.5 py-0.5 rounded">
      {content ?? children}
    </code>
  );
}

/* ── Links ────────────────────────────────────────────────────────────────── */

function Link({
  href,
  title,
  children,
}: {
  href: string;
  title?: string;
  children: ReactNode;
}) {
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  if (!isExternal) {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      const hashIndex = href.indexOf("#");
      const pathname = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
      const hash = hashIndex >= 0 ? href.slice(hashIndex + 1) : null;

      if (pathname) {
        navigate(pathname);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      if (hash) {
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };

    return (
      <a
        href={BASE + href}
        title={title}
        className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      title={title}
      className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ExternalLink size={12} className="inline-block" />
    </a>
  );
}

/* ── Lists ────────────────────────────────────────────────────────────────── */

function List({
  ordered,
  children,
}: {
  ordered?: boolean;
  children: ReactNode;
}) {
  if (ordered) {
    return (
      <ol className="list-decimal list-inside text-zinc-400 text-sm leading-relaxed mb-4 space-y-1 pl-2">
        {children}
      </ol>
    );
  }
  return (
    <ul className="list-disc list-inside text-zinc-400 text-sm leading-relaxed mb-4 space-y-1 pl-2">
      {children}
    </ul>
  );
}

function ListItem({ children }: { children: ReactNode }) {
  return <li className="mb-1">{children}</li>;
}

/* ── Inline styles ────────────────────────────────────────────────────────── */

function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-zinc-200">{children}</strong>;
}

function Emphasis({ children }: { children: ReactNode }) {
  return <em className="italic text-zinc-300">{children}</em>;
}

/* ── Block elements ───────────────────────────────────────────────────────── */

function HorizontalRule() {
  return <hr className="border-t border-zinc-800 my-8" />;
}

function Image({
  src,
  alt,
  title,
}: {
  src: string;
  alt?: string;
  title?: string;
}) {
  return (
    <img
      src={src}
      alt={alt ?? ""}
      title={title}
      className="rounded-lg max-w-full my-5"
    />
  );
}

/* ── Component map for Markdoc renderer ───────────────────────────────────── */

export const componentMap: Record<string, React.ComponentType<any>> = {
  // Doc-specific components (separate files)
  CodeBlock,
  CollapsibleCodeBlock,
  MermaidDiagram,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Callout,
  Blockquote,

  // Inline components (defined above)
  Heading,
  Paragraph,
  InlineCode,
  Link,
  List,
  ListItem,
  Strong,
  Emphasis,
  HorizontalRule,
  Image,
};
