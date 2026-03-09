import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Menu, X, ChevronRight, ExternalLink, Search } from "lucide-react";

interface HeaderProps {
  onMobileMenuToggle: () => void;
  mobileOpen: boolean;
  onSearchOpen: () => void;
}

export function Header({ onMobileMenuToggle, mobileOpen, onSearchOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-[#09090b]/90 backdrop-blur-lg border-zinc-800"
          : "bg-[#09090b]/80 backdrop-blur-md border-zinc-800/60"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Wordmark + Docs breadcrumb */}
        <div className="flex items-center gap-4">
          <span className="text-base font-bold tracking-tight text-zinc-100">
            LikeTik
          </span>
          <ChevronRight size={14} className="text-zinc-600" />
          <span className="text-sm text-zinc-500">Docs</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-500/15 border border-red-500/30 px-2 py-0.5 rounded">
            Beta
          </span>
        </div>

        {/* Right: Desktop links + search */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://www.liketik.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            LikeTik
            <ExternalLink size={12} />
          </a>
          <a
            href="https://backend-test.liketik.com/docs/supplier/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
          >
            API Explorer
            <ExternalLink size={12} />
          </a>
          <button
            onClick={onSearchOpen}
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors cursor-pointer"
          >
            <Search size={14} />
            <span className="text-xs text-zinc-600 font-mono">Cmd+K</span>
          </button>
        </div>

        {/* Mobile: hamburger */}
        <button
          className="md:hidden text-zinc-500 hover:text-zinc-300 cursor-pointer"
          onClick={onMobileMenuToggle}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </motion.header>
  );
}
