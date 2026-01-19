
import React, { useEffect, useState } from 'react';
import { BotService, AnalyticsService, ArenaService } from '../services/store';
import { BotConfig, ArenaConfig } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Terminal, Eye, Edit3, Trash2, Cpu, Database,
  Activity, Shield, Radio, Server, Boxes, Zap, Layout,
  Flame, Globe, ShieldCheck, Waves, Target, Binary,
  Image, Video, Code, Gamepad2, Sparkles, Bot, ChevronRight,
  Brain, TrendingUp, Users, ArrowRight, Hexagon, Orbit,
  Rocket, Crown, Star, Layers3, Satellite, Fingerprint
} from 'lucide-react';
import { ZenArena, ZenAgent, ZenSpark, ZenCrown } from '../components/icons/ZenIcons';

const STUDIOS = [
  {
    id: 'image',
    path: '/studio/image',
    icon: Image,
    title: 'Image Studio',
    desc: 'Generate stunning AI images with elite quality',
    gradient: 'from-purple-600 to-pink-500',
    stats: '47 styles',
    glow: 'shadow-purple-500/20'
  },
  {
    id: 'app',
    path: '/studio/app',
    icon: Code,
    title: 'App Forge',
    desc: 'Build full-stack apps with AI precision',
    gradient: 'from-emerald-600 to-teal-500',
    stats: 'React, Vue, Svelte',
    glow: 'shadow-emerald-500/20'
  },
  {
    id: 'game',
    path: '/studio/game',
    icon: Gamepad2,
    title: 'Game Lab',
    desc: 'Create immersive 2D/3D games',
    gradient: 'from-amber-600 to-yellow-500',
    stats: 'Unity export',
    badge: 'BETA',
    glow: 'shadow-amber-500/20'
  },
];


function MetricBox({ label, value, sub, icon: Icon, color = "text-blue-400", index = 0, gradient }: any) {
  return (
    <div
      className="ultra-glass holographic p-8 flex flex-col gap-6 relative overflow-hidden group rounded-[2.5rem] stagger-reveal animated-border hover:scale-[1.02] transition-all duration-500"
      style={{ '--stagger-index': index, '--glow-color': 'rgba(59, 130, 246, 0.4)' } as React.CSSProperties}
    >
      {/* Premium corner accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient || 'from-blue-500/10 to-cyan-500/10'} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

      {/* Animated background icon */}
      <div className="absolute -top-10 -right-10 p-10 opacity-[0.03] text-blue-500 group-hover:scale-150 group-hover:opacity-[0.15] group-hover:rotate-12 transition-all duration-1000 ease-out">
        <Icon size={160} />
      </div>

      {/* Floating liquid orb decoration */}
      <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-2xl group-hover:scale-[2] transition-all duration-1000 opacity-0 group-hover:opacity-100 liquid-blob" />

      {/* Corner data node */}
      <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-blue-500/50 group-hover:bg-blue-400 transition-colors data-node" style={{ position: 'absolute', animation: 'dataNodePulse 2s ease-in-out infinite' }} />

      <div className="flex items-center gap-4 relative z-10">
        <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${gradient || 'from-blue-600/20 to-cyan-600/20'} border border-blue-500/30 text-blue-500 shadow-[inset_0_0_25px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-500 spring-hover`}>
          <Icon size={20} />
        </div>
        <span className="text-[11px] font-black text-slate-500 tracking-[0.2em] uppercase group-hover:text-slate-400 transition-colors">{label}</span>
      </div>

      <div className="space-y-3 relative z-10">
        <div className={`text-6xl font-black tracking-tighter ${color} drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] leading-none group-hover:scale-105 transition-transform duration-500 count-animate holo-text`}>{value}</div>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">{sub}</div>
      </div>

      {/* Animated progress bar */}
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-6 relative">
        <div className={`h-full bg-gradient-to-r ${gradient || 'from-blue-500 to-cyan-500'} rounded-full opacity-60 group-hover:opacity-100 transition-all duration-700`} style={{ width: '85%', animation: 'morphGradient 3s ease infinite' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>

      {/* Accent line at bottom */}
      <div className="accent-line" />
    </div>
  );
}



interface StudioItem {
  id: string;
  path: string;
  icon: any;
  title: string;
  desc: string;
  gradient: string;
  stats: string;
  glow?: string;
  badge?: string;
}

function StudioCard({ studio, index = 0 }: { studio: StudioItem; index?: number }) {
  return (
    <Link
      to={studio.path}
      className={`group relative p-7 rounded-[2rem] liquid-glass border border-white/[0.06] hover:border-white/20 transition-all duration-700 overflow-hidden holographic shine-sweep stagger-reveal animated-border hover:${studio.glow || 'shadow-blue-500/20'}`}
      style={{ '--stagger-index': index } as React.CSSProperties}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-700 bg-gradient-to-br ${studio.gradient}`} />

      {/* Animated corner glow - liquid blob */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${studio.gradient} blur-3xl opacity-0 group-hover:opacity-40 transition-all duration-700 liquid-blob`} />

      {/* Floating glass shard decoration */}
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-white/[0.02] to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-1000" />

      {/* Data node indicator */}
      <div className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br ${studio.gradient} opacity-50 group-hover:opacity-100`} style={{ animation: 'dataNodePulse 3s ease-in-out infinite' }} />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${studio.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] transition-all duration-500 spring-hover relative`}>
            <studio.icon size={26} className="text-white group-hover:rotate-12 transition-transform duration-500" />
            {/* Icon glow ring */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${studio.gradient} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-[14px] font-black text-white uppercase tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-300 transition-all holo-text">{studio.title}</h4>
              {studio.badge && (
                <span className="text-[8px] font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 uppercase neon-breathe-fast">{studio.badge}</span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1 group-hover:text-slate-400 transition-colors">{studio.desc}</p>
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mt-2 inline-block group-hover:text-blue-400 transition-colors font-mono">{studio.stats}</span>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-white/5 text-slate-600 group-hover:bg-white/10 group-hover:text-white transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1 spring-hover">
          <ChevronRight size={18} />
        </div>
      </div>

      {/* Accent line at bottom */}
      <div className="accent-line" />
    </Link>
  );
}



export default function Dashboard() {
  const [bots, setBots] = useState<BotConfig[]>([]);
  const [arenas, setArenas] = useState<ArenaConfig[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setBots(BotService.getBots());
    setArenas(ArenaService.getArenas());
  }, []);

  const handleDeleteBot = (id: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      BotService.deleteBot(id);
      setBots(BotService.getBots());
    }
  };

  const handleDeleteArena = (id: string) => {
    if (confirm('Are you sure you want to delete this arena?')) {
      ArenaService.deleteArena(id);
      setArenas(ArenaService.getArenas());
    }
  };

  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 pb-40 relative">

      {/* ═══ SUPERCHARGED AMBIENT DECORATIONS ═══ */}

      {/* Code Rain Effect */}
      <div className="code-rain" />

      {/* Floating Liquid Glass Shards */}
      <div className="glass-shard" style={{ top: '5%', left: '3%', animationDelay: '0s' }} />
      <div className="glass-shard" style={{ top: '40%', right: '5%', animationDelay: '-4s', width: 180, height: 180 }} />
      <div className="glass-shard" style={{ bottom: '15%', left: '8%', animationDelay: '-8s', width: 140, height: 140 }} />

      {/* Parallax Liquid Orbs */}
      <div className="parallax-orb parallax-orb-1 liquid-blob" />
      <div className="parallax-orb parallax-orb-2 liquid-blob" style={{ animationDelay: '-7s' }} />
      <div className="parallax-orb parallax-orb-3 liquid-blob" style={{ animationDelay: '-14s' }} />

      {/* Pulsing Data Nodes */}
      <div className="data-node" style={{ top: '20%', left: '12%', animationDelay: '0s' }} />
      <div className="data-node" style={{ top: '35%', right: '18%', animationDelay: '-1s' }} />
      <div className="data-node" style={{ bottom: '30%', left: '25%', animationDelay: '-2s' }} />
      <div className="data-node" style={{ top: '60%', right: '8%', animationDelay: '-1.5s' }} />

      {/* Hexagon Grid Overlay */}
      <div className="absolute inset-0 hex-grid opacity-30 pointer-events-none" />

      {/* Hero Section */}
      <div className="flex flex-col 2xl:flex-row 2xl:items-end justify-between gap-16 relative">
        {/* Ambient glow */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none liquid-blob" />
        <div className="absolute -top-20 right-20 w-60 h-60 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none liquid-blob" style={{ animationDelay: '-5s' }} />

        <div className="space-y-8 relative z-10">
          <div className="flex items-center gap-5 stagger-reveal" style={{ '--stagger-index': 0 } as React.CSSProperties}>
            <div className="w-4 h-4 rounded-full bg-blue-600 neon-breathe-fast shadow-[0_0_30px_rgba(59,130,246,1)] pulse-ring"></div>
            <div className="text-blue-500 font-mono text-[11px] font-bold tracking-[0.2em] uppercase holo-text">
              <span className="typewriter-code">ZEN Agent Studio • SYSTEMS ACTIVE</span>
            </div>
          </div>
          <h1 className="text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] drop-shadow-[0_0_80px_rgba(255,255,255,0.15)] stagger-reveal" style={{ '--stagger-index': 1 } as React.CSSProperties}>
            <span className="inline-block hover:scale-105 transition-transform cursor-default holo-text">Command</span><br />
            <span className="inline-block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent hover:scale-105 transition-transform cursor-default bg-[length:200%_auto] animate-gradient">Center</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-3xl border-l-2 border-blue-600 pl-8 stagger-reveal hover:text-slate-400 transition-colors" style={{ '--stagger-index': 2 } as React.CSSProperties}>
            Build AI agents, generate stunning visuals, create apps and games — all powered by <span className="text-blue-400 font-bold">50+ cutting-edge AI models</span>.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 stagger-reveal" style={{ '--stagger-index': 3 } as React.CSSProperties}>
          <Link
            to="/create"
            className="group bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-12 py-6 rounded-[2rem] font-black text-[14px] uppercase tracking-widest hover:shadow-[0_0_80px_rgba(59,130,246,0.7)] transition-all shadow-xl flex items-center gap-4 active:scale-95 ripple shine-sweep neon-breathe animated-border"
          >
            <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
            Create Agent
          </Link>
          <Link
            to="/arena/new"
            className="group bg-white/5 text-white px-12 py-6 rounded-[2rem] font-black text-[14px] uppercase tracking-widest hover:bg-white/10 transition-all shadow-xl flex items-center gap-4 active:scale-95 border border-white/10 hover:border-white/30 shine-sweep animated-border"
          >
            <Target size={20} strokeWidth={3} className="group-hover:rotate-12 transition-transform duration-300" />
            Create Arena
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricBox label="Active Agents" value={bots.length.toString().padStart(2, '0')} sub="Deployed Units" icon={Bot} index={0} gradient="from-blue-500/20 to-cyan-500/20" />
        <MetricBox label="Arenas" value={arenas.length.toString().padStart(2, '0')} sub="Active Environments" icon={Layout} color="text-cyan-400" index={1} gradient="from-cyan-500/20 to-teal-500/20" />
        <MetricBox label="AI Models" value="50+" sub="Available Models" icon={Brain} color="text-purple-400" index={2} gradient="from-purple-500/20 to-pink-500/20" />
        <MetricBox label="Generation" value="∞" sub="Unlimited Creations" icon={Sparkles} color="text-amber-400" index={3} gradient="from-amber-500/20 to-orange-500/20" />
      </div>

      {/* Creative Studios */}
      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Sparkles size={28} className="text-purple-500" />
            <div>
              <h2 className="text-[18px] font-black text-white uppercase tracking-widest">Creative Studios</h2>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Generate images, videos, apps, and games with AI</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STUDIOS.map((studio, idx) => (
            <StudioCard key={studio.id} studio={studio} index={idx} />
          ))}
        </div>
      </section>

      {/* Arena Hub */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-white/5 pb-10">
          <div className="flex items-center gap-6">
            <Globe size={32} className="text-blue-500 animate-pulse-slow" />
            <h2 className="text-[18px] font-black text-white uppercase tracking-widest">Arenas</h2>
          </div>
          <Link to="/arena/new" className="text-[11px] font-black text-blue-500 hover:text-white transition-colors uppercase tracking-widest">Create New +</Link>
        </div>

        {arenas.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] text-slate-600 bg-white/[0.02]">
            <p className="text-sm font-bold uppercase tracking-widest mb-4">No Arenas Deployed</p>
            <Link to="/arena/new" className="text-blue-500 hover:underline text-sm">Create your first arena</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
            {arenas.map(arena => (
              <div key={arena.id} className="liquid-glass group rounded-[3.5rem] p-1.5 border-white/5 hover:border-blue-500/60 transition-all duration-1000 overflow-hidden relative shadow-2xl">
                <div className="p-10 bg-black/50 rounded-[3.3rem] space-y-8 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                      <Layout size={28} />
                    </div>
                    <div className="flex gap-3">
                      <Link to={`/arena/edit/${arena.id}`} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all">
                        <Edit3 size={18} />
                      </Link>
                      <button onClick={() => handleDeleteArena(arena.id)} className="p-3 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter truncate">{arena.name}</h3>
                    <p className="text-[12px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                      <Cpu size={14} className="text-blue-600" /> {arena.bot_ids.length} Agents
                    </p>
                  </div>
                  <Link to={`/bot/${arena.slug}`} className="w-full py-5 bg-white text-black rounded-3xl font-black text-[13px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95">
                    Enter Arena <Radio size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Asset Repository */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-white/5 pb-10">
          <div className="flex items-center gap-6">
            <Server size={32} className="text-slate-700" />
            <h2 className="text-[18px] font-black text-slate-500 uppercase tracking-widest">My Agents</h2>
          </div>
        </div>

        {bots.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] text-slate-600 bg-white/[0.02]">
            <p className="text-sm font-bold uppercase tracking-widest mb-4">No Agents Found</p>
            <Link to="/create" className="text-blue-500 hover:underline text-sm">Create your first agent</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
            {bots.map(bot => (
              <div key={bot.id} className="liquid-glass group rounded-[3.5rem] p-1.5 border-white/5 hover:border-blue-500/60 transition-all duration-1000 shadow-2xl">
                <div className="p-10 bg-black/50 rounded-[3.3rem] space-y-10">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-inner overflow-hidden relative">
                      {bot.avatar_url ? (
                        <img src={bot.avatar_url} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <Terminal size={24} className="text-slate-600" />
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Link to={`/edit/${bot.id}`} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all">
                        <Edit3 size={18} />
                      </Link>
                      <button onClick={() => handleDeleteBot(bot.id)} className="p-3 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter truncate leading-tight">{bot.name}</h3>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-black px-3 py-1 rounded-lg bg-blue-600/10 text-blue-500 border border-blue-500/20 uppercase tracking-widest truncate max-w-[150px]">{bot.model_config.primary_model}</span>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => navigate(`/workspace/${bot.id}`)}
                      className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/30 active:scale-95"
                    >
                      Chat
                    </button>
                    <Link to={`/bot/${bot.slug}`} target="_blank" className="p-5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-500 hover:text-white rounded-3xl transition-all group-hover:border-blue-500/40">
                      <Globe size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
