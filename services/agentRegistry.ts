import { Agent, AgentVersion, UsageEvent } from '../models/agent';

const STORAGE_KEYS = {
  agents: 'agent_os_agents',
  versions: 'agent_os_agent_versions',
  usage: 'agent_os_usage_events'
};

interface AgentRegistrySnapshot {
  agents: Agent[];
  versions: AgentVersion[];
  usage: UsageEvent[];
}

const parse = <T,>(key: string): T[] => {
  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T[]) : [];
};

const persist = (snapshot: AgentRegistrySnapshot) => {
  localStorage.setItem(STORAGE_KEYS.agents, JSON.stringify(snapshot.agents));
  localStorage.setItem(STORAGE_KEYS.versions, JSON.stringify(snapshot.versions));
  localStorage.setItem(STORAGE_KEYS.usage, JSON.stringify(snapshot.usage));
};

export const createDefaultAgent = (): Agent => {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const versionId = crypto.randomUUID();

  return {
    id,
    name: 'Untitled Agent',
    description: 'Autonomous assistant for high-leverage workflows.',
    tags: ['general'],
    createdAt: now,
    updatedAt: now,
    promptTemplate: 'You are a reliable AI agent. Be concise, accurate, and transparent.',
    activeVersionId: versionId,
    modelConfig: {
      provider: 'openai',
      model: 'gpt-4.1-mini',
      temperature: 0.5,
      top_p: 1,
      maxTokens: 2048
    },
    toolConfig: {
      memoryEnabled: true,
      ragEnabled: false,
      webEnabled: false,
      imageEnabled: false
    }
  };
};

export const createVersionFromAgent = (agent: Agent, notes?: string): AgentVersion => ({
  id: crypto.randomUUID(),
  agentId: agent.id,
  createdAt: new Date().toISOString(),
  promptTemplate: agent.promptTemplate,
  modelConfig: agent.modelConfig,
  toolConfig: agent.toolConfig,
  notes
});

export const AgentRegistry = {
  load(): AgentRegistrySnapshot {
    return {
      agents: parse<Agent>(STORAGE_KEYS.agents),
      versions: parse<AgentVersion>(STORAGE_KEYS.versions),
      usage: parse<UsageEvent>(STORAGE_KEYS.usage)
    };
  },

  save(snapshot: AgentRegistrySnapshot) {
    persist(snapshot);
  }
};

export const generateMockUsageEvent = (agentId: string): UsageEvent => {
  const tokensIn = 300 + Math.floor(Math.random() * 1800);
  const tokensOut = 200 + Math.floor(Math.random() * 1200);
  const latencyMs = 350 + Math.floor(Math.random() * 3500);
  const costUSD = Number((((tokensIn + tokensOut) / 1000) * (0.001 + Math.random() * 0.005)).toFixed(4));

  return {
    id: crypto.randomUUID(),
    agentId,
    createdAt: new Date().toISOString(),
    tokensIn,
    tokensOut,
    latencyMs,
    costUSD,
    status: Math.random() > 0.12 ? 'success' : 'error'
  };
};
