export type AgentStatus = 'success' | 'error';

export interface ModelConfig {
  provider: string;
  model: string;
  temperature: number;
  top_p: number;
  maxTokens: number;
}

export interface ToolConfig {
  memoryEnabled: boolean;
  ragEnabled: boolean;
  webEnabled: boolean;
  imageEnabled: boolean;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  modelConfig: ModelConfig;
  toolConfig: ToolConfig;
  promptTemplate: string;
  activeVersionId: string;
}

export interface AgentVersion {
  id: string;
  agentId: string;
  createdAt: string;
  promptTemplate: string;
  modelConfig: ModelConfig;
  toolConfig: ToolConfig;
  notes?: string;
}

export interface UsageEvent {
  id: string;
  agentId: string;
  createdAt: string;
  tokensIn: number;
  tokensOut: number;
  costUSD: number;
  latencyMs: number;
  status: AgentStatus;
}
