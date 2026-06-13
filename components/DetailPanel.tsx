"use client";

import { motion } from "framer-motion";
import { GitBranch, HeartHandshake, Landmark, UserRound, UsersRound } from "lucide-react";
import { getAncestors, getChildren, getDescendants, getFather, peopleById } from "@/lib/family";
import { useLineageStore } from "@/store/useLineageStore";
import type { HighlightMode } from "@/lib/types";

const highlightButtons: Array<{ mode: HighlightMode; label: string }> = [
  { mode: "ancestors", label: "الآباء" },
  { mode: "descendants", label: "الأبناء" },
  { mode: "direct", label: "النسب المباشر" },
  { mode: "branch", label: "الفرع الكامل" }
];

export function DetailPanel() {
  const { selectedId, setSelectedId, highlightMode, setHighlightMode } = useLineageStore();
  const person = peopleById.get(selectedId);
  if (!person) return null;
  const father = getFather(person.id);
  const children = getChildren(person.id);
  const ancestors = getAncestors(person.id);
  const brothers = father
    ? getChildren(father.id).filter((child) => child.id !== person.id)
    : [];
  const descendants = getDescendants(person.id);

  return (
    <motion.aside
      id="detail-panel"
      tabIndex={-1}
      className="museum-glass rounded-[32px] p-6 shadow-museum w-full text-right flex flex-col gap-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-emeraldDeep/10 px-3 py-1 text-xs font-bold text-emeraldDeep">
              <Landmark className="h-4 w-4" />
              الجيل {(person.generation ?? 0) + 1}
            </span>
            {person.needsReview && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-600">
                تحتاج مراجعة
              </span>
            )}
          </div>
          <h2 className="mt-3 text-4xl font-black text-charcoal">{person.name}</h2>
        </div>
        {person.isDeceased && <span className="rounded-full border border-charcoal/10 bg-charcoal/7 px-3 py-1 text-xs font-bold text-charcoal/70">متوفى</span>}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Metric icon={<UserRound />} label="الأب" value={father?.name ?? "الأصل"} />
        <Metric icon={<UsersRound />} label="الأبناء" value={String(children.length)} />
        <Metric icon={<GitBranch />} label="الذرية" value={String(descendants.length)} />
      </div>

      <div className="mt-5 rounded-3xl border border-emeraldDeep/10 bg-white/55 p-4">
        <div className="flex items-center gap-2 text-sm font-black text-emeraldDeep">
          <HeartHandshake className="h-4 w-4 text-goldRich" />
          أدوات إبراز النسب
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {highlightButtons.map((button) => (
            <button
              key={button.mode}
              onClick={() => setHighlightMode(highlightMode === button.mode ? "none" : button.mode)}
              className={`rounded-2xl border px-3 py-2 text-sm font-bold transition ${highlightMode === button.mode ? "border-goldRich bg-goldRich/25 text-charcoal" : "border-emeraldDeep/10 bg-white/70 text-emeraldDeep"}`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      {father && (
        <div className="mt-5">
          <h3 className="text-sm font-black text-emeraldDeep">الأب</h3>
          <button className="mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-right font-bold shadow-sm transition hover:bg-white" onClick={() => setSelectedId(father.id)}>
            {father.name}
          </button>
        </div>
      )}

      {father && (
        <div className="mt-5">
          <h3 className="text-sm font-black text-emeraldDeep">الإخوة</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {brothers.length > 0 ? (
              brothers.map((brother) => (
                <button
                  key={brother.id}
                  className="rounded-2xl bg-white/70 px-3 py-2 text-[13px] font-bold shadow-sm transition hover:bg-white text-right border border-emeraldDeep/5 hover:border-emeraldDeep/15"
                  onClick={() => setSelectedId(brother.id)}
                >
                  {brother.name}
                </button>
              ))
            ) : (
              <p className="text-xs text-charcoal/50 pr-2">لا يوجد إخوة ظاهرون في الشجرة لهذا العضو.</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-5">
        <h3 className="text-sm font-black text-emeraldDeep">الأبناء</h3>
        <div className="mt-2 grid gap-2">
          {children.length ? (
            children.map((child) => (
              <button key={child.id} className="rounded-2xl bg-white/70 px-4 py-3 text-right font-bold shadow-sm transition hover:bg-white" onClick={() => setSelectedId(child.id)}>
                {child.name}
              </button>
            ))
          ) : (
            <p className="rounded-2xl bg-white/55 px-4 py-3 text-sm text-charcoal/60">لا يوجد ابناء</p>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/60 p-3 text-center">
      <div className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-emeraldDeep/10 text-emeraldDeep [&>svg]:h-4 [&>svg]:w-4">{icon}</div>
      <div className="mt-2 text-xs text-charcoal/55">{label}</div>
      <div className="text-lg font-black text-charcoal">{value}</div>
    </div>
  );
}
