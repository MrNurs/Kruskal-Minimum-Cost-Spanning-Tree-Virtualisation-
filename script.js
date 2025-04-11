let vertices = [];
let edges = [];
let mstEdges = [];
let parent = {};
let rank = {};
let stepTimeout;
let currentStepEdges = [];

function generateGraph() {
  clearTimeout(stepTimeout);
  const vertexCount = parseInt(document.getElementById('vertexCount').value) || 6;
  vertices = [];
  edges = [];
  mstEdges = [];

  const centerX = 300;
  const centerY = 250;
  const radius = Math.min(200, 400 / (vertexCount * 0.5));
  const angleStep = (2 * Math.PI) / vertexCount;

  for (let i = 0; i < vertexCount; i++) {
    const angle = (i * angleStep) - Math.PI/2;
    vertices.push({
      id: i,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    });
  }

  const connected = new Set([0]);
  
  while (connected.size < vertexCount) {
    const from = [...connected][Math.floor(Math.random() * connected.size)];
    const to = Array.from({length: vertexCount}, (_, i) => i)
                  .find(i => !connected.has(i));
    if (to === undefined) break;
    
    edges.push({
      source: from,
      target: to,
      weight: Math.floor(Math.random() * 9) + 1
    });
    connected.add(to);
  }

  for (let i = 0; i < vertexCount; i++) {
    for (let j = i + 1; j < vertexCount; j++) {
      if (Math.random() > 0.5 && !edges.some(e => 
        (e.source === i && e.target === j) ||
        (e.source === j && e.target === i)
      )) {
        edges.push({
          source: i,
          target: j,
          weight: Math.floor(Math.random() * 9) + 1
        });
      }
    }
  }

  updateVisualization();
}

function find(node) {
  if (parent[node] !== node) {
    parent[node] = find(parent[node]);
  }
  return parent[node];
}

function union(node1, node2) {
  const root1 = find(node1);
  const root2 = find(node2);

  if (root1 !== root2) {
    if (rank[root1] > rank[root2]) {
      parent[root2] = root1;
    } else {
      parent[root1] = root2;
      if (rank[root1] === rank[root2]) {
        rank[root2]++;
      }
    }
  }
}

function startKruskalStepByStep() {
  clearTimeout(stepTimeout);
  mstEdges = [];
  parent = {};
  rank = {};
  
  currentStepEdges = [...edges].sort((a, b) => a.weight - b.weight);
  
  vertices.forEach(v => {
    parent[v.id] = v.id;
    rank[v.id] = 0;
  });
  
  updateVisualization();
  stepKruskal();
}

function stepKruskal() {
  if (currentStepEdges.length === 0) return;

  const edge = currentStepEdges.shift();
  const root1 = find(edge.source);
  const root2 = find(edge.target);

  if (root1 !== root2) {
    mstEdges.push(edge);
    union(edge.source, edge.target);
  }

  updateVisualization();

  if (currentStepEdges.length > 0) {
    stepTimeout = setTimeout(stepKruskal, 1500);
  }
}

function updateVisualization() {
  updateTable('edgesTable', edges);
  updateTable('mstTable', mstEdges);
  updateDSUTable();

  const canvas = document.getElementById('graphCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  edges.forEach(edge => {
    const v1 = vertices[edge.source];
    const v2 = vertices[edge.target];
    const isMST = mstEdges.some(e => 
      (e.source === edge.source && e.target === edge.target) ||
      (e.source === edge.target && e.target === edge.source)
    );

    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.strokeStyle = isMST ? '#e74c3c' : '#bdc3c7';
    ctx.lineWidth = isMST ? 3 : 1;
    ctx.stroke();

    ctx.fillStyle = '#2c3e50';
    ctx.font = '12px Arial';
    const midX = (v1.x + v2.x)/2 + 5;
    const midY = (v1.y + v2.y)/2 + 5;
    ctx.fillText(edge.weight, midX, midY);
  });

  vertices.forEach(v => {
    ctx.beginPath();
    ctx.arc(v.x, v.y, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#3498db';
    ctx.fill();
    ctx.strokeStyle = '#2c3e50';
    ctx.stroke();
    
    ctx.fillStyle = '#ecf0f1';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(v.id, v.x, v.y);
  });
}

function updateTable(tableId, items) {
  const table = document.getElementById(tableId);
  table.innerHTML = `
    <tr>
      <th>Source</th>
      <th>Target</th>
      <th>Weight</th>
    </tr>
    ${items.map(edge => `
      <tr>
        <td>${edge.source}</td>
        <td>${edge.target}</td>
        <td>${edge.weight}</td>
      </tr>
    `).join('')}
  `;
}

function updateDSUTable() {
  const table = document.getElementById('disjointSet');
  table.innerHTML = `
    <tr>
      <th>Vertex</th>
      <th>Parent</th>
    </tr>
    ${vertices.map(v => `
      <tr>
        <td>${v.id}</td>
        <td>${parent[v.id]}</td>
      </tr>
    `).join('')}
  `;
}

generateGraph();