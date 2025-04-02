let nodes = [];
let edges = [];
let mstEdges = [];
let stepIndex = 0;
const svg = d3.select("svg");

function generateGraph() {
    nodes = Array.from({ length: 6 }, (_, id) => ({
        id,
        x: Math.random() * 500 + 50,
        y: Math.random() * 400 + 50
    }));
    edges = [];
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (Math.random() > 0.5) {
                edges.push({ source: i, target: j, weight: Math.floor(Math.random() * 10) + 1 });
            }
        }
    }
    drawGraph();
}

function drawGraph() {
    svg.selectAll("*").remove();
    svg.selectAll("line")
        .data(edges)
        .enter()
        .append("line")
        .attr("x1", d => nodes[d.source].x)
        .attr("y1", d => nodes[d.source].y)
        .attr("x2", d => nodes[d.target].x)
        .attr("y2", d => nodes[d.target].y)
        .attr("class", "edge");

    svg.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 10);

    svg.selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("x", d => d.x)
        .attr("y", d => d.y - 15)
        .text(d => d.id);
}

function find(parent, i) {
    if (parent[i] === i) return i;
    return find(parent, parent[i]);
}

function union(parent, rank, x, y) {
    let rootX = find(parent, x);
    let rootY = find(parent, y);
    if (rootX !== rootY) {
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
    }
}

function startKruskalStepByStep() {
    edges.sort((a, b) => a.weight - b.weight);
    mstEdges = [];
    stepIndex = 0;
    let parent = {}, rank = {};
    nodes.forEach(node => { parent[node.id] = node.id; rank[node.id] = 0; });
    stepKruskal(parent, rank);
}

function stepKruskal(parent, rank) {
    if (stepIndex >= edges.length) return;
    let edge = edges[stepIndex];
    let root1 = find(parent, edge.source);
    let root2 = find(parent, edge.target);
    if (root1 !== root2) {
        mstEdges.push(edge);
        union(parent, rank, root1, root2);
        drawMST();
    }
    stepIndex++;
    setTimeout(() => stepKruskal(parent, rank), 1000);
}

function drawMST() {
    svg.selectAll(".mst").remove();
    svg.selectAll(".mst")
        .data(mstEdges)
        .enter()
        .append("line")
        .attr("x1", d => nodes[d.source].x)
        .attr("y1", d => nodes[d.source].y)
        .attr("x2", d => nodes[d.target].x)
        .attr("y2", d => nodes[d.target].y)
        .attr("class", "mst");
}