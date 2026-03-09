import { useEffect, useRef, useState } from "react";

export function MermaidDiagram({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    let cancelled = false;

    import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          primaryColor: "#3b82f6",
          primaryTextColor: "#fafafa",
          lineColor: "#a1a1aa",
          secondaryColor: "#27272a",
          tertiaryColor: "#18181b",
        },
      });

      mermaid.render(idRef.current, chart).then(({ svg: renderedSvg }) => {
        if (!cancelled) {
          setSvg(renderedSvg);
          setLoading(false);
        }
      }).catch(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    });

    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (loading) {
    return (
      <div className="my-6 flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 p-8">
        <span className="text-xs font-mono text-zinc-600">Loading diagram...</span>
      </div>
    );
  }

  return (
    <div
      className="my-6 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
