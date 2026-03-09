import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Copy, Check } from "lucide-react";

/* ── CopyButton ──────────────────────────────────────────────────────────── */

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50 transition-colors"
      aria-label="Copy code"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
          >
            <Check size={13} className="text-emerald-400" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
          >
            <Copy size={13} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ── CodeBlock ────────────────────────────────────────────────────────────── */

const LANG_COLORS: Record<string, string> = {
  bash: "text-emerald-400",
  json: "text-amber-400",
  text: "text-zinc-400",
  http: "text-cyan-400",
  yaml: "text-purple-400",
  markdown: "text-purple-400",
  ts: "text-blue-400",
  typescript: "text-blue-400",
  js: "text-yellow-400",
  javascript: "text-yellow-400",
};

export function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const langColor = LANG_COLORS[language] ?? "text-zinc-400";
  return (
    <div className="relative group my-5 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80">
        <span className={`text-[11px] font-mono font-medium uppercase tracking-widest ${langColor}`}>
          {language}
        </span>
        <CopyButton text={code.trim()} />
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] font-mono leading-relaxed">
        <code className="text-zinc-300 whitespace-pre">{code.trim()}</code>
      </pre>
    </div>
  );
}
