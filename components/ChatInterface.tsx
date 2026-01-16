
import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Paperclip, StopCircle, RotateCw, Cpu, Activity,
  ImageIcon, Maximize2, Minimize2, Microscope, Code,
  Zap, Share2, Terminal, Info, ChevronDown, Sparkles,
  Download, RefreshCw, Plus, Link, Copy, Heart, X,
  Check, Eye, EyeOff, Globe, Loader2, ChevronUp, Hash
} from 'lucide-react';
import { BotConfig, Message, Artifact, TelemetryStep, BotThemeConfig, SessionAccumulator, CreditsBalance } from '../types';
import { ModelRouter } from '../services/llm';
import { CreditsService, ImageLibraryService, KnowledgeService } from '../services/store';
import ArtifactPane from './ArtifactPane';
import XRayVision from './XRayVision';
import UpgradeModal, { useUpgradeModal } from './UpgradeModal';

interface ChatInterfaceProps {
  bot: BotConfig;
  className?: string;
  readOnly?: boolean;
}

const DEFAULT_THEME: BotThemeConfig = {
  primary_color: '#3b82f6',
  secondary_color: '#1e293b',
  bg_color: '#020617',
  user_bubble_color: '#3b82f6',
  bot_bubble_color: '#0f172a',
  font_family: 'Inter',
  font_size: 14,
  bubble_radius: 24,
  shadow_intensity: 'soft',
  background_style: 'glass',
  button_style: 'rounded',
  border_style: 'thin',
  light_mode: false,
  avatar_shape: 'square',
  show_timestamps: false
};

export default function ChatInterface({ bot, className = '', readOnly = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeArtifacts, setActiveArtifacts] = useState<Artifact[] | null>(null);
  const [xrayActive, setXrayActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTelemetry, setCurrentTelemetry] = useState<TelemetryStep[]>([]);
  const [activeSuggestions, setActiveSuggestions] = useState<string[]>([]);
  const [showTokens, setShowTokens] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [processingExpanded, setProcessingExpanded] = useState(false);

  const [sessionStats, setSessionStats] = useState<SessionAccumulator>({
    total_tokens: 0,
    total_energy: 0,
    tool_calls: 0,
    avg_latency: 0,
    messages_count: 0,
    start_time: Date.now()
  });

  // Credits & sharing state
  const [credits, setCredits] = useState<CreditsBalance>(CreditsService.getBalance());
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareContent, setShareContent] = useState<{ type: 'image' | 'text' | 'artifact'; content: string; title?: string } | null>(null);

  // Upgrade modal for when credits are exhausted
  const upgradeModal = useUpgradeModal();

  // Refresh credits after operations
  const refreshCredits = () => setCredits(CreditsService.getBalance());

  // Image action handlers
  const handleDownloadImage = async (url: string, prompt: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `zen-foundry-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (e) {
      // Fallback for cross-origin images
      window.open(url, '_blank');
    }
  };

  const handleSaveToLibrary = (url: string, prompt: string) => {
    ImageLibraryService.saveImage({
      url,
      prompt,
      model: bot.image_gen_config.model || 'unknown',
      agent_id: bot.id,
      agent_name: bot.name,
      aspect_ratio: bot.image_gen_config.aspect_ratio || '1:1',
      tags: ['generated'],
      is_favorite: false
    });
    alert('Image saved to library!');
  };

  const handleAddToKnowledge = (content: string, type: 'text' | 'image' = 'text') => {
    const name = type === 'image' ? `Image_${Date.now()}` : `Content_${Date.now()}`;
    KnowledgeService.quickAddFromChat(content, name, type);
    alert('Added to Knowledge Vault!');
  };

  const handleShare = (type: 'image' | 'text' | 'artifact', content: string, title?: string) => {
    setShareContent({ type, content, title });
    setShareModalOpen(true);
  };

  const handleCopyEmbed = () => {
    if (!shareContent) return;
    const embedCode = shareContent.type === 'image'
      ? `<img src="${shareContent.content}" alt="${shareContent.title || 'AI Generated'}" style="max-width:100%;border-radius:12px;" />`
      : `<div style="padding:16px;background:#0f172a;border-radius:12px;color:#f8fafc;font-family:monospace;">${shareContent.content.slice(0, 500)}${shareContent.content.length > 500 ? '...' : ''}</div>`;
    navigator.clipboard.writeText(embedCode);
    alert('Embed code copied!');
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/#/share/${btoa(JSON.stringify(shareContent)).slice(0, 50)}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied!');
  };

  // Quick copy message handler with visual feedback
  const handleCopyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const userHasScrolledUp = useRef(false);
  const lastMessageCount = useRef(0);
  const theme = { ...DEFAULT_THEME, ...bot.theme_config };

  // Track if user has scrolled up from bottom
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    // User is considered "scrolled up" if more than 200px from bottom
    userHasScrolledUp.current = distanceFromBottom > 200;
  };

  // Only auto-scroll on NEW messages (not during streaming updates to existing messages)
  useEffect(() => {
    const currentCount = messages.length;
    const isNewMessage = currentCount > lastMessageCount.current;
    lastMessageCount.current = currentCount;

    // Only scroll to bottom if:
    // 1. It's a new message (not a streaming update)
    // 2. User hasn't scrolled up
    // 3. The new message is from the user (they just sent it)
    const lastMessage = messages[messages.length - 1];
    const isUserMessage = lastMessage?.role === 'user';

    if (isNewMessage && isUserMessage && !userHasScrolledUp.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages.length]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'init',
        role: 'assistant',
        content: `SECURE_LINK: ${bot.name.toUpperCase()} OPERATIONAL.\n\n[ENGINE]: ${bot.model_config.primary_model.toUpperCase()}\n[MODALITY]: ${bot.image_gen_config.enabled ? 'MULTIMODAL_ENABLED' : 'TEXT_ONLY'}`,
        timestamp: Date.now()
      }]);
      setActiveSuggestions(bot.starter_prompts || []);
    }
  }, [bot.name]);

  const updateSessionStats = (newTokens: number, latency: number, isTool: boolean) => {
    setSessionStats(prev => {
      const newCount = prev.messages_count + 1;
      const newAvgLatency = ((prev.avg_latency * prev.messages_count) + latency) / newCount;
      const energyDelta = (newTokens * 0.05) + (isTool ? 5 : 0.5);
      return {
        total_tokens: prev.total_tokens + newTokens,
        total_energy: prev.total_energy + energyDelta,
        tool_calls: prev.tool_calls + (isTool ? 1 : 0),
        avg_latency: newAvgLatency,
        messages_count: newCount,
        start_time: prev.start_time
      };
    });
  };

  const handleSend = async (forcedInput?: string) => {
    const textToSend = forcedInput || input;
    if (!textToSend.trim() || isTyping) return;

    // Check if user has credits before proceeding
    if (!CreditsService.hasCredits(1)) {
      upgradeModal.showModal();
      return;
    }

    setCurrentTelemetry([]);
    setActiveSuggestions([]);

    const startTime = Date.now();
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: textToSend, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const botMsgId = crypto.randomUUID();
    setMessages(prev => [...prev, { id: botMsgId, role: 'assistant', content: '', timestamp: Date.now(), isStreaming: true }]);

    try {
      const response = await ModelRouter.chatStream(
        bot,
        messages,
        textToSend,
        (fullText) => {
          setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: fullText } : m));
        },
        (step) => {
          setCurrentTelemetry(prev => [...prev, step]);
          if (step.type === 'TOOL_EXEC') {
            updateSessionStats(0, step.duration || 0, true);
          }
        }
      );

      const duration = Date.now() - startTime;
      updateSessionStats(response.tokens, duration, false);

      setMessages(prev => prev.map(m => m.id === botMsgId ? {
        ...m,
        content: response.content,
        image_url: response.image_url,
        thinking_log: response.thinking_log,
        tokens: response.tokens,
        artifacts: response.artifacts,
        suggestions: response.suggestions,
        isStreaming: false
      } : m));

      if (response.suggestions && response.suggestions.length > 0) {
        setActiveSuggestions(response.suggestions);
      }

      if (response.artifacts && response.artifacts.length > 0) {
        setActiveArtifacts(response.artifacts);
      }
    } catch (err: any) {
      setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: `CRITICAL_ERROR: ${err.message}`, isStreaming: false } : m));
    } finally {
      setIsTyping(false);
      // Consume credit after successful response
      CreditsService.useCredit(1);
      refreshCredits();
    }
  };

  const getBubbleStyle = (role: 'user' | 'assistant') => {
    const radius = `${theme.bubble_radius}px`;
    const radiusStyle = role === 'user'
      ? { borderTopLeftRadius: radius, borderTopRightRadius: radius, borderBottomLeftRadius: radius, borderBottomRightRadius: '4px' }
      : { borderTopLeftRadius: '4px', borderTopRightRadius: radius, borderBottomLeftRadius: radius, borderBottomRightRadius: radius };

    const bg = role === 'user' ? theme.user_bubble_color : theme.bot_bubble_color;
    const text = theme.light_mode && role === 'assistant' ? '#1e293b' : '#f8fafc';

    return {
      ...radiusStyle,
      backgroundColor: bg,
      color: text,
      boxShadow: theme.shadow_intensity === 'none' ? 'none' : '0 10px 30px rgba(0,0,0,0.2)',
      fontSize: `${theme.font_size}px`
    };
  };

  return (
    <div
      className={`flex flex-col overflow-hidden relative transition-all duration-700 ${isExpanded ? 'fixed inset-0 z-[1000] m-0 rounded-none' : 'rounded-[2.5rem] border border-white/10 h-full'} ${className}`}
      style={{ fontFamily: theme.font_family, backgroundColor: theme.bg_color || theme.secondary_color }}
    >
      <header className="px-8 py-5 border-b border-white/5 bg-slate-900/40 flex items-center justify-between z-20 backdrop-blur-md glass-premium">
        <div className="flex items-center gap-5">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center neon-breathe-fast spring-hover" style={{ color: theme.primary_color, '--glow-color': theme.primary_color } as React.CSSProperties}><Cpu size={20} /></div>
          <div>
            <h3 className="text-[13px] font-black tracking-[0.2em] uppercase flex items-center gap-2" style={{ color: theme.light_mode ? '#000' : '#fff' }}>
              {bot.name} <div className="w-2 h-2 rounded-full neon-breathe-fast" style={{ backgroundColor: theme.primary_color, '--glow-color': theme.primary_color } as React.CSSProperties}></div>
            </h3>
            <span className="text-[9px] font-mono uppercase opacity-50" style={{ color: theme.light_mode ? '#333' : '#ccc' }}>{bot.model_config.primary_model}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowTokens(!showTokens)}
            className={`p-2.5 rounded-xl border transition-all spring-hover ${showTokens ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white hover:border-white/20'}`}
            title={showTokens ? "Hide token counts" : "Show token counts"}
          >
            <Hash size={16} />
          </button>
          <button onClick={() => setXrayActive(!xrayActive)} className={`p-2.5 rounded-xl border transition-all spring-hover ${xrayActive ? 'text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white hover:border-white/20'}`} style={{ backgroundColor: xrayActive ? theme.primary_color : undefined }}><Microscope size={16} /></button>
          <button onClick={() => setIsExpanded(!isExpanded)} className={`p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white transition-all spring-hover hover:border-white/20`}>{isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>
          <button onClick={() => setMessages([])} className={`p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-rose-400 transition-all spring-hover hover:border-rose-500/30 hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]`}><RotateCw size={16} /></button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative z-10">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar relative z-10 pb-32 scroll-smooth"
        >
          {messages.map((msg, idx) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} spring-in group/msg`} style={{ '--stagger-index': idx } as React.CSSProperties}>
              <div className={`w-full ${msg.role === 'user' ? 'max-w-[70%]' : 'max-w-[85%]'}`}>
                <div className={`flex items-center gap-3 mb-3 ${msg.role === 'user' ? 'flex-row-reverse text-right' : ''}`}>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-glow-subtle" style={{ color: theme.primary_color }}>{msg.role === 'user' ? 'OPERATOR' : 'UNIT'}</span>
                  {/* Quick Copy Button */}
                  <button
                    onClick={() => handleCopyMessage(msg.id, msg.content)}
                    className="opacity-0 group-hover/msg:opacity-100 transition-all p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20"
                    title="Copy message"
                  >
                    {copiedId === msg.id ? (
                      <Check size={12} className="text-emerald-400" />
                    ) : (
                      <Copy size={12} className="text-slate-400" />
                    )}
                  </button>
                  {/* Token Counter for assistant messages */}
                  {msg.role === 'assistant' && msg.tokens && showTokens && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded-full border border-white/5">
                      <Hash size={10} className="text-blue-400" />
                      <span className="text-[8px] font-bold text-slate-500">{msg.tokens} tokens</span>
                    </div>
                  )}
                </div>
                <div className={`p-6 transition-all border holographic hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] relative`} style={getBubbleStyle(msg.role)}>
                  <div className="leading-relaxed whitespace-pre-wrap font-mono prose prose-invert max-w-none">{msg.content}</div>

                  {/* Message Actions Footer */}
                  {msg.role === 'assistant' && msg.content.length > 50 && (
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="px-3 py-1.5 bg-white/5 rounded-lg text-[9px] font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 border border-white/5"
                      >
                        {copiedId === msg.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        {copiedId === msg.id ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={() => handleAddToKnowledge(msg.content, 'text')}
                        className="px-3 py-1.5 bg-white/5 rounded-lg text-[9px] font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 border border-white/5"
                      >
                        <Plus size={12} /> Knowledge
                      </button>
                      <button
                        onClick={() => handleShare('text', msg.content, 'AI Response')}
                        className="px-3 py-1.5 bg-white/5 rounded-lg text-[9px] font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 border border-white/5"
                      >
                        <Share2 size={12} /> Share
                      </button>
                    </div>
                  )}

                  {/* Enhanced Image Display with Actions */}
                  {msg.image_url && (
                    <div className="mt-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl max-w-lg holographic relative group">
                      <img src={msg.image_url} alt="Gen" className="w-full h-auto cursor-pointer" onClick={() => setExpandedImage(msg.image_url!)} />

                      {/* Image Action Buttons */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex gap-2">
                            <button onClick={() => handleDownloadImage(msg.image_url!, msg.content)} className="p-2.5 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all" title="Download">
                              <Download size={16} />
                            </button>
                            <button onClick={() => setExpandedImage(msg.image_url!)} className="p-2.5 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all" title="Expand">
                              <Maximize2 size={16} />
                            </button>
                            <button onClick={() => handleSaveToLibrary(msg.image_url!, msg.content)} className="p-2.5 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all" title="Save to Library">
                              <Heart size={16} />
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleAddToKnowledge(msg.image_url!, 'image')} className="p-2.5 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all" title="Add to Knowledge">
                              <Plus size={16} />
                            </button>
                            <button onClick={() => handleShare('image', msg.image_url!, 'Generated Image')} className="p-2.5 bg-blue-600/80 rounded-xl text-white hover:bg-blue-600 transition-all" title="Share">
                              <Share2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Artifacts with Share Button */}
                  {msg.artifacts && msg.artifacts.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {msg.artifacts.map(art => (
                        <div key={art.id} className="flex gap-2">
                          <button onClick={() => setActiveArtifacts(msg.artifacts!)} className={`px-5 py-2.5 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-xl flex items-center gap-2 hover:bg-white/10 transition-all spring-hover shine-sweep gradient-border-glow`} style={{ color: theme.primary_color }}>
                            <Code size={14} /> VIEW_COMPONENT: {art.title}
                          </button>
                          <button onClick={() => handleShare('artifact', art.content, art.title)} className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all" title="Share">
                            <Share2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start spring-in">
              <div
                className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-white/10 rounded-2xl overflow-hidden holographic shadow-[0_0_40px_rgba(59,130,246,0.15)] cursor-pointer transition-all hover:border-blue-500/30"
                onClick={() => setProcessingExpanded(!processingExpanded)}
              >
                {/* Main Processing Bar */}
                <div className="px-6 py-4 flex items-center gap-4">
                  {/* Animated Icon */}
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                    <div className="absolute inset-1 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 animate-pulse" />
                    <Loader2 size={16} className="relative text-white animate-spin" />
                  </div>

                  {/* Status Text */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-white">
                        {currentTelemetry.length > 0 ? currentTelemetry[currentTelemetry.length - 1].label : 'Processing'}
                      </span>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {currentTelemetry.length > 0
                        ? currentTelemetry[currentTelemetry.length - 1].detail || 'Executing...'
                        : 'Initializing neural pathways...'}
                    </span>
                  </div>

                  {/* Expand/Collapse Toggle */}
                  <button
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all ml-auto"
                    title={processingExpanded ? "Hide details" : "Show details"}
                  >
                    {processingExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <Eye size={14} className="text-slate-400" />}
                  </button>
                </div>

                {/* Animated Progress Bar */}
                <div className="h-1 bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 animate-shimmer" style={{
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s ease-in-out infinite'
                  }} />
                </div>

                {/* Expanded Telemetry View */}
                {processingExpanded && currentTelemetry.length > 0 && (
                  <div className="px-6 py-4 border-t border-white/5 bg-black/40 max-h-48 overflow-y-auto custom-scrollbar">
                    <div className="space-y-2">
                      {currentTelemetry.slice(-5).map((step, idx) => (
                        <div key={step.id} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-3" style={{ animationDelay: `${idx * 50}ms` }}>
                          <div className={`w-1.5 h-1.5 rounded-full ${step.type === 'TOOL_EXEC' ? 'bg-amber-400' :
                            step.type === 'REASONING' ? 'bg-emerald-400' :
                              step.type === 'IMAGE_GEN' ? 'bg-pink-400' :
                                step.type === 'UPLINK' ? 'bg-blue-400' :
                                  'bg-purple-400'
                            }`} />
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{step.type}</span>
                          <span className="text-[10px] text-slate-300 font-mono">{step.label}</span>
                          {step.metrics?.latency && (
                            <span className="text-[8px] text-slate-500 ml-auto">{step.metrics.latency.toFixed(0)}ms</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {xrayActive && <div className="w-[450px] border-l border-white/5 bg-slate-950/80 backdrop-blur-3xl animate-in slide-in-from-right-full duration-700 shadow-2xl"><XRayVision telemetry={currentTelemetry} thinking={messages[messages.length - 1]?.thinking_log} accumulatedStats={sessionStats} /></div>}
      </div>

      <footer className="bg-slate-900/40 backdrop-blur-md border-t border-white/5 z-20 glass-premium">
        {/* Smart Suggestion Chips - Above Input */}
        {!isTyping && activeSuggestions.length > 0 && (
          <div className="px-8 pt-5 pb-3">
            <div className="flex flex-wrap gap-2 justify-start">
              {activeSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(suggestion)}
                  className="group px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/10 transition-all animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-blue-400 flex items-center gap-2">
                    <Sparkles size={12} className="text-blue-500/70 group-hover:text-blue-400" />
                    {suggestion}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-8 pb-5 pt-3">
          <div className="flex items-center gap-5">
            <button className={`p-4 rounded-2xl bg-white/5 text-slate-600 hover:text-white transition-all border border-white/5 hover:border-white/20 spring-hover`}><Paperclip size={20} /></button>
            <div className="flex-1 relative group">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} disabled={readOnly || isTyping} placeholder="Inject command sequence..." className={`w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4.5 text-[14px] font-mono text-white outline-none transition-all focus:border-blue-500/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.2)] focus-ring-premium`} style={{ caretColor: theme.primary_color }} />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <button onClick={() => handleSend()} disabled={!input.trim() || isTyping} className={`group p-4.5 rounded-2xl transition-all shadow-xl border border-transparent ripple ${!isTyping && input.trim() ? 'neon-breathe hover:scale-105' : ''}`} style={{ backgroundColor: isTyping ? 'transparent' : theme.primary_color, color: isTyping ? theme.primary_color : '#fff', '--glow-color': theme.primary_color } as React.CSSProperties}>
              {isTyping ? <StopCircle size={22} className="animate-pulse" /> : <Send size={22} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
            </button>
          </div>

          {/* Credits Indicator */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <Zap size={12} className="text-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {credits.plan === 'pro' ? 'UNLIMITED' : `${credits.remaining}/${credits.total} CREDITS`}
              </span>
            </div>
          </div>
        </div>
      </footer>
      {activeArtifacts && <ArtifactPane artifacts={activeArtifacts} onClose={() => setActiveArtifacts(null)} />}

      {/* Expanded Image Lightbox */}
      {expandedImage && (
        <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8" onClick={() => setExpandedImage(null)}>
          <button className="absolute top-6 right-6 p-3 bg-white/10 rounded-2xl text-white hover:bg-white/20 transition-all" onClick={() => setExpandedImage(null)}>
            <X size={24} />
          </button>
          <img src={expandedImage} alt="Expanded" className="max-w-full max-h-full rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()} />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
            <button onClick={e => { e.stopPropagation(); handleDownloadImage(expandedImage, ''); }} className="px-6 py-3 bg-white/10 rounded-xl text-white font-bold text-sm hover:bg-white/20 transition-all flex items-center gap-2">
              <Download size={16} /> Download
            </button>
            <button onClick={e => { e.stopPropagation(); handleSaveToLibrary(expandedImage, ''); }} className="px-6 py-3 bg-white/10 rounded-xl text-white font-bold text-sm hover:bg-white/20 transition-all flex items-center gap-2">
              <Heart size={16} /> Save to Library
            </button>
            <button onClick={e => { e.stopPropagation(); handleShare('image', expandedImage, 'Generated Image'); }} className="px-6 py-3 bg-blue-600 rounded-xl text-white font-bold text-sm hover:bg-blue-500 transition-all flex items-center gap-2">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && shareContent && (
        <div className="fixed inset-0 z-[1001] bg-black/80 backdrop-blur-xl flex items-center justify-center p-8" onClick={() => setShareModalOpen(false)}>
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white uppercase tracking-wider">Share Content</h3>
              <button onClick={() => setShareModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {shareContent.type === 'image' && (
              <div className="mb-6 rounded-xl overflow-hidden">
                <img src={shareContent.content} alt="Preview" className="w-full h-48 object-cover" />
              </div>
            )}

            <div className="space-y-4">
              <button onClick={handleCopyEmbed} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                <Code size={20} /> Copy Embed Code
              </button>
              <button onClick={handleCopyLink} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                <Link size={20} /> Copy Share Link
              </button>
              <button onClick={() => { navigator.clipboard.writeText(shareContent.content); alert('Content copied!'); }} className="w-full px-6 py-4 bg-blue-600 rounded-2xl text-white font-bold hover:bg-blue-500 transition-all flex items-center justify-center gap-3">
                <Copy size={20} /> Copy Raw Content
              </button>
            </div>

            <p className="mt-6 text-center text-[10px] text-slate-500 uppercase tracking-wider">
              Share your AI-generated content anywhere
            </p>
          </div>
        </div>
      )}

      {/* Upgrade Modal - shown when credits exhausted */}
      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={upgradeModal.closeModal}
        onMinimize={upgradeModal.minimizeModal}
        isMinimized={upgradeModal.isMinimized}
      />
    </div>
  );
}
