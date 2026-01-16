import React, { useState } from 'react';
import {
    Sparkles, Wand2, Image, Palette, Grid, Layers, Settings,
    ChevronRight, ArrowLeft, Plus, Check, Save, Trash2, Eye,
    BarChart3, PenTool, Presentation, Target, Mountain, User,
    Loader2, AlertCircle, CheckCircle2, Copy, Zap, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BotService } from '../services/store';
import { IMAGE_STYLE_CHIPS, AESTHETIC_PRESETS } from '../constants';

// Image Agent Templates - Specialized for different image generation tasks
const IMAGE_AGENT_TEMPLATES = [
    {
        id: 'infographic-architect',
        name: 'Infographic Architect',
        description: 'Data visualization, charts, and professional infographics',
        icon: BarChart3,
        gradient: 'from-blue-600 via-cyan-500 to-teal-400',
        defaultStyles: ['Minimalist', 'Blueprint', 'Vector Art'],
        systemPrompt: 'You are a professional infographic designer. Create clean, data-driven visuals with excellent typography and clear visual hierarchy. Focus on communicating complex information simply.',
        aspectRatio: '9:16' as const,
        quality: 95,
    },
    {
        id: 'masterpiece-creator',
        name: 'Masterpiece Creator',
        description: 'High-art illustrations, detailed paintings, and fine art',
        icon: PenTool,
        gradient: 'from-purple-600 via-pink-500 to-rose-400',
        defaultStyles: ['Oil Painting', 'Hyper-Realistic', 'Cinematic'],
        systemPrompt: 'You are a master artist creating museum-quality pieces. Focus on composition, lighting, color harmony, and technical excellence. Every piece should be a masterwork.',
        aspectRatio: '1:1' as const,
        quality: 100,
    },
    {
        id: 'slide-designer',
        name: 'Slide Designer',
        description: 'Presentation slides, decks, and visual content layouts',
        icon: Presentation,
        gradient: 'from-emerald-600 via-green-500 to-lime-400',
        defaultStyles: ['Minimalist', 'Concept Photo', 'Architectural'],
        systemPrompt: 'You are a presentation design expert. Create visually stunning slide backgrounds, layouts, and graphics that enhance business communication. Focus on clarity and professional aesthetics.',
        aspectRatio: '16:9' as const,
        quality: 90,
    },
    {
        id: 'marketing-artist',
        name: 'Marketing Artist',
        description: 'Ads, banners, social media graphics, and promotional content',
        icon: Target,
        gradient: 'from-orange-600 via-amber-500 to-yellow-400',
        defaultStyles: ['Neon', 'Pop Art', 'Vaporwave'],
        systemPrompt: 'You are a marketing visual expert. Create eye-catching, scroll-stopping graphics that drive engagement. Focus on bold colors, clear CTAs, and brand-aligned aesthetics.',
        aspectRatio: '1:1' as const,
        quality: 90,
    },
    {
        id: 'concept-artist',
        name: 'Concept Artist',
        description: 'Environment design, world-building, and concept art',
        icon: Mountain,
        gradient: 'from-indigo-600 via-violet-500 to-purple-400',
        defaultStyles: ['Unreal Engine 5', 'Cinematic', 'Steampunk'],
        systemPrompt: 'You are a professional concept artist for games and films. Create immersive environments, fantastical worlds, and detailed concept pieces that tell stories through visual design.',
        aspectRatio: '16:9' as const,
        quality: 95,
    },
    {
        id: 'portrait-specialist',
        name: 'Portrait Specialist',
        description: 'Character portraits, headshots, and figure art',
        icon: User,
        gradient: 'from-rose-600 via-pink-500 to-fuchsia-400',
        defaultStyles: ['Photoreal', 'Cinematic', 'Anime'],
        systemPrompt: 'You are a portrait artist specializing in character design and portraiture. Focus on expression, lighting, composition, and capturing the essence of subjects.',
        aspectRatio: '3:2' as const,
        quality: 95,
    },
];

const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:2'] as const;
const IMAGE_MODELS = [
    { id: 'nano-banana-pro', name: 'Nano Banana Pro', provider: 'Google', badge: 'FLAGSHIP' },
    { id: 'dall-e-3', name: 'DALL-E 3', provider: 'OpenAI', badge: 'QUALITY' },
    { id: 'imagen-4', name: 'Imagen 4 Ultra', provider: 'Google', badge: 'PRO' },
];

interface ImageAgent {
    id: string;
    name: string;
    description: string;
    templateId: string;
    styles: string[];
    aspectRatio: typeof ASPECT_RATIOS[number];
    quality: number;
    model: string;
    customPrompt: string;
    createdAt: number;
}

export default function ImageAgentStudio() {
    const navigate = useNavigate();
    const [selectedTemplate, setSelectedTemplate] = useState<typeof IMAGE_AGENT_TEMPLATES[0] | null>(null);
    const [agentName, setAgentName] = useState('');
    const [agentDescription, setAgentDescription] = useState('');
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
    const [aspectRatio, setAspectRatio] = useState<typeof ASPECT_RATIOS[number]>('1:1');
    const [quality, setQuality] = useState(90);
    const [selectedModel, setSelectedModel] = useState('nano-banana-pro');
    const [customPrompt, setCustomPrompt] = useState('');
    const [savedAgents, setSavedAgents] = useState<ImageAgent[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState(false);

    const selectTemplate = (template: typeof IMAGE_AGENT_TEMPLATES[0]) => {
        setSelectedTemplate(template);
        setAgentName(template.name);
        setAgentDescription(template.description);
        setSelectedStyles(template.defaultStyles);
        setAspectRatio(template.aspectRatio);
        setQuality(template.quality);
        setCustomPrompt(template.systemPrompt);
    };

    const toggleStyle = (style: string) => {
        setSelectedStyles(prev =>
            prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style].slice(0, 5)
        );
    };

    const handleSaveAgent = async () => {
        if (!agentName.trim() || !selectedTemplate) return;
        setIsSaving(true);

        // Simulate save delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const newAgent: ImageAgent = {
            id: Date.now().toString(),
            name: agentName,
            description: agentDescription,
            templateId: selectedTemplate.id,
            styles: selectedStyles,
            aspectRatio,
            quality,
            model: selectedModel,
            customPrompt,
            createdAt: Date.now(),
        };

        setSavedAgents(prev => [newAgent, ...prev]);
        setSuccess(`${agentName} agent created successfully!`);
        setTimeout(() => setSuccess(null), 3000);
        setIsSaving(false);

        // Reset form
        setSelectedTemplate(null);
        setAgentName('');
        setAgentDescription('');
        setSelectedStyles([]);
        setCustomPrompt('');
    };

    const deleteAgent = (id: string) => {
        setSavedAgents(prev => prev.filter(a => a.id !== id));
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-700 overflow-hidden">
            {/* Notification Toast */}
            {(error || success) && (
                <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 ${error ? 'bg-red-500/90 text-white' : 'bg-emerald-500/90 text-white'
                    }`}>
                    {error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    <span className="font-bold text-sm">{error || success}</span>
                </div>
            )}

            {/* Header */}
            <header className="shrink-0 flex items-center justify-between mb-6 bg-gradient-to-r from-rose-900/40 via-orange-900/40 to-amber-900/40 backdrop-blur-xl p-5 rounded-[2rem] border border-rose-500/20 shadow-[0_0_40px_rgba(251,146,60,0.1)]">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:scale-105"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-[0_0_30px_rgba(251,146,60,0.5)] animate-pulse">
                            <Sparkles size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-tight bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">Image Agent Studio</h1>
                            <p className="text-[10px] text-orange-300 font-bold uppercase tracking-[0.3em]">Create Specialized Image Generators</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                        <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">Ready</span>
                    </div>
                    <div className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                        <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider">{savedAgents.length} Agents</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
                {/* Left Panel - Template Selection */}
                <div className="w-[350px] shrink-0 flex flex-col gap-5 overflow-y-auto custom-scrollbar pr-2">
                    {/* Template Cards */}
                    <div className="bg-gradient-to-br from-slate-900/80 to-rose-900/20 p-6 rounded-[2rem] border border-rose-500/20 space-y-5">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Layers size={14} className="text-rose-400" />
                                Agent Templates
                            </label>
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/20 px-2 py-1 rounded">{IMAGE_AGENT_TEMPLATES.length}</span>
                        </div>

                        <div className="space-y-3">
                            {IMAGE_AGENT_TEMPLATES.map(template => {
                                const IconComponent = template.icon;
                                const isSelected = selectedTemplate?.id === template.id;
                                return (
                                    <button
                                        key={template.id}
                                        onClick={() => selectTemplate(template)}
                                        className={`w-full p-4 rounded-2xl border text-left transition-all group hover:scale-[1.01] ${isSelected
                                            ? 'bg-gradient-to-r from-rose-600/30 to-orange-600/30 border-rose-400 shadow-[0_0_30px_rgba(251,113,133,0.2)]'
                                            : 'bg-black/30 border-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.gradient} flex items-center justify-center shadow-lg`}>
                                                <IconComponent size={22} className="text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[12px] font-black text-white uppercase tracking-tight truncate">{template.name}</div>
                                                <div className="text-[9px] text-slate-500 font-medium line-clamp-1">{template.description}</div>
                                            </div>
                                            {isSelected && (
                                                <Check size={18} className="text-rose-400 shrink-0" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Saved Agents */}
                    {savedAgents.length > 0 && (
                        <div className="bg-gradient-to-br from-slate-900/80 to-emerald-900/20 p-6 rounded-[2rem] border border-emerald-500/20 space-y-5">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <Star size={14} className="text-emerald-400" />
                                    Your Agents
                                </label>
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded">{savedAgents.length}</span>
                            </div>

                            <div className="space-y-2">
                                {savedAgents.map(agent => (
                                    <div
                                        key={agent.id}
                                        className="p-4 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between group"
                                    >
                                        <div>
                                            <div className="text-[11px] font-black text-white uppercase tracking-tight">{agent.name}</div>
                                            <div className="text-[9px] text-slate-500">{agent.styles.slice(0, 2).join(', ')}</div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                onClick={() => deleteAgent(agent.id)}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Center - Configuration Panel */}
                <div className="flex-1 flex flex-col min-w-0">
                    {selectedTemplate ? (
                        <div className="flex-1 bg-gradient-to-br from-slate-900/50 to-rose-900/20 rounded-[3rem] border border-rose-500/20 overflow-hidden flex flex-col shadow-[inset_0_0_60px_rgba(251,113,133,0.05)]">
                            {/* Config Header */}
                            <div className="shrink-0 p-6 border-b border-white/5 bg-black/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedTemplate.gradient} flex items-center justify-center shadow-lg`}>
                                            <selectedTemplate.icon size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-black text-white uppercase tracking-tight">Configure Agent</h2>
                                            <p className="text-[10px] text-slate-500">Based on {selectedTemplate.name} template</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setPreviewMode(!previewMode)}
                                        className={`px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center gap-2 ${previewMode
                                            ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white'
                                            : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <Eye size={16} />
                                        Preview
                                    </button>
                                </div>
                            </div>

                            {/* Config Body */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                                {/* Name & Description */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Agent Name</label>
                                        <input
                                            type="text"
                                            value={agentName}
                                            onChange={(e) => setAgentName(e.target.value)}
                                            className="w-full bg-black/50 border border-rose-500/30 rounded-xl p-4 text-white text-sm font-bold placeholder:text-slate-600 focus:border-rose-400 focus:shadow-[0_0_20px_rgba(251,113,133,0.2)] outline-none transition-all"
                                            placeholder="My Custom Agent"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</label>
                                        <input
                                            type="text"
                                            value={agentDescription}
                                            onChange={(e) => setAgentDescription(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-sm placeholder:text-slate-600 focus:border-rose-500/50 outline-none transition-all"
                                            placeholder="What this agent creates..."
                                        />
                                    </div>
                                </div>

                                {/* Model Selection */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Zap size={12} className="text-amber-400" />
                                        AI Model
                                    </label>
                                    <div className="flex gap-3">
                                        {IMAGE_MODELS.map(model => (
                                            <button
                                                key={model.id}
                                                onClick={() => setSelectedModel(model.id)}
                                                className={`flex-1 p-4 rounded-xl border transition-all ${selectedModel === model.id
                                                    ? 'bg-gradient-to-r from-rose-600/30 to-orange-600/30 border-rose-400'
                                                    : 'bg-black/30 border-white/5 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="text-[11px] font-black text-white uppercase">{model.name}</div>
                                                <div className="text-[9px] text-slate-500">{model.provider}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Aspect Ratio & Quality */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aspect Ratio</label>
                                        <div className="flex flex-wrap gap-2">
                                            {ASPECT_RATIOS.map(ratio => (
                                                <button
                                                    key={ratio}
                                                    onClick={() => setAspectRatio(ratio)}
                                                    className={`px-4 py-2 rounded-lg border text-[11px] font-bold transition-all ${aspectRatio === ratio
                                                        ? 'bg-gradient-to-r from-rose-600 to-orange-600 border-rose-400 text-white'
                                                        : 'bg-black/30 border-white/5 text-slate-400 hover:border-white/20'
                                                        }`}
                                                >
                                                    {ratio}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quality</label>
                                            <span className="text-[11px] font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded">{quality}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={50}
                                            max={100}
                                            value={quality}
                                            onChange={(e) => setQuality(parseInt(e.target.value))}
                                            className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer"
                                            style={{
                                                background: `linear-gradient(to right, rgb(251 113 133) 0%, rgb(251 113 133) ${(quality - 50) * 2}%, rgb(30 41 59) ${(quality - 50) * 2}%, rgb(30 41 59) 100%)`
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Style Chips */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Palette size={12} className="text-pink-400" />
                                            Default Styles
                                        </label>
                                        <span className="text-[10px] font-bold text-pink-400 bg-pink-500/20 px-2 py-1 rounded">{selectedStyles.length}/5</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto custom-scrollbar">
                                        {IMAGE_STYLE_CHIPS.map(style => (
                                            <button
                                                key={style}
                                                onClick={() => toggleStyle(style)}
                                                className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all hover:scale-105 ${selectedStyles.includes(style)
                                                    ? 'bg-gradient-to-r from-rose-600 to-orange-600 border-rose-400 text-white shadow-[0_0_15px_rgba(251,113,133,0.4)]'
                                                    : 'bg-black/30 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                                                    }`}
                                            >
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Custom System Prompt */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Wand2 size={12} className="text-purple-400" />
                                        Agent Instructions
                                    </label>
                                    <textarea
                                        value={customPrompt}
                                        onChange={(e) => setCustomPrompt(e.target.value)}
                                        placeholder="Custom instructions for how this agent should generate images..."
                                        className="w-full bg-black/50 border border-purple-500/30 rounded-xl p-4 text-white text-sm placeholder:text-slate-600 resize-none h-28 focus:border-purple-400 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="shrink-0 p-6 border-t border-white/5 bg-black/30">
                                <button
                                    onClick={handleSaveAgent}
                                    disabled={!agentName.trim() || isSaving}
                                    className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-4 ${!agentName.trim() || isSaving
                                        ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 text-white shadow-[0_0_60px_rgba(251,146,60,0.4)] hover:shadow-[0_0_100px_rgba(251,146,60,0.6)] hover:scale-[1.01] active:scale-[0.99]'
                                        }`}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={24} className="animate-spin" />
                                            Creating Agent...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={24} />
                                            Create Image Agent
                                            <ChevronRight size={24} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 bg-gradient-to-br from-slate-900/50 to-rose-900/20 rounded-[3rem] border border-rose-500/20 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-32 h-32 mx-auto mb-8 rounded-[3rem] bg-gradient-to-br from-rose-600/10 via-orange-600/10 to-amber-600/10 border-2 border-dashed border-rose-500/30 flex items-center justify-center animate-pulse">
                                    <Sparkles size={48} className="text-rose-500/50" />
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-3">Select a Template</h3>
                                <p className="text-sm text-slate-500 max-w-sm mx-auto">Choose an agent template from the left to start building your specialized image generator</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel - Preview */}
                <div className="w-[280px] shrink-0 bg-gradient-to-b from-slate-900/80 to-rose-900/30 rounded-[2rem] border border-rose-500/20 flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-white/5 bg-black/30">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[12px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Image size={14} className="text-rose-400" />
                                Style Preview
                            </h3>
                        </div>
                    </div>

                    <div className="flex-1 p-5 space-y-4 overflow-y-auto custom-scrollbar">
                        {selectedStyles.length > 0 ? (
                            selectedStyles.map((style, index) => (
                                <div
                                    key={style}
                                    className="aspect-video rounded-2xl border border-white/10 overflow-hidden relative group"
                                    style={{
                                        background: `linear-gradient(135deg, hsl(${index * 60}, 70%, 20%), hsl(${index * 60 + 30}, 60%, 10%))`
                                    }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-[11px] font-black text-white/60 uppercase tracking-widest">{style}</span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <Palette size={40} className="mx-auto text-slate-600 mb-4" />
                                <p className="text-[11px] text-slate-500 font-medium">Select styles to preview</p>
                            </div>
                        )}
                    </div>

                    {selectedTemplate && (
                        <div className="p-5 border-t border-white/5 bg-black/30">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedTemplate.gradient} flex items-center justify-center`}>
                                    <selectedTemplate.icon size={16} className="text-white" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-white uppercase">{agentName || selectedTemplate.name}</div>
                                    <div className="text-[8px] text-slate-500">{aspectRatio} • {quality}% quality</div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {selectedStyles.slice(0, 3).map(style => (
                                    <span key={style} className="text-[8px] font-bold px-2 py-1 rounded bg-rose-500/20 text-rose-400">
                                        {style}
                                    </span>
                                ))}
                                {selectedStyles.length > 3 && (
                                    <span className="text-[8px] font-bold px-2 py-1 rounded bg-white/10 text-slate-400">
                                        +{selectedStyles.length - 3}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
