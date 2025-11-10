# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Interactive Visualization Framework** - A production-ready React Flow-based diagram framework featuring custom interactive nodes, animations, and advanced interactions. Built with React 19, TypeScript 5.9 (strict mode), Vite 7, and Framer Motion.

**Current Status:** Phase 1 Complete (17/50 steps, 34%) - All 7 custom nodes implemented with animations, custom edges, and visual effects.

---

## Common Commands

### Development
```bash
npm run dev       # Start dev server on http://localhost:5173
npm run build     # Type check + production build
npm run preview   # Preview production build
```

### Testing
```bash
npm test          # Run Vitest tests (89 tests passing)
npm run test:ui   # Open Vitest UI for interactive testing
```

**Test Requirements:**
- All new nodes require comprehensive tests (target: 80%+ coverage)
- Use React Testing Library for component tests
- Mock ResizeObserver and React Flow context (see `src/test/setup.ts`)
- Test interactive features (click handlers, state changes, conditional rendering)

### Build
```bash
npm run build     # Runs `tsc -b && vite build`
```
TypeScript must pass strict mode checks before Vite builds.

---

## Architecture

### Tech Stack
- **React 19.2.0** with TypeScript 5.9.3 (strict mode enabled)
- **@xyflow/react 12.9.2** - Core diagram engine
- **Vite 7.2.2** - Build tool (dev server on port 5173)
- **Tailwind CSS 4.1.5** - Styling via `@tailwindcss/vite` plugin
- **Framer Motion** - Animation library for node transitions and effects
- **Prism.js** - Syntax highlighting for CodeNode
- **Vitest 4.0.8** - Testing with jsdom environment
- **React Testing Library 16.3.0** - Component testing

### Directory Structure
```
src/
├── nodes/              # Custom node components (7 types with tests)
│   ├── DataNode.tsx
│   ├── ActionNode.tsx
│   ├── MediaNode.tsx
│   ├── CodeNode.tsx
│   ├── DecisionNode.tsx
│   ├── LoopNode.tsx
│   └── IntegrationNode.tsx
├── edges/              # Custom edge components (4 types with tests)
│   ├── ParticleEdge.tsx
│   ├── SmartEdge.tsx
│   ├── LabeledEdge.tsx
│   └── GlowEdge.tsx
├── components/         # UI components
│   ├── AnimatedNode.tsx
│   └── ParticleBackground.tsx
├── utils/              # Helper functions and configs
│   ├── animations.ts
│   └── motionConfig.ts
├── styles/             # CSS files
│   └── effects.css
├── test/               # Test setup (setup.ts with mocks)
└── App.tsx             # Main ReactFlow canvas
```

---

## Node Implementation

### Node Type System

All custom nodes follow this pattern:

```typescript
// Define data type
export type NodeNameData = {
  label: string
  // ... other properties
  [key: string]: unknown  // Allow additional properties
}

// Define node type
export type NodeNameType = Node<NodeNameData, 'nodeName'>

// Component signature
const NodeName = ({ data, selected }: NodeProps<NodeNameType>) => {
  // Implementation
}
```

**Critical:** Use `NodeProps<YourNodeType>` for proper TypeScript typing.

### Implemented Node Types

1. **DataNode** - Metrics, KPIs with expandable charts and trend indicators
2. **ActionNode** - Buttons, dropdowns, toggles with loading/success states
3. **MediaNode** - Image/video preview with lightbox and upload states
4. **CodeNode** - Syntax highlighting with Prism.js, 6 languages, copy to clipboard
5. **DecisionNode** - Diamond shape with editable conditions, true/false paths
6. **LoopNode** - Iteration controls with progress bar, start/pause/stop
7. **IntegrationNode** - HTTP methods, endpoints, request status, response preview

### Registering Node Types

In `App.tsx`:
```typescript
const nodeTypes = useMemo(
  () => ({
    dataNode: DataNode,
    actionNode: ActionNode,
    mediaNode: MediaNode,
    codeNode: CodeNode,
    decisionNode: DecisionNode,
    loopNode: LoopNode,
    integrationNode: IntegrationNode,
  }),
  []
)
```

### Node Guidelines

1. Use `memo()` for performance
2. Include target Handle (top) and source Handle (bottom)
3. Apply selection styling: `border-blue-500 ring-2 ring-blue-200`
4. Use Tailwind classes for consistent styling
5. Implement interactive features with state management
6. Add `nodrag` class to interactive elements (inputs, buttons) to prevent drag conflicts

---

## Edge Implementation

### Custom Edge Types

All edges are implemented in `src/edges/`:

1. **ParticleEdge** - Animated particles flowing along the path
2. **SmartEdge** - Bezier curves with custom styling
3. **LabeledEdge** - Inline labels using EdgeLabelRenderer
4. **GlowEdge** - Animated glow effect with selection states

### Registering Edge Types

```typescript
const edgeTypes = useMemo(
  () => ({
    particle: ParticleEdge,
    smart: SmartEdge,
    labeled: LabeledEdge,
    glow: GlowEdge,
  }),
  []
)
```

### Edge Usage

```typescript
const edges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'particle',  // Use custom edge type
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'labeled',
    data: { label: 'Process' },  // LabeledEdge accepts data
  },
]
```

---

## Animation System

### Framer Motion Integration

**Animation Variants** (`src/utils/animations.ts`):
- `nodeVariants` - Entry/exit animations for nodes (scale + fade)
- `fadeVariants` - Simple fade in/out
- `slideUpVariants` - Slide up from bottom
- `glowVariants` - Pulsing glow effect
- `staggerContainerVariants` - Sequential child animations

**Motion Config** (`src/utils/motionConfig.ts`):
- `springConfig` - Physics presets (default, bouncy, gentle, stiff)
- `duration` - Timing presets (fast, normal, slow)
- `easing` - Easing functions (easeInOut, easeOut, easeIn)

### AnimatedNode Wrapper

Use `AnimatedNode` to wrap nodes with motion animations:

```typescript
import AnimatedNode from '../components/AnimatedNode'

<AnimatedNode selected={selected}>
  {/* Node content */}
</AnimatedNode>
```

**Features:**
- Scale + fade entry/exit animations
- Hover scale (1.02)
- Tap scale (0.98)
- Selection glow via drop-shadow filter

---

## Visual Effects

### ParticleBackground

Animated particle background with 50 floating particles:

```typescript
import ParticleBackground from './components/ParticleBackground'

<div style={{ position: 'relative' }}>
  <ParticleBackground />
  <ReactFlow {...props} />
</div>
```

### CSS Effects (`src/styles/effects.css`)

Available classes:
- `.node-glow-hover` - Glow on hover
- `.node-glow-selected` - Pulsing glow for selected nodes
- `.edge-glow` - Edge glow effect
- `.smooth-transition` - Smooth transitions
- `.fade-in` - Fade in animation
- `.scale-in` - Scale in animation
- `.animated-gradient` - Animated background gradient

---

## React Flow Essentials

### Critical Missing Features (Table Stakes)

These are essential features we need to implement next:

1. **useReactFlow Hook** - Programmatic control
   - `getNodes()`, `getEdges()` - Query state
   - `setNodes()`, `setEdges()` - Update programmatically
   - `fitView()`, `zoomIn()`, `zoomOut()` - Viewport control
   - `toObject()` - Export flow state

2. **Save/Restore Flow State**
   - `rfInstance.toObject()` - Serialize entire flow
   - `localStorage` integration for persistence
   - `setViewport()` - Restore camera position

3. **NodeToolbar Component**
   - Floating toolbar that doesn't scale with zoom
   - Perfect for delete, copy, expand buttons
   - Always readable at any zoom level

4. **Panel Component**
   - Position UI over viewport (top-left, bottom-right, etc.)
   - Use for toolbars, status indicators, action buttons

5. **Parent-Child Relationships**
   - `parentId` property for nested hierarchies
   - `extent: 'parent'` to constrain children
   - `expandParent` to auto-expand parent

6. **Helper Lines / Alignment Guides**
   - Visual guides during drag
   - Auto-snapping to align nodes
   - Viewport-aware at any zoom level

7. **Connection Validation**
   - `isValidConnection` prop to prevent invalid connections
   - Type-based validation rules

### Important ReactFlow Props

**Should be configured in App.tsx:**

```typescript
<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  edgeTypes={edgeTypes}

  // Enable these for better UX:
  edgesReconnectable={true}           // Allow reconnecting edges
  autoPanOnConnect={true}             // Pan when dragging near edges
  autoPanOnNodeDrag={true}            // Smooth panning during drag
  selectionMode="partial"             // Easier multi-select
  deleteKeyCode="Delete"              // Customize shortcuts
  multiSelectionKeyCode="Control"     // Multi-select key

  // Connection validation:
  isValidConnection={(connection) => {
    // Implement validation logic
    return true
  }}

  // Event handlers:
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}

  fitView
>
```

### Node Properties to Use

Important node properties from React Flow:

- `parentId` - Create sub-flows and hierarchies
- `extent: 'parent'` - Constrain movement to parent bounds
- `expandParent` - Auto-expand parent when child reaches edge
- `draggable`, `selectable`, `deletable` - Control behavior per node
- `dragHandle` - CSS class for custom drag handles
- `zIndex` - Stacking order
- `hidden` - Visibility control

---

## Testing Strategy

### Test Stats
- **89 tests passing** across 9 test files
- 7 node types fully tested (76 tests)
- 4 edge types tested (10 tests)
- App integration tests (3 tests)

### Writing Tests

All tests must wrap components in `<ReactFlowProvider>`:

```typescript
import { render, screen } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'

test('renders with label', () => {
  render(
    <ReactFlowProvider>
      <YourNode
        id="1"
        data={{ label: 'Test' }}
        selected={false}
      />
    </ReactFlowProvider>
  )
  expect(screen.getByText('Test')).toBeInTheDocument()
})
```

### Test Coverage Requirements

For new nodes:
- Rendering with required props
- Interactive features (buttons, toggles, etc.)
- Conditional rendering (expanded states, etc.)
- Selection state styling
- Prop validation

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Initial Load | < 2s |
| Time to Interactive | < 3s |
| Bundle Size (gzipped) | < 250 KB |
| Node Rendering (100 nodes) | < 50ms |
| Smooth 60fps | Up to 500 nodes |
| With Virtualization | 1000+ nodes |

---

## Next Steps (Priority Order)

### Phase 2A: Table Stakes Features (Immediate Priority)
1. **useReactFlow Hook Integration** - Programmatic control
2. **Save/Restore Flow State** - localStorage persistence
3. **NodeToolbar Implementation** - Floating action toolbar
4. **Panel Components** - Custom UI overlays
5. **Connection Validation** - Prevent invalid connections
6. **Edge Reconnection** - Enable `edgesReconnectable`

### Phase 2B: Advanced Features
7. **Parent-Child Relationships** - Node grouping and nesting
8. **Helper Lines with Snapping** - Alignment guides
9. **Context Menus** - Right-click actions
10. **Keyboard Shortcuts** - Undo/redo, copy/paste, delete

Refer to ROADMAP.md for detailed specifications and time estimates.

---

## Key Files

- **BLUEPRINT.md** - Complete project vision and technical specifications
- **ROADMAP.md** - Detailed implementation guide with time estimates (updated with table stakes priorities)
- **ADVANCED_FEATURES.md** - In-depth guide to advanced features
- **package.json** - Dependencies and scripts
- **vite.config.ts** - Vite configuration (port 5173, Tailwind plugin)
- **vitest.config.ts** - Test configuration (globals, jsdom, setup file)
- **tsconfig.json** - TypeScript strict mode configuration
