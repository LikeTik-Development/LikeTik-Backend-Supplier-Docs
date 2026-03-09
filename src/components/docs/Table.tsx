import type { ReactNode } from "react";

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto my-5 rounded-lg border border-zinc-800">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-zinc-900/80 border-b border-zinc-800">{children}</thead>
  );
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children }: { children: ReactNode }) {
  return (
    <tr className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-900/40 transition-colors">
      {children}
    </tr>
  );
}

export function TableHeader({ children }: { children: ReactNode }) {
  return (
    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest text-zinc-500 font-medium whitespace-nowrap">
      {children}
    </th>
  );
}

export function TableCell({ children }: { children: ReactNode }) {
  return <td className="px-4 py-3 text-zinc-400">{children}</td>;
}
