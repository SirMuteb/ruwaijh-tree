"use client";

import { Compass, Gauge, GitBranch, PanelRight, Play, RotateCcw, Search, Sparkles, TimerReset } from "lucide-react";
import { motion } from "framer-motion";
import { searchPeople, getLineageName } from "@/lib/family";
import { useLineageStore } from "@/store/useLineageStore";
import type { ViewMode } from "@/lib/types";

export function TopBar({ onReset, onFit }: { onReset: () => void; onFit: () => void }) {
  const { query, setQuery, setSelectedId, viewMode, setViewMode, setJourneyActive, journeyActive } = useLineageStore();
  const results = searchPeople(query);

  return (
    <motion.header
      className="museum-glass relative z-30 mx-auto mt-4 flex w-[min(1520px,calc(100vw-24px))] flex-col gap-4 rounded-[28px] px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    >
      <div className="text-right">
        <h1 className="text-2xl md:text-3xl font-black text-charcoal leading-tight" style={{ fontFamily: "var(--font-thmanyah-serif), serif" }}>
          شجرة الرويجح من الحلف
        </h1>
        <p className="text-xs md:text-sm font-medium text-emeraldDeep mt-1">
          من ذوي عون بني عبدالله من مطير
        </p>
      </div>

      <div className="relative min-w-0 flex-1 lg:max-w-md">
        <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emeraldDeep/60" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-2xl border border-emeraldDeep/10 bg-white/70 py-3 pl-4 pr-12 text-base shadow-inner outline-none transition focus:border-goldRich"
          placeholder="ابحث بالاسم"
          aria-label="البحث في أفراد العائلة"
        />
        {results.length > 0 && (
          <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-full overflow-hidden rounded-2xl border border-goldRich/30 bg-white/95 shadow-museum">
            {results.map((person) => (
              <button
                key={person.id}
                className="flex w-full items-center justify-between px-4 py-3 text-right transition hover:bg-emeraldDeep/7"
                onClick={() => {
                  setSelectedId(person.id);
                  setQuery("");
                }}
              >
                <span className="font-semibold">{getLineageName(person.id, 4)}</span>
                <span className="text-xs text-emeraldDeep/65">الجيل {(person.generation ?? 0) + 1}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Segmented mode={viewMode} setMode={setViewMode} />
        <IconButton label="احتواء الشجرة" onClick={onFit} icon={<Compass />} />
        <IconButton label="إعادة ضبط العرض" onClick={onReset} icon={<RotateCcw />} />
        <IconButton label="لوحة البيانات" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })} icon={<Gauge />} />
        <IconButton
          label={journeyActive ? "إيقاف الرحلة" : "بدء رحلة العائلة"}
          onClick={() => setJourneyActive(!journeyActive)}
          active={journeyActive}
          icon={journeyActive ? <TimerReset /> : <Play />}
        />
        <IconButton label="تفاصيل العضو" onClick={() => document.getElementById("detail-panel")?.focus()} icon={<PanelRight />} />
      </div>
    </motion.header>
  );
}

function Segmented({ mode, setMode }: { mode: ViewMode; setMode: (mode: ViewMode) => void }) {
  return (
    <div className="flex rounded-2xl border border-emeraldDeep/10 bg-white/60 p-1" role="tablist" aria-label="تبديل طريقة العرض">
      <button
        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${mode === "tree" ? "bg-emeraldDeep text-white" : "text-emeraldDeep"}`}
        onClick={() => setMode("tree")}
      >
        <GitBranch className="h-4 w-4" />
        شجرة
      </button>
      <button
        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${mode === "timeline" ? "bg-emeraldDeep text-white" : "text-emeraldDeep"}`}
        onClick={() => setMode("timeline")}
      >
        <Gauge className="h-4 w-4" />
        أجيال
      </button>
    </div>
  );
}

function IconButton({ label, onClick, icon, active }: { label: string; onClick: () => void; icon: React.ReactNode; active?: boolean }) {
  return (
    <button
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`grid h-11 w-11 place-items-center rounded-2xl border transition ${
        active ? "border-goldRich bg-goldRich text-charcoal shadow-gold" : "border-emeraldDeep/10 bg-white/65 text-emeraldDeep hover:border-goldRich/60"
      }`}
    >
      <span className="h-5 w-5 [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
    </button>
  );
}
