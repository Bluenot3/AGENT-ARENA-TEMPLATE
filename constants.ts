
import { Model, Tool, BotThemeConfig } from './types';

export const IMAGE_STYLE_CHIPS = [
  "Cinematic", "Concept Photo", "Anime", "Cyberpunk", "Oil Painting", 
  "3D Render", "Vector Art", "Polaroid", "Blueprint", "Pixel Art", 
  "Minimalist", "Vaporwave", "Double Exposure", "Tilt-Shift", "Isometric", 
  "Steampunk", "Hyper-Realistic", "Sketch", "Pop Art", "Gothic", 
  "Origami", "Glitch Art", "Synthwave", "Low Poly", "Macro Photography", 
  "Unreal Engine 5", "Charcoal", "Ukiyo-e", "Bokeh", "Claymation",
  "Photoreal", "Architectural", "Watercolor", "Noir", "Neon"
];

export const COMPATIBLE_IMAGE_MODELS = {
  openai: [
    { id: 'dall-e-3', name: 'DALL-E 3' },
    { id: 'gpt-image-1.5', name: 'GPT-Image 1.5' },
    { id: 'gpt-image-1.0', name: 'GPT-Image 1.0' },
    { id: 'sora-v1', name: 'Sora (Video)' }
  ],
  google: [
    { id: 'imagen-4', name: 'Imagen 4 Ultra' },
    { id: 'imagen-3', name: 'Imagen 3' },
    { id: 'imagen-fast', name: 'Imagen Fast' },
    { id: 'nano-banana-pro', name: 'Nano Banana Pro' },
    { id: 'veo-2', name: 'Veo 2 (Video)' }
  ],
  stability: [
    { id: 'sdxl', name: 'Stable Diffusion XL' },
    { id: 'stable-cascade', name: 'Stable Cascade' }
  ],
  runway: [
    { id: 'gen-3', name: 'Runway Gen-3 (Video)' }
  ],
  luma: [
    { id: 'dream-machine', name: 'Dream Machine (Video)' }
  ]
};

export const MODEL_REGISTRY: Model[] = [
  // --- OPENAI ---
  { model_id: 'gpt-5.2', provider_id: 'openai', display_name: 'GPT-5.2 (Apex)', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 2000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gpt-5.1-thinking', provider_id: 'openai', display_name: 'GPT-5.1 Thinking', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 1000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gpt-5.1-fast', provider_id: 'openai', display_name: 'GPT-5.1 Fast', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: false }, context_window: 500000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'gpt-5-long', provider_id: 'openai', display_name: 'GPT-5 Long-Context', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 10000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gpt-4.1', provider_id: 'openai', display_name: 'GPT-4.1', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'gpt-4o', provider_id: 'openai', display_name: 'GPT-4o', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'gpt-4o-mini', provider_id: 'openai', display_name: 'GPT-4o Mini', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: false }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'o1-pro', provider_id: 'openai', display_name: 'o1 Pro', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: false, image_gen: false }, context_window: 200000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'o1-reasoning', provider_id: 'openai', display_name: 'o1 Reasoning', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: false }, context_window: 128000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'o1-mini', provider_id: 'openai', display_name: 'o1 Mini', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: false }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },

  // --- GOOGLE ---
  { model_id: 'gemini-3-pro-preview', provider_id: 'google', display_name: 'Gemini 3 Pro', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 2000000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'gemini-3-flash-preview', provider_id: 'google', display_name: 'Gemini 3 Flash', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 1000000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'gemini-3-nano', provider_id: 'google', display_name: 'Gemini 3 Nano', capabilities: { reasoning: false, coding: true, vision: false, long_context: false, tool_calling: true }, context_window: 32000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'gemini-2.5-pro', provider_id: 'google', display_name: 'Gemini 2.5 Pro', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 2000000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'gemini-2.5-flash', provider_id: 'google', display_name: 'Gemini 2.5 Flash', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 1000000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'gemini-2.0-ultra', provider_id: 'google', display_name: 'Gemini 2.0 Ultra', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 1000000, cost_tier: 'high', speed_tier: 'balanced' },

  // --- ANTHROPIC ---
  { model_id: 'claude-4.5-opus', provider_id: 'anthropic', display_name: 'Claude 4.5 Opus', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 800000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'claude-4-sonnet', provider_id: 'anthropic', display_name: 'Claude 4 Sonnet', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 400000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'claude-3.7-sonnet', provider_id: 'anthropic', display_name: 'Claude 3.7 Sonnet', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 200000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'claude-3-5-sonnet', provider_id: 'anthropic', display_name: 'Claude 3.5 Sonnet', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 200000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'claude-3.5-haiku', provider_id: 'anthropic', display_name: 'Claude 3.5 Haiku', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 200000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'claude-3-haiku', provider_id: 'anthropic', display_name: 'Claude 3 Haiku', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 200000, cost_tier: 'low', speed_tier: 'fast' },

  // --- META ---
  { model_id: 'llama-3.3-70b', provider_id: 'meta', display_name: 'Llama 3.3 70B', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'llama-3.1-405b', provider_id: 'meta', display_name: 'Llama 3.1 405B', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'llama-3.1-70b', provider_id: 'meta', display_name: 'Llama 3.1 70B', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'llama-guard-3', provider_id: 'meta', display_name: 'Llama Guard 3', capabilities: { reasoning: false, coding: false, vision: false, long_context: false, tool_calling: false }, context_window: 8000, cost_tier: 'low', speed_tier: 'fast' },

  // --- MISTRAL ---
  { model_id: 'mistral-large-2', provider_id: 'mistral', display_name: 'Mistral Large 2', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'mistral-medium', provider_id: 'mistral', display_name: 'Mistral Medium', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 32000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'mixtral-8x22b', provider_id: 'mistral', display_name: 'Mixtral 8x22B', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 64000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'mixtral-8x7b', provider_id: 'mistral', display_name: 'Mixtral 8x7B', capabilities: { reasoning: false, coding: true, vision: false, long_context: false, tool_calling: true }, context_window: 32000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'codestral', provider_id: 'mistral', display_name: 'Codestral', capabilities: { reasoning: false, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 32000, cost_tier: 'low', speed_tier: 'fast' },

  // --- xAI ---
  { model_id: 'grok-2', provider_id: 'xai', display_name: 'Grok 2', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'grok-2.5-vision', provider_id: 'xai', display_name: 'Grok 2.5 Vision', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'grok-reasoning', provider_id: 'xai', display_name: 'Grok Reasoning', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'high', speed_tier: 'balanced' },

  // --- COHERE ---
  { model_id: 'command-r-plus', provider_id: 'cohere', display_name: 'Command R+', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'command-r', provider_id: 'cohere', display_name: 'Command R', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },

  // --- PERPLEXITY ---
  { model_id: 'sonar-large', provider_id: 'perplexity', display_name: 'Sonar Large', capabilities: { reasoning: true, coding: false, vision: false, long_context: true, tool_calling: false }, context_window: 32000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'sonar-reasoning', provider_id: 'perplexity', display_name: 'Sonar Reasoning', capabilities: { reasoning: true, coding: false, vision: false, long_context: true, tool_calling: false }, context_window: 32000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'sonar-online', provider_id: 'perplexity', display_name: 'Sonar Online', capabilities: { reasoning: false, coding: false, vision: false, long_context: false, tool_calling: false }, context_window: 16000, cost_tier: 'low', speed_tier: 'fast' },

  // --- DEEPSEEK ---
  { model_id: 'deepseek-r1', provider_id: 'deepseek', display_name: 'DeepSeek-R1', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: false }, context_window: 128000, cost_tier: 'low', speed_tier: 'balanced' },
  { model_id: 'deepseek-v2', provider_id: 'deepseek', display_name: 'DeepSeek-V2', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'balanced' },
  { model_id: 'deepseek-coder', provider_id: 'deepseek', display_name: 'DeepSeek-Coder', capabilities: { reasoning: false, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },

  // --- OPEN SOURCE / SPECIALIZED ---
  { model_id: 'qwen-2.5-72b', provider_id: 'specialized', display_name: 'Qwen 2.5 72B', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 32000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'qwen-2.5-vl', provider_id: 'specialized', display_name: 'Qwen 2.5 VL', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 32000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'phi-3', provider_id: 'specialized', display_name: 'Phi-3 Medium', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: false }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'falcon-180b', provider_id: 'specialized', display_name: 'Falcon 180B', capabilities: { reasoning: true, coding: false, vision: false, long_context: false, tool_calling: false }, context_window: 2000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'yi-large', provider_id: 'specialized', display_name: 'Yi-Large', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 200000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'nous-hermes-3', provider_id: 'specialized', display_name: 'Nous Hermes 3', capabilities: { reasoning: true, coding: true, vision: false, long_context: true, tool_calling: true }, context_window: 128000, cost_tier: 'low', speed_tier: 'fast' },
];

export const AVAILABLE_TOOLS: Tool[] = [
  // --- CORE TOOLS ---
  { tool_id: 'gen_image_foundry', name: 'Visual Synthesis', description: 'Generate high-fidelity images using DALL-E 3 or Imagen 4.', enabled: false },
  { tool_id: 'code_artifact_engine', name: 'Artifact Engine', description: 'Enable real-time code execution and live UI previews.', enabled: false },
  { tool_id: 'web_intel', name: 'Web Intelligence', description: 'Ground responses in live web data (Google/Bing).', enabled: false },
  { tool_id: 'code_kernel', name: 'Code Interpreter', description: 'Execute data analysis in a secure Python environment.', enabled: false },
  { tool_id: 'file_analyzer', name: 'Document Analysis', description: 'Deep semantic analysis of PDF/Docx files.', enabled: false },
  
  // --- ADVANCED CAPABILITIES ---
  { tool_id: 'voice_synth', name: 'Voice Synthesis', description: 'Generate lifelike speech in real-time.', enabled: false },
  { tool_id: 'voice_rec', name: 'Voice Recognition', description: 'Streaming speech-to-text input processing.', enabled: false },
  { tool_id: 'sentiment_engine', name: 'Sentiment Matrix', description: 'Analyze user emotion and tone for adaptive responses.', enabled: false },
  { tool_id: 'video_analyzer', name: 'Video Vision', description: 'Analyze video frames for content understanding.', enabled: false },
  { tool_id: 'wolfram_alpha', name: 'Wolfram Alpha', description: 'Computational knowledge engine access.', enabled: false },
  { tool_id: 'memory_vault', name: 'Memory Vault', description: 'Long-term user preference storage.', enabled: false },
  { tool_id: 'schema_gen', name: 'Schema Generator', description: 'JSON / OpenAPI / SQL schema synthesis.', enabled: false },
  { tool_id: 'data_vis', name: 'Data Visualization', description: 'Generate charts, graphs, and dashboards.', enabled: false },
  { tool_id: 'simulation_mode', name: 'Simulation Mode', description: 'Hypothesis testing & scenario modeling.', enabled: false },

  // --- INTEGRATIONS: PRODUCTIVITY ---
  { tool_id: 'calendar_uplink', name: 'Calendar Uplink', description: 'Read/Write access to Google/Outlook calendars.', enabled: false },
  { tool_id: 'mail_relay', name: 'Email Relay', description: 'Draft and send emails via secure SMTP.', enabled: false },
  { tool_id: 'slack_bridge', name: 'Slack Bridge', description: 'Connect directly to Slack workspaces.', enabled: false },
  { tool_id: 'notion_sync', name: 'Notion Sync', description: 'Read and update Notion databases.', enabled: false },
  { tool_id: 'google_workspace', name: 'Google Workspace', description: 'Integration with Drive, Docs, and Sheets.', enabled: false },

  // --- INTEGRATIONS: DEVOPS & AUTOMATION ---
  { tool_id: 'git_uplink', name: 'GitHub/GitLab', description: 'Repo access for code reviews and issue tracking.', enabled: false },
  { tool_id: 'vercel_deploy', name: 'Vercel Deploy', description: 'Deploy artifacts directly to Vercel.', enabled: false },
  { tool_id: 'zapier_connect', name: 'Zapier', description: 'Trigger Zapier workflows.', enabled: false },
  { tool_id: 'make_automation', name: 'Make.com', description: 'Execute Make scenarios.', enabled: false },

  // --- FINANCIAL ---
  { tool_id: 'crypto_wallet', name: 'Wallet Actions', description: 'Check balances and propose transactions.', enabled: false },
  { tool_id: 'onchain_write', name: 'On-Chain Write', description: 'Execute smart contract interactions.', enabled: false },
];

export const BOT_TEMPLATES = [
  {
    name: "Strategy Expert",
    description: "Expert in game theory and competitive analysis.",
    icon: "♟️",
    industry: "Consulting",
    tools: ["web_intel", "code_kernel", "data_vis"],
    system_instructions: "You are a master strategist."
  },
  {
    name: "Software Architect",
    description: "Specialized in software design and live artifact creation.",
    icon: "💻",
    industry: "Technology",
    tools: ["code_artifact_engine", "code_kernel", "git_uplink"],
    system_instructions: "You are an expert software architect. Always use artifacts for code."
  },
  {
    name: "Visual Artist",
    description: "Creative director for image and video synthesis.",
    icon: "🎨",
    industry: "Design",
    tools: ["gen_image_foundry", "video_analyzer"],
    system_instructions: "You are a visionary artist focusing on high-fidelity visual generation."
  }
];

export const AESTHETIC_PRESETS: Record<string, BotThemeConfig> = {
  zen_glass: {
    primary_color: '#3b82f6', secondary_color: '#1e293b', bg_color: '#020617',
    user_bubble_color: '#3b82f6', bot_bubble_color: '#0f172a',
    font_family: 'Inter', font_size: 14, bubble_radius: 24,
    shadow_intensity: 'soft', background_style: 'glass', button_style: 'rounded', border_style: 'thin', light_mode: false
  },
  cyberpunk: {
    primary_color: '#00f7ff', secondary_color: '#000000', bg_color: '#050505',
    user_bubble_color: '#ff00ff', bot_bubble_color: '#111111',
    font_family: 'JetBrains Mono', font_size: 13, bubble_radius: 0,
    shadow_intensity: 'neon', background_style: 'grid', button_style: 'sharp', border_style: 'thick', light_mode: false
  },
  corporate: {
    primary_color: '#2563eb', secondary_color: '#f1f5f9', bg_color: '#ffffff',
    user_bubble_color: '#2563eb', bot_bubble_color: '#f8fafc',
    font_family: 'Inter', font_size: 15, bubble_radius: 8,
    shadow_intensity: 'none', background_style: 'solid', button_style: 'rounded', border_style: 'thin', light_mode: true
  },
  terminal: {
    primary_color: '#22c55e', secondary_color: '#000000', bg_color: '#0c0c0c',
    user_bubble_color: '#14532d', bot_bubble_color: '#000000',
    font_family: 'Courier New', font_size: 14, bubble_radius: 0,
    shadow_intensity: 'none', background_style: 'solid', button_style: 'sharp', border_style: 'double', light_mode: false
  },
  paper: {
    primary_color: '#78350f', secondary_color: '#fffbeb', bg_color: '#fff7ed',
    user_bubble_color: '#d97706', bot_bubble_color: '#fffbeb',
    font_family: 'Georgia', font_size: 16, bubble_radius: 2,
    shadow_intensity: 'soft', background_style: 'dots', button_style: 'rounded', border_style: 'thin', light_mode: true
  },
  oceanic: {
    primary_color: '#06b6d4', secondary_color: '#083344', bg_color: '#020617',
    user_bubble_color: '#0891b2', bot_bubble_color: '#164e63',
    font_family: 'Space Grotesk', font_size: 14, bubble_radius: 16,
    shadow_intensity: 'soft', background_style: 'gradient', button_style: 'pill', border_style: 'none', light_mode: false
  },
  sunset: {
    primary_color: '#f43f5e', secondary_color: '#4c0519', bg_color: '#2a0a12',
    user_bubble_color: '#e11d48', bot_bubble_color: '#881337',
    font_family: 'Inter', font_size: 14, bubble_radius: 30,
    shadow_intensity: 'soft', background_style: 'gradient', button_style: 'pill', border_style: 'none', light_mode: false
  },
  midnight: {
    primary_color: '#8b5cf6', secondary_color: '#1e1b4b', bg_color: '#020205',
    user_bubble_color: '#6d28d9', bot_bubble_color: '#312e81',
    font_family: 'Inter', font_size: 14, bubble_radius: 12,
    shadow_intensity: 'hard', background_style: 'mesh', button_style: 'rounded', border_style: 'thin', light_mode: false
  },
  brutal: {
    primary_color: '#000000', secondary_color: '#ffffff', bg_color: '#ffffff',
    user_bubble_color: '#000000', bot_bubble_color: '#e5e5e5',
    font_family: 'Arial Black', font_size: 16, bubble_radius: 0,
    shadow_intensity: 'hard', background_style: 'solid', button_style: 'sharp', border_style: 'thick', light_mode: true
  },
  soft: {
    primary_color: '#a855f7', secondary_color: '#faf5ff', bg_color: '#fdf4ff',
    user_bubble_color: '#d8b4fe', bot_bubble_color: '#ffffff',
    font_family: 'Nunito', font_size: 15, bubble_radius: 20,
    shadow_intensity: 'soft', background_style: 'gradient', button_style: 'pill', border_style: 'none', light_mode: true
  }
};
