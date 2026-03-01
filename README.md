# Agent Arena Template → Agent OS (Phase 1)

A production-oriented React + Vite control center for creating, managing, and monitoring AI agents.

## Architecture overview

The app now follows an `AppShell` layout and route-first architecture:

- **Left Dock**: primary navigation (Dashboard, My Agents, Marketplace, Labs, Settings).
- **Top Bar**: command palette trigger (`Ctrl/Cmd+K`), global search, create-agent CTA, dark mode toggle.
- **Center Workspace**: route content and builder flows.
- **Right Inspector**: selected-agent context, last run summary, quick actions.

Core layers:

- `models/`: canonical domain types (`Agent`, `AgentVersion`, `ModelConfig`, `ToolConfig`, `UsageEvent`)
- `stores/`: `AgentStore` context + reducer with CRUD/versioning/run simulation
- `services/`: registry storage abstraction + instrumentation hooks
- `components/ui/`: reusable design primitives (button/card/badge/input/tabs/modal/toast/tooltip/skeleton)
- `pages/`: route pages for Dashboard, Agents, Agent Detail, Marketplace, Labs, Settings

## Storage/provider configuration

Current persistence is **local-first** via `localStorage` in `services/agentRegistry.ts`.

Swapping to Firebase or an API later only requires changing this service layer; UI and store contracts remain stable.

## Features in this phase

- AppShell layout and route-based navigation
- Agent CRUD with persistent registry
- Automatic version history on create/save
- Usage monitoring scaffolding (mock run events, cost/tokens/latency placeholders)
- Create Agent 4-step wizard
- Keyboard-first create flow (`Ctrl/Cmd+K`)
- Dark mode persistence
- Labs section preserving access to legacy interactive pages
- Instrumentation API: `trackEvent(eventName, payload)`

## Run locally

### Prerequisites
- Node.js 20+

### Commands
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run dev server:
   ```bash
   npm run dev
   ```
3. Build production bundle:
   ```bash
   npm run build
   ```

## Environment variables

No client secrets are required for Phase 1 Agent OS flows.

Legacy AI services in this repo may still use:

- `GEMINI_API_KEY` for existing Gemini integrations.

Keep secrets in `.env.local` and never hardcode credentials in client code.
