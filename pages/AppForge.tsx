import React, { useState, useEffect } from 'react';
import {
    Code, Wand2, Sparkles, Download, Share2, Play, Pause,
    Terminal, Layout, Smartphone, Monitor, Tablet, Globe,
    ChevronRight, ArrowLeft, Copy, Trash2, Plus, Check,
    FileCode, Box, Layers, Package, Zap, Settings, Eye,
    RefreshCw, ExternalLink, Save, FolderOpen, Star, Clock,
    Cpu, Database, Server, Cloud, Rocket, Component, Grid3X3,
    Palette, Type, Image, Video, Music, File, Folder
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const APP_TEMPLATES = [
    { id: 'blank', name: 'Blank Canvas', desc: 'Start from scratch', icon: Box, color: 'from-slate-600 to-slate-700' },
    { id: 'landing', name: 'Landing Page', desc: 'Marketing website', icon: Globe, color: 'from-blue-600 to-cyan-500' },
    { id: 'dashboard', name: 'Dashboard', desc: 'Admin panel', icon: Layout, color: 'from-purple-600 to-pink-500' },
    { id: 'ecommerce', name: 'E-Commerce', desc: 'Online store', icon: Package, color: 'from-emerald-600 to-teal-500' },
    { id: 'blog', name: 'Blog/CMS', desc: 'Content site', icon: FileCode, color: 'from-amber-600 to-orange-500' },
    { id: 'saas', name: 'SaaS App', desc: 'Web application', icon: Cloud, color: 'from-indigo-600 to-violet-500' },
];

const FRAMEWORKS = [
    { id: 'react', name: 'React', icon: '⚛️', color: '#61dafb' },
    { id: 'vue', name: 'Vue', icon: '💚', color: '#42b883' },
    { id: 'svelte', name: 'Svelte', icon: '🔥', color: '#ff3e00' },
    { id: 'nextjs', name: 'Next.js', icon: '▲', color: '#ffffff' },
    { id: 'html', name: 'HTML/CSS', icon: '🌐', color: '#e34f26' },
];

const COMPONENTS = [
    { id: 'navbar', name: 'Navigation', icon: Layout },
    { id: 'hero', name: 'Hero Section', icon: Sparkles },
    { id: 'features', name: 'Features Grid', icon: Grid3X3 },
    { id: 'pricing', name: 'Pricing Table', icon: Package },
    { id: 'testimonials', name: 'Testimonials', icon: Star },
    { id: 'footer', name: 'Footer', icon: Layers },
    { id: 'form', name: 'Contact Form', icon: FileCode },
    { id: 'gallery', name: 'Image Gallery', icon: Image },
];

const SAMPLE_CODE = `import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">My App</h1>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg">
          Get Started
        </button>
      </nav>
      
      <main className="container mx-auto px-6 py-20">
        <h2 className="text-5xl font-bold text-white mb-6">
          Welcome to the Future
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl">
          Build amazing apps with AI-powered code generation.
        </p>
      </main>
    </div>
  );
}`;

export default function AppForge() {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [selectedFramework, setSelectedFramework] = useState('react');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedCode, setGeneratedCode] = useState(SAMPLE_CODE);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [activeTab, setActiveTab] = useState<'code' | 'preview'>('preview');
    const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

    const handleGenerate = async () => {
        if (!prompt.trim() && !selectedTemplate) return;
        setIsGenerating(true);

        // Simulate code generation
        await new Promise(r => setTimeout(r, 3000));

        setGeneratedCode(SAMPLE_CODE);
        setActiveTab('preview');
        setIsGenerating(false);
    };

    const toggleComponent = (id: string) => {
        setSelectedComponents(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
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
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg">
                            <Code size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-tight">App Forge</h1>
                            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.3em]">AI Code Generation Engine</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                        {FRAMEWORKS.map(fw => (
                            <button
                                key={fw.id}
                                onClick={() => setSelectedFramework(fw.id)}
                                className={`px-4 py-2 rounded-lg text-[11px] font-bold transition-all ${selectedFramework === fw.id
                                        ? 'bg-emerald-600 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {fw.icon} {fw.name}
                            </button>
                        ))}
                    </div>

                    <button className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[12px] uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg">
                        <Rocket size={16} /> Deploy
                    </button>
                </div>
            </header>

            <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
                {/* Left Panel - Builder */}
                <div className="w-[380px] shrink-0 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
                    {/* Prompt Input */}
                    <div className="liquid-glass p-6 rounded-[2rem] border border-white/10 space-y-5">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Wand2 size={14} className="text-emerald-400" />
                                Describe Your App
                            </label>
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe the app you want to build... e.g., 'A modern SaaS landing page with pricing table and testimonials'"
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white text-sm placeholder:text-slate-600 resize-none h-36 focus:border-emerald-500/50 outline-none transition-all"
                        />
                    </div>

                    {/* Templates */}
                    <div className="liquid-glass p-6 rounded-[2rem] border border-white/10 space-y-5">
                        <label className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Layout size={14} className="text-cyan-400" />
                            Start with Template
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {APP_TEMPLATES.map(template => (
                                <button
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(selectedTemplate === template.id ? null : template.id)}
                                    className={`p-4 rounded-2xl border text-left transition-all ${selectedTemplate === template.id
                                            ? 'bg-emerald-600/20 border-emerald-500 shadow-lg'
                                            : 'bg-black/20 border-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center mb-3`}>
                                        <template.icon size={20} className="text-white" />
                                    </div>
                                    <div className="text-[12px] font-black text-white uppercase tracking-tight">{template.name}</div>
                                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{template.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Components */}
                    <div className="liquid-glass p-6 rounded-[2rem] border border-white/10 space-y-5">
                        <label className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Component size={14} className="text-purple-400" />
                            Add Components
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {COMPONENTS.map(comp => (
                                <button
                                    key={comp.id}
                                    onClick={() => toggleComponent(comp.id)}
                                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${selectedComponents.includes(comp.id)
                                            ? 'bg-purple-600/20 border-purple-500'
                                            : 'bg-black/20 border-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <comp.icon size={18} className={selectedComponents.includes(comp.id) ? 'text-purple-400' : 'text-slate-500'} />
                                    <span className="text-[11px] font-bold text-white">{comp.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className={`w-full py-6 rounded-[2rem] font-black text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-4 ${isGenerating
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-[0_0_60px_rgba(16,185,129,0.4)] hover:shadow-[0_0_80px_rgba(16,185,129,0.6)] active:scale-[0.99]'
                            }`}
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw size={24} className="animate-spin" />
                                Generating App...
                            </>
                        ) : (
                            <>
                                <Zap size={24} />
                                Generate App
                                <ChevronRight size={24} />
                            </>
                        )}
                    </button>
                </div>

                {/* Center - Code/Preview */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 liquid-glass rounded-[3rem] border border-white/10 overflow-hidden flex flex-col">
                        {/* Tabs & Controls */}
                        <div className="shrink-0 flex items-center justify-between p-4 border-b border-white/5">
                            <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl">
                                <button
                                    onClick={() => setActiveTab('preview')}
                                    className={`px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'preview' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    <Eye size={14} /> Preview
                                </button>
                                <button
                                    onClick={() => setActiveTab('code')}
                                    className={`px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'code' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    <Terminal size={14} /> Code
                                </button>
                            </div>

                            {activeTab === 'preview' && (
                                <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl">
                                    <button
                                        onClick={() => setPreviewMode('desktop')}
                                        className={`p-2 rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        <Monitor size={18} />
                                    </button>
                                    <button
                                        onClick={() => setPreviewMode('tablet')}
                                        className={`p-2 rounded-lg transition-all ${previewMode === 'tablet' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        <Tablet size={18} />
                                    </button>
                                    <button
                                        onClick={() => setPreviewMode('mobile')}
                                        className={`p-2 rounded-lg transition-all ${previewMode === 'mobile' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        <Smartphone size={18} />
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                    <RefreshCw size={18} />
                                </button>
                                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                    <Copy size={18} />
                                </button>
                                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                    <Download size={18} />
                                </button>
                                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                    <ExternalLink size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-hidden bg-black/40 relative">
                            {isGenerating ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-28 h-28 mx-auto mb-8 relative">
                                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-500 animate-spin blur-xl opacity-50" />
                                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center justify-center">
                                                <Code size={40} className="text-white animate-pulse" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-widest mb-3">Generating Code...</h3>
                                        <p className="text-sm text-slate-500">Building your application</p>
                                    </div>
                                </div>
                            ) : activeTab === 'preview' ? (
                                <div className="h-full flex items-center justify-center p-8">
                                    <div
                                        className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${previewMode === 'desktop' ? 'w-full h-full' :
                                                previewMode === 'tablet' ? 'w-[768px] h-full' :
                                                    'w-[375px] h-full'
                                            }`}
                                    >
                                        <div className="h-full bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
                                            <nav className="p-6 flex justify-between items-center border-b border-white/10">
                                                <h1 className="text-xl font-bold text-white">My App</h1>
                                                <button className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">
                                                    Get Started
                                                </button>
                                            </nav>
                                            <main className="flex-1 p-6 flex flex-col justify-center">
                                                <h2 className="text-4xl font-bold text-white mb-4">Welcome to the Future</h2>
                                                <p className="text-lg text-slate-400 max-w-xl">
                                                    Build amazing apps with AI-powered code generation.
                                                </p>
                                            </main>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full overflow-auto custom-scrollbar p-6">
                                    <pre className="text-sm font-mono text-slate-300 leading-relaxed">
                                        <code>{generatedCode}</code>
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel - File Explorer */}
                <div className="w-[260px] shrink-0 liquid-glass rounded-[2rem] border border-white/10 flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-white/5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[12px] font-black text-white uppercase tracking-widest">Files</h3>
                            <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                        <FileItem name="src" type="folder" />
                        <FileItem name="App.tsx" type="file" indent level={1} active />
                        <FileItem name="index.tsx" type="file" indent level={1} />
                        <FileItem name="styles.css" type="file" indent level={1} />
                        <FileItem name="components" type="folder" indent level={1} />
                        <FileItem name="Navbar.tsx" type="file" indent level={2} />
                        <FileItem name="Hero.tsx" type="file" indent level={2} />
                        <FileItem name="public" type="folder" />
                        <FileItem name="package.json" type="file" />
                        <FileItem name="tailwind.config.js" type="file" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function FileItem({ name, type, level = 0, active = false }: { name: string; type: 'file' | 'folder'; level?: number; active?: boolean; indent?: boolean }) {
    return (
        <button
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${active ? 'bg-emerald-600/20 text-emerald-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
            style={{ paddingLeft: `${12 + level * 16}px` }}
        >
            {type === 'folder' ? (
                <Folder size={16} className="shrink-0" />
            ) : (
                <FileCode size={16} className="shrink-0" />
            )}
            <span className="text-[12px] font-medium truncate">{name}</span>
        </button>
    );
}
