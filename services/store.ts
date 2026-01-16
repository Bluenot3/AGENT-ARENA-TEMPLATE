
import { Entitlement, WalletLink, User, ApiKey, BotConfig, UsageEvent, KnowledgeAsset, ArenaConfig, ArenaTheme, ImageAsset, CreditsBalance } from '../types';
import { AESTHETIC_PRESETS } from '../constants';

const STORE_KEYS = {
  ENTITLEMENTS: 'zen_entitlements',
  WALLET: 'zen_wallet_link',
  ARENAS: 'zen_arenas',
  BOTS: 'zen_bots',
  USER: 'zen_user',
  USAGE: 'zen_usage',
  KEYS: 'zen_keys',
  KNOWLEDGE: 'zen_knowledge',
  CREDITS: 'zen_credits',
  IMAGE_LIBRARY: 'zen_image_library'
};

export const ArenaService = {
  getArenas: (): ArenaConfig[] => {
    const stored = localStorage.getItem(STORE_KEYS.ARENAS);
    return stored ? JSON.parse(stored) : [];
  },
  getArena: (id: string): ArenaConfig | undefined => {
    return ArenaService.getArenas().find(a => a.id === id);
  },
  saveArena: async (arena: ArenaConfig) => {
    const arenas = ArenaService.getArenas();
    const idx = arenas.findIndex(a => a.id === arena.id);
    if (idx >= 0) arenas[idx] = arena;
    else arenas.push(arena);
    localStorage.setItem(STORE_KEYS.ARENAS, JSON.stringify(arenas));
  },
  deleteArena: (id: string) => {
    const arenas = ArenaService.getArenas().filter(a => a.id !== id);
    localStorage.setItem(STORE_KEYS.ARENAS, JSON.stringify(arenas));
  },
  createEmptyArena: (): ArenaConfig => ({
    id: crypto.randomUUID(),
    name: 'NEW_ARENA',
    description: 'A high-fidelity space for intelligence interaction.',
    slug: 'arena-' + Math.random().toString(36).substring(7),
    bot_ids: [],
    theme: {
      primary_color: '#3b82f6',
      secondary_color: '#1e293b',
      bg_color: '#020617',
      accent_color: '#00f7ff',
      font_family: 'Inter',
      border_radius: '1rem',
      animation_style: 'subtle',
      glass_blur: '20px',
      button_style: 'glass',
      border_intensity: '1px',
      // Required base theme props
      user_bubble_color: '#3b82f6',
      bot_bubble_color: '#1e293b',
      font_size: 14,
      bubble_radius: 12,
      shadow_intensity: 'soft',
      background_style: 'glass',
      border_style: 'thin',
      light_mode: false
    },
    created_at: new Date().toISOString()
  })
};

export const CommerceService = {
  getEntitlements: (userId: string): Entitlement[] => {
    const stored = localStorage.getItem(STORE_KEYS.ENTITLEMENTS);
    if (!stored) return [];
    return JSON.parse(stored).filter((e: Entitlement) => e.user_id === userId);
  },
  checkAccess: (userId: string, resourceId: string): boolean => {
    const entitlements = CommerceService.getEntitlements(userId);
    return entitlements.some(e =>
      e.resource_id === resourceId &&
      e.status === 'active' &&
      (!e.valid_until || new Date(e.valid_until) > new Date())
    );
  },
  addEntitlement: (entitlement: Entitlement) => {
    const all = JSON.parse(localStorage.getItem(STORE_KEYS.ENTITLEMENTS) || '[]');
    all.push(entitlement);
    localStorage.setItem(STORE_KEYS.ENTITLEMENTS, JSON.stringify(all));
  },
  setWallet: (link: WalletLink | null) => {
    if (link) localStorage.setItem(STORE_KEYS.WALLET, JSON.stringify(link));
    else localStorage.removeItem(STORE_KEYS.WALLET);
  },
  getWallet: (): WalletLink | null => {
    const stored = localStorage.getItem(STORE_KEYS.WALLET);
    return stored ? JSON.parse(stored) : null;
  }
};

export const AuthService = {
  getUser: (): User | null => {
    const stored = localStorage.getItem(STORE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  },
  login: async (): Promise<User> => {
    const mockUser: User = { id: 'usr-1', email: 'operator@zen.foundry' };
    localStorage.setItem(STORE_KEYS.USER, JSON.stringify(mockUser));
    return mockUser;
  },
  logout: () => {
    localStorage.removeItem(STORE_KEYS.USER);
    window.location.reload();
  },
  authorizeGoogle: async (): Promise<User> => {
    const user = AuthService.getUser();
    if (!user) throw new Error("No user");
    const updated = { ...user, google_authorized: true };
    localStorage.setItem(STORE_KEYS.USER, JSON.stringify(updated));
    return updated;
  },
  setSubscription: (active: boolean) => {
    localStorage.setItem('zen_premium', active ? 'true' : 'false');
  }
};

export const BotService = {
  getBots: (): BotConfig[] => {
    const stored = localStorage.getItem(STORE_KEYS.BOTS);
    return stored ? JSON.parse(stored) : [];
  },
  getBot: (id: string): BotConfig | undefined => {
    return BotService.getBots().find(b => b.id === id);
  },
  saveBot: async (bot: BotConfig) => {
    const bots = BotService.getBots();
    const idx = bots.findIndex(b => b.id === bot.id);
    if (idx >= 0) bots[idx] = bot;
    else bots.push(bot);
    localStorage.setItem(STORE_KEYS.BOTS, JSON.stringify(bots));
  },
  deleteBot: (id: string) => {
    const bots = BotService.getBots().filter(b => b.id !== id);
    localStorage.setItem(STORE_KEYS.BOTS, JSON.stringify(bots));
  },
  createEmptyBot: (): BotConfig => ({
    id: crypto.randomUUID(),
    name: 'NEW_ASSET',
    slug: 'new-asset-' + Math.random().toString(36).substring(7),
    description: '',
    publish_state: 'draft',
    system_instructions: 'You are a professional assistant designed for high-fidelity intelligence.',
    system_reminder: 'Focus on being concise and technically accurate.',
    positive_directives: 'Provide clear, logical, and evidence-based responses.',
    negative_directives: 'Avoid excessive jargon, filler words, or unsubstantiated claims.',
    model_config: {
      primary_model: 'gemini-3-flash-preview',
      temperature: 0.7,
      thinking_budget: 0,
      context_budget: 100000,
      max_output_tokens: 8192,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop_sequences: []
    },
    theme_config: AESTHETIC_PRESETS['zen_glass'],
    image_gen_config: {
      enabled: false,
      model: 'nano-banana-pro',
      style_prompt: '',
      selected_chips: ['Cinematic'],
      custom_chips: [],
      aspect_ratio: '1:1'
    },
    tools: [
      { tool_id: 'web_search', name: 'Web Intel', description: 'Real-time search across global networks.', enabled: false, category: 'core' },
    ],
    knowledge_ids: [],
    starter_prompts: ['Analyze current system state'],
    features: { dual_response_mode: false, multi_agent_consult: false, thought_stream_visibility: true, quick_forge: false, xray_vision: true, alignment_lock: false },
    workflow: { planning_strategy: 'linear' }
  }),
  createBotFromTemplate: (template: any): BotConfig => {
    const bot = BotService.createEmptyBot();
    return {
      ...bot,
      name: template.name,
      description: template.description,
      system_instructions: template.system_instructions,
      workflow: { planning_strategy: template.planning || 'linear' }
    };
  }
};

export const AnalyticsService = {
  getUsage: (): UsageEvent[] => {
    return JSON.parse(localStorage.getItem(STORE_KEYS.USAGE) || '[]');
  },
  logUsage: (event: UsageEvent) => {
    const usage = AnalyticsService.getUsage();
    usage.push(event);
    localStorage.setItem(STORE_KEYS.USAGE, JSON.stringify(usage));
  }
};

export const KeyService = {
  getKeys: (): ApiKey[] => {
    return JSON.parse(localStorage.getItem(STORE_KEYS.KEYS) || '[]');
  },
  saveKey: (providerId: string, key: string) => {
    const keys = KeyService.getKeys();
    const snippet = key.substring(0, 8) + '...';
    const idx = keys.findIndex(k => k.provider_id === providerId);
    if (idx >= 0) keys[idx] = { provider_id: providerId, key_snippet: snippet };
    else keys.push({ provider_id: providerId, key_snippet: snippet });
    localStorage.setItem(STORE_KEYS.KEYS, JSON.stringify(keys));
    // Also store the full key separately (base64 encoded for basic obfuscation)
    localStorage.setItem(`zen_key_${providerId}`, btoa(key));
  },
  deleteKey: (providerId: string) => {
    const keys = KeyService.getKeys().filter(k => k.provider_id !== providerId);
    localStorage.setItem(STORE_KEYS.KEYS, JSON.stringify(keys));
    localStorage.removeItem(`zen_key_${providerId}`);
  },
  getFullKey: (providerId: string): string | null => {
    const encoded = localStorage.getItem(`zen_key_${providerId}`);
    if (!encoded) return null;
    try {
      return atob(encoded);
    } catch {
      return null;
    }
  },
  testKey: async (providerId: string, key: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (providerId === 'google') {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: key });
        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: 'Say "API key verified" in exactly 3 words.',
        });
        if (response.text) {
          return { success: true, message: 'Google API key verified successfully!' };
        }
      }
      // Add other provider tests here as needed
      return { success: true, message: `${providerId} key stored (verification pending)` };
    } catch (error: any) {
      return { success: false, message: error.message || 'Key verification failed' };
    }
  }
};

export const KnowledgeService = {
  getAssets: (): KnowledgeAsset[] => {
    return JSON.parse(localStorage.getItem(STORE_KEYS.KNOWLEDGE) || '[]');
  },
  saveAsset: async (asset: KnowledgeAsset) => {
    const assets = KnowledgeService.getAssets();
    assets.push(asset);
    localStorage.setItem(STORE_KEYS.KNOWLEDGE, JSON.stringify(assets));
  },
  deleteAsset: (id: string) => {
    const assets = KnowledgeService.getAssets().filter(a => a.id !== id);
    localStorage.setItem(STORE_KEYS.KNOWLEDGE, JSON.stringify(assets));
  },
  // Quick add text/image from chat as knowledge
  quickAddFromChat: (content: string, name: string, type: 'text' | 'image' = 'text') => {
    const asset: KnowledgeAsset = {
      id: crypto.randomUUID(),
      name,
      type,
      source: 'chat_quick_add',
      content,
      tags: ['quick-add', 'from-chat'],
      status: 'indexed',
      created_at: new Date().toISOString()
    };
    KnowledgeService.saveAsset(asset);
    return asset;
  }
};

// === CREDITS SERVICE ===
const FREE_PLAN_CREDITS = 7;
const PLUS_PLAN_CREDITS = 500;

export const CreditsService = {
  getBalance: (): CreditsBalance => {
    const stored = localStorage.getItem(STORE_KEYS.CREDITS);
    if (!stored) {
      // Initialize free plan with 7 credits
      const initial: CreditsBalance = {
        total: FREE_PLAN_CREDITS,
        used: 0,
        remaining: FREE_PLAN_CREDITS,
        plan: 'free'
      };
      localStorage.setItem(STORE_KEYS.CREDITS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  },

  useCredit: (amount: number = 1): boolean => {
    const balance = CreditsService.getBalance();
    // Pro/Enterprise users have unlimited credits
    if (balance.plan === 'pro' || balance.plan === 'enterprise') {
      balance.used += amount;
      localStorage.setItem(STORE_KEYS.CREDITS, JSON.stringify(balance));
      return true;
    }

    if (balance.remaining < amount) return false;

    balance.used += amount;
    balance.remaining -= amount;
    localStorage.setItem(STORE_KEYS.CREDITS, JSON.stringify(balance));
    return true;
  },

  addCredits: (amount: number) => {
    const balance = CreditsService.getBalance();
    balance.total += amount;
    balance.remaining += amount;
    localStorage.setItem(STORE_KEYS.CREDITS, JSON.stringify(balance));
  },

  upgradeToPlus: (stripeCustomerId?: string, stripeSubscriptionId?: string) => {
    const balance: CreditsBalance = {
      total: PLUS_PLAN_CREDITS,
      used: 0,
      remaining: PLUS_PLAN_CREDITS,
      plan: 'plus',
      reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId
    };
    localStorage.setItem(STORE_KEYS.CREDITS, JSON.stringify(balance));
    AuthService.setSubscription(true);
  },

  upgradeToPro: (stripeCustomerId?: string, stripeSubscriptionId?: string) => {
    const balance: CreditsBalance = {
      total: 999999,
      used: 0,
      remaining: 999999,
      plan: 'pro',
      reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId
    };
    localStorage.setItem(STORE_KEYS.CREDITS, JSON.stringify(balance));
    AuthService.setSubscription(true);
  },

  resetToFree: () => {
    const balance: CreditsBalance = {
      total: FREE_PLAN_CREDITS,
      used: 0,
      remaining: FREE_PLAN_CREDITS,
      plan: 'free'
    };
    localStorage.setItem(STORE_KEYS.CREDITS, JSON.stringify(balance));
    AuthService.setSubscription(false);
  },

  hasCredits: (amount: number = 1): boolean => {
    const balance = CreditsService.getBalance();
    return balance.remaining >= amount || balance.plan === 'pro' || balance.plan === 'enterprise';
  },

  isPaidPlan: (): boolean => {
    const balance = CreditsService.getBalance();
    return balance.plan !== 'free';
  },

  getLowCreditsWarning: (): boolean => {
    const balance = CreditsService.getBalance();
    if (balance.plan === 'pro' || balance.plan === 'enterprise') return false;
    return balance.remaining <= 2;
  }
};

// === IMAGE LIBRARY SERVICE ===
export const ImageLibraryService = {
  getImages: (): ImageAsset[] => {
    return JSON.parse(localStorage.getItem(STORE_KEYS.IMAGE_LIBRARY) || '[]');
  },

  saveImage: (image: Omit<ImageAsset, 'id' | 'created_at'>): ImageAsset => {
    const images = ImageLibraryService.getImages();
    const newImage: ImageAsset = {
      ...image,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    images.unshift(newImage); // Add to front
    localStorage.setItem(STORE_KEYS.IMAGE_LIBRARY, JSON.stringify(images));
    return newImage;
  },

  deleteImage: (id: string) => {
    const images = ImageLibraryService.getImages().filter(i => i.id !== id);
    localStorage.setItem(STORE_KEYS.IMAGE_LIBRARY, JSON.stringify(images));
  },

  toggleFavorite: (id: string) => {
    const images = ImageLibraryService.getImages();
    const idx = images.findIndex(i => i.id === id);
    if (idx >= 0) {
      images[idx].is_favorite = !images[idx].is_favorite;
      localStorage.setItem(STORE_KEYS.IMAGE_LIBRARY, JSON.stringify(images));
    }
  },

  getImagesByAgent: (agentId: string): ImageAsset[] => {
    return ImageLibraryService.getImages().filter(i => i.agent_id === agentId);
  }
};
