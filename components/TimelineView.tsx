"use client";

import { motion } from "framer-motion";
import { people } from "@/lib/family";
import { useLineageStore } from "@/store/useLineageStore";

export function TimelineView() {
  const { setSelectedId, selectedId } = useLineageStore();
  const levels = new Map<number, typeof people>();
  people.forEach((person) => {
    const generation = person.generation ?? 0;
    levels.set(generation, [...(levels.get(generation) ?? []), person]);
  });

  return (
    <section className="mx-auto mt-4 h-[72vh] min-h-[560px] w-full overflow-auto rounded-[32px] border border-white/60 bg-white/35 p-6 shadow-museum">
      <div className="flex min-w-[1200px] gap-5" dir="rtl">
        {[...levels.entries()].sort((a, b) => a[0] - b[0]).map(([generation, members]) => (
          <motion.div
            key={generation}
            className="min-w-[220px] flex-1 rounded-[28px] border border-emeraldDeep/10 bg-white/55 p-4"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: generation * 0.035 }}
          >
            <div className="sticky top-0 z-10 rounded-2xl bg-emeraldDeep px-4 py-3 text-center text-sm font-black text-white shadow">
              الجيل {generation + 1}
            </div>
            <div className="mt-4 grid gap-3">
              {members.sort((a, b) => a.id.localeCompare(b.id))
                .map((person) => (
                  <button
                    key={person.id}
                    onClick={() => setSelectedId(person.id)}
                    className={`rounded-2xl border px-4 py-3 text-center text-sm font-bold shadow-sm transition hover:-translate-y-0.5 ${
                      selectedId === person.id ? "border-goldRich bg-goldRich/25 text-charcoal" : "border-white/70 bg-white/75 text-charcoal"
                    } ${person.isDeceased ? "grayscale" : ""}`}
                  >
                    {person.name}
                  </button>
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
