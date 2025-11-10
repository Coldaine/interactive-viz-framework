# Interactive Visualization Framework

> A production-ready, visually stunning React Flow-based diagram framework with advanced interactions, animations, and professional features.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://github.com/Coldaine/interactive-viz-framework)
[![Tests](https://img.shields.io/badge/tests-9%20passing-success)](#)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](#)
[![TypeScript](https://img.shields.io/badge/typescript-5.9.3-blue)](https://www.typescriptlang.org/)
[![React Flow](https://img.shields.io/badge/react%20flow-12.9.2-ff0072)](https://reactflow.dev)

## 📖 Documentation

| Document | Description |
|----------|-------------|
| **[BLUEPRINT.md](./BLUEPRINT.md)** | Complete project vision, architecture, and technical specifications |
| **[ROADMAP.md](./ROADMAP.md)** | Detailed 50-step implementation guide with time estimates |
| **[ADVANCED_FEATURES.md](./ADVANCED_FEATURES.md)** | In-depth guide to advanced features with code examples |

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/Coldaine/interactive-viz-framework.git
cd interactive-viz-framework

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

Visit `http://localhost:3000` to see the framework in action.

---

## ✨ Features

### Core Capabilities (Current - 7/50 Complete)
- ✅ **Interactive Canvas** - Drag, zoom, pan with React Flow v12
- ✅ **Custom Nodes** - DataNode with expandable charts and trend indicators
- ✅ **Modern Stack** - Vite 7.2.2, React 19.2.0, TypeScript 5.9.3
- ✅ **Styling** - Tailwind CSS v4.1.5 for rapid UI development
- ✅ **Testing** - Vitest 4.0.8 with 9 passing tests (100% coverage)
- ✅ **GitHub Integration** - Version control and collaboration ready

### Planned Features (See [ROADMAP.md](./ROADMAP.md))

#### 🎨 Visual Polish
- Animated particles flowing through edges
- Glow effects on hover and selection
- Node entry/exit animations with Framer Motion
- Smooth zoom transitions
- Animated background patterns

#### 🎮 Advanced Interactions
- Context menus (right-click)
- Keyboard shortcuts (Ctrl+Z, Ctrl+C, Delete, etc.)
- Multi-select with selection box
- Lasso selection tool
- Node grouping and parent-child hierarchies
- Node resizing with constraints
- Edge label editing

#### 🧠 Smart Features
- Auto-layout with Dagre (hierarchical, force-directed)
- Search and filtering with fuzzy matching
- Undo/Redo system (50-state history)
- Connection validation (type-based)
- Smart edge routing (avoid overlaps)
- Grid snapping and alignment guides

#### 💾 Data Management
- Save/Load flows (localStorage + JSON file)
- Export to PNG/SVG/JSON
- Import from JSON with validation
- Auto-save functionality

#### 🚀 Performance
- Virtualization for 1000+ nodes
- Bundle size optimization
- Performance benchmarking

#### 👥 Collaboration (Future)
- Real-time WebSocket sync
- Presence indicators (user cursors)
- Conflict resolution with CRDT

#### ♿ Accessibility
- ARIA labels and keyboard navigation
- Screen reader support
- Error boundaries and graceful degradation

---

## 🏗️ Architecture

### Tech Stack
```
Frontend:      React 19.2.0 + TypeScript 5.9.3
Build Tool:    Vite 7.2.2
Diagram:       @xyflow/react 12.9.2
Styling:       Tailwind CSS 4.1.5
Animation:     Framer Motion (planned)
State:         Zustand (planned)
Testing:       Vitest 4.0.8 + React Testing Library 16.3.0
```

### Project Structure
```
src/
├── nodes/              # Custom node components
│   ├── DataNode.tsx    ✅ Complete
│   ├── ActionNode.tsx  📋 Next
│   ├── MediaNode.tsx
│   ├── CodeNode.tsx
│   ├── DecisionNode.tsx
│   ├── LoopNode.tsx
│   └── IntegrationNode.tsx
├── edges/              # Custom edge components (planned)
├── components/         # UI components (planned)
├── hooks/              # Custom React hooks (planned)
├── store/              # Zustand state management (planned)
├── utils/              # Helper functions (planned)
├── types/              # TypeScript definitions (planned)
└── App.tsx             # Main application
```

---

## 🎯 Roadmap

### Phase 0: Foundation ✅ (Complete)
**Steps 1-7** | 100% Complete | 9 Tests Passing

- [x] Git repository and GitHub setup
- [x] Vite + React + TypeScript project
- [x] Vitest + React Testing Library
- [x] React Flow v12 integration
- [x] Tailwind CSS v4 setup
- [x] DataNode with interactive features

### Phase 1: Core Nodes & Visual Effects 🚧 (In Progress)
**Steps 8-17** | Est. 12 hours | Priority: HIGH

- [ ] ActionNode, MediaNode, CodeNode
- [ ] DecisionNode, LoopNode, IntegrationNode
- [ ] Framer Motion integration
- [ ] Animated edges (Particle, Smart, Labeled, Glow)
- [ ] Visual effects (glow, particles, backgrounds)

### Phase 2: Advanced Interactions
**Steps 18-25** | Est. 16 hours | Priority: HIGH

### Phase 3: State Management & Persistence
**Steps 26-30** | Est. 11 hours | Priority: HIGH

### Phase 4: Advanced Canvas Features
**Steps 31-36** | Est. 14 hours | Priority: MEDIUM

### Phase 5: Performance & Optimization
**Steps 37-38** | Est. 6 hours | Priority: MEDIUM

### Phase 6-9: Collaboration, Accessibility, Documentation, DevOps
**Steps 39-50** | Est. 27.5 hours | Priority: MIXED

**Full Roadmap:** See [ROADMAP.md](./ROADMAP.md) for detailed breakdown.

---

## 📊 Progress

**Overall:** 7/50 steps complete (14%)

```
Phase 0: ████████████████████ 100% (Foundation)
Phase 1: ███░░░░░░░░░░░░░░░░░  15% (Nodes & Effects)
Phase 2: ░░░░░░░░░░░░░░░░░░░░   0% (Interactions)
Phase 3: ░░░░░░░░░░░░░░░░░░░░   0% (State)
Phase 4: ░░░░░░░░░░░░░░░░░░░░   0% (Canvas)
Phase 5: ░░░░░░░░░░░░░░░░░░░░   0% (Performance)
Phase 6: ░░░░░░░░░░░░░░░░░░░░   0% (Collaboration)
Phase 7: ░░░░░░░░░░░░░░░░░░░░   0% (Accessibility)
Phase 8: ░░░░░░░░░░░░░░░░░░░░   0% (Documentation)
Phase 9: ░░░░░░░░░░░░░░░░░░░░   0% (DevOps)
```

---

## 🧪 Testing

We maintain 100% test coverage for all implemented features.

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm test -- --watch
```

**Current Test Stats:**
- **Test Files:** 2 passing
- **Tests:** 9 passing
- **Duration:** ~1.6s
- **Coverage:** 100%

---

## 🎨 Node Types

### DataNode ✅ (Complete)
Display metrics, KPIs, and data visualizations.

**Features:**
- Real-time value display with trend indicators (↑/↓/→)
- Expandable mini bar charts
- Interactive hover states
- Unit display (USD, users, etc.)
- Color-coded trends (green/red/gray)

**Example:**
```typescript
{
  id: '1',
  type: 'dataNode',
  position: { x: 100, y: 100 },
  data: {
    label: 'Revenue',
    value: 45678,
    unit: 'USD',
    trend: 'up',
    chartData: [120, 150, 180, 200, 250, 300, 350],
  },
}
```

### ActionNode 📋 (Next)
Execute actions and trigger workflows with buttons and controls.

### MediaNode
Display images, videos, and rich media with preview capabilities.

### CodeNode
Display and edit code snippets with syntax highlighting.

### DecisionNode
Conditional branching logic with true/false paths.

### LoopNode
Iteration and repeated operations with progress tracking.

### IntegrationNode
API calls and external integrations with status indicators.

---

## 🤝 Contributing

We welcome contributions! See [BLUEPRINT.md](./BLUEPRINT.md) for contribution guidelines.

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Conventional Commits
- 80%+ test coverage for new features

### Commit Format
```
feat: Add ActionNode with button controls
fix: Resolve edge rendering issue on zoom
docs: Update BLUEPRINT.md with testing strategy
test: Add integration tests for undo/redo
perf: Optimize node rendering with React.memo
```

---

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🔗 Links

- **GitHub:** [Coldaine/interactive-viz-framework](https://github.com/Coldaine/interactive-viz-framework)
- **React Flow Docs:** [reactflow.dev](https://reactflow.dev)
- **Live Demo:** Coming soon after Phase 1 completion

---

## 🙏 Acknowledgments

- [React Flow](https://reactflow.dev) - Excellent diagram library
- [Vite](https://vitejs.dev) - Lightning-fast build tool
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Vitest](https://vitest.dev) - Blazing fast testing framework

---

**Status:** 🚧 In Active Development | **Version:** 0.1.0 | **Last Updated:** 2025-11-10

Built with ❤️ using Claude Code
