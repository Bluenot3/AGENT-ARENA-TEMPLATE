import React, { useState, useEffect, useRef } from 'react';
import {
    Image, Wand2, Sparkles, Download, Share2, History, Layers,
    Palette, Grid, Maximize2, RotateCw, Zap, Settings, Play,
    ChevronRight, ArrowLeft, Heart, Copy, Trash2, Plus, Check,
    Sun, Moon, Contrast, Droplet, Crop, FlipHorizontal, FlipVertical,
    ZoomIn, ZoomOut, Move, Brush, Eraser, Type, Shapes, Pipette,
    Undo2, Redo2, Save, FolderOpen, Star, Clock, Filter, SlidersHorizontal,
    Loader2, AlertCircle, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IMAGE_STYLE_CHIPS } from '../constants';
import { AIService } from '../services/ai';

const ASPECT_RATIOS = [
    { label: '1:1', width: 1024, height: 1024, icon: '◻️' },
    { label: '16:9', width: 1920, height: 1080, icon: '🖥️' },
    { label: '9:16', width: 1080, height: 1920, icon: '📱' },
    { label: '4:3', width: 1024, height: 768, icon: '📺' },
    { label: '3:2', width: 1024, height: 683, icon: '📷' },
];

const IMAGE_MODELS = [
    { id: 'nano-banana-pro', name: 'Nano Banana Pro', provider: 'Google', badge: 'FLAGSHIP', color: '#fbbc04', desc: 'Creative & fast' },
    { id: 'nano-banana', name: 'Nano Banana', provider: 'Google', badge: 'FAST', color: '#fbbc04', desc: 'Quick generations' },
    { id: 'dall-e-3', name: 'DALL-E 3', provider: 'OpenAI', badge: 'QUALITY', color: '#10a37f', desc: 'Highest quality' },
    { id: 'gpt-image-1.5', name: 'GPT-Image 1.5', provider: 'OpenAI', badge: 'NEW', color: '#10a37f', desc: 'Latest OpenAI' },
    { id: 'imagen-4', name: 'Imagen 4 Ultra', provider: 'Google', badge: 'PRO', color: '#4285f4', desc: 'Photorealistic' },
];

interface GeneratedImage {
    id: string;
    url: string;
    prompt: string;
    style: string;
    model: string;
    timestamp: number;
}

export default function ImageStudio() {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [selectedModel, setSelectedModel] = useState('nano-banana-pro');
    const [selectedRatio, setSelectedRatio] = useState('1:1');
    const [selectedStyles, setSelectedStyles] = useState<string[]>(['Cinematic']);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [quality, setQuality] = useState(80);
    const [creativity, setCreativity] = useState(70);
    const [numberOfImages, setNumberOfImages] = useState(4);
    const [seed, setSeed] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const promptRef = useRef<HTMLTextAreaElement>(null);

    const toggleStyle = (style: string) => {
        setSelectedStyles(prev =>
            prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style].slice(0, 5)
        );
    };

    const handleEnhancePrompt = async () => {
        if (!prompt.trim()) return;
        setIsEnhancing(true);
        try {
            const enhanced = await AIService.enhancePrompt(prompt, 'image');
            setPrompt(enhanced);
            setSuccess('Prompt enhanced!');
            setTimeout(() => setSuccess(null), 2000);
        } catch (err) {
            setError('Failed to enhance prompt');
            setTimeout(() => setError(null), 3000);
        }
        setIsEnhancing(false);
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setError(null);

        try {
            const styleString = selectedStyles.join(', ');
            const urls = await AIService.generateImage({
                prompt,
                model: selectedModel,
                style: styleString,
                aspectRatio: selectedRatio,
                negativePrompt,
                numberOfImages
            });

            const newImages: GeneratedImage[] = urls.map((url, i) => ({
                id: `${Date.now()}-${i}`,
                url,
                prompt,
                style: styleString,
                model: selectedModel,
                timestamp: Date.now()
            }));

            setGeneratedImages(prev => [...newImages, ...prev]);
            setSelectedImage(newImages[0]);
            setSuccess(`Generated ${newImages.length} images!`);
            setTimeout(() => setSuccess(null), 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to generate images');
            setTimeout(() => setError(null), 5000);
        }

        setIsGenerating(false);
    };

    const handleDownload = async () => {
        if (!selectedImage) return;
        try {
            const response = await fetch(selectedImage.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `nexus-ai-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    const currentModel = IMAGE_MODELS.find(m => m.id === selectedModel);

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
            <header className="shrink-0 flex items-center justify-between mb-6 bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-xl p-5 rounded-[2rem] border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.1)]">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:scale-105"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)] animate-pulse">
                            <Image size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Image Studio</h1>
                            <p className="text-[10px] text-purple-300 font-bold uppercase tracking-[0.3em]">Powered by {currentModel?.name || 'AI'}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                        <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">Online</span>
                    </div>
                    <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:scale-105">
                        <History size={20} />
                    </button>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-3 rounded-xl transition-all hover:scale-105 ${showSettings ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
                    >
                        <SlidersHorizontal size={20} />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
                {/* Left Panel - Controls */}
                <div className="w-[420px] shrink-0 flex flex-col gap-5 overflow-y-auto custom-scrollbar pr-2">
                    {/* Prompt Input */}
                    <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/30 p-6 rounded-[2rem] border border-purple-500/20 space-y-5 shadow-[inset_0_0_40px_rgba(168,85,247,0.05)]">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Sparkles size={14} className="text-purple-400" />
                                Creative Prompt
                            </label>
                            <button
                                onClick={handleEnhancePrompt}
                                disabled={isEnhancing || !prompt.trim()}
                                className="text-[10px] font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider flex items-center gap-1 disabled:opacity-50 transition-all hover:scale-105"
                            >
                                {isEnhancing ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                                {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
                            </button>
                        </div>
                        <textarea
                            ref={promptRef}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your vision... e.g., 'A majestic dragon soaring through aurora-lit skies'"
                            className="w-full bg-black/50 border border-purple-500/30 rounded-2xl p-5 text-white text-sm placeholder:text-slate-500 resize-none h-32 focus:border-purple-400 focus:shadow-[0_0_20px_rgba(168,85,247,0.2)] outline-none transition-all"
                        />

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Negative Prompt (Optional)</label>
                            <input
                                value={negativePrompt}
                                onChange={(e) => setNegativePrompt(e.target.value)}
                                placeholder="blurry, low quality, distorted..."
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-sm placeholder:text-slate-600 focus:border-purple-500/50 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Model Selection */}
                    <div className="bg-gradient-to-br from-slate-900/80 to-amber-900/20 p-6 rounded-[2rem] border border-amber-500/20 space-y-5">
                        <label className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Zap size={14} className="text-amber-400" />
                            AI Model
                        </label>
                        <div className="space-y-3">
                            {IMAGE_MODELS.map(model => (
                                <button
                                    key={model.id}
                                    onClick={() => setSelectedModel(model.id)}
                                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group hover:scale-[1.02] ${selectedModel === model.id
                                            ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.2)]'
                                            : 'bg-black/30 border-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br" style={{ background: `linear-gradient(135deg, ${model.color}40, ${model.color}20)` }}>
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: model.color }} />
                                        </div>
                                        <div>
                                            <div className="text-[13px] font-black text-white uppercase tracking-tight">{model.name}</div>
                                            <div className="text-[9px] text-slate-500 font-medium">{model.desc}</div>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black px-2.5 py-1 rounded-lg text-white uppercase" style={{ backgroundColor: model.color + '40', color: model.color }}>{model.badge}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Aspect Ratio */}
                    <div className="bg-gradient-to-br from-slate-900/80 to-cyan-900/20 p-6 rounded-[2rem] border border-cyan-500/20 space-y-5">
                        <label className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Crop size={14} className="text-cyan-400" />
                            Aspect Ratio
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {ASPECT_RATIOS.map(ratio => (
                                <button
                                    key={ratio.label}
                                    onClick={() => setSelectedRatio(ratio.label)}
                                    className={`px-5 py-3 rounded-xl border text-[12px] font-black transition-all hover:scale-105 ${selectedRatio === ratio.label
                                            ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                                            : 'bg-black/30 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                                        }`}
                                >
                                    {ratio.icon} {ratio.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Style Chips */}
                    <div className="bg-gradient-to-br from-slate-900/80 to-pink-900/20 p-6 rounded-[2rem] border border-pink-500/20 space-y-5">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Palette size={14} className="text-pink-400" />
                                Style Modifiers
                            </label>
                            <span className="text-[10px] font-bold text-pink-400 bg-pink-500/20 px-2 py-1 rounded">{selectedStyles.length}/5</span>
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-[180px] overflow-y-auto custom-scrollbar">
                            {IMAGE_STYLE_CHIPS.map(style => (
                                <button
                                    key={style}
                                    onClick={() => toggleStyle(style)}
                                    className={`px-4 py-2 rounded-xl border text-[11px] font-bold transition-all hover:scale-105 ${selectedStyles.includes(style)
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                            : 'bg-black/30 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                                        }`}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Advanced Settings */}
                    {showSettings && (
                        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 p-6 rounded-[2rem] border border-white/10 space-y-6 animate-in slide-in-from-left duration-300">
                            <label className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Settings size={14} className="text-slate-400" />
                                Advanced Settings
                            </label>

                            <SliderControl label="Number of Images" value={numberOfImages} onChange={setNumberOfImages} max={8} min={1} />
                            <SliderControl label="Quality" value={quality} onChange={setQuality} max={100} />
                            <SliderControl label="Creativity" value={creativity} onChange={setCreativity} max={100} />

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Seed (Optional)</label>
                                <input
                                    value={seed}
                                    onChange={(e) => setSeed(e.target.value)}
                                    placeholder="Random"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm font-mono placeholder:text-slate-600 focus:border-purple-500/50 outline-none"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Center - Canvas / Preview */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 bg-gradient-to-br from-slate-900/50 to-purple-900/20 rounded-[3rem] border border-purple-500/20 overflow-hidden flex flex-col shadow-[inset_0_0_60px_rgba(168,85,247,0.05)]">
                        {/* Toolbar */}
                        <div className="shrink-0 flex items-center justify-between p-4 border-b border-white/5 bg-black/30">
                            <div className="flex items-center gap-2">
                                <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:scale-105">
                                    <ZoomOut size={18} />
                                </button>
                                <span className="text-[12px] font-bold text-slate-500 px-3 bg-white/5 py-1.5 rounded-lg">100%</span>
                                <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:scale-105">
                                    <ZoomIn size={18} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:scale-105">
                                    <Undo2 size={18} />
                                </button>
                                <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:scale-105">
                                    <Redo2 size={18} />
                                </button>
                                <div className="w-px h-6 bg-white/10 mx-2" />
                                <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:scale-105">
                                    <FlipHorizontal size={18} />
                                </button>
                                <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:scale-105">
                                    <FlipVertical size={18} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:scale-105">
                                    <Heart size={18} />
                                </button>
                                <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:scale-105">
                                    <Share2 size={18} />
                                </button>
                                <button
                                    onClick={handleDownload}
                                    disabled={!selectedImage}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] text-white font-bold text-[11px] uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 hover:scale-105"
                                >
                                    <Download size={16} /> Export
                                </button>
                            </div>
                        </div>

                        {/* Canvas Area */}
                        <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
                            {/* Animated Background Grid */}
                            <div className="absolute inset-0 opacity-10" style={{
                                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(168,85,247,0.3) 0%, transparent 50%)',
                            }} />

                            {isGenerating ? (
                                <div className="text-center relative z-10">
                                    <div className="w-36 h-36 mx-auto mb-8 relative">
                                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 animate-spin blur-2xl opacity-60" />
                                        <div className="absolute inset-2 rounded-[1.5rem] bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center animate-pulse">
                                            <Sparkles size={48} className="text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Creating Magic...</h3>
                                    <p className="text-sm text-slate-400 mb-2">Using {currentModel?.name}</p>
                                    <p className="text-xs text-slate-500">Generating {numberOfImages} images</p>
                                    <div className="mt-8 h-2 w-64 mx-auto bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 animate-progress rounded-full" />
                                    </div>
                                </div>
                            ) : selectedImage ? (
                                <div className="relative max-w-full max-h-full group">
                                    <img
                                        src={selectedImage.url}
                                        alt={selectedImage.prompt}
                                        className="max-w-full max-h-[55vh] rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.5)] border-2 border-white/10 transition-all group-hover:shadow-[0_0_80px_rgba(168,85,247,0.3)]"
                                    />
                                    <div className="absolute bottom-4 left-4 right-4 p-5 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-sm font-medium line-clamp-2">{selectedImage.prompt}</p>
                                        <div className="flex items-center gap-3 mt-3">
                                            <span className="text-[10px] font-black px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 uppercase">{selectedImage.style || 'Default'}</span>
                                            <span className="text-[10px] font-bold text-slate-500">{IMAGE_MODELS.find(m => m.id === selectedImage.model)?.name}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center relative z-10">
                                    <div className="w-40 h-40 mx-auto mb-8 rounded-[3rem] bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-orange-600/10 border-2 border-dashed border-purple-500/30 flex items-center justify-center animate-pulse">
                                        <Image size={56} className="text-purple-500/50" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-3">Ready to Create</h3>
                                    <p className="text-sm text-slate-500 max-w-sm mx-auto">Enter a prompt and let AI generate stunning images for you</p>
                                </div>
                            )}
                        </div>

                        {/* Generated Variations */}
                        {generatedImages.length > 0 && (
                            <div className="shrink-0 p-5 border-t border-white/5 bg-black/30">
                                <div className="flex items-center gap-4 overflow-x-auto custom-scrollbar pb-2">
                                    {generatedImages.slice(0, 12).map((img) => (
                                        <button
                                            key={img.id}
                                            onClick={() => setSelectedImage(img)}
                                            className={`shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all hover:scale-110 ${selectedImage?.id === img.id ? 'border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.5)]' : 'border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || isGenerating}
                        className={`mt-6 w-full py-6 rounded-[2rem] font-black text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-4 ${!prompt.trim() || isGenerating
                                ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white shadow-[0_0_60px_rgba(168,85,247,0.4)] hover:shadow-[0_0_100px_rgba(168,85,247,0.6)] hover:scale-[1.01] active:scale-[0.99]'
                            }`}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 size={26} className="animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles size={26} />
                                Generate {numberOfImages} Images
                                <ChevronRight size={26} />
                            </>
                        )}
                    </button>
                </div>

                {/* Right Panel - Gallery */}
                <div className="w-[280px] shrink-0 bg-gradient-to-b from-slate-900/80 to-purple-900/30 rounded-[2rem] border border-purple-500/20 flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-white/5 bg-black/30">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[12px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Layers size={14} className="text-purple-400" /> Gallery
                            </h3>
                            <span className="text-[10px] font-bold text-purple-400 bg-purple-500/20 px-2 py-1 rounded">{generatedImages.length}</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                        {generatedImages.length === 0 ? (
                            <div className="text-center py-12">
                                <Image size={40} className="mx-auto text-slate-600 mb-4" />
                                <p className="text-[11px] text-slate-500 font-medium">Your creations will appear here</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {generatedImages.map((img) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImage(img)}
                                        className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:scale-105 ${selectedImage?.id === img.id ? 'border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'border-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 4s ease-out;
        }
      `}</style>
        </div>
    );
}

function SliderControl({ label, value, onChange, max, min = 0 }: { label: string; value: number; onChange: (v: number) => void; max: number; min?: number }) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
                <span className="text-[11px] font-mono font-bold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded">{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-purple-500"
                style={{
                    background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(168 85 247) ${((value - min) / (max - min)) * 100}%, rgb(30 41 59) ${((value - min) / (max - min)) * 100}%, rgb(30 41 59) 100%)`
                }}
            />
        </div>
    );
}
