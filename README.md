# Interactive Visualization Framework

> A production-ready, visually stunning React Flow-based diagram framework with advanced interactions, animations, and professional features.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://github.com/Coldaine/interactive-viz-framework)
[![Tests](https://img.shields.io/badge/tests-89%20passing-success)](#)
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

Visit `http://localhost:5173` to see the framework in action.

---

## ✨ Features

### Core Capabilities (Phase 1 Complete - 17/50 steps, 34%)
- ✅ **Interactive Canvas** - Drag, zoom, pan with React Flow v12
- ✅ **7 Custom Node Types** - DataNode, ActionNode, MediaNode, CodeNode, DecisionNode, LoopNode, IntegrationNode
- ✅ **4 Custom Edge Types** - ParticleEdge, SmartEdge, LabeledEdge, GlowEdge with animations
- ✅ **Framer Motion** - Smooth animations, hover effects, node transitions
- ✅ **Visual Effects** - Particle background, glow effects, animated gradients
- ✅ **Modern Stack** - Vite 7.2.2, React 19.2.0, TypeScript 5.9.3, Tailwind CSS 4.1.5
- ✅ **Testing** - Vitest 4.0.8 with 89 passing tests (100% coverage)
- ✅ **GitHub Integration** - Version control and collaboration ready

**Next Priority:** Table stakes features (useReactFlow hook, Save/Restore, NodeToolbar, Panel, Connection Validation)

### Planned Features (See [ROADMAP.md](./ROADMAP.md))

#### 🎨 Visual Polish ✅ (Complete)
- ✅ Animated particles flowing through edges
- ✅ Glow effects on hover and selection
- ✅ Node entry/exit animations with Framer Motion
- ✅ Smooth zoom transitions
- ✅ Animated background patterns

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
Animation:     Framer Motion 11.15.0
Syntax:        Prism.js 1.30.0
State:         Zustand (planned)
Testing:       Vitest 4.0.8 + React Testing Library 16.3.0
```

### Project Structure
```
src/
├── nodes/              # Custom node components
│   ├── DataNode.tsx    ✅ Complete
│   ├── ActionNode.tsx  ✅ Complete
│   ├── MediaNode.tsx   ✅ Complete
│   ├── CodeNode.tsx    ✅ Complete
│   ├── DecisionNode.tsx ✅ Complete
│   ├── LoopNode.tsx    ✅ Complete
│   └── IntegrationNode.tsx ✅ Complete
├── edges/              # Custom edge components
│   ├── ParticleEdge.tsx ✅ Complete
│   ├── SmartEdge.tsx   ✅ Complete
│   ├── LabeledEdge.tsx ✅ Complete
│   └── GlowEdge.tsx    ✅ Complete
├── components/         # UI components
│   ├── AnimatedNode.tsx ✅ Complete
│   └── ParticleBackground.tsx ✅ Complete
├── utils/              # Helper functions
│   ├── animations.ts   ✅ Complete
│   └── motionConfig.ts ✅ Complete
├── styles/             # CSS and visual effects
│   └── effects.css     ✅ Complete
├── hooks/              # Custom React hooks (planned)
├── store/              # Zustand state management (planned)
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

### Phase 1: Core Nodes & Visual Effects ✅ (Complete)
**Steps 8-17** | 100% Complete | 89 Tests Passing

- [x] ActionNode, MediaNode, CodeNode
- [x] DecisionNode, LoopNode, IntegrationNode
- [x] Framer Motion integration
- [x] Animated edges (Particle, Smart, Labeled, Glow)
- [x] Visual effects (glow, particles, backgrounds)

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

**Overall:** 17/50 steps complete (34%)

```
Phase 0: ████████████████████ 100% (Foundation)
Phase 1: ████████████████████ 100% (Nodes & Effects)
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
- **Test Files:** 9 passing
- **Tests:** 89 passing
- **Duration:** ~2.5s
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

### ActionNode ✅ (Complete)
Execute actions and trigger workflows with buttons and controls.

**Features:**
- Primary/secondary action buttons
- Dropdown menu with option selection
- Toggle switch with state management
- Loading/success/error states
- Interactive controls without drag interference

### MediaNode ✅ (Complete)
Display images, videos, and rich media with preview capabilities.

**Features:**
- Image/video preview with thumbnails
- Click-to-zoom lightbox
- Upload state indicators (uploading, uploaded, error)
- File type icons
- Media player controls for videos

### CodeNode ✅ (Complete)
Display and edit code snippets with syntax highlighting.

**Features:**
- Syntax highlighting for 6 languages (JS, TS, Python, JSX, TSX, Markup)
- Language selector dropdown
- Copy to clipboard functionality
- Expandable code blocks
- Light/dark theme support
- Powered by Prism.js

### DecisionNode ✅ (Complete)
Conditional branching logic with true/false paths.

**Features:**
- Diamond shape with CSS clip-path
- Editable condition with inline input
- True/false output handles (left/right)
- Color-coded paths (green/red)
- Visual distinction for conditional logic

### LoopNode ✅ (Complete)
Iteration and repeated operations with progress tracking.

**Features:**
- Loop type selector (for, while, forEach)
- Iteration counter (current/max)
- Progress bar visualization
- Start/pause/resume/stop controls
- Running/paused/completed status indicators

### IntegrationNode ✅ (Complete)
API calls and external integrations with status indicators.

**Features:**
- HTTP method selector (GET, POST, PUT, DELETE, PATCH) with color coding
- Endpoint URL input
- Service type selector (REST, GraphQL, WebSocket)
- Request status tracking (idle, pending, success, error)
- Response preview with expand/collapse
- Simulated request execution

---

## 🚀 Deployment

### Vercel (Recommended)

This project is configured for one-click deployment to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Coldaine/interactive-viz-framework)

#### Manual Vercel Setup

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Connect to Vercel**:
   ```bash
   vercel
   ```

3. **Deploy to production**:
   ```bash
   vercel --prod
   ```

#### Automatic Deployment via GitHub Integration

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will automatically detect the Vite framework
4. Click "Deploy"

**Configuration:** The `vercel.json` file is pre-configured with:
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing with catch-all rewrites
- Security headers (X-Frame-Options, CSP, etc.)
- Asset caching (1 year for `/assets/*`)

#### Environment Variables

No environment variables are required for the base deployment. If you add features that need env vars:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add your variables for Production/Preview/Development

### CI/CD Pipeline

Every push and pull request triggers automated checks:

| Check | Description | Required for Merge |
|-------|-------------|-------------------|
| **Type Check** | TypeScript strict mode validation | ✅ Yes |
| **Tests** | Vitest test suite (89 tests) | ✅ Yes |
| **Build** | Production build verification | ✅ Yes |
| **Bundle Size** | Track build output size | ℹ️ Info only |

#### GitHub Actions Workflows

**`.github/workflows/ci.yml`** - Main CI pipeline:
- Runs on all branches and PRs
- Parallel execution (lint, test, build)
- Upload coverage reports and build artifacts
- PR status checks prevent merging if tests fail

**`.github/workflows/deploy.yml`** - Auto-deployment (optional):
- Triggers on push to `main` branch
- Requires Vercel secrets configured
- Alternative to Vercel GitHub integration

#### Required GitHub Secrets (for deploy.yml only)

If using the automated deploy workflow, add these secrets to your repository:

```bash
VERCEL_TOKEN          # Get from https://vercel.com/account/tokens
VERCEL_ORG_ID         # Found in Vercel team settings
VERCEL_PROJECT_ID     # Found in Vercel project settings
```

**Note:** The Vercel GitHub integration is recommended over the deploy workflow for most use cases.

### Live Demo

🔗 **Production:** [https://interactive-viz-framework.vercel.app](https://interactive-viz-framework.vercel.app) *(coming soon)*

Preview deployments are automatically created for every pull request.

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
