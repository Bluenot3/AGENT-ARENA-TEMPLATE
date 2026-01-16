import React, { useState } from 'react';
import {
    Gamepad2, Wand2, Sparkles, Download, Share2, Play, Pause,
    Box, Layers, Move, RotateCcw, Grid, Maximize2, Eye,
    ChevronRight, ArrowLeft, Copy, Trash2, Plus, Check,
    Zap, Settings, Code, Image, Music, Volume2, Square,
    Circle, Triangle, Hexagon, Star, Heart, Diamond, Target,
    Timer, Gauge, Trophy, Flag, Crosshair, Joystick, Sword,
    Shield, Flame, Droplet, Wind, Mountain, Trees, Sun, Moon,
    RefreshCw, Save, FolderOpen, FileCode, Palette, Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GAME_TEMPLATES = [
    { id: 'blank', name: 'Blank Project', desc: 'Start from scratch', icon: Box, color: 'from-slate-600 to-slate-700' },
    { id: 'platformer', name: '2D Platformer', desc: 'Side-scrolling action', icon: Joystick, color: 'from-blue-600 to-cyan-500' },
    { id: 'rpg', name: 'Top-Down RPG', desc: 'Adventure exploration', icon: Sword, color: 'from-purple-600 to-pink-500' },
    { id: 'puzzle', name: 'Puzzle Game', desc: 'Logic challenges', icon: Grid, color: 'from-emerald-600 to-teal-500' },
    { id: 'endless', name: 'Endless Runner', desc: 'Infinite gameplay', icon: Play, color: 'from-amber-600 to-orange-500' },
    { id: 'shooter', name: 'Space Shooter', desc: 'Arcade action', icon: Target, color: 'from-rose-600 to-red-500' },
];

const ASSET_TYPES = [
    { id: 'character', name: 'Characters', icon: Users, count: 12 },
    { id: 'enemy', name: 'Enemies', icon: Sword, count: 8 },
    { id: 'platform', name: 'Platforms', icon: Square, count: 24 },
    { id: 'item', name: 'Items', icon: Star, count: 16 },
    { id: 'background', name: 'Backgrounds', icon: Mountain, count: 6 },
    { id: 'effect', name: 'Effects', icon: Sparkles, count: 20 },
];

const SAMPLE_SPRITES = [
    { id: '1', url: 'https://picsum.photos/seed/sprite1/64/64', name: 'Hero' },
    { id: '2', url: 'https://picsum.photos/seed/sprite2/64/64', name: 'Enemy' },
    { id: '3', url: 'https://picsum.photos/seed/sprite3/64/64', name: 'Coin' },
    { id: '4', url: 'https://picsum.photos/seed/sprite4/64/64', name: 'Platform' },
    { id: '5', url: 'https://picsum.photos/seed/sprite5/64/64', name: 'Powerup' },
    { id: '6', url: 'https://picsum.photos/seed/sprite6/64/64', name: 'Boss' },
];

const PHYSICS_PRESETS = ['Platformer', 'Top-Down', 'Space', 'Puzzle', 'Custom'];

export default function GameLab() {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState<'scene' | 'assets' | 'logic' | 'preview'>('scene');
    const [selectedAssetType, setSelectedAssetType] = useState('character');
    const [generatedAssets, setGeneratedAssets] = useState<typeof SAMPLE_SPRITES>([]);
    const [showGrid, setShowGrid] = useState(true);
    const [physics, setPhysics] = useState('Platformer');
    const [isPlaying, setIsPlaying] = useState(false);

    const handleGenerateAsset = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);

        await new Promise(r => setTimeout(r, 2000));

        const newAsset = {
            id: Date.now().toString(),
            url: `https://picsum.photos/seed/${Date.now()}/64/64`,
            name: prompt.split(' ').slice(0, 2).join(' ')
        };

        setGeneratedAssets(prev => [newAsset, ...prev]);
        setPrompt('');
        setIsGenerating(false);
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-700 overflow-hidden">
            {/* Header */}
            <header className="shrink-0 flex items-center justify-between mb-6 bg-slate-900/40 backdrop-blur-xl p-5 rounded-[2rem] border border-white/5">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-yellow-500 flex items-center justify-center shadow-lg">
                            <Gamepad2 size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-tight">Game Lab</h1>
                            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-[0.3em]">AI Game Creation Engine</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl">
                        {['scene', 'assets', 'logic', 'preview'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`p-3 rounded-xl transition-all ${isPlaying ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>

                    <button className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-[12px] uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg">
                        <Download size={16} /> Export
                    </button>
                </div>
            </header>

            <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
                {/* Left Panel - Tools */}
                <div className="w-[320px] shrink-0 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
                    {/* Template Selection */}
                    {activeTab === 'scene' && (
                        <>
                            <div className="liquid-glass p-6 rounded-[2rem] border border-white/10 space-y-5">
                                <label className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <Layers size={14} className="text-amber-400" />
                                    Game Template
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {GAME_TEMPLATES.map(template => (
                                        <button
                                            key={template.id}
                                            onClick={() => setSelectedTemplate(selectedTemplate === template.id ? null : template.id)}
                                            className={`p-4 rounded-2xl border text-left transition-all ${selectedTemplate === template.id
                                                    ? 'bg-amber-600/20 border-amber-500 shadow-lg'
                                                    : 'bg-black/20 border-white/5 hover:border-white/20'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center mb-3`}>
                                                <template.icon size={20} className="text-white" />
                                            </div>
                                            <div className="text-[11px] font-black text-white uppercase tracking-tight truncate">{template.name}</div>
                                            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{template.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="liquid-glass p-6 rounded-[2rem] border border-white/10 space-y-5">
                                <label className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <Gauge size={14} className="text-cyan-400" />
                                    Physics Preset
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {PHYSICS_PRESETS.map(preset => (
                                        <button
                                            key={preset}
                                            onClick={() => setPhysics(preset)}
                                            className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${physics === preset
                                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500'
                                                    : 'bg-white/5 text-slate-400 border border-white/5 hover:text-white'
                                                }`}
                                        >
                                            {preset}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="liquid-glass p-6 rounded-[2rem] border border-white/10 space-y-5">
                                <label className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <Settings size={14} className="text-slate-400" />
                                    Scene Settings
                                </label>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Show Grid</span>
                                        <button
                                            onClick={() => setShowGrid(!showGrid)}
                                            className={`w-12 h-6 rounded-full p-1 transition-all ${showGrid ? 'bg-amber-500' : 'bg-slate-700'}`}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${showGrid ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gravity</span>
                                        <span className="text-[11px] font-mono font-bold text-amber-400">9.8</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">World Size</span>
                                        <span className="text-[11px] font-mono font-bold text-amber-400">1920×1080</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Asset Generator */}
                    {activeTab === 'assets' && (
                        <>
                            <div className="liquid-glass p-6 rounded-[2rem] border border-white/10 space-y-5">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                        <Wand2 size={14} className="text-purple-400" />
                                        Generate Asset
                                    </label>
                                </div>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe the game asset... e.g., 'pixel art knight with sword'"
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white text-sm placeholder:text-slate-600 resize-none h-28 focus:border-amber-500/50 outline-none transition-all"
                                />
                                <button
                                    onClick={handleGenerateAsset}
                                    disabled={!prompt.trim() || isGenerating}
                                    className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${!prompt.trim() || isGenerating
                                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]'
                                        }`}
                                >
                                    {isGenerating ? (
                                        <>
                                            <RefreshCw size={16} className="animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={16} />
                                            Generate Sprite
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="liquid-glass p-6 rounded-[2rem] border border-white/10 space-y-5">
                                <label className="text-[11px] font-black text-white uppercase tracking-widest">Asset Categories</label>
                                <div className="space-y-2">
                                    {ASSET_TYPES.map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => setSelectedAssetType(type.id)}
                                            className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${selectedAssetType === type.id
                                                    ? 'bg-amber-600/20 border border-amber-500'
                                                    : 'bg-black/20 border border-white/5 hover:border-white/20'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <type.icon size={18} className={selectedAssetType === type.id ? 'text-amber-400' : 'text-slate-500'} />
                                                <span className="text-[12px] font-bold text-white">{type.name}</span>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500">{type.count}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Logic Editor */}
                    {activeTab === 'logic' && (
                        <div className="liquid-glass p-6 rounded-[2rem] border border-white/10 space-y-5">
                            <label className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Code size={14} className="text-emerald-400" />
                                Game Logic
                            </label>
                            <div className="space-y-3">
                                {['Player Movement', 'Enemy AI', 'Collectibles', 'Score System', 'Level Complete'].map((logic, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
                                        <span className="text-[12px] font-bold text-white">{logic}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="text-[9px] font-bold text-emerald-400 uppercase">Active</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-slate-400 font-bold text-[11px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
                                <Plus size={16} /> Add Logic Block
                            </button>
                        </div>
                    )}
                </div>

                {/* Center - Game Canvas */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 liquid-glass rounded-[3rem] border border-white/10 overflow-hidden flex flex-col">
                        {/* Canvas Toolbar */}
                        <div className="shrink-0 flex items-center justify-between p-4 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg bg-amber-600/20 text-amber-400">
                                    <Move size={18} />
                                </button>
                                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                    <RotateCcw size={18} />
                                </button>
                                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                    <Square size={18} />
                                </button>
                                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                    <Circle size={18} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                    <Grid size={18} />
                                </button>
                                <span className="text-[12px] font-bold text-slate-500 px-3">100%</span>
                                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                    <Maximize2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Game Canvas */}
                        <div className="flex-1 bg-slate-950 relative overflow-hidden">
                            {/* Grid */}
                            {showGrid && (
                                <div
                                    className="absolute inset-0 opacity-10"
                                    style={{
                                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                                        backgroundSize: '32px 32px'
                                    }}
                                />
                            )}

                            {/* Sample Game Scene */}
                            <div className="absolute inset-0 flex items-end justify-center p-8">
                                {/* Ground */}
                                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-emerald-900/50 to-transparent" />

                                {/* Platforms */}
                                <div className="absolute bottom-20 left-1/4 w-32 h-4 bg-amber-600 rounded" />
                                <div className="absolute bottom-40 left-1/2 w-40 h-4 bg-amber-600 rounded" />
                                <div className="absolute bottom-60 right-1/4 w-28 h-4 bg-amber-600 rounded" />

                                {/* Player */}
                                <div className="absolute bottom-32 left-1/4 w-8 h-12 bg-blue-500 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.5)]" />

                                {/* Coins */}
                                <div className="absolute bottom-48 left-1/2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
                                <div className="absolute bottom-68 right-1/3 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />

                                {/* Enemy */}
                                <div className="absolute bottom-44 left-2/3 w-6 h-6 bg-rose-500 rounded shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                            </div>

                            {/* Playing indicator */}
                            {isPlaying && (
                                <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Playing</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Assets */}
                <div className="w-[280px] shrink-0 liquid-glass rounded-[2rem] border border-white/10 flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-white/5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[12px] font-black text-white uppercase tracking-widest">Sprites</h3>
                            <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                        <div className="grid grid-cols-3 gap-3">
                            {[...generatedAssets, ...SAMPLE_SPRITES].map((sprite) => (
                                <button
                                    key={sprite.id}
                                    className="aspect-square rounded-xl bg-slate-900 border border-white/5 hover:border-amber-500/50 transition-all overflow-hidden group relative"
                                >
                                    <img src={sprite.url} alt={sprite.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-1">
                                        <span className="text-[8px] font-bold text-white uppercase truncate px-1">{sprite.name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 border-t border-white/5">
                        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 text-white font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all">
                            <Wand2 size={14} /> Generate Assets
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
