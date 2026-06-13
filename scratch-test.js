const data = require('./data/family.json');
const d3Hierarchy = require('d3-hierarchy');

const parsedPeople = data.map((raw) => {
  return {
    id: String(raw.id),
    name: raw.name,
    fatherId: raw.fatherId != null ? String(raw.fatherId) : null,
    children: [],
    generation: 0
  };
});

const parsedPeopleById = new Map(parsedPeople.map(p => [p.id, p]));
parsedPeople.forEach((person) => {
  if (person.fatherId) {
    const father = parsedPeopleById.get(person.fatherId);
    if (father) {
      father.children.push(person.id);
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
});

const rootNode = d3Hierarchy.stratify()
  .id((d) => d.id)
  .parentId((d) => d.fatherId || undefined)(parsedPeople);

const treeLayout = d3Hierarchy.tree().nodeSize([190, 210]);
const treeNode = treeLayout(rootNode);

console.log("Root node ID:", rootNode.data.id, "Name:", rootNode.data.name);
console.log("Total nodes in hierarchy:", rootNode.descendants().length);

console.log("\nCoordinates of top 10 nodes in hierarchy:");
rootNode.descendants().slice(0, 10).forEach(node => {
  console.log(`ID: ${node.data.id}, Name: ${node.data.name}, x: ${node.x.toFixed(2)}, y: ${node.y.toFixed(2)}, depth: ${node.depth}`);
});
