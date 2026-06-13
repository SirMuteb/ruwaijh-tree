"use client";

import { useCallback, useRef } from "react";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Dashboard } from "@/components/Dashboard";
import { DetailPanel } from "@/components/DetailPanel";
import { LineageTree } from "@/components/LineageTree";
import { TimelineView } from "@/components/TimelineView";
import { TopBar } from "@/components/TopBar";
import { WelcomeModal } from "@/components/WelcomeModal";
import { useLineageStore } from "@/store/useLineageStore";

export default function Home() {
  const actions = useRef({ reset: () => {}, fit: () => {} });
  const registerActions = useCallback((next: { reset: () => void; fit: () => void }) => {
    actions.current = next;
  }, []);
  const viewMode = useLineageStore((state) => state.viewMode);

  return (
    <main className="relative min-h-screen overflow-x-hidden pb-8">
      <BackgroundEffects />
      <WelcomeModal />
      <TopBar onReset={() => actions.current.reset()} onFit={() => actions.current.fit()} />
      
      <div className="mx-auto my-6 grid w-[min(1520px,calc(100vw-24px))] gap-6 lg:grid-cols-[1fr_390px] items-start">
        {/* Right side (Desktop) / Top side (Mobile) */}
        <div className="flex flex-col gap-4 min-w-0">
          {/* Website Goal Phrase */}
          <div className="museum-glass border border-emeraldDeep/10 rounded-[28px] p-5 text-right bg-white/65 shadow-sm">
            <p className="text-sm md:text-base font-bold text-emeraldDeep leading-7" style={{ fontFamily: "var(--font-thmanyah-sans), sans-serif" }}>
              من جذورٍ راسخة في عمق الماضي إلى فروعٍ تمتد نحو المستقبل، توحدنا هذه الشجرة الرقمية لحفظ الأنساب وتوثيق التاريخ العائلي للأجيال القادمة.
            </p>
          </div>
          {viewMode === "tree" ? <LineageTree registerActions={registerActions} /> : <TimelineView />}
        </div>

        {/* Left side (Desktop) / Bottom side (Mobile) */}
        <div className="flex flex-col gap-6 w-full max-w-[390px] lg:w-[390px] justify-self-center lg:justify-self-start">
          <DetailPanel />
          <Dashboard />
        </div>
      </div>
    </main>
  );
}
