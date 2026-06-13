"use client";

import { create } from "zustand";
import type { HighlightMode, ViewMode } from "@/lib/types";

interface LineageState {
  selectedId: string;
  focusedId: string;
  query: string;
  viewMode: ViewMode;
  highlightMode: HighlightMode;
  journeyActive: boolean;
  setSelectedId: (id: string) => void;
  setFocusedId: (id: string) => void;
  setQuery: (query: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setHighlightMode: (mode: HighlightMode) => void;
  setJourneyActive: (active: boolean) => void;
}

export const useLineageStore = create<LineageState>((set) => ({
  selectedId: "عباد",
  focusedId: "عباد",
  query: "",
  viewMode: "tree",
  highlightMode: "none",
  journeyActive: false,
  setSelectedId: (id) => set({ selectedId: id, focusedId: id }),
  setFocusedId: (id) => set({ focusedId: id }),
  setQuery: (query) => set({ query }),
  setViewMode: (viewMode) => set({ viewMode }),
  setHighlightMode: (highlightMode) => set({ highlightMode }),
  setJourneyActive: (journeyActive) => set((state) => ({
    journeyActive,
    viewMode: journeyActive ? "tree" : state.viewMode
  }))
}));
