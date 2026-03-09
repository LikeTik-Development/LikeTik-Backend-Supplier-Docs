import { motion } from "motion/react";
import type { ParsedDoc, Subsection } from "@/markdoc/loader.ts";

/* ── Types ───────────────────────────────────────────────────────────────── */

interface SidebarGroup {
  label: string;
  items: SidebarDocItem[];
}

interface SidebarDocItem {
  id: string;
  label: string;
  comingSoon?: boolean;
  subsections: Subsection[];
}

/* ── Constants ───────────────────────────────────────────────────────────── */

const GROUP_ORDER = ["Getting Started", "API Reference", "Reference"];

/* ── Build sidebar structure from parsed docs ────────────────────────────── */

function buildSidebar(docs: ParsedDoc[]): SidebarGroup[] {
  const groups = new Map<string, SidebarDocItem[]>();

  for (const doc of docs) {
    const g = doc.frontmatter.group;
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push({
      id: doc.frontmatter.id,
      label: doc.frontmatter.title,
      comingSoon: doc.frontmatter.comingSoon,
      subsections: doc.subsections,
    });
  }

  return GROUP_ORDER
    .filter((g) => groups.has(g))
    .map((g) => ({ label: g, items: groups.get(g)! }));
}

/* ── Sidebar Component ───────────────────────────────────────────────────── */

interface SidebarProps {
  docs: ParsedDoc[];
  activeSlug: string;
  onNavigate: (slug: string) => void;
}

export function Sidebar({ docs, activeSlug, onNavigate }: SidebarProps) {
  const sidebar = buildSidebar(docs);

  return (
    <nav className="flex flex-col gap-7">
      {sidebar.map((group) => (
        <div key={group.label}>
          <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-600 mb-2.5 px-3">
            {group.label}
          </p>
          <div className="flex flex-col gap-px">
            {group.items.map((item) => {
              const active = activeSlug === item.id;
              return (
                <div key={item.id}>
                  {/* Section item */}
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`w-full text-left text-[13px] px-3 py-1.5 rounded-md transition-colors duration-150 cursor-pointer ${
                      active
                        ? "text-zinc-100 bg-blue-500/10 font-medium"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {active && (
                        <motion.span
                          layoutId="sidebar-active-dot"
                          className="block w-1 h-1 rounded-full bg-blue-500 flex-shrink-0"
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                      {item.label}
                      {item.comingSoon && (
                        <span className="ml-2 text-[9px] font-mono uppercase tracking-wider text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                          Soon
                        </span>
                      )}
                    </span>
                  </button>

                  {/* Subsections (shown only when section is active) */}
                  {active && item.subsections.length > 0 && (
                    <div className="flex flex-col gap-px mt-1 ml-3 pl-3 border-l border-zinc-800/60">
                      {item.subsections.map((sub) => (
                        <a
                          key={sub.id}
                          href={`#${sub.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById(sub.id);
                            if (el) {
                              const top = el.getBoundingClientRect().top + window.scrollY - 80;
                              window.scrollTo({ top, behavior: "smooth" });
                            }
                          }}
                          className="text-left text-[12px] px-2 py-1 rounded text-zinc-600 hover:text-zinc-400 transition-colors"
                        >
                          {sub.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
