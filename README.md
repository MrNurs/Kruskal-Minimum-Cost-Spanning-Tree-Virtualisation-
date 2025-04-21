# Kruskal's Algorithm Visualization

This is a web-based visualization tool for **Kruskal's Algorithm**, which is used to find the **Minimum Spanning Tree (MST)** of a connected, undirected, weighted graph. The project is implemented using **HTML, CSS, and JavaScript**.

## 🚀 Features

- 🎯 Generate a random connected graph with up to 12 vertices.
- 🧮 Visual step-by-step execution of Kruskal's algorithm.
- 🖼️ Graph visualization using the `<canvas>` element.
- 🧩 Tables showing:
  - All graph edges
  - Current MST edges
  - Disjoint Set Union (DSU) structure
- ⏸️ Controls to pause, continue, step forward/backward.

---

## 🧠 How It Works

1. **Graph Generation**  
   - Vertices are placed in a circular layout.
   - Random edges with weights are generated ensuring the graph is connected.

2. **Kruskal's Algorithm**  
   - Edges are sorted by weight.
   - Disjoint Set Union (DSU) is used to avoid cycles.
   - Edges are added to the MST if they connect disjoint components.

3. **Visualization**  
   - Red edges = MST edges  
   - Grey edges = Remaining graph edges  
   - Weight labels are shown mid-edge  
   - MST completion is indicated with a success message.

---