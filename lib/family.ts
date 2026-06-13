import data from "@/data/family.json";
import type { FamilyData, Person, TreeLink, TreePoint } from "@/lib/types";
import { stratify, tree } from "d3-hierarchy";

const parsedPeople: Person[] = (data as any[]).map((raw) => {
  return {
    id: String(raw.id),
    name: raw.name,
    fatherId: raw.fatherId != null ? String(raw.fatherId) : null,
    children: [],
    isDeceased: false,
    needsReview: false,
    generation: 0,
  };
});

const parsedPeopleById = new Map<string, Person>(
  parsedPeople.map((person) => [person.id, person])
);

parsedPeople.forEach((person) => {
  if (person.fatherId) {
    const father = parsedPeopleById.get(person.fatherId);
    if (father) {
      if (!father.children.includes(person.id)) {
        father.children.push(person.id);
      }
    }
  }
});

parsedPeople.forEach((person) => {
  let gen = 0;
  let cursor = person;
  while (cursor.fatherId) {
    const father = parsedPeopleById.get(cursor.fatherId);
    if (!father) break;
    gen++;
    cursor = father;
  }
  person.generation = gen;
  person.isDeceased = gen < 6;
});

export const familyData: FamilyData = {
  people: parsedPeople,
  metadata: {
    sourcePdf: "family.pdf",
    extraction: "manual",
    personCount: parsedPeople.length,
    generatedAt: new Date().toISOString(),
  },
};

export const people = familyData.people;

export const peopleById = parsedPeopleById;

export const rootPerson = people.find((person) => !person.fatherId) ?? people[0];

export function getFather(personId: string): Person | undefined {
  const person = peopleById.get(personId);
  return person?.fatherId ? peopleById.get(person.fatherId) : undefined;
}

export function getChildren(personId: string): Person[] {
  const person = peopleById.get(personId);
  return person?.children.map((id) => peopleById.get(id)).filter(Boolean) as Person[] ?? [];
}

export function getAncestors(personId: string): string[] {
  const result: string[] = [];
  let cursor = peopleById.get(personId);
  while (cursor?.fatherId) {
    result.push(cursor.fatherId);
    cursor = peopleById.get(cursor.fatherId);
  }
  return result;
}

export function getDescendants(personId: string): string[] {
  const result: string[] = [];
  const visit = (id: string) => {
    getChildren(id).forEach((child) => {
      result.push(child.id);
      visit(child.id);
    });
  };
  visit(personId);
  return result;
}

export function getBranch(personId: string): string[] {
  const person = peopleById.get(personId);
  const top = getAncestors(personId).at(-1) ?? person?.id;
  return top ? [top, ...getDescendants(top)] : [];
}

export function normalizeArabic(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[\u064B-\u0652]/g, "")
    .replace(/[اأإآ]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/[ةه]/g, "ه")
    .replace(/ـ/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function getLineageName(personId: string, limit = 4): string {
  const names: string[] = [];
  let cursor = peopleById.get(personId);
  let depth = 0;
  while (cursor && depth < limit) {
    names.push(cursor.name);
    if (!cursor.fatherId) break;
    cursor = peopleById.get(cursor.fatherId);
    depth++;
  }
  return names.join(" بن ");
}

export function getFullLineageName(personId: string): string {
  const names: string[] = [];
  let cursor = peopleById.get(personId);
  while (cursor) {
    names.push(cursor.name);
    if (!cursor.fatherId) break;
    cursor = peopleById.get(cursor.fatherId);
  }
  return names.join(" بن ");
}

export function searchPeople(query: string): Person[] {
  const normalizedQuery = normalizeArabic(query);
  if (!normalizedQuery) return [];
  const queryWords = normalizedQuery.split(" ").filter(Boolean);
  if (queryWords.length === 0) return [];

  const [firstWord, ...remainingWords] = queryWords;

  return people
    .filter((person) => {
      // 1. First word must match the beginning of the person's name
      const normalizedFirstName = normalizeArabic(person.name);
      if (!normalizedFirstName.startsWith(firstWord)) {
        return false;
      }
      // 2. All other words must match somewhere in their lineage path
      const lineageName = getLineageName(person.id, 4);
      const normalizedLineage = normalizeArabic(lineageName);
      return remainingWords.every((word) => normalizedLineage.includes(word));
    })
    .sort((a, b) => (a.generation ?? 0) - (b.generation ?? 0))
    .slice(0, 12);
}

export function getStats() {
  if (people.length === 0) {
    return {
      total: 0,
      generations: 0,
      deceased: 0,
      largestBranch: undefined
    };
  }
  const generations = Math.max(...people.map((person) => person.generation ?? 0)) + 1;
  const deceased = people.filter((person) => person.isDeceased).length;
  const largestBranch = people
    .map((person) => ({ person, count: getDescendants(person.id).length }))
    .sort((a, b) => b.count - a.count)[0];
  return {
    total: people.length,
    generations,
    deceased,
    largestBranch
  };
}

export function buildTreeLayout() {
  if (people.length === 0) {
    return {
      points: new Map<string, TreePoint>(),
      links: [],
      bounds: { minX: 0, maxX: 0, minY: 0, maxY: 0 }
    };
  }

  const rootNode = stratify<Person>()
    .id((d) => d.id)
    .parentId((d) => d.fatherId || undefined)(people);

  const treeLayout = tree<Person>().nodeSize([190, 210]);
  const treeNode = treeLayout(rootNode);

  const points = new Map<string, TreePoint>();
  treeNode.descendants().forEach((node) => {
    points.set(node.data.id, {
      id: node.data.id,
      x: node.x,
      y: node.y,
      depth: node.depth
    });
  });

  const links: TreeLink[] = treeNode.links().map((link) => {
    const sourcePoint = points.get(link.source.data.id)!;
    const targetPoint = points.get(link.target.data.id)!;
    return {
      source: sourcePoint,
      target: targetPoint
    };
  });

  const bounds = [...points.values()].reduce(
    (acc, point) => ({
      minX: Math.min(acc.minX, point.x),
      maxX: Math.max(acc.maxX, point.x),
      minY: Math.min(acc.minY, point.y),
      maxY: Math.max(acc.maxY, point.y)
    }),
    { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  );

  return { points, links, bounds };
}
