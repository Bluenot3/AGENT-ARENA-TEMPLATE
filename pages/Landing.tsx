import React, { useEffect, useState, useRef } from 'react';
import {
  Terminal, Shield, Zap, Activity, ChevronRight, Radar, Cpu, Globe,
  Sparkles, Image, Video, Code, Gamepad2, Wand2, Bot, Layers, Brain,
  ArrowRight, Play, Star, TrendingUp, Users, Rocket, Crown, Check,
  Palette, MessageSquare, Database, Settings, ChevronDown, Hexagon,
  Orbit, Fingerprint, Satellite
} from 'lucide-react';
import { AuthService } from '../services/store';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { ZenSymbol, ZenSpark, ZenAgent } from '../components/icons/ZenIcons';

const AI_MODELS = [
  { name: 'GPT-5.2 Apex', provider: 'OpenAI', badge: 'FLAGSHIP', color: '#10a37f' },
  { name: 'Claude 4.5 Opus', provider: 'Anthropic', badge: 'REASONING', color: '#cc785c' },
  { name: 'Sonnet 4.5', provider: 'Anthropic', badge: 'BALANCED', color: '#8b7355' },
  { name: 'Gemini 3 Pro', provider: 'Google', badge: 'MULTIMODAL', color: '#4285f4' },
  { name: 'Gemini 3 Flash', provider: 'Google', badge: 'FAST', color: '#34a853' },
  { name: 'Nano Banana Pro', provider: 'Google', badge: 'CREATIVE', color: '#fbbc04' },
  { name: 'Grok 2.5', provider: 'xAI', badge: 'UNFILTERED', color: '#1da1f2' },
  { name: 'DeepSeek R1', provider: 'DeepSeek', badge: 'REASONING', color: '#6366f1' },
];

const STUDIOS = [
  {
    id: 'agents',
    icon: Bot,
    title: 'Agent Builder',
    desc: 'Create intelligent AI agents with custom personalities, tools, and knowledge bases',
    color: 'from-blue-600 to-cyan-500',
    features: ['Multi-Model Support', '50+ AI Models', 'Custom Personas', 'Tool Integration']
  },
  {
    id: 'images',
    icon: Image,
    title: 'Image Studio',
    desc: 'Generate stunning visuals with DALL-E 3, Imagen 4, Nano Banana Pro & more',
    color: 'from-purple-600 to-pink-500',
    features: ['Style Mixing', 'Inpainting', 'Variations', 'Upscaling']
  },
  {
    id: 'video',
    icon: Video,
    title: 'Video Studio',
    desc: 'Create AI videos with Sora, Veo 2, and Runway Gen-3 Alpha',
    color: 'from-rose-600 to-orange-500',
    features: ['Text-to-Video', 'Image Animation', 'Style Transfer', '4K Export']
  },
  {
    id: 'apps',
    icon: Code,
    title: 'App Forge',
    desc: 'Build full-stack applications with AI-powered code generation',
    color: 'from-emerald-600 to-teal-500',
    features: ['React/Vue/Svelte', 'Live Preview', 'One-Click Deploy', 'API Builder']
  },
  {
    id: 'games',
    icon: Gamepad2,
    title: 'Game Lab',
    desc: 'Create 2D/3D games with AI-generated assets and logic',
    color: 'from-amber-600 to-yellow-500',
    features: ['Sprite Generation', 'Physics Engine', 'Level Design', 'Export to Unity']
  },
  {
    id: 'arena',
    icon: Layers,
    title: 'Multi-Agent Arena',
    desc: 'Orchestrate teams of AI agents working together on complex tasks',
    color: 'from-indigo-600 to-violet-500',
    features: ['Agent Teams', 'Role Assignment', 'Debate Mode', 'Collaboration']
  },
];

const STATS = [
  { label: 'AI Models', value: '50+', icon: Brain },
  { label: 'Active Users', value: '12.4K', icon: Users },
  { label: 'Creations', value: '1.2M', icon: Sparkles },
  { label: 'Uptime', value: '99.99%', icon: TrendingUp },
];

export default function Landing({ onLogin }: { onLogin: () => void }) {
  const navigate = useNavigate();
  const [glitch, setGlitch] = useState(false);
  const [activeStudio, setActiveStudio] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouse);

    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100);
    }, 5000);

    // Particle animation
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles: Array<{ x: number, y: number, vx: number, vy: number, size: number, alpha: number }> = [];
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.1
        });
      }

      const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 130, 246, ${p.alpha})`;
          ctx.fill();

          // Draw connections
          particles.slice(i + 1).forEach(p2 => {
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - dist / 120)})`;
              ctx.stroke();
            }
          });
        });

        requestAnimationFrame(animate);
      };
      animate();

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('mousemove', handleMouse);
        clearInterval(glitchInterval);
      };
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouse);
      clearInterval(glitchInterval);
    };
  }, []);

  const handleLogin = async () => {
    const user = await AuthService.login();
    onLogin();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-[#010309] selection:bg-blue-600/30">
      {/* Animated Background */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-60" />

      {/* Gradient Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-[120px] transition-all duration-[3000ms]"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.8) 0%, transparent 70%)',
            left: `${mousePos.x * 0.02}%`,
            top: `${mousePos.y * 0.02}%`,
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.8) 0%, transparent 70%)',
            right: '10%',
            bottom: '20%',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-10 blur-[80px]"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.8) 0%, transparent 70%)',
            left: '30%',
            top: '60%',
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-6 lg:px-16 flex items-center justify-between">
        <div className="flex items-center gap-4 bg-[#020617]/90 backdrop-blur-3xl px-6 py-4 rounded-2xl border border-white/10 shadow-2xl group hover:border-blue-500/30 transition-all duration-500">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] transition-all duration-500">
            <Logo className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-[16px] font-black text-white tracking-tight leading-none flex items-center gap-2">
              ZEN AI Co.
              <span className="text-[8px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">v7.2.0</span>
            </h1>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.25em]">Build. Deploy. Scale.</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <NavLink label="Studios" />
          <NavLink label="Pricing" />
          <NavLink label="Docs" />
          <NavLink label="Community" />
        </div>

        <button
          onClick={handleLogin}
          className="group relative overflow-hidden bg-white text-black px-8 py-4 rounded-2xl font-black text-sm transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-3">
            Launch Studio
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="absolute inset-0 z-10 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 text-white transition-opacity duration-500">
            Launch Studio
            <ArrowRight size={18} />
          </span>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 lg:pt-24 pb-32 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 px-6 py-3 rounded-full animate-pulse">
              <Sparkles size={16} className="text-amber-400" />
              <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Next-Gen AI Platform — 50+ Models Available</span>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Main Headline */}
          <div className={`text-center transition-all duration-100 ${glitch ? 'skew-x-1 translate-x-1' : ''}`}>
            <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter uppercase leading-[0.85] mb-8">
              <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_60px_rgba(255,255,255,0.3)]">
                ZEN AI
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_80px_rgba(59,130,246,0.4)] animate-gradient">
                Platform
              </span>
            </h2>

            <p className="text-lg md:text-2xl text-slate-300 font-medium max-w-4xl mx-auto leading-relaxed mb-12">
              The elite AI platform for building intelligent agents, generating stunning visuals, and forging apps —
              <span className="text-white font-bold">powered by 50+ cutting-edge AI models.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-20">
              <button
                onClick={handleLogin}
                className="group bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-16 py-7 rounded-[2rem] font-black text-lg uppercase tracking-wider hover:shadow-[0_0_80px_rgba(59,130,246,0.4)] transition-all active:scale-95 flex items-center gap-4"
              >
                <Rocket size={24} />
                Start Creating Free
                <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>

              <button className="group flex items-center gap-4 text-slate-400 hover:text-white transition-colors px-8 py-7">
                <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Play size={20} fill="currentColor" className="ml-1" />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest">Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
              {STATS.map((stat, i) => (
                <div key={i} className="flex items-center gap-4 px-8 py-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <stat.icon size={24} className="text-blue-400" />
                  <div className="text-left">
                    <div className="text-3xl font-black text-white">{stat.value}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Models Ticker */}
      <section className="relative z-10 py-12 border-y border-white/5 bg-black/40 backdrop-blur-xl overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...AI_MODELS, ...AI_MODELS].map((model, i) => (
            <div key={i} className="inline-flex items-center gap-4 mx-8 px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: model.color }} />
              <span className="text-white font-bold">{model.name}</span>
              <span className="text-[9px] font-black px-2 py-1 rounded-lg bg-white/10 text-slate-400 uppercase tracking-wider">{model.badge}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Studios Section */}
      <section className="relative z-10 py-32 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 px-5 py-2 rounded-full mb-8">
              <Wand2 size={16} className="text-purple-400" />
              <span className="text-[10px] font-black text-purple-300 uppercase tracking-[0.3em]">Creative Studios</span>
            </div>
            <h3 className="text-5xl md:text-7xl font-black text-white tracking-tight uppercase mb-6">
              One Platform.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Infinite Possibilities.</span>
            </h3>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Everything you need to bring your AI-powered ideas to life. No coding required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {STUDIOS.map((studio, i) => (
              <div
                key={studio.id}
                className="group relative p-8 rounded-[3rem] bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-white/30 transition-all duration-700 overflow-hidden cursor-pointer hover:shadow-[0_0_80px_rgba(59,130,246,0.1)]"
                onMouseEnter={() => setActiveStudio(i)}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br ${studio.color}`} />

                <div className="relative z-10">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${studio.color} flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                    <studio.icon size={36} className="text-white" />
                  </div>

                  <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-4">{studio.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8">{studio.desc}</p>

                  <div className="flex flex-wrap gap-2">
                    {studio.features.map((f, j) => (
                      <span key={j} className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 uppercase tracking-wider border border-white/5">
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center gap-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <span className="text-xs font-black uppercase tracking-widest">Open Studio</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-32 px-6 lg:px-16 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/20 px-5 py-2 rounded-full mb-8">
                <Crown size={16} className="text-cyan-400" />
                <span className="text-[10px] font-black text-cyan-300 uppercase tracking-[0.3em]">Why Choose Us</span>
              </div>
              <h3 className="text-5xl md:text-6xl font-black text-white tracking-tight uppercase mb-8">
                Power Meets<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Simplicity</span>
              </h3>
              <p className="text-lg text-slate-400 leading-relaxed mb-12">
                Access the world's most powerful AI models through an intuitive interface.
                No complex APIs to learn, no infrastructure to manage.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Brain, text: '50+ AI models from OpenAI, Anthropic, Google, xAI & more' },
                  { icon: Zap, text: 'Real-time generation with sub-second latency' },
                  { icon: Shield, text: 'Enterprise-grade security & data encryption' },
                  { icon: Settings, text: 'Full customization with no-code tools' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <item.icon size={22} />
                    </div>
                    <span className="text-white font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-[4rem] blur-3xl" />
              <div className="relative p-8 rounded-[4rem] bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/20 shadow-2xl">
                <div className="aspect-video rounded-3xl bg-black/60 border border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="text-center p-12">
                    <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center animate-pulse">
                      <Play size={40} className="text-white ml-2" fill="white" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Interactive Demo Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto text-center">
          <div className="relative p-16 rounded-[4rem] bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-600/20 border border-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.3),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(139,92,246,0.3),transparent_50%)]" />

            <div className="relative z-10">
              <h3 className="text-5xl md:text-7xl font-black text-white tracking-tight uppercase mb-8">
                Ready to Create?
              </h3>
              <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                Join thousands of creators building the future with AI. Start free, upgrade when you're ready.
              </p>
              <button
                onClick={handleLogin}
                className="bg-white text-black px-20 py-8 rounded-[2rem] font-black text-xl uppercase tracking-wider hover:shadow-[0_0_100px_rgba(255,255,255,0.4)] transition-all active:scale-95 inline-flex items-center gap-5"
              >
                <Sparkles size={28} />
                Get Started Free
                <ChevronRight size={28} />
              </button>

              <p className="mt-8 text-sm text-slate-500">
                No credit card required • Unlimited free tier • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 lg:px-16 py-16 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                <Logo className="text-white w-7 h-7" />
              </div>
              <div>
                <h4 className="text-white font-black">ZEN AI Co.</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Build. Deploy. Scale.</p>
              </div>
            </div>

            <div className="flex gap-12 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">Pricing</a>
              <a href="#" className="hover:text-white transition-colors">Blog</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
            </div>

            <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              © 2026 ZEN AI Co. • v7.2.0 • Elite Platform
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s ease infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div >
  );
}

function NavLink({ label }: { label: string }) {
  return (
    <a href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">
      {label}
    </a>
  );
}