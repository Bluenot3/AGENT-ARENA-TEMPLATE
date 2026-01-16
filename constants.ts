
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
  { model_id: 'nano-banana-pro', provider_id: 'google', display_name: 'Nano Banana Pro', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 500000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'nano-banana', provider_id: 'google', display_name: 'Nano Banana', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 256000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'gemini-2.5-pro', provider_id: 'google', display_name: 'Gemini 2.5 Pro', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 2000000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'gemini-2.5-flash', provider_id: 'google', display_name: 'Gemini 2.5 Flash', capabilities: { reasoning: false, coding: true, vision: true, long_context: true, tool_calling: true, image_gen: true }, context_window: 1000000, cost_tier: 'low', speed_tier: 'fast' },
  { model_id: 'gemini-2.0-ultra', provider_id: 'google', display_name: 'Gemini 2.0 Ultra', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 1000000, cost_tier: 'high', speed_tier: 'balanced' },

  // --- ANTHROPIC ---
  { model_id: 'claude-4.5-opus', provider_id: 'anthropic', display_name: 'Claude 4.5 Opus', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 800000, cost_tier: 'high', speed_tier: 'balanced' },
  { model_id: 'claude-4.5-sonnet', provider_id: 'anthropic', display_name: 'Claude 4.5 Sonnet', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 600000, cost_tier: 'medium', speed_tier: 'fast' },
  { model_id: 'claude-4-sonnet', provider_id: 'anthropic', display_name: 'Claude 4 Sonnet', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 400000, cost_tier: 'medium', speed_tier: 'balanced' },
  { model_id: 'claude-4-opus', provider_id: 'anthropic', display_name: 'Claude 4 Opus', capabilities: { reasoning: true, coding: true, vision: true, long_context: true, tool_calling: true }, context_window: 500000, cost_tier: 'high', speed_tier: 'balanced' },
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

export const TOOL_CATEGORIES = [
  { id: 'all', label: 'All Tools', icon: 'Wrench' },
  { id: 'core', label: 'Core', icon: 'Zap' },
  { id: 'productivity', label: 'Productivity', icon: 'ClipboardList' },
  { id: 'communication', label: 'Communication', icon: 'MessageSquare' },
  { id: 'automation', label: 'Automation', icon: 'RefreshCw' },
  { id: 'data', label: 'Data', icon: 'BarChart3' },
  { id: 'creative', label: 'Creative', icon: 'Palette' },
  { id: 'finance', label: 'Finance', icon: 'Wallet' },
  { id: 'integrations', label: 'Integrations', icon: 'Link' },
  { id: 'custom', label: 'Custom', icon: 'Sparkles' },
];

export const AVAILABLE_TOOLS: Tool[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // CORE TOOLS - Essential AI capabilities
  // ═══════════════════════════════════════════════════════════════════════════
  { tool_id: 'gen_image_foundry', name: 'Visual Synthesis', description: 'Generate high-fidelity images using DALL-E 3, Imagen 4, or Stable Diffusion.', enabled: false, category: 'core', icon: 'Image' },
  { tool_id: 'code_artifact_engine', name: 'Artifact Engine', description: 'Enable real-time code execution and live UI previews.', enabled: false, category: 'core', icon: 'Code2' },
  { tool_id: 'web_intel', name: 'Web Intelligence', description: 'Ground responses in live web data via Google/Bing search.', enabled: false, category: 'core', icon: 'Globe' },
  { tool_id: 'code_kernel', name: 'Code Interpreter', description: 'Execute Python code for data analysis in a secure sandbox.', enabled: false, category: 'core', icon: 'Terminal' },
  { tool_id: 'file_analyzer', name: 'Document Analysis', description: 'Deep semantic analysis of PDF, DOCX, and text files.', enabled: false, category: 'core', icon: 'FileText' },
  { tool_id: 'memory_vault', name: 'Memory Vault', description: 'Long-term user preference and context storage.', enabled: false, category: 'core', icon: 'Brain' },
  { tool_id: 'schema_gen', name: 'Schema Generator', description: 'Generate JSON, OpenAPI, GraphQL, and SQL schemas.', enabled: false, category: 'core', icon: 'Braces' },
  { tool_id: 'reasoning_engine', name: 'Deep Reasoning', description: 'Multi-step logical reasoning with chain-of-thought.', enabled: false, category: 'core', icon: 'Sparkles' },

  // ═══════════════════════════════════════════════════════════════════════════
  // PRODUCTIVITY TOOLS - Work smarter
  // ═══════════════════════════════════════════════════════════════════════════
  { tool_id: 'calendar_uplink', name: 'Calendar Uplink', description: 'Read/Write access to Google/Outlook calendars.', enabled: false, category: 'productivity', icon: 'Calendar' },
  { tool_id: 'mail_relay', name: 'Email Relay', description: 'Draft, send, and manage emails via SMTP/API.', enabled: false, category: 'productivity', icon: 'Mail' },
  { tool_id: 'notion_sync', name: 'Notion Sync', description: 'Read and update Notion databases and pages.', enabled: false, category: 'productivity', icon: 'FileEdit' },
  { tool_id: 'google_workspace', name: 'Google Workspace', description: 'Integration with Drive, Docs, Sheets, and Slides.', enabled: false, category: 'productivity', icon: 'LayoutGrid' },
  { tool_id: 'task_manager', name: 'Task Manager', description: 'Create and manage tasks in Todoist, Asana, or Monday.', enabled: false, category: 'productivity', icon: 'CheckSquare' },
  { tool_id: 'meeting_scheduler', name: 'Meeting Scheduler', description: 'Schedule meetings with Calendly or Cal.com integration.', enabled: false, category: 'productivity', icon: 'CalendarClock' },
  { tool_id: 'crm_sync', name: 'CRM Sync', description: 'Sync with HubSpot, Salesforce, or Pipedrive.', enabled: false, category: 'productivity', icon: 'Users' },
  { tool_id: 'spreadsheet_engine', name: 'Spreadsheet Engine', description: 'Read, write, and analyze Google Sheets / Excel.', enabled: false, category: 'productivity', icon: 'Table' },
  { tool_id: 'doc_generator', name: 'Document Generator', description: 'Create formatted documents, contracts, and reports.', enabled: false, category: 'productivity', icon: 'FilePlus' },
  { tool_id: 'notes_sync', name: 'Notes Sync', description: 'Sync with Evernote, OneNote, or Obsidian.', enabled: false, category: 'productivity', icon: 'StickyNote' },

  // ═══════════════════════════════════════════════════════════════════════════
  // COMMUNICATION TOOLS - Connect everywhere
  // ═══════════════════════════════════════════════════════════════════════════
  { tool_id: 'slack_bridge', name: 'Slack Bridge', description: 'Send messages and manage Slack workspaces.', enabled: false, category: 'communication', icon: 'MessageSquare' },
  { tool_id: 'discord_bot', name: 'Discord Bot', description: 'Interact with Discord servers and channels.', enabled: false, category: 'communication', icon: 'Gamepad2' },
  { tool_id: 'teams_connect', name: 'Teams Connect', description: 'Microsoft Teams messaging and notifications.', enabled: false, category: 'communication', icon: 'Building2' },
  { tool_id: 'whatsapp_relay', name: 'WhatsApp Relay', description: 'Send WhatsApp messages via Business API.', enabled: false, category: 'communication', icon: 'Smartphone' },
  { tool_id: 'sms_gateway', name: 'SMS Gateway', description: 'Send SMS via Twilio or MessageBird.', enabled: false, category: 'communication', icon: 'MessageCircle' },
  { tool_id: 'push_notify', name: 'Push Notifications', description: 'Send push notifications to mobile apps.', enabled: false, category: 'communication', icon: 'Bell' },
  { tool_id: 'intercom_chat', name: 'Intercom Chat', description: 'Manage Intercom conversations and users.', enabled: false, category: 'communication', icon: 'MessagesSquare' },
  { tool_id: 'zendesk_ticket', name: 'Zendesk Ticket', description: 'Create and manage support tickets.', enabled: false, category: 'communication', icon: 'Ticket' },

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTOMATION TOOLS - Workflow orchestration
  // ═══════════════════════════════════════════════════════════════════════════
  { tool_id: 'zapier_connect', name: 'Zapier', description: 'Trigger Zapier zaps and workflows.', enabled: false, category: 'automation', icon: 'Zap' },
  { tool_id: 'make_automation', name: 'Make.com', description: 'Execute Make (Integromat) scenarios.', enabled: false, category: 'automation', icon: 'Workflow' },
  { tool_id: 'ifttt_bridge', name: 'IFTTT Bridge', description: 'Trigger IFTTT applets and recipes.', enabled: false, category: 'automation', icon: 'GitBranch' },
  { tool_id: 'pabbly_connect', name: 'Pabbly Connect', description: 'Automate with Pabbly workflows.', enabled: false, category: 'automation', icon: 'Link' },
  { tool_id: 'n8n_workflow', name: 'n8n Workflow', description: 'Execute n8n automation workflows.', enabled: false, category: 'automation', icon: 'Network' },
  { tool_id: 'pipedream', name: 'Pipedream', description: 'Run Pipedream workflows via API.', enabled: false, category: 'automation', icon: 'Rocket' },
  { tool_id: 'webhook_trigger', name: 'Webhook Trigger', description: 'Send data to any webhook endpoint.', enabled: false, category: 'automation', icon: 'Webhook' },
  { tool_id: 'cron_scheduler', name: 'Cron Scheduler', description: 'Schedule recurring automated tasks.', enabled: false, category: 'automation', icon: 'Clock' },

  // ═══════════════════════════════════════════════════════════════════════════
  // DATA TOOLS - Information management
  // ═══════════════════════════════════════════════════════════════════════════
  { tool_id: 'data_vis', name: 'Data Visualization', description: 'Generate charts, graphs, and dashboards.', enabled: false, category: 'data', icon: 'BarChart3' },
  { tool_id: 'database_query', name: 'Database Query', description: 'Query PostgreSQL, MySQL, or SQLite databases.', enabled: false, category: 'data', icon: 'Database' },
  { tool_id: 'airtable_sync', name: 'Airtable Sync', description: 'Read and write Airtable bases.', enabled: false, category: 'data', icon: 'Grid3X3' },
  { tool_id: 'firebase_connect', name: 'Firebase Connect', description: 'Access Firebase Firestore and Realtime DB.', enabled: false, category: 'data', icon: 'Flame' },
  { tool_id: 'supabase_link', name: 'Supabase Link', description: 'Query and update Supabase databases.', enabled: false, category: 'data', icon: 'Layers' },
  { tool_id: 'mongodb_atlas', name: 'MongoDB Atlas', description: 'Connect to MongoDB Atlas clusters.', enabled: false, category: 'data', icon: 'Leaf' },
  { tool_id: 'bigquery', name: 'BigQuery', description: 'Run BigQuery SQL analytics.', enabled: false, category: 'data', icon: 'Search' },
  { tool_id: 'vector_search', name: 'Vector Search', description: 'Semantic search across embeddings (Pinecone/Weaviate).', enabled: false, category: 'data', icon: 'Compass' },

  // ═══════════════════════════════════════════════════════════════════════════
  // CREATIVE TOOLS - Content creation
  // ═══════════════════════════════════════════════════════════════════════════
  { tool_id: 'video_synth', name: 'Video Synthesis', description: 'Generate videos with Sora, Runway, or Veo.', enabled: false, category: 'creative', icon: 'Video' },
  { tool_id: 'audio_transcribe', name: 'Audio Transcription', description: 'Transcribe audio with Whisper or AssemblyAI.', enabled: false, category: 'creative', icon: 'Mic' },
  { tool_id: 'voice_synth', name: 'Voice Synthesis', description: 'Generate speech with ElevenLabs or Play.ht.', enabled: false, category: 'creative', icon: 'AudioLines' },
  { tool_id: 'voice_rec', name: 'Voice Recognition', description: 'Real-time speech-to-text processing.', enabled: false, category: 'creative', icon: 'Ear' },
  { tool_id: 'music_gen', name: 'Music Generator', description: 'Create music with Suno or MusicGen.', enabled: false, category: 'creative', icon: 'Music' },
  { tool_id: 'video_analyzer', name: 'Video Vision', description: 'Analyze video content frame-by-frame.', enabled: false, category: 'creative', icon: 'Eye' },

  // ═══════════════════════════════════════════════════════════════════════════
  // FINANCE TOOLS - Money management
  // ═══════════════════════════════════════════════════════════════════════════
  { tool_id: 'stripe_integration', name: 'Stripe Integration', description: 'Create invoices, manage subscriptions.', enabled: false, category: 'finance', icon: 'CreditCard' },
  { tool_id: 'paypal_connect', name: 'PayPal Connect', description: 'Process payments and send payouts.', enabled: false, category: 'finance', icon: 'Banknote' },
  { tool_id: 'crypto_wallet', name: 'Wallet Actions', description: 'Check crypto balances and transactions.', enabled: false, category: 'finance', icon: 'Coins' },
  { tool_id: 'onchain_write', name: 'On-Chain Write', description: 'Execute smart contract interactions.', enabled: false, category: 'finance', icon: 'Binary' },
  { tool_id: 'invoice_gen', name: 'Invoice Generator', description: 'Create and send professional invoices.', enabled: false, category: 'finance', icon: 'Receipt' },
  { tool_id: 'expense_tracker', name: 'Expense Tracker', description: 'Track and categorize expenses.', enabled: false, category: 'finance', icon: 'TrendingUp' },

  // ═══════════════════════════════════════════════════════════════════════════
  // INTEGRATION TOOLS - External services
  // ═══════════════════════════════════════════════════════════════════════════
  { tool_id: 'git_uplink', name: 'GitHub/GitLab', description: 'Repo access, PRs, issues, and code reviews.', enabled: false, category: 'integrations', icon: 'GitPullRequest' },
  { tool_id: 'vercel_deploy', name: 'Vercel Deploy', description: 'Deploy projects directly to Vercel.', enabled: false, category: 'integrations', icon: 'Triangle' },
  { tool_id: 'wolfram_alpha', name: 'Wolfram Alpha', description: 'Computational knowledge engine access.', enabled: false, category: 'integrations', icon: 'Calculator' },
  { tool_id: 'sentiment_engine', name: 'Sentiment Analysis', description: 'Analyze emotion and tone in text.', enabled: false, category: 'integrations', icon: 'Heart' },
  { tool_id: 'translation', name: 'Translation', description: 'Translate text between 100+ languages.', enabled: false, category: 'integrations', icon: 'Languages' },
  { tool_id: 'simulation_mode', name: 'Simulation Mode', description: 'Hypothesis testing and scenario modeling.', enabled: false, category: 'integrations', icon: 'FlaskConical' },
];

export const BOT_TEMPLATES = [
  {
    id: 'strategy-expert',
    name: "STRATEGY EXPERT",
    description: "Master strategist for game theory, competitive analysis, and decision optimization.",
    icon: "♟️",
    industry: "Consulting",
    gradient: "from-blue-600 to-indigo-600",
    tools: ["web_intel", "code_kernel", "data_vis"],
    model: "gemini-3-pro-preview",
    system_instructions: `You are a master strategist specializing in game theory, competitive analysis, and strategic decision-making. 

Your capabilities include:
- Analyzing complex scenarios and identifying optimal strategies
- Applying game theory principles to real-world situations
- Evaluating competitive landscapes and market positioning
- Providing evidence-based recommendations with clear reasoning

Communicate with precision and authority. Use structured frameworks when presenting analysis. Always consider multiple scenarios and their implications.`,
    positive_directives: "Strategic, analytical, evidence-based, decisive, comprehensive",
    negative_directives: "Vague, uncertain, unfounded claims, excessive hedging"
  },
  {
    id: 'software-architect',
    name: "SOFTWARE ARCHITECT",
    description: "Expert in system design, code architecture, and live artifact creation.",
    icon: "💻",
    industry: "Technology",
    gradient: "from-emerald-600 to-cyan-600",
    tools: ["code_artifact_engine", "code_kernel", "git_uplink"],
    model: "gemini-3-pro-preview",
    system_instructions: `You are an expert software architect with deep knowledge of system design, distributed systems, and modern development practices.

Your capabilities include:
- Designing scalable, maintainable software architectures
- Creating live code artifacts with React, TypeScript, and modern frameworks
- Reviewing code for best practices and optimization opportunities
- Explaining complex technical concepts clearly

Always use the Artifact Engine to create interactive code examples. Provide production-ready code with proper error handling, types, and documentation.`,
    positive_directives: "Clean code, best practices, typed, documented, testable",
    negative_directives: "Hacky solutions, ignoring edge cases, magic numbers"
  },
  {
    id: 'visual-artist',
    name: "VISUAL ARTIST",
    description: "Creative director for AI image generation and visual storytelling.",
    icon: "🎨",
    industry: "Design",
    gradient: "from-pink-600 to-purple-600",
    tools: ["gen_image_foundry", "video_analyzer"],
    model: "gemini-3-flash-preview",
    imageGenEnabled: true,
    system_instructions: `You are a visionary visual artist and creative director specializing in AI-powered image generation.

Your capabilities include:
- Creating stunning visual concepts and detailed image prompts
- Understanding composition, lighting, color theory, and artistic styles
- Translating abstract ideas into compelling visual descriptions
- Guiding users through the creative process

When users request images, craft detailed, evocative prompts that capture their vision. Consider style, mood, lighting, composition, and technical aspects.`,
    positive_directives: "Vivid, descriptive, artistic, evocative, inspiring",
    negative_directives: "Generic, bland, technically inaccurate descriptions"
  },
  {
    id: 'customer-support',
    name: "CUSTOMER SUPPORT",
    description: "Friendly, efficient support agent for handling customer inquiries.",
    icon: "💬",
    industry: "Support",
    gradient: "from-amber-600 to-orange-600",
    tools: ["web_intel", "memory_vault"],
    model: "gemini-3-flash-preview",
    system_instructions: `You are a friendly, professional customer support specialist committed to providing exceptional service.

Your approach:
- Listen carefully and acknowledge customer concerns
- Provide clear, step-by-step solutions
- Maintain a warm, empathetic tone while being efficient
- Escalate complex issues appropriately
- Follow up to ensure satisfaction

Always prioritize customer satisfaction while following company policies. Be patient, understanding, and solution-oriented.`,
    positive_directives: "Friendly, helpful, patient, solution-focused, empathetic",
    negative_directives: "Dismissive, robotic, passing blame, overpromising"
  },
  {
    id: 'research-assistant',
    name: "RESEARCH ASSISTANT",
    description: "Academic researcher for deep analysis and literature review.",
    icon: "📚",
    industry: "Academia",
    gradient: "from-violet-600 to-purple-600",
    tools: ["web_intel", "file_analyzer", "data_vis"],
    model: "gemini-3-pro-preview",
    system_instructions: `You are a meticulous research assistant with expertise in academic research methodology and analysis.

Your capabilities:
- Conducting comprehensive literature reviews
- Synthesizing information from multiple sources
- Identifying patterns, gaps, and opportunities in research
- Citing sources properly and maintaining academic rigor
- Creating clear summaries and visualizations of findings

Always cite your sources. Present balanced perspectives and acknowledge limitations. Use proper academic language while remaining accessible.`,
    positive_directives: "Rigorous, cited, objective, thorough, methodical",
    negative_directives: "Unsourced claims, bias, superficial analysis"
  },
  {
    id: 'data-analyst',
    name: "DATA ANALYST",
    description: "Expert in data analysis, visualization, and insight generation.",
    icon: "📊",
    industry: "Analytics",
    gradient: "from-cyan-600 to-blue-600",
    tools: ["code_kernel", "data_vis", "schema_gen"],
    model: "gemini-3-pro-preview",
    system_instructions: `You are an expert data analyst skilled in extracting insights from complex datasets.

Your expertise includes:
- Statistical analysis and data modeling
- Creating clear, compelling visualizations
- Identifying trends, patterns, and anomalies
- Translating data into actionable insights
- Python/Pandas for data manipulation

Present findings with appropriate context. Always consider data quality and potential biases. Make recommendations based on evidence.`,
    positive_directives: "Data-driven, precise, visual, actionable, contextual",
    negative_directives: "Assumptions without data, misleading charts, overclaiming"
  },
  {
    id: 'creative-writer',
    name: "CREATIVE WRITER",
    description: "Versatile writer for content creation and storytelling.",
    icon: "✍️",
    industry: "Content",
    gradient: "from-rose-600 to-pink-600",
    tools: ["web_intel"],
    model: "gemini-3-pro-preview",
    system_instructions: `You are a talented creative writer with mastery over various writing styles and formats.

Your skills include:
- Crafting compelling narratives and stories
- Adapting tone and style to any audience
- Creating engaging marketing copy and content
- Editing and refining prose for maximum impact
- Developing unique voices for different brands

Write with clarity, creativity, and purpose. Consider your audience and the desired emotional response. Every word should serve a purpose.`,
    positive_directives: "Engaging, creative, polished, purposeful, original",
    negative_directives: "Clichés, passive voice overuse, unclear messaging"
  },
  {
    id: 'marketing-strategist',
    name: "MARKETING STRATEGIST",
    description: "Growth expert for campaigns, branding, and market analysis.",
    icon: "📈",
    industry: "Marketing",
    gradient: "from-green-600 to-emerald-600",
    tools: ["web_intel", "data_vis", "mail_relay"],
    model: "gemini-3-flash-preview",
    system_instructions: `You are a strategic marketing expert with deep knowledge of digital marketing, branding, and growth strategies.

Your expertise spans:
- Developing comprehensive marketing strategies
- Analyzing market trends and competitor positioning
- Creating compelling brand narratives
- Optimizing campaigns for ROI
- Understanding customer psychology and behavior

Think strategically while being practical about execution. Consider budget constraints and resource allocation. Focus on measurable outcomes.`,
    positive_directives: "Strategic, data-informed, creative, ROI-focused",
    negative_directives: "Vanity metrics, unfounded claims, ignoring target audience"
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
    primary_color: '#00f7ff', secondary_color: '#0a0a0a', bg_color: '#000000',
    user_bubble_color: '#ff00ff', bot_bubble_color: '#0d0d0d',
    font_family: 'JetBrains Mono', font_size: 13, bubble_radius: 0,
    shadow_intensity: 'neon', background_style: 'grid', button_style: 'sharp', border_style: 'thick', light_mode: false
  },
  neon_tokyo: {
    primary_color: '#ff0080', secondary_color: '#1a0a1a', bg_color: '#0a0010',
    user_bubble_color: '#ff0080', bot_bubble_color: '#1a0a20',
    font_family: 'Orbitron', font_size: 13, bubble_radius: 4,
    shadow_intensity: 'neon', background_style: 'mesh', button_style: 'sharp', border_style: 'thick', light_mode: false
  },
  aurora: {
    primary_color: '#00ff88', secondary_color: '#0a2020', bg_color: '#020a0a',
    user_bubble_color: '#00cc88', bot_bubble_color: '#0a1a1a',
    font_family: 'Space Grotesk', font_size: 14, bubble_radius: 20,
    shadow_intensity: 'soft', background_style: 'gradient', button_style: 'pill', border_style: 'none', light_mode: false
  },
  holographic: {
    primary_color: '#a855f7', secondary_color: '#1a1025', bg_color: '#080510',
    user_bubble_color: '#c084fc', bot_bubble_color: '#1e1030',
    font_family: 'Outfit', font_size: 14, bubble_radius: 16,
    shadow_intensity: 'neon', background_style: 'mesh', button_style: 'rounded', border_style: 'thin', light_mode: false
  },
  matrix: {
    primary_color: '#00ff00', secondary_color: '#001a00', bg_color: '#000a00',
    user_bubble_color: '#00cc00', bot_bubble_color: '#001500',
    font_family: 'JetBrains Mono', font_size: 13, bubble_radius: 0,
    shadow_intensity: 'neon', background_style: 'grid', button_style: 'sharp', border_style: 'double', light_mode: false
  },
  noir: {
    primary_color: '#f5f5f5', secondary_color: '#1a1a1a', bg_color: '#0d0d0d',
    user_bubble_color: '#333333', bot_bubble_color: '#1a1a1a',
    font_family: 'Playfair Display', font_size: 15, bubble_radius: 8,
    shadow_intensity: 'hard', background_style: 'solid', button_style: 'rounded', border_style: 'thin', light_mode: false
  },
  obsidian: {
    primary_color: '#6366f1', secondary_color: '#18181b', bg_color: '#09090b',
    user_bubble_color: '#4f46e5', bot_bubble_color: '#18181b',
    font_family: 'Inter', font_size: 14, bubble_radius: 12,
    shadow_intensity: 'hard', background_style: 'mesh', button_style: 'rounded', border_style: 'thin', light_mode: false
  },
  fire: {
    primary_color: '#f97316', secondary_color: '#1c0a00', bg_color: '#0a0200',
    user_bubble_color: '#ea580c', bot_bubble_color: '#1a0a00',
    font_family: 'Inter', font_size: 14, bubble_radius: 16,
    shadow_intensity: 'neon', background_style: 'gradient', button_style: 'pill', border_style: 'none', light_mode: false
  },
  ice: {
    primary_color: '#38bdf8', secondary_color: '#0c1929', bg_color: '#020617',
    user_bubble_color: '#0ea5e9', bot_bubble_color: '#0c1929',
    font_family: 'Inter', font_size: 14, bubble_radius: 20,
    shadow_intensity: 'soft', background_style: 'glass', button_style: 'pill', border_style: 'none', light_mode: false
  },
  terminal: {
    primary_color: '#22c55e', secondary_color: '#000000', bg_color: '#0c0c0c',
    user_bubble_color: '#14532d', bot_bubble_color: '#000000',
    font_family: 'Courier New', font_size: 14, bubble_radius: 0,
    shadow_intensity: 'none', background_style: 'solid', button_style: 'sharp', border_style: 'double', light_mode: false
  },
  corporate: {
    primary_color: '#2563eb', secondary_color: '#f1f5f9', bg_color: '#ffffff',
    user_bubble_color: '#2563eb', bot_bubble_color: '#f8fafc',
    font_family: 'Inter', font_size: 15, bubble_radius: 8,
    shadow_intensity: 'soft', background_style: 'solid', button_style: 'rounded', border_style: 'thin', light_mode: true
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
  },
  luxury: {
    primary_color: '#fbbf24', secondary_color: '#1c1917', bg_color: '#0c0a09',
    user_bubble_color: '#d97706', bot_bubble_color: '#1c1917',
    font_family: 'Playfair Display', font_size: 15, bubble_radius: 8,
    shadow_intensity: 'soft', background_style: 'gradient', button_style: 'rounded', border_style: 'thin', light_mode: false
  },
  vapor: {
    primary_color: '#f0abfc', secondary_color: '#2e1065', bg_color: '#1e1b4b',
    user_bubble_color: '#e879f9', bot_bubble_color: '#3b0764',
    font_family: 'Outfit', font_size: 14, bubble_radius: 24,
    shadow_intensity: 'neon', background_style: 'gradient', button_style: 'pill', border_style: 'none', light_mode: false
  }
};

// Iconic Arena Templates - Vastly different themes for multi-agent environments
export const ARENA_TEMPLATES = {
  neon_colosseum: {
    id: 'neon_colosseum',
    name: 'Neon Colosseum',
    description: 'Cyberpunk tournament arena with electric neon aesthetics',
    icon: '⚡',
    preview_gradient: 'from-cyan-500 via-magenta-500 to-purple-600',
    theme: {
      primary_color: '#00ffff',
      secondary_color: '#ff00ff',
      bg_color: '#0a0012',
      accent_color: '#00ff88',
      user_bubble_color: '#00ffff',
      bot_bubble_color: '#1a0025',
      font_family: 'JetBrains Mono',
      font_size: 13,
      bubble_radius: 4,
      shadow_intensity: 'neon' as const,
      background_style: 'grid' as const,
      button_style: 'sharp' as const,
      border_style: 'thick' as const,
      light_mode: false,
      layout_mode: 'debate_mode' as const,
      animation_style: 'glitch' as const,
      glass_blur: '20px',
      border_radius: '8px',
      border_intensity: '2px',
    }
  },
  crystal_sanctum: {
    id: 'crystal_sanctum',
    name: 'Crystal Sanctum',
    description: 'Ethereal fantasy realm with mystical glass aesthetics',
    icon: '💎',
    preview_gradient: 'from-purple-600 via-violet-500 to-indigo-600',
    theme: {
      primary_color: '#a855f7',
      secondary_color: '#fbbf24',
      bg_color: '#0c0020',
      accent_color: '#c084fc',
      user_bubble_color: '#7c3aed',
      bot_bubble_color: '#1e1040',
      font_family: 'Outfit',
      font_size: 14,
      bubble_radius: 24,
      shadow_intensity: 'soft' as const,
      background_style: 'glass' as const,
      button_style: 'pill' as const,
      border_style: 'thin' as const,
      light_mode: false,
      layout_mode: 'chat_focus' as const,
      animation_style: 'subtle' as const,
      glass_blur: '40px',
      border_radius: '24px',
      border_intensity: '1px',
    }
  },
  iron_forge: {
    id: 'iron_forge',
    name: 'Iron Forge',
    description: 'Industrial steampunk workshop with metallic textures',
    icon: '⚙️',
    preview_gradient: 'from-orange-600 via-amber-500 to-yellow-600',
    theme: {
      primary_color: '#f97316',
      secondary_color: '#cd7c00',
      bg_color: '#1a1008',
      accent_color: '#fbbf24',
      user_bubble_color: '#ea580c',
      bot_bubble_color: '#2a1a0a',
      font_family: 'JetBrains Mono',
      font_size: 13,
      bubble_radius: 0,
      shadow_intensity: 'hard' as const,
      background_style: 'mesh' as const,
      button_style: 'sharp' as const,
      border_style: 'double' as const,
      light_mode: false,
      layout_mode: 'grid_view' as const,
      animation_style: 'dynamic' as const,
      glass_blur: '10px',
      border_radius: '4px',
      border_intensity: '3px',
    }
  },
  zen_garden: {
    id: 'zen_garden',
    name: 'Zen Garden',
    description: 'Minimalist Japanese aesthetic with serene simplicity',
    icon: '🌸',
    preview_gradient: 'from-slate-100 via-sage-200 to-stone-300',
    theme: {
      primary_color: '#64748b',
      secondary_color: '#84a98c',
      bg_color: '#fafaf9',
      accent_color: '#a8a29e',
      user_bubble_color: '#64748b',
      bot_bubble_color: '#f5f5f4',
      font_family: 'Inter',
      font_size: 15,
      bubble_radius: 16,
      shadow_intensity: 'soft' as const,
      background_style: 'solid' as const,
      button_style: 'rounded' as const,
      border_style: 'thin' as const,
      light_mode: true,
      layout_mode: 'chat_focus' as const,
      animation_style: 'subtle' as const,
      glass_blur: '0px',
      border_radius: '16px',
      border_intensity: '1px',
    }
  },
  quantum_lab: {
    id: 'quantum_lab',
    name: 'Quantum Lab',
    description: 'Sci-fi research facility with holographic interfaces',
    icon: '🔬',
    preview_gradient: 'from-blue-600 via-cyan-500 to-teal-500',
    theme: {
      primary_color: '#0ea5e9',
      secondary_color: '#0f172a',
      bg_color: '#020617',
      accent_color: '#38bdf8',
      user_bubble_color: '#0284c7',
      bot_bubble_color: '#0c1929',
      font_family: 'Space Grotesk',
      font_size: 13,
      bubble_radius: 12,
      shadow_intensity: 'neon' as const,
      background_style: 'grid' as const,
      button_style: 'glass' as const,
      border_style: 'thin' as const,
      light_mode: false,
      layout_mode: 'split_pane' as const,
      animation_style: 'dynamic' as const,
      glass_blur: '30px',
      border_radius: '12px',
      border_intensity: '1px',
    }
  },
  dark_citadel: {
    id: 'dark_citadel',
    name: 'Dark Citadel',
    description: 'Gothic medieval fortress with ornate dark aesthetics',
    icon: '🏰',
    preview_gradient: 'from-red-900 via-rose-800 to-stone-900',
    theme: {
      primary_color: '#dc2626',
      secondary_color: '#1c1917',
      bg_color: '#0c0a09',
      accent_color: '#fbbf24',
      user_bubble_color: '#991b1b',
      bot_bubble_color: '#1c1917',
      font_family: 'Playfair Display',
      font_size: 15,
      bubble_radius: 8,
      shadow_intensity: 'hard' as const,
      background_style: 'gradient' as const,
      button_style: 'rounded' as const,
      border_style: 'thick' as const,
      light_mode: false,
      layout_mode: 'debate_mode' as const,
      animation_style: 'subtle' as const,
      glass_blur: '5px',
      border_radius: '8px',
      border_intensity: '2px',
    }
  },
};

