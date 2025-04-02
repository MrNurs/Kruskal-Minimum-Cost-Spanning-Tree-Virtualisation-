const nodes = [
    { id: 0, x: 50, y: 50 },
    { id: 1, x: 300, y: 100 },
    { id: 2, x: 50, y: 250 },
    { id: 3, x: 250, y: 400 },
    { id: 4, x: 450, y: 200 }
];
const edges = [
    { u: 0, v: 1, weight: 3 },
    { u: 0, v: 2, weight: 1 },
    { u: 1, v: 2, weight: 3 },
    { u: 1, v: 4, weight: 6 },
    { u: 2, v: 3, weight: 4 },
    { u: 3, v: 4, weight: 2 }
];

const graphDiv = document.getElementById('graph');
edges.forEach(({ u, v, weight }, index) => {
    const nodeU = nodes[u];
    const nodeV = nodes[v];

    const edge = document.createElement('div');
    edge.classList.add('edge');
    edge.style.width = Math.hypot(nodeV.x - nodeU.x, nodeV.y - nodeU.y) + 'px';
    edge.style.top = nodeU.y + 15 + 'px';
    edge.style.left = nodeU.x + 15 + 'px';
    edge.style.transform = `rotate(${Math.atan2(nodeV.y - nodeU.y, nodeV.x - nodeU.x)}rad)`;
    edge.setAttribute('data-edge-id', index);
    graphDiv.appendChild(edge);
});
class DSU {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = Array(n).fill(1);
    }

    find(v) {
        if (this.parent[v] !== v) {
            this.parent[v] = this.find(this.parent[v]);
        }
        return this.parent[v];
    }

    union(a, b) {
        let rootA = this.find(a);
        let rootB = this.find(b);
        if (rootA !== rootB) {
            if (this.rank[rootA] > this.rank[rootB]) {
                this.parent[rootB] = rootA;
            } else if (this.rank[rootA] < this.rank[rootB]) {
                this.parent[rootA] = rootB;
            } else {
                this.parent[rootB] = rootA;
                this.rank[rootA]++;
            }
            return true;
        }
        return false;
    }
}
function runKruskal() {
    edges.sort((a, b) => a.weight - b.weight); 
    const dsu = new DSU(nodes.length);
    const mstEdges = [];

    for (let { u, v, weight } of edges) {
        if (dsu.union(u, v)) {
            mstEdges.push({ u, v });
            if (mstEdges.length === nodes.length - 1) break;
        }
    }

    highlightEdges(mstEdges);
}
function highlightEdges(mstEdges) {
    const edgeElements = document.querySelectorAll('.edge');
    mstEdges.forEach(({ u, v }) => {
        edges.forEach((edge, index) => {
            if ((edge.u === u && edge.v === v) || (edge.u === v && edge.v === u)) {
                setTimeout(() => {
                    edgeElements[index].classList.add('highlight');
                }, 500 * index); 
            }
        });
    });
}