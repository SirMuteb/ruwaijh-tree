"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Dashboard } from "@/components/Dashboard";
import { DetailPanel } from "@/components/DetailPanel";
import { LineageTree } from "@/components/LineageTree";
import { TimelineView } from "@/components/TimelineView";
import { TopBar } from "@/components/TopBar";
import { WelcomeModal } from "@/components/WelcomeModal";
import { BottomNav } from "@/components/BottomNav";
import { useLineageStore } from "@/store/useLineageStore";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const actions = useRef({ reset: () => {}, fit: () => {} });
  const registerActions = useCallback((next: { reset: () => void; fit: () => void }) => {
    actions.current = next;
  }, []);
  const viewMode = useLineageStore((state) => state.viewMode);
  const selectedId = useLineageStore((state) => state.selectedId);

  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const lastSelectedId = useRef(selectedId);

  // Sync mobile bottom sheet display with node selection (except initial mount load)
  useEffect(() => {
    if (selectedId && selectedId !== lastSelectedId.current) {
      setIsMobileSheetOpen(true);
    }
    lastSelectedId.current = selectedId;
  }, [selectedId]);

  return (
    <main className="relative min-h-screen overflow-x-hidden pb-24 md:pb-8">
      <BackgroundEffects />
      <WelcomeModal />
      <TopBar onReset={() => actions.current.reset()} onFit={() => actions.current.fit()} />
      
      <div className="mx-auto my-6 grid w-[min(1520px,calc(100vw-24px))] gap-6 lg:grid-cols-[1fr_390px] items-start">
        {/* Website Goal Phrase */}
        <div className="lg:col-start-1 lg:row-start-1 museum-glass border border-emeraldDeep/10 rounded-[28px] p-5 text-right bg-white/65 shadow-sm">
          <p className="text-sm md:text-base font-bold text-emeraldDeep leading-7" style={{ fontFamily: "var(--font-thmanyah-sans), sans-serif" }}>
            من جذورٍ راسخة في عمق الماضي إلى فروعٍ تمتد نحو المستقبل، توحدنا هذه الشجرة الرقمية لحفظ الأنساب وتوثيق التاريخ العائلي للأجيال القادمة.
          </p>
        </div>

        {/* Tree / Timeline View */}
        <div id="tree-or-timeline-container" className="lg:col-start-1 lg:row-start-2 min-w-0">
          {viewMode === "tree" ? <LineageTree registerActions={registerActions} /> : <TimelineView />}
        </div>

        {/* Left side Sticky Sidebar (Desktop) / Hidden on mobile since it uses the Bottom Sheet */}
        <div className="hidden lg:block lg:col-start-2 lg:row-start-1 lg:row-span-3 lg:sticky lg:top-6 w-full max-w-[390px] lg:w-[390px] justify-self-center lg:justify-self-start">
          <DetailPanel />
        </div>

        {/* Dashboard under the Tree View */}
        <div id="dashboard-section" className="lg:col-start-1 lg:row-start-3 w-full">
          <Dashboard />
        </div>
      </div>

      {/* Mobile Bottom Sheet Details View */}
      <AnimatePresence>
        {isMobileSheetOpen && (
          <>
            {/* Backdrop overlay to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSheetOpen(false)}
              className="fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-sm lg:hidden"
            />

            {/* Bottom Sheet Modal Container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[32px] border-t border-goldRich/30 bg-white shadow-museum p-5 pb-[calc(env(safe-area-inset-bottom,16px)+8px)] lg:hidden flex flex-col gap-3"
            >
              {/* Drag handle decorator bar */}
              <div 
                className="mx-auto w-12 h-1.5 rounded-full bg-charcoal/15 mb-2 cursor-pointer shrink-0" 
                onClick={() => setIsMobileSheetOpen(false)} 
              />
              
              {/* Native Close Button */}
              <button 
                onClick={() => setIsMobileSheetOpen(false)}
                className="absolute top-4 left-4 h-10 w-10 rounded-full bg-emeraldDeep/5 flex items-center justify-center text-emeraldDeep font-bold hover:bg-emeraldDeep/10 active:scale-90 transition z-50"
                aria-label="إغلاق تفاصيل العضو"
              >
                ✕
              </button>

              <div className="overflow-y-auto flex-1">
                <DetailPanel />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sticky Bottom Navigation on Mobile */}
      <BottomNav />
    </main>
  );
}
