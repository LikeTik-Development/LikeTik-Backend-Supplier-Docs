import { useState, useEffect } from "react";
import { DocPage } from "@/components/docs/DocPage.tsx";

export function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function usePath() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  return path;
}

export default function App() {
  const path = usePath();

  // Root redirects to overview (Decision #14: no landing page)
  useEffect(() => {
    if (path === "/" || path === "") {
      navigate("/docs/overview");
    }
  }, [path]);

  // All paths render DocPage (it handles slug extraction internally)
  return <DocPage />;
}
