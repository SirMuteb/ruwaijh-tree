"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, Compass, RotateCcw, ZoomIn, ZoomOut, HelpCircle } from "lucide-react";
import { getAncestors, getBranch, getDescendants, getChildren, peopleById, people, rootPerson } from "@/lib/family";
import { useLineageStore } from "@/store/useLineageStore";
import { AnimatePresence, motion } from "framer-motion";

type CardSize = "sm" | "md" | "lg";

function formatChildrenCount(count: number): string {
  if (count === 1) return "ابن واحد";
  if (count === 2) return "ابنان";
  if (count >= 3 && count <= 10) return `${count} أبناء`;
  return `${count} ابن`;
}

interface TreeNodeProps {
  personId: string;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  selectedId: string;
  setSelectedId: (id: string) => void;
  highlightedIds: Set<string>;
  depth: number;
  isFirst: boolean;
  isLast: boolean;
  cardSize: CardSize;
}

function TreeNode({
  personId,
  expandedIds,
  toggleExpand,
  selectedId,
  setSelectedId,
  highlightedIds,
  depth,
  isFirst,
  isLast,
  cardSize
}: TreeNodeProps) {
  const person = peopleById.get(personId);
  if (!person) return null;

  const children = getChildren(personId);
  const isExpanded = expandedIds.has(personId);
  const isSelected = selectedId === personId;
  const isHighlighted = highlightedIds.has(personId);
  const hasChildren = children.length > 0;

  // Determine sizing styles based on cardSize selection
  const cardPadding = cardSize === "sm" ? "px-3 py-1.5 gap-2" : cardSize === "lg" ? "px-5 py-3.5 gap-4" : "px-4 py-2.5 gap-3";
  const nameTextSize = cardSize === "sm" ? "text-xs font-bold" : cardSize === "lg" ? "text-lg font-black" : "text-sm font-bold";
  const badgeTextSize = cardSize === "sm" ? "text-[10px]" : "text-xs";
  const dotSize = cardSize === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";

  return (
    <div className="flex flex-col relative" id={`node-${personId}`}>
      <div className="flex items-center relative">
        {/* CSS horizontal branch elbow connector */}
        {depth > 0 && (
          <div className="absolute right-[-16px] top-1/2 w-4 h-[1.5px] bg-amber-800/20 pointer-events-none" />
        )}

        {/* Card Body */}
        <motion.div
          onClick={() => setSelectedId(personId)}
          className={`
            group flex items-center justify-between rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm select-none min-w-[200px] max-w-[320px]
            ${cardPadding}
            ${isSelected
              ? "bg-emeraldDeep text-white border-goldRich shadow-gold scale-[1.02]"
              : isHighlighted
              ? "bg-emeraldDeep/10 border-emeraldDeep/30 text-charcoal hover:bg-emeraldDeep/15 hover:border-emeraldDeep/40"
              : "bg-white/75 border-amber-800/10 text-charcoal hover:bg-white hover:border-amber-800/25"
            }
            ${person.isDeceased ? "opacity-90" : ""}
          `}
          layoutId={`card-layout-${personId}`}
        >
          <div className="flex items-center gap-3">
            {/* Status dot */}
            <div
              className={`
                rounded-full shrink-0
                ${dotSize}
                ${isSelected ? "bg-goldRich animate-pulse" : person.isDeceased ? "bg-charcoal/30" : "bg-emeraldDeep"}
              `}
            />

            <div className="flex flex-col gap-0.5 text-right">
              <span className={`tracking-wide ${nameTextSize}`}>
                {person.name}
              </span>
              
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isSelected ? "bg-white/15 text-white" : "bg-emeraldDeep/5 text-emeraldDeep"
                }`}>
                  الجيل {person.generation ? person.generation + 1 : 1}
                </span>
                {hasChildren && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    isSelected ? "bg-white/10 text-white/95" : "bg-amber-800/5 text-amber-800/80"
                  }`}>
                    {formatChildrenCount(children.length)}
                  </span>
                )}
                {person.needsReview && (
                  <span className="bg-amber-500/10 text-amber-600 font-bold px-2 py-0.5 rounded-full text-[10px]">
                    مراجعة
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Expand / Collapse Toggle Button */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(personId);
              }}
              className={`
                flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-lg border transition-all duration-150
                ${isSelected
                  ? "border-white/20 hover:bg-white/10 text-white"
                  : "border-emeraldDeep/10 hover:bg-emeraldDeep/5 text-emeraldDeep"
                }
              `}
              aria-label={isExpanded ? "طي الفرع" : "بسط الفرع"}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          )}
        </motion.div>
      </div>

      {/* Children list nested below with right-border representing the vertical relationship line */}
      {isExpanded && hasChildren && (
        <div className="mr-5 border-r border-amber-800/15 pr-4 relative flex flex-col gap-3 mt-3">
          {children.map((child, idx) => (
            <TreeNode
              key={child.id}
              personId={child.id}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              highlightedIds={highlightedIds}
              depth={depth + 1}
              isFirst={idx === 0}
              isLast={idx === children.length - 1}
              cardSize={cardSize}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const RUWAYJIH_ID = "رويجح_وقيتان_عايد_سالم_محمد_عبيد_عباد";

export function LineageTree({ registerActions }: { registerActions: (actions: { reset: () => void; fit: () => void }) => void }) {
  const { selectedId, setSelectedId, highlightMode, journeyActive, setJourneyActive } = useLineageStore();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set([RUWAYJIH_ID]));
  const [cardSize, setCardSize] = useState<CardSize>("md");

  // Build the set of currently highlighted node IDs based on active highlight mode
  const highlightedIds = useMemo(() => {
    if (highlightMode === "ancestors")   return new Set([selectedId, ...getAncestors(selectedId)]);
    if (highlightMode === "descendants") return new Set([selectedId, ...getDescendants(selectedId)]);
    if (highlightMode === "branch")      return new Set([selectedId, ...getBranch(selectedId)]);
    if (highlightMode === "direct")      return new Set([selectedId, ...getAncestors(selectedId), ...getDescendants(selectedId)]);
    return new Set([selectedId]);
  }, [highlightMode, selectedId]);

  // Expand a specific branch ID
  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Collapse all except root (Ruwayjih)
  const reset = useCallback(() => {
    setExpandedIds(new Set([RUWAYJIH_ID]));
    const rootEl = document.getElementById(`node-${RUWAYJIH_ID}`);
    if (rootEl) {
      rootEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  // Expand all nodes in the database
  const fit = useCallback(() => {
    const allIds = people.map((p) => p.id);
    setExpandedIds(new Set(allIds));
  }, []);

  // Register external actions (called from TopBar)
  useEffect(() => {
    registerActions({ reset, fit });
  }, [reset, fit, registerActions]);

  // Sync selectedId changes by expanding the ancestry path and scrolling it into view
  useEffect(() => {
    if (selectedId) {
      const ancestors = getAncestors(selectedId);
      if (ancestors.length > 0) {
        setExpandedIds((prev) => {
          const next = new Set(prev);
          ancestors.forEach((id) => next.add(id));
          return next;
        });
      }

      // Smoothly scroll to the selected member card once expanded
      const timer = setTimeout(() => {
        const el = document.getElementById(`node-${selectedId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        }
      }, 120);

      return () => clearTimeout(timer);
    }
  }, [selectedId]);

  // Handle guided journey mode traversal
  useEffect(() => {
    if (!journeyActive) return;
    // Walk down by generation, then left-to-right (sorted)
    const ordered = [...people].sort((a, b) => (a.generation ?? 0) - (b.generation ?? 0));
    let index = 0;
    const timer = window.setInterval(() => {
      const point = ordered[index++];
      if (!point) {
        setJourneyActive(false);
        return;
      }
      setSelectedId(point.id);
    }, 1500);

    return () => window.clearInterval(timer);
  }, [journeyActive, setJourneyActive, setSelectedId]);

  return (
    <section
      dir="rtl"
      className="relative mx-auto mt-4 h-[76vh] min-h-[580px] w-full overflow-hidden rounded-[32px] border border-amber-900/20 shadow-museum flex flex-col"
      style={{ background: "linear-gradient(160deg,#fdf6e3 0%,#f5e6c8 60%,#e8d5a3 100%)" }}
    >
      {/* Parchment texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[32px] opacity-15"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Internal Control Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-amber-900/10 bg-white/40 px-6 py-3.5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-emeraldDeep/75" />
          <span className="text-sm font-semibold text-emeraldDeep">تصفح شجرة النسب</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sizing Controls */}
          <div className="flex rounded-xl border border-emeraldDeep/15 bg-white/60 p-0.5">
            <button
              onClick={() => setCardSize("sm")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${cardSize === "sm" ? "bg-emeraldDeep text-white shadow-sm" : "text-emeraldDeep"}`}
            >
              صغير
            </button>
            <button
              onClick={() => setCardSize("md")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${cardSize === "md" ? "bg-emeraldDeep text-white shadow-sm" : "text-emeraldDeep"}`}
            >
              متوسط
            </button>
            <button
              onClick={() => setCardSize("lg")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${cardSize === "lg" ? "bg-emeraldDeep text-white shadow-sm" : "text-emeraldDeep"}`}
            >
              كبير
            </button>
          </div>

          <span className="h-4 w-[1px] bg-amber-900/10" />

          {/* Quick collapse/expand triggers */}
          <button
            onClick={fit}
            className="flex items-center gap-1.5 rounded-xl border border-emeraldDeep/10 bg-white/65 px-3 py-1.5 text-xs font-bold text-emeraldDeep hover:border-emeraldDeep/30 transition shadow-sm"
          >
            <Compass className="h-3.5 w-3.5" />
            توسيع الكل
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 rounded-xl border border-emeraldDeep/10 bg-white/65 px-3 py-1.5 text-xs font-bold text-emeraldDeep hover:border-emeraldDeep/30 transition shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            طي إلى الجذر
          </button>
        </div>
      </div>

      {/* Main tree viewport */}
      <div className="relative z-10 flex-1 overflow-auto p-8 md:p-12 scroll-smooth">
        <div className="min-w-[max-content] flex flex-col items-start justify-start pr-4 pb-16 gap-6">
          {/* Heritage Banner Card for Ruwayjih Ancestors */}
          <div className="museum-glass border border-goldRich/30 bg-white/70 rounded-3xl p-5 shadow-museum max-w-[550px] text-right flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-amber-800/90 bg-amber-500/15 px-2.5 py-0.5 rounded-full">النسب المتصل وصولاً للجد الأكبر</span>
            </div>
            <h3 className="text-lg font-black text-emeraldDeep leading-7" style={{ fontFamily: "var(--font-thmanyah-serif), serif" }}>
              رويجح بن وقيتان بن عايد بن سالم بن محمد بن عبيد بن عباد
            </h3>
            <p className="text-xs text-charcoal/60 leading-5">
              تبدأ الشجرة المعروضة بالأسفل من الابن **رويجح**، وهنا نثبت تسلسل آبائه وأجداده كما ورد في وثائق النسب وصولاً للجد الأكبر **عباد**.
            </p>
          </div>

          <TreeNode
            personId={RUWAYJIH_ID}
            expandedIds={expandedIds}
            toggleExpand={toggleExpand}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            highlightedIds={highlightedIds}
            depth={0}
            isFirst={true}
            isLast={true}
            cardSize={cardSize}
          />
        </div>
      </div>

      {/* Guided Tour Banner */}
      <AnimatePresence>
        {journeyActive && (
          <motion.div
            className="absolute bottom-6 left-6 z-20 rounded-2xl border border-goldRich bg-emeraldDeep px-4 py-3 text-sm font-bold text-white shadow-gold"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
          >
            رحلة العائلة قيد العرض...
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
