import { useState } from "react";
import { CopyButton } from "./CodeBlock.tsx";

const LANG_COLORS: Record<string, string> = {
  json: "text-amber-400",
  http: "text-cyan-400",
};

export function CollapsibleCodeBlock({
  code,
  language,
  lineCount,
}: {
  code: string;
  language: string;
  lineCount: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const preview = code.split("\n").slice(0, 5).join("\n");
  const langColor = LANG_COLORS[language] ?? "text-zinc-400";

  return (
    <div className="relative group my-5 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80">
        <span className={`text-[11px] font-mono font-medium uppercase tracking-widest ${langColor}`}>
          {language}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-600 font-mono">{lineCount} lines</span>
          <CopyButton text={code.trim()} />
        </div>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] font-mono leading-relaxed">
        <code className="text-zinc-300 whitespace-pre">
          {expanded ? code.trim() : preview + "\n..."}
        </code>
      </pre>
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full py-2 text-xs font-mono text-zinc-500 hover:text-zinc-300 bg-zinc-900/60 border-t border-zinc-800/60 transition-colors"
        >
          Expand ({lineCount} lines)
        </button>
      )}
    </div>
  );
}
