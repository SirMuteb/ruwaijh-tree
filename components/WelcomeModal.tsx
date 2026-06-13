"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState<1 | 2>(1);

  // Sequential auto-dismiss timers
  useEffect(() => {
    if (!isOpen) return;

    if (step === 1) {
      const timer = setTimeout(() => {
        setStep(2);
      }, 6000);
      return () => clearTimeout(timer);
    } else if (step === 2) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [step, isOpen]);

  const handleInteraction = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (step === 1) {
      setStep(2);
    } else {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <div
        onClick={() => handleInteraction()}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/50 p-4 backdrop-blur-md cursor-pointer select-none"
        dir="rtl"
        role="button"
        aria-label="إغلاق الترحيب"
      >
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
          className="relative max-h-[92vh] w-full max-w-[620px] overflow-y-auto rounded-[32px] border border-goldRich/30 bg-white/95 p-6 md:p-8 shadow-museum text-right flex flex-col gap-6 cursor-default"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #fcfbf7 60%, #f7f3e8 100%)",
            fontFamily: "var(--font-thmanyah-sans), sans-serif"
          }}
          onClick={(e) => {
            handleInteraction(e);
          }}
        >
          {step === 1 ? (
            <>
              {/* Basmala Header decorative style */}
              <div className="text-center text-xs text-amber-800/60 font-semibold tracking-widest border-b border-amber-900/5 pb-4">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </div>

              {/* Quranic Verse */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-amber-800/80">قَالَ الله تَعَالَىٰ:</span>
                <blockquote
                  className="text-lg md:text-xl font-black text-emeraldDeep text-center leading-8 py-2 px-3 border-r-2 border-emeraldDeep/15 bg-emeraldDeep/5 rounded-l-2xl"
                  style={{ fontFamily: "var(--font-thmanyah-serif), serif" }}
                >
                  ﴿ يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ إِنَّ اللَّهَ عَلِيمٌ خَبِيرٌ ﴾
                </blockquote>
                <span className="text-xs text-charcoal/50 text-left font-bold pl-2">
                  ﴿ سورة الحجرات: ١٣ ﴾
                </span>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-amber-950/10" />
                </div>
                <div className="relative bg-[#fcfbf7] px-4 text-amber-800/30 text-lg">♦</div>
              </div>

              {/* Hadith */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-amber-800/80">قال رسول الله ﷺ:</span>
                <blockquote className="text-sm md:text-base font-bold text-charcoal text-center leading-7 py-2 px-4 bg-amber-900/5 rounded-2xl">
                  &quot; تعلموا من أنسابكم ما تصلون به أرحامكم، فإن صلة الرحم محبة في الأهل، مثراة في المال، منسأة في الأثر &quot;
                </blockquote>
                <span className="text-xs text-charcoal/50 text-left font-bold pl-2">
                  ﴿ أخرجه الترمذي (1979)، وأحمد (8855) وصححه الألباني ﴾
                </span>
              </div>
            </>
          ) : (
            <>
              {/* Welcome Header */}
              <div className="text-center text-xs text-amber-800/60 font-semibold tracking-widest border-b border-amber-900/5 pb-4">
                أهلاً بكم في أرشيف العائلة
              </div>

              {/* Modern Family welcome message */}
              <div className="flex flex-col gap-3 py-6 px-4">
                <blockquote
                  className="text-lg md:text-xl font-black text-emeraldDeep text-center leading-9"
                  style={{ fontFamily: "var(--font-thmanyah-serif), serif" }}
                >
                  عائلتنا تجمع بين أصالة الجذور وحداثة التقنية، فمن شجرة العائلة العريقة الى مستقبل رقمي يحاكيها، نسعى الى حفظ الإرث والأنساب وتوثيقها للأجيال القادمة
                </blockquote>
              </div>
            </>
          )}

          {/* Prompt banner detailing touch interaction */}
          <div className="text-center text-[10px] text-amber-800/40 font-bold border-t border-amber-900/5 pt-4">
            انقر في أي مكان على الشاشة للمتابعة ودخول الشجرة
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
