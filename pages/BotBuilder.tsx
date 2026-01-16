
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BotConfig, Tool, KnowledgeAsset, BotThemeConfig } from '../types';
import { BotService, AuthService, KnowledgeService, KeyService } from '../services/store';
import ModelSelector from '../components/ModelSelector';
import MagicEnhancer from '../components/MagicEnhancer';
import ChatInterface from '../components/ChatInterface';
import { AVAILABLE_TOOLS, TOOL_CATEGORIES, IMAGE_STYLE_CHIPS, MODEL_REGISTRY, COMPATIBLE_IMAGE_MODELS, AESTHETIC_PRESETS, BOT_TEMPLATES } from '../constants';
import CustomActionModal from '../components/CustomActionModal';
import {
  Save, ArrowLeft, Cpu, Brain, User, Sliders, Share2,
  ImageIcon, BookOpen, Fingerprint, Scan, Filter, Camera,
  Trash2, Plus, Zap, Activity, Shield, Palette, Crosshair,
  Settings, ChevronRight, Terminal, Workflow, Target, Binary,
  ShieldAlert, Gauge, Info, Ban, Focus, Anchor, Maximize,
  PieChart, BarChart4, BoxSelect, Check, ToggleLeft, ToggleRight,
  Database, Image as LucideImage, Layers, Globe, Eye, EyeOff, Box, Search,
  Paintbrush, LayoutTemplate, MessageSquare, Sun, Moon,
  Shapes, Clock, Lock, DollarSign, LockKeyhole, MessageCircle,
  Undo2, Redo2, Wand2, MousePointer2, Settings2, Sparkles,
  Type as TypeIcon, Flame, RefreshCw, Code2, FileText, Braces,
  Calendar, Mail, FileEdit, LayoutGrid, CheckSquare, CalendarClock,
  Users, Table, FilePlus, StickyNote, Gamepad2, Building2, Smartphone,
  Bell, MessagesSquare, Ticket, GitBranch, Link, Network, Rocket,
  Webhook, BarChart3, Grid3X3, Leaf, Compass, Video, Mic, AudioLines,
  Ear, Music, CreditCard, Banknote, Coins, Receipt, TrendingUp,
  GitPullRequest, Triangle, Calculator, Heart, Languages, FlaskConical,
  LucideIcon
} from 'lucide-react';

// Icon mapping for tools
const ICON_MAP: Record<string, LucideIcon> = {
  Image: LucideImage, Code2, Globe, Terminal, FileText, Brain, Braces, Sparkles,
  Calendar, Mail, FileEdit, LayoutGrid, CheckSquare, CalendarClock, Users, Table, FilePlus, StickyNote,
  MessageSquare, Gamepad2, Building2, Smartphone, MessageCircle, Bell, MessagesSquare, Ticket,
  Zap, Workflow, GitBranch, Link, Network, Rocket, Webhook, Clock,
  BarChart3, Database, Grid3X3, Flame, Layers, Leaf, Search, Compass,
  Video, Mic, AudioLines, Ear, Music, Eye,
  CreditCard, Banknote, Coins, Binary, Receipt, TrendingUp,
  GitPullRequest, Triangle, Calculator, Heart, Languages, FlaskConical,
  // Category icons
  Wrench: Settings, ClipboardList: BookOpen, RefreshCw, Palette, Wallet: CreditCard, Box
};

const STEPS = [
  { id: 'definition', label: 'Profile', icon: User },
  { id: 'aesthetic', label: 'Aesthetics', icon: Palette },
  { id: 'intelligence', label: 'Model', icon: Brain },
  { id: 'images', label: 'Image Gen', icon: ImageIcon },
  { id: 'tools', label: 'Tools', icon: Cpu },
  { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
  { id: 'configuration', label: 'Settings', icon: Sliders }
];

export default function BotBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [bot, setBot] = useState<BotConfig | null>(null);
  const [allAssets, setAllAssets] = useState<KnowledgeAsset[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [toolSearch, setToolSearch] = useState('');
  const [toolCategory, setToolCategory] = useState('all');
  const [customTools, setCustomTools] = useState<Tool[]>([]);
  const [showCustomActionModal, setShowCustomActionModal] = useState(false);

  useEffect(() => {
    setAllAssets(KnowledgeService.getAssets());
    if (id) {
      const existing = BotService.getBot(id);
      if (existing) setBot(existing);
      else navigate('/dashboard');
    } else {
      // Show templates when creating a new bot
      setShowTemplates(true);
      setBot(BotService.createEmptyBot());
    }
  }, [id, navigate]);

  const applyTemplate = (template: typeof BOT_TEMPLATES[0]) => {
    if (!bot) return;
    const updatedBot: BotConfig = {
      ...bot,
      name: template.name,
      system_instructions: template.system_instructions,
      positive_directives: template.positive_directives || '',
      negative_directives: template.negative_directives || '',
      model_config: {
        ...bot.model_config,
        primary_model: template.model || bot.model_config.primary_model
      },
      tools: template.tools.map(toolId => {
        const toolDef = AVAILABLE_TOOLS.find(t => t.tool_id === toolId);
        return toolDef ? { ...toolDef, enabled: true } : null;
      }).filter(Boolean) as any,
      image_gen_config: {
        ...bot.image_gen_config,
        enabled: template.imageGenEnabled || false
      }
    };
    setBot(updatedBot);
    setShowTemplates(false);
  };

  const [publishDropdownOpen, setPublishDropdownOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (publishState?: 'draft' | 'private' | 'arena') => {
    if (bot) {
      const updatedBot = publishState ? { ...bot, publish_state: publishState } : bot;
      await BotService.saveBot(updatedBot);
      setBot(updatedBot);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handlePublishToArena = async () => {
    if (bot) {
      await BotService.saveBot({ ...bot, publish_state: 'arena' });
      alert(`🚀 ${bot.name} has been published to your arena collection! You can now add it to any arena.`);
      navigate('/dashboard');
    }
  };

  const handleSaveAndExit = async () => {
    if (bot) {
      await BotService.saveBot(bot);
      navigate('/dashboard');
    }
  };

  const updateBot = (updates: any) => {
    setBot(prev => prev ? { ...prev, ...updates } : null);
  };

  const applyPreset = (presetKey: string) => {
    if (bot && AESTHETIC_PRESETS[presetKey]) {
      updateBot({ theme_config: { ...bot.theme_config, ...AESTHETIC_PRESETS[presetKey] } });
    }
  };

  const toggleChip = (chip: string) => {
    if (!bot) return;
    const current = bot.image_gen_config.selected_chips || [];
    const updated = current.includes(chip) ? current.filter(c => c !== chip) : [...current, chip];
    updateBot({ image_gen_config: { ...bot.image_gen_config, selected_chips: updated } });
  };

  const toggleTool = (toolId: string) => {
    if (!bot) return;
    const currentTools = bot.tools || [];
    const exists = currentTools.find(t => t.tool_id === toolId);

    let newTools;
    if (exists) {
      newTools = currentTools.filter(t => t.tool_id !== toolId);
    } else {
      const def = AVAILABLE_TOOLS.find(t => t.tool_id === toolId);
      if (def) newTools = [...currentTools, { ...def, enabled: true }];
      else newTools = currentTools;
    }
    updateBot({ tools: newTools });
  };

  const toggleKnowledge = (assetId: string) => {
    if (!bot) return;
    const currentIds = bot.knowledge_ids || [];
    const updated = currentIds.includes(assetId)
      ? currentIds.filter(id => id !== assetId)
      : [...currentIds, assetId];
    updateBot({ knowledge_ids: updated });
  };

  const handleModelSelect = (mid: string) => {
    if (!bot) return;
    const modelConfigUpdate = { ...bot.model_config, primary_model: mid };
    const selectedModelDef = MODEL_REGISTRY.find(m => m.model_id === mid);

    if (selectedModelDef) {
      const maxCtx = selectedModelDef.context_window;
      if ((modelConfigUpdate.context_budget + modelConfigUpdate.max_output_tokens) > maxCtx) {
        modelConfigUpdate.context_budget = Math.floor(maxCtx * 0.7);
        modelConfigUpdate.max_output_tokens = Math.floor(maxCtx * 0.2);
      }
    }

    let imageConfigUpdate = { ...bot.image_gen_config };
    if (selectedModelDef?.provider_id === 'openai') {
      imageConfigUpdate.model = 'dall-e-3';
      imageConfigUpdate.enabled = true;
    } else if (selectedModelDef?.provider_id === 'google') {
      imageConfigUpdate.model = 'nano-banana-pro';
      imageConfigUpdate.enabled = true;
    }

    updateBot({
      model_config: modelConfigUpdate,
      image_gen_config: imageConfigUpdate
    });
  };

  const handleImageModelSelect = (imgId: string | null) => {
    if (!bot) return;
    if (imgId === null) {
      updateBot({ image_gen_config: { ...bot.image_gen_config, enabled: false } });
    } else {
      updateBot({ image_gen_config: { ...bot.image_gen_config, enabled: true, model: imgId } });
    }
  };

  const currentModelDef = MODEL_REGISTRY.find(m => m.model_id === bot?.model_config.primary_model);
  const maxTotalTokens = currentModelDef?.context_window || 128000;

  const outputBudget = bot?.model_config.max_output_tokens || 0;
  const contextBudget = bot?.model_config.context_budget || 0;
  const thinkingBudget = bot?.model_config.thinking_budget || 0;
  const totalAllocated = outputBudget + contextBudget + thinkingBudget;

  const updateTokenBudget = (field: 'max_output_tokens' | 'context_budget' | 'thinking_budget', newValue: number) => {
    if (!bot) return;
    const currentVal = bot.model_config[field] || 0;
    const otherTotal = totalAllocated - currentVal;
    if (newValue + otherTotal > maxTotalTokens) {
      newValue = maxTotalTokens - otherTotal;
    }
    updateBot({ model_config: { ...bot.model_config, [field]: newValue } });
  };

  if (!bot) return null;

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-700">
      {/* Template Selection Modal */}
      {showTemplates && !id && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="liquid-glass p-12 rounded-[3rem] border border-white/10 space-y-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                  <Zap size={14} /> Quick Start Templates
                </div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tight">Choose Your Agent Template</h2>
                <p className="text-slate-500 text-sm max-w-xl mx-auto">Select a pre-configured template to get started quickly, or start from scratch.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {BOT_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className="group p-6 rounded-[2rem] bg-gradient-to-br from-slate-900/80 to-black/80 border border-white/5 hover:border-white/20 transition-all duration-300 text-left hover:scale-[1.02] hover:shadow-2xl"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${template.gradient} flex items-center justify-center text-2xl mb-4 shadow-xl group-hover:scale-110 transition-transform`}>
                      {template.icon}
                    </div>
                    <h3 className="text-[13px] font-black text-white uppercase tracking-wider mb-2">{template.name}</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{template.description}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider bg-white/5 px-2 py-1 rounded-lg">{template.industry}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setShowTemplates(false)}
                  className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-[12px] font-black uppercase tracking-widest"
                >
                  Start From Scratch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Action Modal */}
      <CustomActionModal
        isOpen={showCustomActionModal}
        onClose={() => setShowCustomActionModal(false)}
        onSave={(tool) => {
          setCustomTools([...customTools, tool]);
          updateBot({ tools: [...bot.tools, tool] });
        }}
      />

      {/* Designer Header */}
      <header className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 shrink-0 bg-slate-900/20 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/5 shadow-2xl gap-6">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="p-4 rounded-2xl bg-slate-900/50 border border-white/10 text-slate-500 hover:text-white transition-all shadow-inner active:scale-90 group">
            <ArrowLeft size={20} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
              Agent Configuration
            </h1>
            <span className="text-[10px] font-mono font-black text-blue-500 uppercase tracking-[0.4em] mt-2 bg-blue-500/10 px-3 py-1 rounded-full w-fit">
              MANIFEST: {bot.name || 'UNNAMED_ASSET'}
            </span>
          </div>
        </div>

        {/* Action Buttons - Top Right */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Publish State Badge */}
          <div className="relative">
            <button
              onClick={() => setPublishDropdownOpen(!publishDropdownOpen)}
              className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-2 border transition-all hover:scale-105 ${bot.publish_state === 'arena' ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400' :
                bot.publish_state === 'private' ? 'bg-amber-600/20 border-amber-500/40 text-amber-400' :
                  'bg-slate-800/60 border-white/10 text-slate-400 hover:border-white/20'
                }`}
            >
              {bot.publish_state === 'arena' ? '🌐 Published' : bot.publish_state === 'private' ? '🔒 Private' : '📝 Draft'}
              <ChevronRight size={12} className={`transition-transform ${publishDropdownOpen ? 'rotate-90' : ''}`} />
            </button>

            {publishDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in slide-in-from-top-2 duration-200">
                <button onClick={() => { handleSave('draft'); setPublishDropdownOpen(false); }} className="w-full px-5 py-3.5 text-left text-[10px] font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3">
                  📝 Draft <span className="text-slate-600 ml-auto text-[9px]">WIP</span>
                </button>
                <button onClick={() => { handleSave('private'); setPublishDropdownOpen(false); }} className="w-full px-5 py-3.5 text-left text-[10px] font-bold text-amber-400 hover:bg-amber-500/10 transition-all flex items-center gap-3 border-t border-white/5">
                  🔒 Private <span className="text-slate-600 ml-auto text-[9px]">Only you</span>
                </button>
                <button onClick={() => { handleSave('arena'); setPublishDropdownOpen(false); }} className="w-full px-5 py-3.5 text-left text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/10 transition-all flex items-center gap-3 border-t border-white/5">
                  🌐 Published <span className="text-slate-600 ml-auto text-[9px]">Arenas</span>
                </button>
              </div>
            )}
          </div>

          {/* Save Success Indicator */}
          {saveSuccess && (
            <div className="px-4 py-2.5 bg-emerald-600/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-[9px] font-black uppercase tracking-wider flex items-center gap-2 animate-in zoom-in-95 duration-300">
              <Check size={12} /> Saved!
            </div>
          )}

          {/* Save Button */}
          <button onClick={() => handleSave()} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-wider hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2">
            <Save size={14} /> Save
          </button>

          {/* Publish Button */}
          <button onClick={handlePublishToArena} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-wider hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-blue-500/20 flex items-center gap-2 active:scale-95">
            <Share2 size={14} /> Publish
          </button>
        </div>
      </header>

      {/* Step Navigation Tabs - Separate Row */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="flex bg-black/30 p-1.5 rounded-2xl border border-white/5 backdrop-blur-sm">
          {STEPS.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap group relative ${activeStep === idx
                ? 'bg-blue-600 text-white font-black shadow-lg shadow-blue-600/30'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
            >
              <step.icon size={16} strokeWidth={activeStep === idx ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wide">
                {step.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-10 overflow-hidden min-h-0 pb-10">
        {/* Left Config Pane */}
        <div className="w-full lg:w-[480px] xl:w-[580px] flex-shrink-0 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-4 transition-all duration-700">

          {/* STEP 0: PROFILE */}
          {activeStep === 0 && (
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
              <div className="liquid-glass p-10 rounded-[3rem] border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/50 space-y-12 shadow-2xl">
                <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                  <div className="p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-500">
                    <User size={28} />
                  </div>
                  <h3 className="text-[14px] font-black text-white uppercase tracking-[0.3em]">Core Profile</h3>
                </div>

                <div className="grid grid-cols-1 gap-10">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Agent Designation</label>
                    <input
                      type="text"
                      value={bot.name}
                      onChange={e => updateBot({ name: e.target.value.toUpperCase() })}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-[16px] font-mono text-white outline-none focus:border-blue-500/50 transition-all hover:bg-black/60 shadow-inner"
                      placeholder="e.g. STRATEGY_UNIT_ALPHA"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Network Handle</label>
                    <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl px-6 py-6 group focus-within:border-blue-500/50 transition-all">
                      <span className="text-slate-700 font-black text-sm pr-1">@</span>
                      <input
                        type="text"
                        value={bot.slug}
                        onChange={e => updateBot({ slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        className="bg-transparent text-[14px] font-bold text-blue-400 outline-none w-full"
                        placeholder="my-agent-slug"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-3">
                      <MessageCircle size={18} className="text-blue-500" /> Interaction Starter Chips
                    </label>
                  </div>
                  <textarea
                    value={bot.starter_prompts?.join('\n') || ''}
                    onChange={e => updateBot({ starter_prompts: e.target.value.split('\n').filter(Boolean) })}
                    placeholder="Provide sample user queries (one per line)..."
                    className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-8 text-[13px] font-mono text-slate-300 h-44 focus:border-blue-500/30 outline-none resize-none shadow-inner leading-relaxed"
                  />
                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest px-4">These appear as suggestion chips to guide new users.</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-3">
                      <Terminal size={18} className="text-blue-500" /> Behavioral Instructions
                    </label>
                    <MagicEnhancer value={bot.system_instructions} onEnhance={(v) => updateBot({ system_instructions: v })} />
                  </div>
                  <textarea
                    value={bot.system_instructions}
                    onChange={e => updateBot({ system_instructions: e.target.value })}
                    placeholder="Enter core operational logic and persona data..."
                    className="w-full bg-black/40 border border-white/10 rounded-[2.5rem] p-10 text-[15px] text-slate-300 h-[32rem] focus:border-blue-500/30 outline-none resize-none shadow-inner leading-relaxed custom-scrollbar transition-all hover:bg-black/60"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: AESTHETICS */}
          {activeStep === 1 && (
            <div className="animate-in slide-in-from-left-4 duration-500 space-y-6">
              <div className="liquid-glass p-10 rounded-[3rem] border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/50 space-y-12 shadow-2xl">
                <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                  <div className="p-3 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-500">
                    <Paintbrush size={28} />
                  </div>
                  <h3 className="text-[14px] font-black text-white uppercase tracking-[0.3em]">Aesthetic Engine</h3>
                </div>

                <div className="space-y-6">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Atmospheric Presets</label>
                  <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {Object.keys(AESTHETIC_PRESETS).map(key => (
                      <button
                        key={key}
                        onClick={() => applyPreset(key)}
                        className="p-5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-purple-500/50 transition-all text-left group active:scale-95"
                      >
                        <div className="text-[11px] font-black text-white uppercase tracking-[0.1em] group-hover:text-purple-400">{key.replace('_', ' ')}</div>
                        <div className="flex gap-2 mt-4">
                          <div className="w-5 h-5 rounded-full shadow-lg border border-white/10" style={{ background: AESTHETIC_PRESETS[key].primary_color }} />
                          <div className="w-5 h-5 rounded-full shadow-lg border border-white/10" style={{ background: AESTHETIC_PRESETS[key].bg_color }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                  <ColorPicker label="Brand Primary" value={bot.theme_config.primary_color} onChange={v => updateBot({ theme_config: { ...bot.theme_config, primary_color: v } })} />
                  <ColorPicker label="Workspace BG" value={bot.theme_config.bg_color || '#000000'} onChange={v => updateBot({ theme_config: { ...bot.theme_config, bg_color: v } })} />
                  <ColorPicker label="User Signal" value={bot.theme_config.user_bubble_color} onChange={v => updateBot({ theme_config: { ...bot.theme_config, user_bubble_color: v } })} />
                  <ColorPicker label="Unit Signal" value={bot.theme_config.bot_bubble_color} onChange={v => updateBot({ theme_config: { ...bot.theme_config, bot_bubble_color: v } })} />
                </div>

                <div className="space-y-4 pt-4">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Interface Mode</label>
                  <div className="flex gap-4 bg-black/40 p-2 rounded-[2rem] border border-white/10">
                    <button
                      onClick={() => updateBot({ theme_config: { ...bot.theme_config, light_mode: false } })}
                      className={`flex-1 py-4 rounded-[1.5rem] text-[11px] font-black uppercase transition-all flex items-center justify-center gap-3 ${!bot.theme_config.light_mode ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/20' : 'text-slate-500 hover:text-white'}`}
                    >
                      <Moon size={16} /> DARK_PROTO
                    </button>
                    <button
                      onClick={() => updateBot({ theme_config: { ...bot.theme_config, light_mode: true } })}
                      className={`flex-1 py-4 rounded-[1.5rem] text-[11px] font-black uppercase transition-all flex items-center justify-center gap-3 ${bot.theme_config.light_mode ? 'bg-white text-black shadow-xl shadow-white/30' : 'text-slate-500 hover:text-white'}`}
                    >
                      <Sun size={16} /> LIGHT_PROTO
                    </button>
                  </div>
                </div>

                <div className="space-y-12 pt-8 border-t border-white/5">
                  <SliderControl
                    label="CORNER_RADIUS_INTENSITY"
                    value={bot.theme_config.bubble_radius}
                    onChange={v => updateBot({ theme_config: { ...bot.theme_config, bubble_radius: v } })}
                    max={40}
                    icon={Box}
                    color="text-purple-400"
                  />
                  <SliderControl
                    label="NEURAL_TYPE_SCALE"
                    value={bot.theme_config.font_size}
                    onChange={v => updateBot({ theme_config: { ...bot.theme_config, font_size: v } })}
                    max={24}
                    min={10}
                    icon={TypeIcon}
                    color="text-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">SHADOW_MATRIX</label>
                    <select
                      value={bot.theme_config.shadow_intensity}
                      onChange={e => updateBot({ theme_config: { ...bot.theme_config, shadow_intensity: e.target.value } })}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-[12px] font-bold text-white outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
                    >
                      <option value="none">DEACTIVATED</option>
                      <option value="soft">SOFT_GLASS</option>
                      <option value="hard">TACTICAL_HARD</option>
                      <option value="neon">NEON_FLUX</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">NEURAL_TYPOGRAPHY</label>
                    <select
                      value={bot.theme_config.font_family}
                      onChange={e => updateBot({ theme_config: { ...bot.theme_config, font_family: e.target.value } })}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-[12px] font-bold text-white outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
                    >
                      <option value="Inter">INTER_SYSTEM</option>
                      <option value="JetBrains Mono">JETBRAINS_TECH</option>
                      <option value="Space Grotesk">SPACE_MODERN</option>
                      <option value="Courier New">COURIER_RETRO</option>
                      <option value="Georgia">GEORGIA_CLASSIC</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: MODEL */}
          {activeStep === 2 && (
            <div className="animate-in slide-in-from-left-4 duration-500 h-full">
              <div className="liquid-glass p-10 rounded-[3rem] border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/50 h-full flex flex-col">
                <div className="flex items-center gap-4 border-b border-white/5 pb-8 mb-10 shrink-0">
                  <div className="p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-500">
                    <Brain size={28} />
                  </div>
                  <h3 className="text-[14px] font-black text-white uppercase tracking-[0.3em]">Intelligence Routing</h3>
                </div>
                <div className="flex-1 overflow-visible">
                  <ModelSelector
                    selectedId={bot.model_config.primary_model}
                    onSelect={handleModelSelect}
                    selectedImageModelId={bot.image_gen_config.model}
                    imageGenEnabled={bot.image_gen_config.enabled}
                    onSelectImageModel={handleImageModelSelect}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: IMAGE GEN */}
          {activeStep === 3 && (
            <div className="animate-in slide-in-from-left-4 duration-500 space-y-6">
              <div className="liquid-glass p-10 rounded-[3rem] border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/50 space-y-12 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-cyan-600/10 text-cyan-500 border border-cyan-500/20">
                      <LucideImage size={28} />
                    </div>
                    <h3 className="text-[14px] font-black text-white uppercase tracking-[0.3em]">Visual Synthesis</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Matrix</span>
                    <button
                      onClick={() => updateBot({ image_gen_config: { ...bot.image_gen_config, enabled: !bot.image_gen_config.enabled } })}
                      className={`w-16 h-8 rounded-full p-1.5 transition-all duration-500 relative ${bot.image_gen_config.enabled ? 'bg-cyan-600 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-slate-700'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-500 ${bot.image_gen_config.enabled ? 'translate-x-8' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

                {bot.image_gen_config.enabled ? (
                  <div className="space-y-12 animate-in zoom-in-95 duration-500">
                    <div className="space-y-6">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Latent Model Blueprint</label>
                      <div className="grid grid-cols-2 gap-4">
                        {['dall-e-3', 'gpt-image-1.5', 'imagen-4', 'imagen-3'].map(m => (
                          <button
                            key={m}
                            onClick={() => updateBot({ image_gen_config: { ...bot.image_gen_config, model: m } })}
                            className={`p-6 rounded-[2rem] border flex items-center justify-center gap-4 transition-all hover:scale-[1.02] ${bot.image_gen_config.model === m ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400 shadow-xl' : 'bg-black/20 border-white/5 text-slate-500 hover:text-white'}`}
                          >
                            <Zap size={18} fill="currentColor" />
                            <span className="text-[12px] font-black uppercase tracking-widest">{m}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Synthesis Aspect Ratio</label>
                      <div className="flex bg-black/40 p-2 rounded-[2rem] border border-white/10">
                        {['1:1', '16:9', '9:16'].map((ratio) => (
                          <button
                            key={ratio}
                            onClick={() => updateBot({ image_gen_config: { ...bot.image_gen_config, aspect_ratio: ratio as any } })}
                            className={`flex-1 py-4 rounded-[1.5rem] text-[12px] font-black transition-all ${bot.image_gen_config.aspect_ratio === ratio ? 'bg-cyan-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
                          >
                            {ratio}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Latent Style Matrix</label>
                      <div className="grid grid-cols-3 gap-3 max-h-[360px] overflow-y-auto custom-scrollbar p-2 bg-black/20 rounded-[2rem] border border-white/5">
                        {IMAGE_STYLE_CHIPS.map(chip => (
                          <button
                            key={chip}
                            onClick={() => toggleChip(chip)}
                            className={`px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-tight truncate transition-all ${bot.image_gen_config.selected_chips.includes(chip) ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20 hover:text-white'}`}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-32 text-center opacity-30 animate-in fade-in zoom-in-95">
                    <div className="p-10 rounded-full bg-slate-900 border border-white/5 mb-8 mx-auto w-fit shadow-2xl">
                      <EyeOff size={80} className="text-slate-600" />
                    </div>
                    <h4 className="text-[18px] font-black uppercase text-white tracking-[0.4em]">Visual Synthesis Offline</h4>
                    <p className="text-[11px] mt-4 font-bold text-slate-600 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">Enable the visual core to configure advanced generative parameters.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: TOOLS */}
          {activeStep === 4 && (
            <div className="animate-in slide-in-from-left-4 duration-500 space-y-6">
              <div className="liquid-glass p-10 rounded-[3rem] border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/50 space-y-8 shadow-2xl">
                {/* Header with counter and create button */}
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-500">
                      <Cpu size={28} />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-black text-white uppercase tracking-[0.3em]">Intelligence Nodes</h3>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{bot.tools.length} Active • {AVAILABLE_TOOLS.length}+ Available</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCustomActionModal(true)}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-2 hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg hover:shadow-purple-500/20"
                  >
                    <Plus size={14} /> Create Action
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    value={toolSearch}
                    onChange={e => setToolSearch(e.target.value)}
                    placeholder="Search tools..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 pl-14 text-sm text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                  />
                  <Globe size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                </div>

                {/* Category Tabs */}
                {/* Category Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {TOOL_CATEGORIES.map(cat => {
                    const IconComponent = ICON_MAP[cat.icon] || Box;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setToolCategory(cat.id)}
                        className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap flex items-center gap-2 transition-all ${toolCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white'}`}
                      >
                        <IconComponent size={14} strokeWidth={2} /> {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Tools Section */}
                {customTools.length > 0 && (toolCategory === 'all' || toolCategory === 'custom') && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={12} /> Your Custom Actions
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {customTools.map((tool) => {
                        const isActive = bot.tools.some(t => t.tool_id === tool.tool_id);
                        return (
                          <div
                            key={tool.tool_id}
                            className={`p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${isActive ? 'bg-purple-600/10 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.1)]' : 'bg-black/20 border-white/5 hover:border-purple-500/30'}`}
                          >
                            <div className="flex items-center gap-5">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${isActive ? 'bg-purple-600 shadow-xl' : 'bg-white/5'}`}>
                                {tool.icon || '🔧'}
                              </div>
                              <div className="overflow-hidden">
                                <h4 className={`text-[12px] font-black uppercase tracking-wider truncate ${isActive ? 'text-white' : 'text-slate-400'}`}>{tool.name}</h4>
                                <p className="text-[9px] text-slate-600 font-bold uppercase mt-0.5 tracking-wider line-clamp-1">{tool.description}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleTool(tool.tool_id)}
                              className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-purple-600 text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10'}`}
                            >
                              {isActive ? 'ACTIVE' : 'DEPLOY'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tools Grid */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                  {AVAILABLE_TOOLS
                    .filter(tool => toolCategory === 'all' || tool.category === toolCategory)
                    .filter(tool => !toolSearch || tool.name.toLowerCase().includes(toolSearch.toLowerCase()) || tool.description.toLowerCase().includes(toolSearch.toLowerCase()))
                    .map((tool) => {
                      const isActive = bot.tools.some(t => t.tool_id === tool.tool_id);
                      return (
                        <div
                          key={tool.tool_id}
                          className={`p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${isActive ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.1)]' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
                        >
                          <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-indigo-600 shadow-xl text-white' : 'bg-white/5 text-slate-400'}`}>
                              {tool.icon && ICON_MAP[tool.icon] ? React.createElement(ICON_MAP[tool.icon], { size: 22, strokeWidth: 1.5 }) : <Box size={22} strokeWidth={1.5} />}
                            </div>
                            <div className="overflow-hidden">
                              <div className="flex items-center gap-2">
                                <h4 className={`text-[12px] font-black uppercase tracking-wider truncate ${isActive ? 'text-white' : 'text-slate-400'}`}>{tool.name}</h4>
                                <span className="text-[8px] font-bold text-slate-600 uppercase bg-white/5 px-2 py-0.5 rounded">{tool.category}</span>
                              </div>
                              <p className="text-[9px] text-slate-600 font-bold uppercase mt-0.5 tracking-wider line-clamp-1">{tool.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleTool(tool.tool_id)}
                            className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10'}`}
                          >
                            {isActive ? 'ACTIVE' : 'DEPLOY'}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: KNOWLEDGE */}
          {activeStep === 5 && (
            <div className="animate-in slide-in-from-left-4 duration-500 space-y-6">
              <div className="liquid-glass p-10 rounded-[3rem] border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/50 space-y-12 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-emerald-600/10 text-emerald-500 border border-emerald-500/20">
                      <Database size={28} />
                    </div>
                    <h3 className="text-[14px] font-black text-white uppercase tracking-[0.3em]">Knowledge Vault Link</h3>
                  </div>
                  <button
                    onClick={() => navigate('/knowledge')}
                    className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-5 py-2.5 rounded-xl border border-blue-500/20 uppercase tracking-widest hover:text-white transition-all"
                  >
                    NEW_INTEL +
                  </button>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto no-scrollbar pr-2">
                  {allAssets.length === 0 ? (
                    <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-30 bg-white/[0.02]">
                      <Database size={64} className="mx-auto mb-6 text-slate-600" />
                      <p className="text-[15px] font-black uppercase text-slate-500 tracking-[0.4em]">Vault Isolated</p>
                      <p className="text-[10px] mt-4 font-bold text-slate-600 uppercase tracking-widest">Ingest operational data to establish semantic links.</p>
                    </div>
                  ) : (
                    allAssets.map(asset => {
                      const isLinked = (bot.knowledge_ids || []).includes(asset.id);
                      return (
                        <div
                          key={asset.id}
                          onClick={() => toggleKnowledge(asset.id)}
                          className={`p-5 rounded-[2rem] border cursor-pointer transition-all flex items-center justify-between group active:scale-[0.98] ${isLinked ? 'bg-emerald-500/10 border-emerald-500/50 shadow-2xl' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                        >
                          <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isLinked ? 'bg-emerald-500 text-white shadow-xl' : 'bg-white/5 text-slate-600 border-white/10'}`}>
                              <Layers size={22} />
                            </div>
                            <div className="overflow-hidden">
                              <div className={`text-[14px] font-black uppercase tracking-tight truncate ${isLinked ? 'text-emerald-400' : 'text-white'}`}>{asset.name}</div>
                              <div className="text-[10px] font-mono text-slate-600 uppercase mt-1 truncate">PROTO://{asset.type} // SRC://{asset.source}</div>
                            </div>
                          </div>
                          <div className={`p-2 rounded-full transition-all duration-500 ${isLinked ? 'bg-emerald-500 text-white rotate-0' : 'bg-white/5 text-slate-800 rotate-45 group-hover:text-slate-400'}`}>
                            {isLinked ? <Check size={18} strokeWidth={4} /> : <Plus size={18} strokeWidth={4} />}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: SETTINGS */}
          {activeStep === 6 && (
            <div className="animate-in slide-in-from-left-4 duration-500 space-y-6">
              <div className="liquid-glass p-10 rounded-[3rem] border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/50 space-y-14 shadow-2xl">
                <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                  <div className="p-3 rounded-2xl bg-amber-600/10 border border-amber-500/20 text-amber-500">
                    <Sliders size={28} />
                  </div>
                  <h3 className="text-[14px] font-black text-white uppercase tracking-[0.3em]">Operational Manifest</h3>
                </div>

                <div className="grid grid-cols-1 gap-12">
                  <div className="space-y-6">
                    <label className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-3 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 w-fit">
                      <Focus size={16} /> SIGNAL_POSITIVE (INCLUDES)
                    </label>
                    <textarea
                      value={bot.positive_directives}
                      onChange={e => updateBot({ positive_directives: e.target.value })}
                      placeholder="e.g. 'STRATEGY', 'OPTIMIZED', 'EVIDENCE-BASED'..."
                      className="w-full bg-black/40 border border-white/10 rounded-[2.5rem] p-10 text-[13px] font-mono text-emerald-400 h-48 focus:border-emerald-500/30 outline-none resize-none shadow-inner leading-relaxed transition-all hover:bg-black/60"
                    />
                  </div>
                  <div className="space-y-6">
                    <label className="text-[11px] font-black text-rose-500 uppercase tracking-[0.2em] flex items-center gap-3 bg-rose-500/10 px-4 py-2 rounded-xl border border-rose-500/20 w-fit">
                      <Ban size={16} /> SIGNAL_NEGATIVE (AVOIDS)
                    </label>
                    <textarea
                      value={bot.negative_directives}
                      onChange={e => updateBot({ negative_directives: e.target.value })}
                      placeholder="e.g. 'UNCERTAIN', 'APOLOGETIC', 'FILLER'..."
                      className="w-full bg-black/40 border border-white/10 rounded-[2.5rem] p-10 text-[13px] font-mono text-rose-400 h-48 focus:border-rose-500/30 outline-none resize-none shadow-inner leading-relaxed transition-all hover:bg-black/60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 pt-8 border-t border-white/5">
                  <div className="space-y-6">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                      <LockKeyhole size={20} className="text-amber-500" /> Alignment Lock
                    </label>
                    <div className="flex items-center gap-6 bg-black/40 p-6 rounded-[2rem] border border-white/10 group hover:bg-black/60 transition-all">
                      <button
                        onClick={() => updateBot({ features: { ...bot.features, alignment_lock: !bot.features.alignment_lock } })}
                        className={`w-20 h-9 rounded-full p-1.5 transition-all duration-500 relative shrink-0 ${bot.features.alignment_lock ? 'bg-amber-500 shadow-2xl shadow-amber-500/30' : 'bg-slate-700'}`}
                      >
                        <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-500 absolute top-1.5 ${bot.features.alignment_lock ? 'right-1.5' : 'left-1.5'}`} />
                      </button>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight">ENFORCE SYSTEM INTEGRITY AND PREVENT NEURAL DRIFT.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                      <DollarSign size={20} className="text-emerald-500" /> Session Hard-Cap
                    </label>
                    <div className="flex items-center gap-4 bg-black/40 p-6 rounded-[2rem] border border-white/10 hover:bg-black/60 transition-all group focus-within:border-emerald-500/40">
                      <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                        <DollarSign size={20} />
                      </div>
                      <input
                        type="number"
                        value={bot.model_config.cost_guardrail || ''}
                        onChange={e => updateBot({ model_config: { ...bot.model_config, cost_guardrail: parseFloat(e.target.value) } })}
                        className="bg-transparent text-[18px] font-mono font-black text-white outline-none w-full placeholder:text-slate-800"
                        placeholder="NO_LIMIT"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-10 rounded-[3rem] bg-black/40 border border-white/5 space-y-12 shadow-inner">
                  <div className="flex items-center justify-between border-b border-white/5 pb-8">
                    <div className="flex items-center gap-5">
                      <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/20">
                        <BarChart4 size={24} />
                      </div>
                      <span className="text-[15px] font-black text-white uppercase tracking-[0.2em]">Neural Capacity Budget</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[12px] font-black text-blue-400 uppercase tracking-widest">{totalAllocated.toLocaleString()} / {maxTotalTokens.toLocaleString()} TKN</span>
                      <div className="text-[9px] font-mono text-slate-600 uppercase mt-2 tracking-tighter">CORE://{bot.model_config.primary_model}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-14 pt-4">
                    <TokenSlider label="MEMORY_RETENTION" value={contextBudget} max={maxTotalTokens} color="text-blue-500" accentColor="bg-blue-600" onChange={(v) => updateTokenBudget('context_budget', v)} />
                    <TokenSlider label="RESPONSE_MAX_OUTPUT" value={outputBudget} max={maxTotalTokens} color="text-purple-500" accentColor="bg-purple-600" onChange={(v) => updateTokenBudget('max_output_tokens', v)} />
                    {currentModelDef?.capabilities.reasoning && (
                      <TokenSlider label="LOGIC_REASONING_BUDGET" value={thinkingBudget} max={maxTotalTokens} color="text-emerald-500" accentColor="bg-emerald-500" onChange={(v) => updateTokenBudget('thinking_budget', v)} />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14 pb-12 pt-6 border-t border-white/5">
                  <SliderControl label="Neural Temperature" value={bot.model_config.temperature} onChange={v => updateBot({ model_config: { ...bot.model_config, temperature: v } })} max={1} step={0.1} icon={Flame} color="text-orange-500" />
                  <SliderControl label="Nucleus Sampling (Top P)" value={bot.model_config.top_p} onChange={v => updateBot({ model_config: { ...bot.model_config, top_p: v } })} max={1} step={0.05} icon={Target} color="text-blue-400" />
                  <SliderControl label="Frequency Penalty" value={bot.model_config.frequency_penalty} onChange={v => updateBot({ model_config: { ...bot.model_config, frequency_penalty: v } })} max={2} step={0.1} icon={RefreshCw} color="text-rose-400" />
                  <SliderControl label="Presence Penalty" value={bot.model_config.presence_penalty} onChange={v => updateBot({ model_config: { ...bot.model_config, presence_penalty: v } })} max={2} step={0.1} icon={Layers} color="text-emerald-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Preview Pane */}
        <div className="flex-1 flex flex-col min-w-0 h-full transition-all duration-700">
          <div className="flex items-center justify-between mb-8 px-6 shrink-0">
            <div className="flex items-center gap-6">
              <div className="p-2.5 rounded-2xl bg-blue-600/10 text-blue-600 border border-blue-500/20 shadow-xl">
                <Activity size={24} className="animate-pulse" />
              </div>
              <h4 className="text-[14px] font-black text-slate-500 uppercase tracking-[0.5em]">Live Neural Workspace</h4>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 status-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
              <span className="text-[10px] font-black text-slate-100 uppercase tracking-[0.3em]">Signal: Synchronized</span>
            </div>
          </div>

          <div className="flex-1 shadow-[0_0_140px_rgba(0,0,0,0.7)] relative rounded-[4rem] overflow-hidden border border-white/10 bg-black/40 group transition-all duration-700 hover:border-blue-500/20">
            <ChatInterface
              bot={bot}
              className="h-full border-none rounded-none"
            />
            {/* Aesthetic Workspace Grid / Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
              <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,4px_100%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderControl({ label, value, onChange, max, min = 0, step = 1, icon: Icon, color = "text-blue-500" }: { label: string, value: number, onChange: (v: number) => void, max: number, min?: number, step?: number, icon?: any, color?: string }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
        <span className="flex items-center gap-3">
          {Icon && <Icon size={14} className={color} />}
          {label}
        </span>
        <span className={`${color} font-mono bg-white/5 px-3 py-1 rounded-lg border border-white/5 shadow-inner`}>
          {value.toFixed(1)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-slate-900 rounded-full appearance-none cursor-pointer accent-current hover:scale-y-125 transition-transform"
        style={{ color: color.includes('text-') ? 'var(--accent-blue)' : color }}
      />
    </div>
  );
}

function TokenSlider({ label, value, max, color, accentColor, onChange }: { label: string, value: number, max: number, color: string, accentColor: string, onChange: (v: number) => void }) {
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center text-[11px] font-black text-slate-500 uppercase tracking-widest">
        <span className="flex items-center gap-4">
          <BoxSelect size={18} className={color} />
          {label}
        </span>
        <span className={`${color} font-mono bg-black/60 px-5 py-1.5 rounded-[1rem] border border-white/5 shadow-2xl`}>
          {value.toLocaleString()} TKN
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={512}
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        className={`w-full h-2.5 rounded-full appearance-none cursor-pointer bg-slate-950 transition-all accent-${accentColor.replace('bg-', '')} hover:scale-y-110`}
        style={{ accentColor: accentColor.replace('bg-', '') }}
      />
    </div>
  );
}

function ColorPicker({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-4">
      <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-1">{label}</span>
      <div className="flex items-center gap-5 bg-black/40 p-4 rounded-[1.8rem] border border-white/10 hover:border-white/30 transition-all group">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-12 h-12 rounded-2xl bg-transparent border-none cursor-pointer p-0 overflow-hidden shadow-2xl transition-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 rounded-2xl border-2 border-white/20 pointer-events-none" />
        </div>
        <span className="text-[14px] font-mono font-black text-white/80 uppercase tracking-tighter">
          {value.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
