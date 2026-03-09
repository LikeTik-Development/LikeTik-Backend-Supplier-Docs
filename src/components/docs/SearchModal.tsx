import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search } from "lucide-react";
import { navigate } from "@/App.tsx";
import { useSearch } from "@/hooks/useSearch.ts";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const results = useSearch(query);

  // Reset query when modal opens
  useEffect(() => {
    if (isOpen) setQuery("");
  }, [isOpen]);

  // Escape key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
              <Search size={16} className="text-zinc-500 flex-shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documentation..."
                className="w-full bg-transparent text-zinc-100 text-sm placeholder-zinc-600 outline-none"
              />
            </div>

            {/* Results list */}
            <div className="max-h-80 overflow-y-auto">
              {results.length > 0 ? (
                results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => {
                      navigate(`/docs/${result.slug}`);
                      onClose();
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm text-zinc-200">{result.title}</span>
                  </button>
                ))
              ) : query.trim() ? (
                <div className="px-5 py-8 text-center text-sm text-zinc-600">
                  No results found
                </div>
              ) : (
                <div className="px-5 py-8 text-center text-sm text-zinc-600">
                  Type to search...
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
