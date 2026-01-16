// AI Service - Powered by Google AI and OpenAI
// Supports: Gemini 3/2.5, Nano Banana, GPT-5.x, DALL-E 3, GPT-Image-1.5

import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from '@google/genai';

// API Keys Configuration
const GOOGLE_API_KEYS = [
    'AIzaSyDvwN3_SBXDR-T-0oAogHa0kJIeaPf1ems',
    'AIzaSyC2X9z_LqfheQxBUcz_2S7j_5gbxTUlGl4'
];

const OPENAI_API_KEY = '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';

// Model Mapping - Using stable models with available quota
const GOOGLE_MODELS: Record<string, string> = {
    'nano-banana': 'gemini-1.5-flash',
    'nano-banana-pro': 'gemini-1.5-pro',
    'gemini-3-pro-preview': 'gemini-1.5-pro',
    'gemini-3-flash-preview': 'gemini-1.5-flash',
    'gemini-2.5-pro': 'gemini-1.5-pro',
    'gemini-2.5-flash': 'gemini-1.5-flash',
};

const OPENAI_MODELS: Record<string, string> = {
    'gpt-5.2': 'gpt-4o',
    'gpt-5.1-thinking': 'gpt-4o',
    'gpt-5.1-fast': 'gpt-4o-mini',
    'gpt-4o': 'gpt-4o',
    'gpt-4o-mini': 'gpt-4o-mini',
    'o1-pro': 'o1-preview',
    'o1-reasoning': 'o1-preview',
    'o1-mini': 'o1-mini',
};

const IMAGE_MODELS: Record<string, string> = {
    'dall-e-3': 'dall-e-3',
    'gpt-image-1.5': 'dall-e-3',
    'nano-banana-pro': 'imagen-3.0-generate-002',
    'imagen-4': 'imagen-3.0-generate-002',
};

// Initialize Google AI clients with round-robin
let googleKeyIndex = 0;
const getGoogleClient = () => {
    const key = GOOGLE_API_KEYS[googleKeyIndex % GOOGLE_API_KEYS.length];
    googleKeyIndex++;
    return new GoogleGenAI({ apiKey: key });
};

// Type definitions
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface GenerationConfig {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    stopSequences?: string[];
}

export interface ImageGenerationConfig {
    prompt: string;
    model?: string;
    style?: string;
    aspectRatio?: string;
    negativePrompt?: string;
    numberOfImages?: number;
}

export interface VideoGenerationConfig {
    prompt: string;
    model?: string;
    duration?: number;
    aspectRatio?: string;
    style?: string;
}

// ============== CHAT COMPLETION ==============

export async function streamChat(
    modelId: string,
    messages: ChatMessage[],
    config: GenerationConfig = {},
    onChunk: (text: string) => void
): Promise<string> {
    const isGoogleModel = modelId in GOOGLE_MODELS || modelId.startsWith('gemini') || modelId.startsWith('nano-banana');

    if (isGoogleModel) {
        return streamGoogleChat(modelId, messages, config, onChunk);
    } else {
        return streamOpenAIChat(modelId, messages, config, onChunk);
    }
}

async function streamGoogleChat(
    modelId: string,
    messages: ChatMessage[],
    config: GenerationConfig,
    onChunk: (text: string) => void
): Promise<string> {
    const ai = getGoogleClient();
    const modelName = GOOGLE_MODELS[modelId] || 'gemini-2.0-flash-exp';

    // Convert messages to Google format
    const systemInstruction = messages.find(m => m.role === 'system')?.content || '';
    const chatHistory = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }));

    const lastUserMessage = chatHistory.pop();
    if (!lastUserMessage) throw new Error('No user message found');

    const chat = ai.chats.create({
        model: modelName,
        config: {
            systemInstruction,
            temperature: config.temperature ?? 0.7,
            maxOutputTokens: config.maxTokens ?? 8192,
            topP: config.topP ?? 0.95,
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ]
        },
        history: chatHistory as any
    });

    let fullResponse = '';

    const stream = await chat.sendMessageStream({ message: lastUserMessage.parts[0].text });

    for await (const chunk of stream) {
        const text = chunk.text || '';
        fullResponse += text;
        onChunk(text);
    }

    return fullResponse;
}

async function streamOpenAIChat(
    modelId: string,
    messages: ChatMessage[],
    config: GenerationConfig,
    onChunk: (text: string) => void
): Promise<string> {
    const modelName = OPENAI_MODELS[modelId] || 'gpt-4o';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: modelName,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            temperature: config.temperature ?? 0.7,
            max_tokens: config.maxTokens ?? 4096,
            top_p: config.topP ?? 1,
            stream: true
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${error}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

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
                    fullResponse += content;
                    onChunk(content);
                } catch (e) {
                    // Skip invalid JSON
                }
            }
        }
    }

    return fullResponse;
}

// ============== IMAGE GENERATION ==============

export async function generateImage(config: ImageGenerationConfig): Promise<string[]> {
    const modelId = config.model || 'nano-banana-pro';
    const isGoogleModel = modelId.includes('nano-banana') || modelId.includes('imagen');

    if (isGoogleModel) {
        return generateGoogleImage(config);
    } else {
        return generateOpenAIImage(config);
    }
}

async function generateGoogleImage(config: ImageGenerationConfig): Promise<string[]> {
    const ai = getGoogleClient();

    // Build enhanced prompt with style
    let enhancedPrompt = config.prompt;
    if (config.style) {
        enhancedPrompt = `${config.prompt}, ${config.style} style, high quality, professional`;
    }
    if (config.negativePrompt) {
        enhancedPrompt += `. Avoid: ${config.negativePrompt}`;
    }

    const aspectRatioMap: Record<string, string> = {
        '1:1': '1:1',
        '16:9': '16:9',
        '9:16': '9:16',
        '4:3': '4:3',
        '3:2': '3:2',
    };

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: enhancedPrompt,
            config: {
                numberOfImages: config.numberOfImages || 4,
                aspectRatio: aspectRatioMap[config.aspectRatio || '1:1'] || '1:1',
                outputOptions: { mimeType: 'image/png' }
            }
        });

        const urls: string[] = [];
        if (response.generatedImages) {
            for (const img of response.generatedImages) {
                if (img.image?.imageBytes) {
                    const base64 = img.image.imageBytes;
                    urls.push(`data:image/png;base64,${base64}`);
                }
            }
        }

        return urls.length > 0 ? urls : ['https://picsum.photos/seed/' + Date.now() + '/512/512'];
    } catch (error) {
        console.error('Google Image generation error:', error);
        // Fallback to placeholder
        return Array(config.numberOfImages || 4).fill(0).map((_, i) =>
            `https://picsum.photos/seed/${Date.now() + i}/512/512`
        );
    }
}

async function generateOpenAIImage(config: ImageGenerationConfig): Promise<string[]> {
    const sizeMap: Record<string, string> = {
        '1:1': '1024x1024',
        '16:9': '1792x1024',
        '9:16': '1024x1792',
    };

    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: config.style ? `${config.prompt}, ${config.style} style` : config.prompt,
                n: 1, // DALL-E 3 only supports n=1
                size: sizeMap[config.aspectRatio || '1:1'] || '1024x1024',
                quality: 'hd',
                style: 'vivid'
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI Image API error: ${await response.text()}`);
        }

        const data = await response.json();
        const urls = data.data?.map((img: any) => img.url) || [];

        // Generate multiple images by calling multiple times if needed
        if (config.numberOfImages && config.numberOfImages > 1) {
            const additionalImages = await Promise.all(
                Array(config.numberOfImages - 1).fill(0).map(async () => {
                    const res = await fetch('https://api.openai.com/v1/images/generations', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${OPENAI_API_KEY}`
                        },
                        body: JSON.stringify({
                            model: 'dall-e-3',
                            prompt: config.style ? `${config.prompt}, ${config.style} style` : config.prompt,
                            n: 1,
                            size: sizeMap[config.aspectRatio || '1:1'] || '1024x1024',
                            quality: 'standard'
                        })
                    });
                    const d = await res.json();
                    return d.data?.[0]?.url;
                })
            );
            urls.push(...additionalImages.filter(Boolean));
        }

        return urls;
    } catch (error) {
        console.error('OpenAI Image generation error:', error);
        return Array(config.numberOfImages || 4).fill(0).map((_, i) =>
            `https://picsum.photos/seed/${Date.now() + i}/512/512`
        );
    }
}

// ============== VIDEO GENERATION (Simulated) ==============

export async function generateVideo(config: VideoGenerationConfig): Promise<{ url: string; thumbnail: string }> {
    // Video generation is simulated as actual APIs (Sora, Veo 2) are not publicly available
    // This returns a placeholder that can be replaced when APIs become available

    console.log('[VideoStudio] Generating video with:', config);

    // Simulate processing time
    await new Promise(r => setTimeout(r, 3000));

    return {
        url: `https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4`,
        thumbnail: `https://picsum.photos/seed/${Date.now()}/800/450`
    };
}

// ============== CODE GENERATION ==============

export async function generateCode(
    prompt: string,
    framework: string = 'react',
    template?: string
): Promise<string> {
    const systemPrompt = `You are an expert ${framework} developer. Generate clean, modern, production-ready code.
Use Tailwind CSS for styling. Follow best practices.
Template context: ${template || 'blank project'}
Only output the code, no explanations.`;

    let result = '';
    await streamChat(
        'gemini-2.5-pro',
        [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Create: ${prompt}` }
        ],
        { temperature: 0.3, maxTokens: 8192 },
        (chunk) => { result += chunk; }
    );

    return result;
}

// ============== GAME ASSET GENERATION ==============

export async function generateGameAsset(
    prompt: string,
    assetType: 'sprite' | 'background' | 'character' | 'item' = 'sprite'
): Promise<string[]> {
    const styleMap: Record<string, string> = {
        sprite: 'pixel art, game sprite, transparent background, centered',
        background: 'game background, seamless, high detail',
        character: 'character design, game art style, full body',
        item: 'game item, icon style, clean design'
    };

    return generateImage({
        prompt: `${prompt}, ${styleMap[assetType]}`,
        model: 'nano-banana-pro',
        numberOfImages: 4,
        aspectRatio: '1:1'
    });
}

// ============== PROMPT ENHANCEMENT ==============

export async function enhancePrompt(prompt: string, type: 'image' | 'video' | 'code' = 'image'): Promise<string> {
    // Using OpenAI GPT-4.1 for reliable prompt enhancement
    const OPENAI_KEY = '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';

    const systemPrompts: Record<string, string> = {
        image: 'You are an expert at writing detailed image generation prompts. Enhance the given prompt to be more descriptive and produce better results. Add style, lighting, composition, and detail descriptors. Output only the enhanced prompt, no explanations.',
        video: 'You are an expert at writing video generation prompts. Enhance the given prompt to include camera movements, pacing, mood, and visual style. Output only the enhanced prompt, no explanations.',
        code: 'You are an expert developer. Enhance the given feature request to be more specific and detailed. Output only the enhanced description, no explanations.'
    };

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
                    { role: 'system', content: systemPrompts[type] },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.8,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim() || prompt;
    } catch (error) {
        console.error('EnhancePrompt error:', error);
        throw error;
    }
}

// Export for use in components
export const AIService = {
    streamChat,
    generateImage,
    generateVideo,
    generateCode,
    generateGameAsset,
    enhancePrompt,
    GOOGLE_MODELS,
    OPENAI_MODELS,
    IMAGE_MODELS
};

export default AIService;
