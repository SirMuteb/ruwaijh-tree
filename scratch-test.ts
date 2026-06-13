import { buildTreeLayout, people } from './lib/family';

console.log("Total people:", people.length);
const layout = buildTreeLayout();
console.log("Points size:", layout.points.size);
console.log("Links count:", layout.links.length);
console.log("Bounds:", layout.bounds);

console.log("\nFirst 10 points:");
const pointsArr = Array.from(layout.points.values());
pointsArr.slice(0, 10).forEach(pt => {
  const p = people.find(x => x.id === pt.id);
  console.log(`ID: ${pt.id}, Name: ${p?.name}, x: ${pt.x}, y: ${pt.y}, depth: ${pt.depth}`);
});
