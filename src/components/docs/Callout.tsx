import type { ReactNode } from "react";

/* ── Callout ──────────────────────────────────────────────────────────────── */

const CALLOUT_STYLES = {
  note: {
    border: "border-blue-500/60",
    bg: "bg-blue-500/5",
    label: "Note",
    labelColor: "text-blue-400",
    bodyColor: "text-zinc-400",
  },
  tip: {
    border: "border-emerald-500/60",
    bg: "bg-emerald-500/5",
    label: "Tip",
    labelColor: "text-emerald-400",
    bodyColor: "text-zinc-400",
  },
  warn: {
    border: "border-amber-500/60",
    bg: "bg-amber-500/5",
    label: "Warning",
    labelColor: "text-amber-400",
    bodyColor: "text-zinc-400",
  },
  important: {
    border: "border-red-500/80",
    bg: "bg-red-500/10",
    label: "Important",
    labelColor: "text-red-400",
    bodyColor: "text-red-300/90",
  },
} as const;

export function Callout({
  children,
  type = "note",
}: {
  children: ReactNode;
  type?: "note" | "tip" | "warn" | "important";
}) {
  const s = CALLOUT_STYLES[type] ?? CALLOUT_STYLES.note;
  return (
    <div className={`border-l-2 ${s.border} ${s.bg} p-4 rounded-r-lg my-5`}>
      <p className={`text-[11px] font-mono font-bold uppercase tracking-widest mb-1.5 ${s.labelColor}`}>
        {s.label}
      </p>
      <div className={`${s.bodyColor} text-sm leading-relaxed [&>p]:mb-0`}>{children}</div>
    </div>
  );
}

/* ── Blockquote ───────────────────────────────────────────────────────────── */

export function Blockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="border-l-2 border-zinc-700 pl-4 my-5 text-zinc-400 text-sm leading-relaxed italic">
      {children}
    </blockquote>
  );
}
