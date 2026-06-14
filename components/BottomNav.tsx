"use client";

import { useLineageStore } from "@/store/useLineageStore";
import { Home, GitBranch, Search, Gauge, Info } from "lucide-react";

export function BottomNav() {
  const { setViewMode, viewMode } = useLineageStore();

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSearchFocus = () => {
    const input = document.querySelector(
      "input[aria-label='البحث في أفراد العائلة']"
    ) as HTMLInputElement | null;
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-amber-900/10 bg-white/85 pb-[calc(env(safe-area-inset-bottom,16px)-8px)] pt-2 shadow-lg backdrop-blur-xl md:hidden animate-fade-in"
      dir="rtl"
      style={{ fontFamily: "var(--font-thmanyah-sans), sans-serif" }}
    >
      <div className="mx-auto grid w-full max-w-md grid-cols-5 gap-1 px-2">
        {/* Home */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex flex-col items-center justify-center py-2.5 px-1 text-emeraldDeep hover:text-goldRich transition-colors active:scale-95 duration-100"
          style={{ minHeight: "48px" }}
          aria-label="الرئيسية"
        >
          <Home className="h-5.5 w-5.5" />
          <span className="mt-1 text-[13px] font-bold">الرئيسية</span>
        </button>

        {/* Tree */}
        <button
          onClick={() => {
            setViewMode("tree");
            setTimeout(() => handleScrollTo("tree-or-timeline-container"), 50);
          }}
          className={`flex flex-col items-center justify-center py-2.5 px-1 transition-colors active:scale-95 duration-100 ${
            viewMode === "tree" ? "text-goldRich" : "text-emeraldDeep hover:text-goldRich"
          }`}
          style={{ minHeight: "48px" }}
          aria-label="شجرة النسب"
        >
          <GitBranch className="h-5.5 w-5.5" />
          <span className="mt-1 text-[13px] font-bold">الشجرة</span>
        </button>

        {/* Search */}
        <button
          onClick={handleSearchFocus}
          className="flex flex-col items-center justify-center py-2.5 px-1 text-emeraldDeep hover:text-goldRich transition-colors active:scale-95 duration-100"
          style={{ minHeight: "48px" }}
          aria-label="البحث"
        >
          <Search className="h-5.5 w-5.5" />
          <span className="mt-1 text-[13px] font-bold">البحث</span>
        </button>

        {/* Generations */}
        <button
          onClick={() => {
            setViewMode("timeline");
            setTimeout(() => handleScrollTo("tree-or-timeline-container"), 50);
          }}
          className={`flex flex-col items-center justify-center py-2.5 px-1 transition-colors active:scale-95 duration-100 ${
            viewMode === "timeline" ? "text-goldRich" : "text-emeraldDeep hover:text-goldRich"
          }`}
          style={{ minHeight: "48px" }}
          aria-label="الأجيال"
        >
          <Gauge className="h-5.5 w-5.5" />
          <span className="mt-1 text-[13px] font-bold">الأجيال</span>
        </button>

        {/* About / Stats */}
        <button
          onClick={() => {
            const el = document.getElementById("dashboard-section");
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
              window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            }
          }}
          className="flex flex-col items-center justify-center py-2.5 px-1 text-emeraldDeep hover:text-goldRich transition-colors active:scale-95 duration-100"
          style={{ minHeight: "48px" }}
          aria-label="لوحة التراث حول الشجرة"
        >
          <Info className="h-5.5 w-5.5" />
          <span className="mt-1 text-[13px] font-bold">عن الشجرة</span>
        </button>
      </div>
    </nav>
  );
}
