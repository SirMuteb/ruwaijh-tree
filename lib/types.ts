export interface Person {
  id: string;
  name: string;
  fatherId?: string | null;
  children: string[];
  isDeceased?: boolean;
  needsReview?: boolean;
  generation?: number;
  source?: {
    pdf: string;
    x: number;
    y: number;
    pdfItems?: number[];
    note?: string;
  };
}

export interface FamilyData {
  people: Person[];
  metadata?: {
    sourcePdf: string;
    extraction: string;
    personCount: number;
    generatedAt: string;
  };
}

export type ViewMode = "tree" | "timeline";
export type HighlightMode = "none" | "ancestors" | "descendants" | "direct" | "branch";

export interface TreePoint {
  id: string;
  x: number;
  y: number;
  depth: number;
}

export interface TreeLink {
  source: TreePoint;
  target: TreePoint;
}
