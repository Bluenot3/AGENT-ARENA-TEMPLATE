
export type EntitlementType = 'agent_access' | 'tool_access' | 'knowledge_access' | 'platform_tier' | 'metered_tokens';

export interface Entitlement {
  id: string;
  user_id: string;
  type: EntitlementType;
  resource_id: string;
  status: 'active' | 'expired' | 'pending' | 'revoked';
  valid_until?: string;
  metadata: {
    source: 'stripe' | 'gumroad' | 'crypto' | 'admin';
    transaction_id: string;
    seats?: number;
    tokens_remaining?: number;
  };
  created_at: string;
  updated_at: string;
}

export interface Model {
  model_id: string;
  provider_id: string;
  display_name: string;
  capabilities: {
    reasoning: boolean;
    coding: boolean;
    vision: boolean;
    long_context: boolean;
    tool_calling: boolean;
    image_gen?: boolean;
    video_gen?: boolean;
  };
  context_window: number;
  cost_tier: 'low' | 'medium' | 'high';
  speed_tier: 'fast' | 'balanced';
}

export interface Tool {
  tool_id: string;
  name: string;
  description: string;
  enabled: boolean;
  required_key?: string;
  // Enhanced fields for custom actions
  category: 'core' | 'productivity' | 'integrations' | 'automation' | 'data' | 'creative' | 'communication' | 'finance' | 'custom';
  icon?: string;
  is_custom?: boolean;
  parameters?: ToolParameter[];
  action?: ToolAction;
  created_at?: string;
}

export interface ToolParameter {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'textarea' | 'email' | 'url';
  label: string;
  description?: string;
  required?: boolean;
  default_value?: any;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface ToolAction {
  type: 'webhook' | 'zapier' | 'make' | 'pabbly' | 'ifttt' | 'email' | 'pdf' | 'custom_code' | 'database' | 'api_call';
  webhook_url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body_template?: string;
  code?: string;
  success_message?: string;
  error_message?: string;
}

export interface Artifact {
  id: string;
  title: string;
  language: string;
  content: string;
}

export interface TelemetryStep {
  id: string;
  type: 'UPLINK' | 'RETRIEVAL' | 'REASONING' | 'TOOL_EXEC' | 'SYNTHESIS' | 'OUTPUT' | 'IMAGE_GEN' | 'VIDEO_GEN' | 'ENTROPY_ANALYSIS';
  status: 'pending' | 'active' | 'complete' | 'error';
  label: string;
  detail?: string;
  timestamp: number;
  duration?: number;
  metrics?: {
    latency?: number;
    tokens_per_sec?: number;
    vram_usage?: number;
    attention_heads?: number;
    energy_cost?: number; // Simulated Joules
  };
}

export interface SessionAccumulator {
  total_tokens: number;
  total_energy: number; // Simulated Joules
  tool_calls: number;
  avg_latency: number;
  messages_count: number;
  start_time: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  image_url?: string;
  video_url?: string;
  dual_content?: string;
  consultation_log?: string[];
  thinking_log?: string;
  timestamp: number;
  model_used?: string;
  tokens?: number;
  artifacts?: Artifact[];
  selected_variant?: 'A' | 'B';
  isStreaming?: boolean;
  telemetry?: TelemetryStep[];
  suggestions?: string[];
}

export interface BotThemeConfig {
  primary_color: string;
  secondary_color: string;
  bg_color?: string;
  user_bubble_color: string;
  bot_bubble_color: string;
  font_family: string;
  font_size: number; // px
  bubble_radius: number; // px
  shadow_intensity: 'none' | 'soft' | 'hard' | 'neon';
  background_style: 'solid' | 'gradient' | 'glass' | 'mesh' | 'grid' | 'dots';
  button_style: 'rounded' | 'sharp' | 'pill' | 'skeuomorphic' | 'glass';
  border_style: 'thin' | 'thick' | 'double' | 'none';
  light_mode: boolean;
  avatar_shape?: 'circle' | 'square' | 'hexagon';
  show_timestamps?: boolean;
}

export interface BotConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatar_url?: string;
  publish_state: 'draft' | 'private' | 'arena';
  system_instructions: string;
  system_reminder?: string;
  positive_directives?: string;
  negative_directives?: string;
  theme_config: BotThemeConfig;
  model_config: {
    primary_model: string;
    temperature: number;
    top_p: number;
    top_k?: number;
    frequency_penalty: number;
    presence_penalty: number;
    stop_sequences: string[];
    // Token Budgeting
    max_output_tokens: number;
    context_budget: number; // Memory/Input reservation
    thinking_budget: number;
    cost_guardrail?: number; // USD per session cap
  };
  image_gen_config: {
    enabled: boolean;
    model: string;
    style_prompt: string;
    selected_chips: string[];
    custom_chips: string[];
    aspect_ratio: '1:1' | '16:9' | '9:16';
  };
  tools: Tool[];
  knowledge_ids: string[];
  starter_prompts: string[];
  features: {
    dual_response_mode: boolean;
    multi_agent_consult: boolean;
    thought_stream_visibility: boolean;
    quick_forge: boolean;
    xray_vision: boolean;
    alignment_lock: boolean;
  };
  workflow: {
    planning_strategy: 'linear' | 'chain-of-thought' | 'react' | 'autonomous';
  };
}

export interface TOONChunk {
  id: string;
  text: string;
  tags: string[];
  vector_hash?: string;
  token_count: number;
}

export interface KnowledgeAsset {
  id: string;
  name: string;
  type: 'pdf' | 'url' | 'doc' | 'image' | 'text' | 'spreadsheet' | 'toon';
  source: string;
  content?: string;
  toon_chunks?: TOONChunk[];
  tags: string[];
  size?: string;
  status: 'indexed' | 'pending';
  created_at: string;
}

export interface ArenaTheme extends BotThemeConfig {
  layout_mode?: 'chat_focus' | 'grid_view' | 'split_pane' | 'debate_mode';
  background_image_url?: string;
  accent_color?: string;
  border_radius?: string;
  animation_style?: 'none' | 'subtle' | 'dynamic' | 'glitch';
  glass_blur?: string;
  border_intensity?: string;
}

export interface ArenaConfig {
  id: string;
  name: string;
  description: string;
  slug: string;
  bot_ids: string[];
  global_system_prompt?: string;
  theme: ArenaTheme;
  custom_css?: string;
  turn_arbitration?: 'round_robin' | 'priority' | 'random';
  role_assignment?: Record<string, 'planner' | 'executor' | 'critic' | 'synthesizer'>;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  google_authorized?: boolean;
}

export interface ApiKey {
  provider_id: string;
  key_snippet: string;
}

export interface UsageEvent {
  date: string;
  tokens: number;
  cost_est: number;
  model: string;
  status: 'SUCCESS' | 'FAILURE';
}

export interface WalletLink {
  address: string;
  chain_id: number;
  provider: string;
  connected_at: string;
}

export interface PricePlan {
  id: string;
  type: string;
  amount: number;
  interval?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  resource_ids: string[];
  price_plans: PricePlan[];
}

// === IMAGE LIBRARY & CREDITS SYSTEM ===

export interface ImageAsset {
  id: string;
  url: string;
  prompt: string;
  model: string;
  agent_id?: string;
  agent_name?: string;
  style?: string;
  aspect_ratio: string;
  created_at: string;
  tags: string[];
  is_favorite: boolean;
}

export interface CreditsBalance {
  total: number;
  used: number;
  remaining: number;
  plan: 'free' | 'plus' | 'pro' | 'enterprise';
  reset_date?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}

export interface ShareConfig {
  type: 'link' | 'embed' | 'download';
  embed_code?: string;
  share_url?: string;
  is_public: boolean;
  expires_at?: string;
}

export interface ImageAgent {
  id: string;
  name: string;
  description: string;
  templateId: string;
  styles: string[];
  aspectRatio: string;
  quality: number;
  model: string;
  customPrompt: string;
  createdAt: number;
}
