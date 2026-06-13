"use client";

import { motion } from "framer-motion";

export function BackgroundEffects() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-goldRich/15 blur-3xl"
        animate={{ y: [0, 22, 0], opacity: [0.45, 0.72, 0.45] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[5%] h-96 w-96 rounded-full bg-emeraldDeep/12 blur-3xl"
        animate={{ x: [0, -28, 0], opacity: [0.35, 0.62, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 heritage-pattern opacity-50" />
      {Array.from({ length: 18 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-1 w-1 rounded-full bg-goldRich/40"
          style={{ left: `${(index * 47) % 100}%`, top: `${(index * 31) % 100}%` }}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.65, 0.15] }}
          transition={{ duration: 5 + (index % 5), repeat: Infinity, delay: index * 0.2 }}
        />
      ))}
    </div>
  );
}
