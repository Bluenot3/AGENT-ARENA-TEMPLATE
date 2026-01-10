
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Paperclip, StopCircle, RotateCw, Cpu, Activity, 
  ImageIcon, Maximize2, Minimize2, Microscope, Code, 
  Zap, Share2, Terminal, Info, ChevronDown, Sparkles
} from 'lucide-react';
import { BotConfig, Message, Artifact, TelemetryStep, BotThemeConfig, SessionAccumulator } from '../types';
import { ModelRouter } from '../services/llm';
import ArtifactPane from './ArtifactPane';
import XRayVision from './XRayVision';

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
  
  const [sessionStats, setSessionStats] = useState<SessionAccumulator>({
    total_tokens: 0,
    total_energy: 0,
    tool_calls: 0,
    avg_latency: 0,
    messages_count: 0,
    start_time: Date.now()
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = { ...DEFAULT_THEME, ...bot.theme_config };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, activeSuggestions]);

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
      <header className="px-8 py-5 border-b border-white/5 bg-slate-900/40 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center gap-5">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center" style={{ color: theme.primary_color }}><Cpu size={20} /></div>
          <div>
            <h3 className="text-[13px] font-black tracking-[0.2em] uppercase flex items-center gap-2" style={{ color: theme.light_mode ? '#000' : '#fff' }}>
              {bot.name} <div className="w-2 h-2 rounded-full status-pulse" style={{ backgroundColor: theme.primary_color }}></div>
            </h3>
            <span className="text-[9px] font-mono uppercase opacity-50" style={{ color: theme.light_mode ? '#333' : '#ccc' }}>{bot.model_config.primary_model}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setXrayActive(!xrayActive)} className={`p-2.5 rounded-xl border transition-all ${xrayActive ? 'text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`} style={{ backgroundColor: xrayActive ? theme.primary_color : undefined }}><Microscope size={16} /></button>
          <button onClick={() => setIsExpanded(!isExpanded)} className={`p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white transition-all`}>{isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button>
          <button onClick={() => setMessages([])} className={`p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-rose-400 transition-all`}><RotateCw size={16} /></button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative z-10">
        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar relative z-10 pb-32">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`w-full ${msg.role === 'user' ? 'max-w-[70%]' : 'max-w-[85%]'}`}>
                <div className={`flex items-center gap-3 mb-3 ${msg.role === 'user' ? 'flex-row-reverse text-right' : ''}`}>
                   <span className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: theme.primary_color }}>{msg.role === 'user' ? 'OPERATOR' : 'UNIT'}</span>
                </div>
                <div className={`p-6 transition-all border`} style={getBubbleStyle(msg.role)}>
                  <div className="leading-relaxed whitespace-pre-wrap font-mono prose prose-invert max-w-none">{msg.content}</div>
                  {msg.image_url && <div className="mt-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl max-w-lg"><img src={msg.image_url} alt="Gen" className="w-full h-auto" /></div>}
                  {msg.artifacts && msg.artifacts.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {msg.artifacts.map(art => (
                        <button key={art.id} onClick={() => setActiveArtifacts(msg.artifacts!)} className={`px-5 py-2.5 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-xl flex items-center gap-2 hover:bg-white/10 transition-all`} style={{ color: theme.primary_color }}>
                           <Code size={14} /> VIEW_COMPONENT: {art.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && <div className="flex justify-start"><div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4"><div className="flex gap-1.5"><div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: theme.primary_color }}></div><div className="w-1.5 h-1.5 rounded-full animate-bounce delay-75" style={{ backgroundColor: theme.primary_color }}></div><div className="w-1.5 h-1.5 rounded-full animate-bounce delay-150" style={{ backgroundColor: theme.primary_color }}></div></div><span className="text-[9px] font-black uppercase" style={{ color: theme.primary_color }}>Processing...</span></div></div>}
          <div ref={messagesEndRef} />
        </div>

        {!isTyping && activeSuggestions.length > 0 && (
           <div className="absolute bottom-32 left-0 right-0 z-20 flex justify-center px-4 pointer-events-none">
              <div className="flex flex-wrap gap-3 justify-center pointer-events-auto max-w-4xl">
                 {activeSuggestions.map((suggestion, idx) => (
                    <button key={idx} onClick={() => handleSend(suggestion)} className="group px-6 py-3 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl hover:border-blue-500/50 transition-all animate-in fade-in slide-in-from-bottom-4">
                       <span className="text-[11px] font-bold text-slate-300 group-hover:text-blue-400 flex items-center gap-2"><Sparkles size={12} className="text-blue-500" />{suggestion}</span>
                    </button>
                 ))}
              </div>
           </div>
        )}

        {xrayActive && <div className="w-[450px] border-l border-white/5 bg-slate-950/80 backdrop-blur-3xl animate-in slide-in-from-right-full duration-700 shadow-2xl"><XRayVision telemetry={currentTelemetry} thinking={messages[messages.length-1]?.thinking_log} accumulatedStats={sessionStats} /></div>}
      </div>

      <footer className="p-8 bg-slate-900/40 backdrop-blur-md border-t border-white/5 z-20">
        <div className="flex items-center gap-5">
          <button className={`p-4 rounded-2xl bg-white/5 text-slate-600 hover:text-white transition-all border border-white/5`}><Paperclip size={20} /></button>
          <div className="flex-1 relative group">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} disabled={readOnly || isTyping} placeholder="Inject command sequence..." className={`w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4.5 text-[14px] font-mono text-white outline-none transition-all`} style={{ caretColor: theme.primary_color }} />
          </div>
          <button onClick={() => handleSend()} disabled={!input.trim() || isTyping} className={`p-4.5 rounded-2xl transition-all shadow-xl border border-transparent`} style={{ backgroundColor: isTyping ? undefined : theme.primary_color, color: isTyping ? theme.primary_color : '#fff' }}>{isTyping ? <StopCircle size={22} className="animate-pulse" /> : <Send size={22} />}</button>
        </div>
      </footer>
      {activeArtifacts && <ArtifactPane artifacts={activeArtifacts} onClose={() => setActiveArtifacts(null)} />}
    </div>
  );
}
