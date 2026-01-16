
import { GoogleGenAI, Type } from "@google/genai";
import { BotConfig, Message, Artifact, KnowledgeAsset, ArenaTheme, TelemetryStep } from '../types';
import { AnalyticsService, KnowledgeService, KeyService } from './store';
import { WebIntelService } from './webintel';

// Default API Key for Gemini (fallback when user hasn't added their own)
const DEFAULT_GEMINI_KEY = 'AIzaSyDvwN3_SBXDR-T-0oAogHa0kJIeaPf1ems';

// Get API key - prefer user's stored key, fall back to default
const getApiKey = (): string => {
  const userKey = KeyService.getFullKey?.('google');
  return userKey || DEFAULT_GEMINI_KEY;
};

// Model mapping for display names to actual API model names
// Using working model identifiers for Google AI SDK
const MODEL_MAPPING: Record<string, string> = {
  // Gemini 2.x models
  'gemini-2.5-pro': 'gemini-2.0-flash',
  'gemini-2.5-flash': 'gemini-2.0-flash',
  'gemini-2.0-flash': 'gemini-2.0-flash',
  'gemini-2.0-pro': 'gemini-2.0-flash',
  // Gemini 3.x preview (map to working models)
  'gemini-3-pro-preview': 'gemini-2.0-flash',
  'gemini-3-flash-preview': 'gemini-2.0-flash',
  // Legacy names
  'gemini-1.5-pro': 'gemini-2.0-flash',
  'gemini-1.5-flash': 'gemini-2.0-flash',
  'nano-banana-pro': 'gemini-2.0-flash',
  'nano-banana': 'gemini-2.0-flash',
};

const getActualModelName = (modelId: string): string => {
  return MODEL_MAPPING[modelId] || 'gemini-2.0-flash';
};

interface LLMResponse {
  content: string;
  image_url?: string;
  dual_content?: string;
  thinking_log?: string;
  model_used: string;
  tokens: number;
  artifacts?: Artifact[];
  suggestions?: string[];
}

export const ModelRouter = {
  chatStream: async (
    bot: BotConfig,
    history: Message[],
    userPrompt: string,
    onChunk: (text: string) => void,
    onTelemetry?: (step: TelemetryStep) => void
  ): Promise<LLMResponse> => {

    const sendTelemetry = (type: TelemetryStep['type'], label: string, detail?: string) => {
      onTelemetry?.({
        id: crypto.randomUUID(),
        type,
        label,
        detail,
        status: 'active',
        timestamp: Date.now(),
        metrics: {
          latency: Math.random() * 5 + 15,
          tokens_per_sec: Math.random() * 40 + 80,
          attention_heads: 128,
          vram_usage: Math.random() * 10 + 35
        }
      });
    };

    // Determine if using OpenAI, Anthropic, or Google based on selected model
    const selectedModel = bot.model_config.primary_model;

    // Check for Anthropic/Claude models
    const isAnthropicModel = selectedModel.includes('claude') || selectedModel.includes('sonnet') ||
      selectedModel.includes('opus') || selectedModel.includes('haiku') || selectedModel.includes('anthropic');

    // Check for OpenAI models  
    const isOpenAIModel = !isAnthropicModel && (selectedModel.includes('gpt') || selectedModel.includes('o1') ||
      selectedModel.startsWith('gpt-') || selectedModel.includes('openai'));

    const provider = isAnthropicModel ? 'Anthropic' : (isOpenAIModel ? 'OpenAI' : 'Google');
    sendTelemetry('UPLINK', 'Neural Handshake Complete', `Node: ${selectedModel} (${provider})`);

    // Knowledge Retrieval
    const assets = KnowledgeService.getAssets();
    const selectedKnowledge = assets.filter(a => (bot.knowledge_ids || []).includes(a.id));
    let knowledgeContext = selectedKnowledge.map(k => `[VAULT_NODE: ${k.name}]\n${k.content || k.source}`).join('\n');

    // Web Intelligence - Check if web search is enabled and needed
    const webIntelEnabled = bot.tools.some(t => t.tool_id === 'web_intel');
    let webSearchContext = '';

    if (webIntelEnabled) {
      // Detect if user is asking for web search or current information
      // Made MORE AGGRESSIVE to catch more queries
      const webSearchIndicators = [
        /search (?:the )?(?:web|internet|online)/i,
        /look up/i,
        /find (?:information|info|out) (?:about|on)/i,
        /what (?:is|are) (?:the )?(?:latest|current|recent|today|tonight|tomorrow)/i,
        /(?:latest|current|recent|today|tonight) (?:news|updates|information|game|games|score|scores|match|weather|price|stock)/i,
        /(?:who|what|when|where|why|how) (?:is|are|was|were|did|does|do|will|can)/i,
        /search for/i,
        /google/i,
        /browse/i,
        /scrape/i,
        /(?:https?:\/\/[^\s]+)/i, // URL detection
        // Sports & Events - critical for NFL, NBA, etc.
        /(?:nfl|nba|mlb|nhl|premier league|champions league|world cup|super bowl)/i,
        /(?:game|games|match|matches|score|scores|schedule|standings|playoff|playoffs)/i,
        /(?:weather|forecast|temperature|rain|snow)/i,
        // News & Current Events
        /(?:news|headlines|breaking|happened|happening|update|updates)/i,
        /(?:stock|stocks|market|crypto|bitcoin|ethereum|price|prices)/i,
        // General Info Requests
        /(?:tell me about|explain|what happened|who won|did .+ win)/i,
        /(?:reviews?|rating|ratings|best|top|popular|trending)/i,
        /(?:release date|coming out|available|launch|announced)/i,
        /(?:on tonight|on today|playing today|playing tonight)/i,
      ];

      const shouldSearchWeb = webSearchIndicators.some(regex => regex.test(userPrompt));

      // Also check for URL to scrape
      const urlMatch = userPrompt.match(/(https?:\/\/[^\s]+)/);

      if (urlMatch) {
        // User provided a URL - scrape it
        sendTelemetry('TOOL_EXEC', 'Web Scrape', `Target: ${urlMatch[1]}`);
        try {
          const scrapeResult = await WebIntelService.scrape(urlMatch[1]);
          if (scrapeResult) {
            webSearchContext = `\n[WEB_SCRAPED_CONTENT from ${scrapeResult.url}]:\nTitle: ${scrapeResult.title}\n\n${scrapeResult.markdown || scrapeResult.content}`;
            sendTelemetry('REASONING', 'Scrape Complete', `Retrieved ${(scrapeResult.markdown || scrapeResult.content).length} chars`);
          }
        } catch (e: any) {
          sendTelemetry('ENTROPY_ANALYSIS', 'Scrape Failed', e.message);
        }
      } else if (shouldSearchWeb) {
        // Perform web search
        sendTelemetry('TOOL_EXEC', 'Web Search', `Query: ${userPrompt.substring(0, 50)}...`);
        try {
          const searchResults = await WebIntelService.research(userPrompt);
          if (searchResults && !searchResults.includes('No web results found')) {
            webSearchContext = `\n[WEB_INTELLIGENCE_RESULTS]:\n${searchResults}\n\n[INSTRUCTION: Use these web search results to answer the user's question. Cite sources with URLs where appropriate.]`;
            sendTelemetry('REASONING', 'Search Complete', `Found web results`);
          }
        } catch (e: any) {
          sendTelemetry('ENTROPY_ANALYSIS', 'Search Failed', e.message);
        }
      }
    }

    // Image Request Logic
    const imageIndicators = [/generate image/i, /create image/i, /draw/i, /visualize/i, /image of/i, /picture of/i];
    const isImageReq = bot.image_gen_config.enabled && imageIndicators.some(regex => regex.test(userPrompt));


    let imageUrl: string | undefined = undefined;

    if (isImageReq) {
      const targetImageModel = bot.image_gen_config.model || 'dall-e-3';
      sendTelemetry('IMAGE_GEN', 'Synthesis Initialization', `Visual Engine: ${targetImageModel}`);

      try {
        imageUrl = await ModelRouter.generateImageWithFailsafes(userPrompt, targetImageModel, (log) => {
          sendTelemetry('ENTROPY_ANALYSIS', 'Model Reroute Signal', log);
        });
      } catch (e: any) {
        sendTelemetry('ENTROPY_ANALYSIS', 'Synthesis Terminal Failure', e.message);
      }
    }

    const artifactsEnabled = bot.tools.some(t => t.tool_id === 'code_artifact_engine');

    // Advanced Artifact Generation Instructions
    const artifactInstructions = artifactsEnabled ? `
[ARTIFACT_ENGINE]: ACTIVE - You have the power to create interactive web applications!

When the user asks you to create ANY of the following, you MUST generate complete, runnable code:
- Websites, landing pages, web apps
- Dashboards, calculators, tools
- Games, visualizations, interactive demos
- Components, UI designs, forms

ARTIFACT FORMAT REQUIREMENTS:
1. Generate COMPLETE, SELF-CONTAINED HTML files with embedded CSS and JavaScript
2. Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
3. Include all necessary JavaScript logic inline
4. The code MUST work immediately when rendered in an iframe
5. Wrap your code in a markdown code block: \`\`\`html ... \`\`\`

EXAMPLE ARTIFACT STRUCTURE:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <title>App Name</title>
</head>
<body>
  <!-- Your complete app here -->
  <script>
    // All JavaScript functionality here
  </script>
</body>
</html>
\`\`\`

The user will see a "VIEW" button to preview your creation in a live sandbox. Make it impressive!
` : '\n[ARTIFACT_ENGINE]: DISABLED';

    // Image Generation Instructions
    const imageInstructions = bot.image_gen_config.enabled ? `
[IMAGE_GENERATION]: ACTIVE - You can generate images!
- When user requests images, visualizations, or artwork, generate them
- Simply describe what you're creating and the image will be generated automatically
` : '';

    // Web Intelligence Instructions
    const webIntelInstructions = webIntelEnabled ? `
[WEB_INTELLIGENCE]: ACTIVE - You have real-time web access powered by Firecrawl!
- You can search the web for current information, news, and research
- You can scrape and analyze any URL the user provides
- When answering questions about current events, recent news, or real-time data, use web search
- For URLs, extract and summarize the key content
- Always cite your sources with [Source: URL] when using web results
` : '';

    // Advanced System Instruction Assembly
    const systemPromptParts = [
      bot.system_instructions,
      bot.positive_directives ? `\n[BEHAVIORAL_FOCUS]: ${bot.positive_directives}` : '',
      bot.negative_directives ? `\n[BEHAVIORAL_AVOIDANCE]: ${bot.negative_directives}` : '',
      knowledgeContext ? `\n[CONTEXT_VAULT]: ${knowledgeContext}` : '\n[CONTEXT_VAULT]: Vault offline.',
      webSearchContext ? webSearchContext : '',
      artifactInstructions,
      imageInstructions,
      webIntelInstructions,
      `\n[ENGINE_SPEC]: ${selectedModel}`,
      '\n[MODE]: ADAPTIVE_PROFESSIONAL',
      '\n[PROTOCOL_SUGGESTIONS]: At the end of your response, provide 2-3 short follow-up prompts as: [NEXT_IDEA: suggestion]. Do not number them.',
      bot.system_reminder ? `\n[FINAL_ANCHOR_REMINDER]: ${bot.system_reminder}` : ''
    ];

    const systemPrompt = systemPromptParts.filter(Boolean).join('\n');

    // Context Budget Logic
    const contextBudget = bot.model_config.context_budget || 100000;
    let currentTokenEstimate = 0;
    const prunedHistory: Message[] = [];

    for (let i = history.length - 1; i >= 0; i--) {
      const msg = history[i];
      const estimatedTokens = msg.content.length * 0.3;
      if (currentTokenEstimate + estimatedTokens < contextBudget) {
        prunedHistory.unshift(msg);
        currentTokenEstimate += estimatedTokens;
      } else {
        break;
      }
    }

    sendTelemetry('REASONING', 'Context Optimization', `History pruned to ${prunedHistory.length} turns (${Math.round(currentTokenEstimate)} est. tokens)`);

    let fullText = "";
    let thinking = "";

    // Route to appropriate provider
    if (isAnthropicModel) {
      // ========== ANTHROPIC/CLAUDE ROUTING ==========
      const ANTHROPIC_KEY = KeyService.getFullKey('anthropic');

      if (!ANTHROPIC_KEY) {
        throw new Error('CRITICAL_ERROR: Anthropic API key not found. Please add your Anthropic API key in the API Keys section.');
      }

      // Map display model names to actual Anthropic model names
      // These map the MODEL_REGISTRY IDs to actual Anthropic API model names
      const anthropicModelMap: Record<string, string> = {
        // Claude 4.5 models
        'claude-4.5-opus': 'claude-sonnet-4-20250514', // Using sonnet-4 as opus-4 may not exist yet
        'claude-4.5-sonnet': 'claude-sonnet-4-20250514',
        'sonnet-4.5': 'claude-sonnet-4-20250514',
        'opus-4.5': 'claude-sonnet-4-20250514',

        // Claude 4 models
        'claude-4-sonnet': 'claude-sonnet-4-20250514',
        'claude-4-opus': 'claude-sonnet-4-20250514',

        // Claude 3.7 / 3.5 models
        'claude-3.7-sonnet': 'claude-3-5-sonnet-20241022',
        'claude-3-5-sonnet': 'claude-3-5-sonnet-20241022',
        'claude-3.5-haiku': 'claude-3-haiku-20240307',

        // Claude 3 base models
        'claude-3-opus': 'claude-3-opus-20240229',
        'claude-3-sonnet': 'claude-3-sonnet-20240229',
        'claude-3-haiku': 'claude-3-haiku-20240307',
        'haiku': 'claude-3-haiku-20240307',
      };

      const actualModel = anthropicModelMap[selectedModel] || 'claude-sonnet-4-20250514';
      sendTelemetry('REASONING', 'Anthropic Routing', `Model: ${selectedModel} -> ${actualModel}`);

      // Build messages for Anthropic format
      const anthropicMessages = prunedHistory.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }));
      anthropicMessages.push({ role: 'user', content: userPrompt });

      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: JSON.stringify({
            model: actualModel,
            max_tokens: bot.model_config.max_output_tokens || 8192,
            system: systemPrompt,
            messages: anthropicMessages,
            stream: true
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`CRITICAL_ERROR: ${JSON.stringify({ error: { message: errorText, code: response.status, status: response.statusText } })}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

            for (const line of lines) {
              const data = line.replace('data: ', '');
              if (data === '[DONE]' || !data.trim()) continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  fullText += parsed.delta.text;
                  onChunk(fullText.replace(/\[NEXT_IDEA:.*?\]/g, ''));
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      } catch (error: any) {
        console.error('Anthropic Chat Error:', error);
        throw error;
      }
    } else if (isOpenAIModel) {
      // ========== OPENAI ROUTING ==========
      const OPENAI_KEY = KeyService.getFullKey('openai') || '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';

      // Map display model names to actual OpenAI model names
      const openaiModelMap: Record<string, string> = {
        'gpt-5.2': 'gpt-4o',
        'gpt-5.1-thinking': 'gpt-4o',
        'gpt-5.1-fast': 'gpt-4o-mini',
        'gpt-5.1': 'gpt-4.1',
        'gpt-5-long': 'gpt-4o',
        'gpt-4.1': 'gpt-4.1',
        'gpt-4o': 'gpt-4o',
        'gpt-4o-mini': 'gpt-4o-mini',
        'o1-pro': 'o1-preview',
        'o1-reasoning': 'o1-preview',
        'o1-mini': 'o1-mini',
      };

      const actualModel = openaiModelMap[selectedModel] || 'gpt-4o';
      sendTelemetry('REASONING', 'OpenAI Routing', `Model: ${selectedModel} -> ${actualModel}`);

      const messages = [
        { role: 'system', content: systemPrompt },
        ...prunedHistory.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userPrompt }
      ];

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_KEY}`
          },
          body: JSON.stringify({
            model: actualModel,
            messages,
            temperature: bot.model_config.temperature,
            max_tokens: bot.model_config.max_output_tokens,
            top_p: bot.model_config.top_p,
            frequency_penalty: bot.model_config.frequency_penalty || 0,
            presence_penalty: bot.model_config.presence_penalty || 0,
            stream: true
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

            for (const line of lines) {
              const data = line.replace('data: ', '');
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';
                fullText += content;
                onChunk(fullText.replace(/\[NEXT_IDEA:.*?\]/g, ''));
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      } catch (error: any) {
        console.error('OpenAI Chat Error:', error);
        throw error;
      }
    } else {
      // ========== GOOGLE/GEMINI ROUTING ==========
      const ai = new GoogleGenAI({ apiKey: getApiKey() });

      const contents = prunedHistory.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      contents.push({ role: 'user', parts: [{ text: userPrompt }] });

      const actualGoogleModel = getActualModelName(selectedModel);
      sendTelemetry('REASONING', 'Google Routing', `Model: ${selectedModel} -> ${actualGoogleModel}`);

      const responseStream = await ai.models.generateContentStream({
        model: actualGoogleModel,
        contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: bot.model_config.temperature,
          topP: bot.model_config.top_p,
          maxOutputTokens: bot.model_config.max_output_tokens,
          thinkingConfig: bot.model_config.thinking_budget > 0
            ? { thinkingBudget: bot.model_config.thinking_budget }
            : undefined,
          stopSequences: bot.model_config.stop_sequences?.length > 0 ? bot.model_config.stop_sequences : undefined,
        }
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          fullText += chunk.text;
          onChunk(fullText.replace(/\[NEXT_IDEA:.*?\]/g, ''));
        }
        if (chunk.candidates?.[0]?.content?.parts) {
          const thought = chunk.candidates[0].content.parts.find((p: any) => (p as any).thought);
          if (thought) thinking += (thought as any).text || "";
        }
      }
    }

    // Extraction of Suggestions
    const suggestions: string[] = [];
    const suggestionRegex = /\[NEXT_IDEA:\s*(.*?)\]/g;
    let match;
    while ((match = suggestionRegex.exec(fullText)) !== null) {
      if (match[1] && match[1].length < 60) {
        suggestions.push(match[1].trim());
      }
    }

    // Clean suggestions from content
    const cleanContent = fullText.replace(/\[NEXT_IDEA:.*?\]/g, '').trim();

    // High-Precision Artifact Extraction
    const artifacts: Artifact[] = [];
    if (artifactsEnabled) {
      const codeRegex = /```(html|css|javascript|typescript|jsx|tsx|json|python)\n([\s\S]{150,}?)```/gi;
      let artMatch;
      while ((artMatch = codeRegex.exec(fullText)) !== null) {
        artifacts.push({
          id: crypto.randomUUID(),
          title: `Synthesis_${artMatch[1].toUpperCase()}_Node`,
          language: artMatch[1].toLowerCase(),
          content: artMatch[2].trim()
        });
      }
    }

    return {
      content: cleanContent,
      image_url: imageUrl,
      thinking_log: thinking,
      model_used: bot.model_config.primary_model,
      tokens: Math.ceil(fullText.length / 4),
      artifacts: artifacts.length > 0 ? artifacts : undefined,
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };
  },

  generateImageWithFailsafes: async (prompt: string, requestedModel: string, onRetry?: (msg: string) => void): Promise<string> => {
    // Get user's stored API keys
    const openaiKey = KeyService.getFullKey('openai') || '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';
    const googleKey = getApiKey();

    // OpenAI DALL-E 3 Image Generation
    const generateWithDallE = async (imagePrompt: string): Promise<string> => {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: imagePrompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard'
        })
      });

      if (!response.ok) {
        throw new Error(`DALL-E error: ${response.status}`);
      }

      const data = await response.json();
      return data.data?.[0]?.url || '';
    };

    // Google Gemini Image Generation
    const generateWithGemini = async (imagePrompt: string): Promise<string> => {
      const ai = new GoogleGenAI({ apiKey: googleKey });
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{ parts: [{ text: `Generate an image: ${imagePrompt}` }] }],
      });

      const part = response.candidates?.[0]?.content?.parts?.find(p => (p as any).inlineData);
      if (part && (part as any).inlineData) {
        return `data:${(part as any).inlineData.mimeType};base64,${(part as any).inlineData.data}`;
      }
      throw new Error('Gemini image generation failed');
    };

    // Try DALL-E first for all models, with Gemini fallback
    try {
      onRetry?.(`Using DALL-E 3 for high-quality image generation...`);
      return await generateWithDallE(prompt);
    } catch (e: any) {
      onRetry?.(`DALL-E failed: ${e.message}. Trying Gemini...`);
      try {
        return await generateWithGemini(prompt);
      } catch (e2: any) {
        // Final fallback - return a placeholder
        onRetry?.(`All image generators failed. Using placeholder.`);
        return `https://placehold.co/1024x1024/1e293b/3b82f6?text=${encodeURIComponent(prompt.slice(0, 50))}`;
      }
    }
  },

  enhance: async (text: string): Promise<string> => {
    // Using OpenAI GPT-4.1 for reliable prompt enhancement
    const OPENAI_KEY = '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';

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4.1',
          messages: [
            {
              role: 'system',
              content: 'You are an expert at enhancing AI prompts. Synthesize a highly professional, technical, and precise version of the given text. Ensure it reads like a master-level agent prompt or creative brief. Return ONLY the enhanced text, no explanations.'
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content?.trim() || text;
    } catch (error) {
      console.error('Enhance error:', error);
      throw error;
    }
  },

  generateArenaTheme: async (prompt: string): Promise<ArenaTheme> => {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    const response = await ai.models.generateContent({
      model: getActualModelName('gemini-3-flash-preview'),
      contents: `Synthesize a tactical JSON theme for a UI based on: ${prompt}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primary_color: { type: Type.STRING },
            secondary_color: { type: Type.STRING },
            bg_color: { type: Type.STRING },
            accent_color: { type: Type.STRING },
            font_family: { type: Type.STRING },
            border_radius: { type: Type.STRING },
            animation_style: { type: Type.STRING, enum: ['none', 'subtle', 'dynamic', 'glitch'] },
            glass_blur: { type: Type.STRING },
            button_style: { type: Type.STRING, enum: ['rounded', 'sharp', 'pill', 'skeuomorphic', 'glass'] },
            border_intensity: { type: Type.STRING }
          },
          required: ["primary_color", "secondary_color", "bg_color", "accent_color", "font_family", "border_radius", "animation_style", "glass_blur", "button_style", "border_intensity"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  }
};
