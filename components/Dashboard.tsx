"use client";

import { motion, useInView } from "framer-motion";
import { BarChart3, GitFork, Hourglass, UsersRound } from "lucide-react";
import { useRef } from "react";
import { getStats } from "@/lib/family";

export function Dashboard() {
  const stats = getStats();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section ref={ref} className="mx-auto my-8 grid w-[min(1520px,calc(100vw-24px))] gap-4 lg:grid-cols-[1.2fr_.8fr]">
      <div className="museum-glass rounded-[32px] p-6">
        <div className="flex items-center gap-2 text-emeraldDeep">
          <BarChart3 className="h-5 w-5 text-goldRich" />
          <h2 className="text-xl font-black">لوحة التراث</h2>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat icon={<UsersRound />} label="إجمالي الأفراد" value={stats.total} inView={inView} />
          <Stat icon={<Hourglass />} label="عدد الأجيال" value={stats.generations} inView={inView} />
          <Stat icon={<GitFork />} label="أكبر فرع" value={stats.largestBranch?.count ?? 0} inView={inView} />
          <Stat icon={<UsersRound />} label="المشار إليهم كمتوفين" value={stats.deceased} inView={inView} />
        </div>
      </div>
      <div className="museum-glass rounded-[32px] p-6 text-right">
        <h2 className="text-xl font-black text-emeraldDeep">توثيق البيانات</h2>
        <div className="mt-4 text-sm leading-7 text-charcoal/80 flex flex-col gap-4">
          <div>
            <span className="font-bold text-emeraldDeep block text-xs">جمع وإعداد</span>
            <span className="font-black text-base text-charcoal">سطام بن مقحم بن بجاد الحلفي</span>
            <span className="text-xs text-charcoal/50 block mt-0.5">الطبعة الأولى ١٤٤٧/١٢/١٨ هـ</span>
          </div>
          <div className="border-t border-emeraldDeep/10 pt-3">
            <span className="font-bold text-emeraldDeep block text-xs">تصميم وبرمجة</span>
            <span className="font-black text-base text-charcoal">متعب بن نايف بن متعب الحلفي</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, label, value, inView }: { icon: React.ReactNode; label: string; value: number; inView: boolean }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/65 p-5 shadow-sm">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emeraldDeep text-white [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
      <div className="mt-4 text-sm text-charcoal/60">{label}</div>
      <motion.div className="mt-1 text-4xl font-black text-charcoal" initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
        {inView ? value : 0}
      </motion.div>
    </div>
  );
}
