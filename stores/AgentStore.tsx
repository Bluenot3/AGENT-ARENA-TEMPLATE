import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { Agent, AgentVersion, UsageEvent } from '../models/agent';
import { AgentRegistry, createDefaultAgent, createVersionFromAgent, generateMockUsageEvent } from '../services/agentRegistry';
import { trackEvent } from '../services/instrumentation';

interface AgentState {
  agents: Agent[];
  versions: AgentVersion[];
  usage: UsageEvent[];
  selectedAgentId?: string;
}

type AgentDraft = Omit<Agent, 'id' | 'createdAt' | 'updatedAt' | 'activeVersionId'>;

type AgentAction =
  | { type: 'create'; draft: AgentDraft }
  | { type: 'update'; agent: Agent }
  | { type: 'delete'; agentId: string }
  | { type: 'select'; agentId?: string }
  | { type: 'run'; agentId: string }
  | { type: 'duplicate'; agentId: string };

const bootstrap = (): AgentState => {
  const existing = AgentRegistry.load();

  if (existing.agents.length === 0) {
    const agent = createDefaultAgent();
    const version = createVersionFromAgent(agent, 'Initial version');
    const seeded = { agents: [{ ...agent, activeVersionId: version.id }], versions: [version], usage: [] };
    AgentRegistry.save(seeded);
    return { ...seeded, selectedAgentId: agent.id };
  }

  return { ...existing, selectedAgentId: existing.agents[0]?.id };
};

const reducer = (state: AgentState, action: AgentAction): AgentState => {
  switch (action.type) {
    case 'create': {
      const now = new Date().toISOString();
      const id = crypto.randomUUID();
      const base: Agent = {
        ...action.draft,
        id,
        createdAt: now,
        updatedAt: now,
        activeVersionId: ''
      };
      const version = createVersionFromAgent(base, 'Created from wizard');
      const agent = { ...base, activeVersionId: version.id };
      const next = {
        ...state,
        agents: [agent, ...state.agents],
        versions: [version, ...state.versions],
        selectedAgentId: agent.id
      };
      AgentRegistry.save(next);
      trackEvent('agent_created', { agentId: id, name: agent.name });
      return next;
    }
    case 'update': {
      const updatedAgent = { ...action.agent, updatedAt: new Date().toISOString() };
      const version = createVersionFromAgent(updatedAgent, 'Manual save');
      const next = {
        ...state,
        agents: state.agents.map((agent) =>
          agent.id === updatedAgent.id ? { ...updatedAgent, activeVersionId: version.id } : agent
        ),
        versions: [version, ...state.versions]
      };
      AgentRegistry.save(next);
      trackEvent('agent_updated', { agentId: updatedAgent.id });
      return next;
    }
    case 'delete': {
      const next = {
        ...state,
        agents: state.agents.filter((a) => a.id !== action.agentId),
        versions: state.versions.filter((v) => v.agentId !== action.agentId),
        usage: state.usage.filter((u) => u.agentId !== action.agentId),
        selectedAgentId: state.selectedAgentId === action.agentId ? state.agents[0]?.id : state.selectedAgentId
      };
      AgentRegistry.save(next);
      trackEvent('agent_deleted', { agentId: action.agentId });
      return next;
    }
    case 'run': {
      const event = generateMockUsageEvent(action.agentId);
      const next = { ...state, usage: [event, ...state.usage] };
      AgentRegistry.save(next);
      trackEvent('agent_run', { agentId: action.agentId, costUSD: event.costUSD, status: event.status });
      return next;
    }
    case 'duplicate': {
      const source = state.agents.find((a) => a.id === action.agentId);
      if (!source) return state;
      const now = new Date().toISOString();
      const clonedBase: Agent = {
        ...source,
        id: crypto.randomUUID(),
        name: `${source.name} Copy`,
        createdAt: now,
        updatedAt: now,
        activeVersionId: ''
      };
      const version = createVersionFromAgent(clonedBase, 'Duplicated');
      const cloned = { ...clonedBase, activeVersionId: version.id };
      const next = {
        ...state,
        agents: [cloned, ...state.agents],
        versions: [version, ...state.versions],
        selectedAgentId: cloned.id
      };
      AgentRegistry.save(next);
      trackEvent('agent_duplicated', { sourceAgentId: source.id, clonedAgentId: cloned.id });
      return next;
    }
    case 'select':
      return { ...state, selectedAgentId: action.agentId };
    default:
      return state;
  }
};

interface AgentStoreContextValue extends AgentState {
  createAgent: (draft: AgentDraft) => void;
  updateAgent: (agent: Agent) => void;
  deleteAgent: (agentId: string) => void;
  runAgent: (agentId: string) => void;
  duplicateAgent: (agentId: string) => void;
  selectAgent: (agentId?: string) => void;
}

const AgentStoreContext = createContext<AgentStoreContextValue | null>(null);

export const AgentStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, bootstrap);

  const value = useMemo(
    () => ({
      ...state,
      createAgent: (draft: AgentDraft) => dispatch({ type: 'create', draft }),
      updateAgent: (agent: Agent) => dispatch({ type: 'update', agent }),
      deleteAgent: (agentId: string) => dispatch({ type: 'delete', agentId }),
      runAgent: (agentId: string) => dispatch({ type: 'run', agentId }),
      duplicateAgent: (agentId: string) => dispatch({ type: 'duplicate', agentId }),
      selectAgent: (agentId?: string) => dispatch({ type: 'select', agentId })
    }),
    [state]
  );

  return <AgentStoreContext.Provider value={value}>{children}</AgentStoreContext.Provider>;
};

export const useAgentStore = () => {
  const ctx = useContext(AgentStoreContext);
  if (!ctx) throw new Error('useAgentStore must be used in AgentStoreProvider');
  return ctx;
};
