# Advanced Features Guide

This document details the advanced features planned for the Interactive Visualization Framework, inspired by the best examples in the React Flow showcase.

---

## 🎯 Core Advanced Features

### 1. Auto-Layout Algorithms ⚡
**Priority:** CRITICAL | **Step:** 31 | **Est:** 3 hours

Transform chaotic diagrams into organized layouts with one click.

**Algorithms:**
- **Hierarchical (Dagre)** - Top-to-bottom or left-to-right tree layouts
- **Force-Directed** - Physics-based organic arrangements
- **Circular** - Nodes arranged in circles
- **Layered** - Separate nodes into distinct layers

**Use Cases:**
- Organization charts
- Dependency graphs
- Process flows
- Mind maps

**Implementation:**
```typescript
import dagre from 'dagre';

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 200, height: 100 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const position = dagreGraph.node(node.id);
      return { ...node, position: { x: position.x, y: position.y } };
    }),
    edges,
  };
};
```

**User Experience:**
- Toolbar button: "Auto-Layout"
- Layout dropdown: Choose algorithm
- Animate transition with Framer Motion

---

### 2. Undo/Redo System 🔄
**Priority:** CRITICAL | **Step:** 27 | **Est:** 3 hours

Professional editing requires the ability to revert mistakes.

**Features:**
- History stack (max 50 states)
- Keyboard shortcuts: `Ctrl+Z` / `Ctrl+Shift+Z`
- Time-travel debugging for developers
- Skip insignificant changes (viewport, zoom)
- Visual indicator of undo/redo availability

**Implementation Strategy:**
```typescript
interface HistoryState {
  nodes: Node[];
  edges: Edge[];
  timestamp: number;
  action: string;
}

const useHistoryStore = create<HistoryStore>((set, get) => ({
  past: [],
  future: [],

  addToHistory: (state: HistoryState) => {
    const { past } = get();
    set({
      past: [...past.slice(-49), state], // Keep last 50
      future: [], // Clear redo stack
    });
  },

  undo: () => {
    const { past, future } = get();
    if (past.length === 0) return null;

    const previous = past[past.length - 1];
    set({
      past: past.slice(0, -1),
      future: [get().current, ...future],
    });
    return previous;
  },

  redo: () => {
    const { future, past } = get();
    if (future.length === 0) return null;

    const next = future[0];
    set({
      past: [...past, get().current],
      future: future.slice(1),
    });
    return next;
  },
}));
```

**Actions to Track:**
- Add/delete nodes
- Add/delete edges
- Move nodes
- Edit node data
- Group/ungroup

**Actions to Skip:**
- Zoom changes
- Pan changes
- Selection changes
- Hover states

---

### 3. Node Grouping & Hierarchies 📦
**Priority:** CRITICAL | **Step:** 22 | **Est:** 3 hours

Create parent-child relationships for complex diagrams.

**Features:**
- Select multiple nodes → `Ctrl+G` to group
- Parent node with expandable/collapsible UI
- Moving parent moves all children
- Nested groups (groups within groups)
- Visual hierarchy indicators

**React Flow Implementation:**
```typescript
// Set parent relationship
const groupedNode = {
  id: 'parent-1',
  type: 'group',
  position: { x: 0, y: 0 },
  data: { label: 'Group' },
};

const childNodes = [
  {
    id: 'child-1',
    parentId: 'parent-1', // Key property
    position: { x: 10, y: 10 }, // Relative to parent
    data: { label: 'Child 1' },
  },
];
```

**GroupNode Component:**
- Expandable container
- Drag handle
- Child count badge
- Collapse/expand animation

---

### 4. Multi-Select & Lasso Selection 🎯
**Priority:** HIGH | **Steps:** 20-21 | **Est:** 3.5 hours

Professional tools need bulk operations.

**Selection Box:**
- Click and drag to create selection rectangle
- All nodes inside get selected
- `Shift+drag` to add to selection
- Visual feedback: dashed blue box

**Lasso Selection:**
- Press `L` key to activate lasso mode
- Draw freehand path around nodes
- Point-in-polygon algorithm determines selection
- Animated SVG path

**Implementation:**
```typescript
const isPointInPolygon = (point: XYPosition, polygon: XYPosition[]) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    const intersect = ((yi > point.y) !== (yj > point.y))
      && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};
```

---

### 5. Search & Filtering 🔍
**Priority:** HIGH | **Step:** 33 | **Est:** 2 hours

Essential for large diagrams with 100+ nodes.

**Features:**
- Fuzzy search by label
- Filter by node type
- Highlight matches with glow
- Jump to node (center viewport)
- Keyboard navigation: Arrow keys through results

**UI Components:**
- Search bar in header
- Results dropdown
- "X matches found" counter
- Clear button

**Implementation with Fuse.js:**
```typescript
import Fuse from 'fuse.js';

const fuse = new Fuse(nodes, {
  keys: ['data.label', 'type', 'id'],
  threshold: 0.3, // Fuzzy matching tolerance
});

const searchResults = fuse.search(query);
```

**Visual Feedback:**
- Matched nodes: Pulse animation
- Non-matched nodes: Fade to 30% opacity
- Selected result: Glow + center viewport

---

### 6. Smart Edge Routing 🛤️
**Priority:** MEDIUM | **Step:** 25 | **Est:** 2 hours

Edges that intelligently avoid node overlaps.

**Algorithms:**
- **A* Pathfinding** - Find shortest path around obstacles
- **ELK Edge Routing** - Professional-grade routing
- **Bezier Smoothing** - Smooth curves

**Features:**
- Auto-reroute on node drag
- Configurable clearance (padding around nodes)
- Animation on path change

**Implementation:**
```typescript
import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

const routeEdge = async (edge, nodes) => {
  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.edgeRouting': 'ORTHOGONAL',
    },
    children: nodes.map(n => ({
      id: n.id,
      width: n.width || 200,
      height: n.height || 100,
    })),
    edges: [edge],
  };

  const layout = await elk.layout(graph);
  return layout.edges[0].sections; // Path sections
};
```

---

### 7. Node Resizing 📏
**Priority:** MEDIUM | **Step:** 23 | **Est:** 1 hour

Dynamic sizing for content that grows.

**React Flow's NodeResizer:**
```typescript
import { NodeResizer } from '@xyflow/react';

const ResizableNode = ({ data }) => {
  return (
    <>
      <NodeResizer
        minWidth={100}
        minHeight={50}
        maxWidth={800}
        maxHeight={600}
        keepAspectRatio={false}
        color="#3b82f6"
        handleStyle={{ width: 8, height: 8 }}
      />
      <div className="node-content">
        {data.label}
      </div>
    </>
  );
};
```

**Features:**
- Corner handles for resize
- Aspect ratio lock (optional)
- Min/max constraints
- Visual resize preview

---

### 8. Alignment Guides & Grid Snapping 📐
**Priority:** MEDIUM | **Step:** 32 | **Est:** 2 hours

Professional alignment tools like Figma/Sketch.

**Grid Snapping:**
```typescript
<ReactFlow
  snapToGrid={true}
  snapGrid={[15, 15]} // 15px grid
  defaultEdgeOptions={{
    type: 'smoothstep',
  }}
>
```

**Alignment Guides:**
- Vertical/horizontal lines appear when nodes align
- Snap to other nodes (not just grid)
- "Distribute evenly" command
- Align toolbar: Left, Center, Right, Top, Middle, Bottom

**Visual:**
- Red dashed line on alignment
- Fade in/out animation
- Magnetic snap feel

---

### 9. Connection Type Validation 🔐
**Priority:** MEDIUM | **Step:** 34 | **Est:** 2 hours

Prevent invalid connections (e.g., number → string).

**Validation Rules:**
```typescript
const connectionRules = {
  dataNode: {
    canConnectTo: ['actionNode', 'integrationNode'],
    maxConnections: 5,
  },
  actionNode: {
    canConnectTo: ['dataNode', 'decisionNode'],
    maxConnections: 10,
  },
};

const isValidConnection = (connection) => {
  const sourceNode = nodes.find(n => n.id === connection.source);
  const targetNode = nodes.find(n => n.id === connection.target);

  const rules = connectionRules[sourceNode.type];
  if (!rules) return true;

  // Check if target type is allowed
  if (!rules.canConnectTo.includes(targetNode.type)) {
    return false;
  }

  // Check max connections
  const sourceConnections = edges.filter(e => e.source === sourceNode.id);
  if (sourceConnections.length >= rules.maxConnections) {
    return false;
  }

  return true;
};
```

**Visual Feedback:**
- Valid: Green highlight on target handle
- Invalid: Red highlight + shake animation
- Tooltip: "Cannot connect Data to Media"

---

### 10. Real-Time Collaboration 👥
**Priority:** LOW | **Steps:** 39-40 | **Est:** 6 hours

Multi-user editing with WebSockets.

**Architecture:**
```
Client 1 ─┐
Client 2 ─┤─── WebSocket Server ─── Database
Client 3 ─┘
```

**Features:**
- Presence indicators (colored cursors)
- Real-time node updates
- Conflict resolution with CRDT (Yjs)
- User list with avatars
- Chat sidebar

**WebSocket Events:**
```typescript
socket.on('node:move', (data) => {
  updateNode(data.nodeId, { position: data.position });
});

socket.on('user:join', (user) => {
  addPresence(user);
});

socket.on('cursor:move', (data) => {
  updateCursor(data.userId, data.position);
});
```

**CRDT with Yjs:**
```typescript
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const doc = new Y.Doc();
const provider = new WebsocketProvider('ws://localhost:1234', 'my-room', doc);

const yNodes = doc.getArray('nodes');
yNodes.observe(event => {
  // Sync changes to React Flow
  setNodes(yNodes.toArray());
});
```

---

### 11. Export & Import 💾
**Priority:** MEDIUM | **Steps:** 29-30 | **Est:** 3 hours

Professional tools need data portability.

**Export Formats:**

1. **PNG Export** (High Resolution)
```typescript
import { toPng } from 'html-to-image';
import { getNodesBounds, getViewportForBounds } from '@xyflow/react';

const exportToPng = async () => {
  const nodesBounds = getNodesBounds(nodes);
  const viewport = getViewportForBounds(
    nodesBounds,
    imageWidth,
    imageHeight,
    0.5,
    2
  );

  const dataUrl = await toPng(document.querySelector('.react-flow'), {
    backgroundColor: '#ffffff',
    width: imageWidth,
    height: imageHeight,
    style: {
      transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
    },
  });

  const a = document.createElement('a');
  a.setAttribute('download', 'flow.png');
  a.setAttribute('href', dataUrl);
  a.click();
};
```

2. **SVG Export** (Vector Graphics)
```typescript
const exportToSvg = () => {
  const svgElement = document.querySelector('.react-flow__edges');
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);

  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  saveAs(blob, 'flow.svg');
};
```

3. **JSON Export** (Data Only)
```typescript
const exportToJson = () => {
  const flowData = {
    nodes: nodes.map(({ id, type, position, data }) => ({
      id, type, position, data
    })),
    edges: edges.map(({ id, source, target, type }) => ({
      id, source, target, type
    })),
    viewport: { x: 0, y: 0, zoom: 1 },
  };

  const json = JSON.stringify(flowData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  saveAs(blob, 'flow.json');
};
```

**Import:**
- Drag-and-drop JSON file
- Validate schema with Zod
- Merge or replace options

---

### 12. Performance Optimization ⚡
**Priority:** MEDIUM | **Steps:** 37-38 | **Est:** 6 hours

Handle 1000+ nodes smoothly.

**Techniques:**

1. **Virtualization**
   - Only render visible nodes
   - Use React Flow's built-in virtualization
   - Window-based rendering

2. **React.memo**
   - Memoize node components
   - Prevent unnecessary re-renders

3. **Debouncing**
   - Debounce zoom/pan events
   - Throttle expensive operations

4. **Web Workers**
   - Offload layout calculations
   - Compute edge paths in background

**Benchmarks:**
```typescript
import { describe, bench } from 'vitest';

describe('Node Rendering Performance', () => {
  bench('100 nodes', () => {
    renderNodes(100);
  });

  bench('500 nodes', () => {
    renderNodes(500);
  });

  bench('1000 nodes', () => {
    renderNodes(1000);
  });
});
```

**Targets:**
- 100 nodes: < 50ms
- 500 nodes: < 200ms
- 1000 nodes: < 500ms with virtualization

---

### 13. Accessibility (a11y) ♿
**Priority:** MEDIUM | **Steps:** 41 | **Est:** 2 hours

Make the framework usable for everyone.

**ARIA Attributes:**
```typescript
<div
  role="button"
  aria-label="Delete node"
  aria-pressed={isPressed}
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleDelete();
    }
  }}
>
  Delete
</div>
```

**Keyboard Navigation:**
- Tab through nodes
- Arrow keys to move selected node
- Enter to activate
- Space to select
- Escape to cancel

**Screen Reader Support:**
- Announce node additions
- Announce edge connections
- Describe node types

---

## 🎨 Visual Polish Features

### Animated Particles on Edges
Particles flow along edge paths to show data flow.

```typescript
const ParticleEdge = ({ id, sourceX, sourceY, targetX, targetY }) => {
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <circle r="3" fill="#3b82f6">
        <animateMotion
          dur="2s"
          repeatCount="indefinite"
          path={edgePath}
        />
      </circle>
    </>
  );
};
```

### Glow Effects
```css
.node-selected {
  box-shadow: 0 0 20px 5px rgba(59, 130, 246, 0.6);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 20px 5px rgba(59, 130, 246, 0.6); }
  50% { box-shadow: 0 0 30px 10px rgba(59, 130, 246, 0.8); }
}
```

### Node Entry Animations
```typescript
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0, opacity: 0 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  {children}
</motion.div>
```

---

## 📚 Summary of Advanced Features

| Feature | Priority | Est. Time | Impact |
|---------|----------|-----------|--------|
| Auto-Layout | CRITICAL | 3h | 🔥 High |
| Undo/Redo | CRITICAL | 3h | 🔥 High |
| Grouping | CRITICAL | 3h | 🔥 High |
| Multi-Select | HIGH | 1.5h | 🔥 High |
| Search | HIGH | 2h | 🔥 High |
| Smart Routing | MEDIUM | 2h | ⚡ Medium |
| Resizing | MEDIUM | 1h | ⚡ Medium |
| Alignment | MEDIUM | 2h | ⚡ Medium |
| Validation | MEDIUM | 2h | ⚡ Medium |
| Export/Import | MEDIUM | 3h | ⚡ Medium |
| Performance | MEDIUM | 6h | ⚡ Medium |
| Collaboration | LOW | 6h | 💡 Low |
| Accessibility | MEDIUM | 2h | 💡 Low |

**Total Estimated Time for Advanced Features:** ~36 hours

---

**Last Updated:** 2025-11-10
**For Full Roadmap:** See `ROADMAP.md`
**For Project Blueprint:** See `BLUEPRINT.md`
