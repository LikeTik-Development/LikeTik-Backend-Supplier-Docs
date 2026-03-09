import { useState, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import Markdoc from "@markdoc/markdoc";
import React from "react";

import { navigate, BASE } from "@/App.tsx";
import { parseDoc, type ParsedDoc } from "@/markdoc/loader.ts";
import { componentMap } from "@/markdoc/components.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { Sidebar } from "@/components/layout/Sidebar.tsx";
import { Footer } from "@/components/layout/Footer.tsx";
import { SearchModal } from "@/components/docs/SearchModal.tsx";
import { buildSearchIndex } from "@/search/index.ts";

/* ── Raw markdown imports ────────────────────────────────────────────────── */

import overviewMd from "@/content/docs/01-overview.md?raw";
import gettingStartedMd from "@/content/docs/02-getting-started.md?raw";
import authenticationMd from "@/content/docs/03-authentication.md?raw";
import supplierProfileMd from "@/content/docs/04-supplier-profile.md?raw";
import productManagementMd from "@/content/docs/05-product-management.md?raw";
import orderFulfillmentMd from "@/content/docs/06-order-fulfillment.md?raw";
import webhooksMd from "@/content/docs/07-webhooks.md?raw";
import constraintsLimitsMd from "@/content/docs/08-constraints-limits.md?raw";
import troubleshootingMd from "@/content/docs/09-troubleshooting.md?raw";
import additionalResourcesMd from "@/content/docs/10-additional-resources.md?raw";

/* ── Parse all docs at module level ──────────────────────────────────────── */

const PARSED_DOCS: ParsedDoc[] = [
  overviewMd,
  gettingStartedMd,
  authenticationMd,
  supplierProfileMd,
  productManagementMd,
  orderFulfillmentMd,
  webhooksMd,
  constraintsLimitsMd,
  troubleshootingMd,
  additionalResourcesMd,
].map(parseDoc);

/* ── Build search index once ─────────────────────────────────────────────── */

buildSearchIndex(PARSED_DOCS);

/* ── Main DocPage Component ──────────────────────────────────────────────── */

export function DocPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Extract slug from URL path (strip base path, then /docs/ prefix)
  const getSlug = () => {
    const path = window.location.pathname;
    const relative = path.startsWith(BASE) ? path.slice(BASE.length) : path;
    return relative.replace(/^\/docs\/?/, "") || "overview";
  };

  const [slug, setSlug] = useState(getSlug);

  // Listen to popstate for navigation updates
  useEffect(() => {
    const handler = () => setSlug(getSlug());
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  // Find active doc by matching slug to frontmatter.id
  const activeDoc = useMemo(
    () => PARSED_DOCS.find((doc) => doc.frontmatter.id === slug) ?? PARSED_DOCS[0],
    [slug],
  );

  // Render the active doc's Markdoc content
  const rendered = useMemo(
    () => Markdoc.renderers.react(activeDoc.content, React, { components: componentMap }),
    [activeDoc.content],
  );

  // Navigation handler
  const handleNavigate = useCallback((docId: string) => {
    navigate(`/docs/${docId}`);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Cmd+K keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased">
      <Header
        onMobileMenuToggle={() => setMobileOpen((v) => !v)}
        mobileOpen={mobileOpen}
        onSearchOpen={() => setSearchOpen(true)}
      />

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#09090b]/95 backdrop-blur-lg pt-14 overflow-y-auto md:hidden"
          >
            <div className="px-6 py-6">
              <Sidebar docs={PARSED_DOCS} activeSlug={slug} onNavigate={handleNavigate} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-screen-2xl mx-auto flex pt-14">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0 sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto py-8 px-4 border-r border-zinc-800/60">
          <Sidebar docs={PARSED_DOCS} activeSlug={slug} onNavigate={handleNavigate} />
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 px-6 md:px-12 lg:px-16 py-8 max-w-5xl">
          <h2
            id={activeDoc.frontmatter.id}
            className="text-2xl font-bold text-zinc-100 tracking-tight border-l-2 border-blue-500 pl-4 mb-6"
          >
            {activeDoc.frontmatter.title}
          </h2>
          {rendered}
        </main>
      </div>

      <Footer />

      {/* Search modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
