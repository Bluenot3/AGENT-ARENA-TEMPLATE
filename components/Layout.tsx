
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Terminal, Shield, Activity, Power, ChevronRight,
  BookOpen, Layers, Radar, PanelLeftClose, PanelLeft,
  ChevronLeft, LayoutGrid, Briefcase, Zap, Settings,
  Cpu, Database, Box, Image, Code, Gamepad2,
  Bot, Sparkles, Plus, Crown, Hexagon, Orbit, Flame,
  Satellite, Radio, Wifi, Signal
} from 'lucide-react';
import { AuthService, CreditsService } from '../services/store';
import { CreditsBalance } from '../types';
import Logo from './Logo';
import { ZenAgent, ZenArena, ZenKnowledge, ZenImageStudio, ZenSpark, ZenAppForge, ZenGameLab, ZenAnalytics, ZenKeys, ZenCrown, ZenPower } from './icons/ZenIcons';

const SidebarItem = ({ to, icon: Icon, label, isCollapsed, badge, gradient }: { to: string; icon: any; label: string; isCollapsed: boolean; badge?: string; gradient?: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 transition-all duration-300 group relative mx-2 rounded-xl mb-1 spring-hover shine-sweep ${isActive
        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]'
        : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border border-transparent hover:border-white/10'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <div className={`shrink-0 ${isCollapsed ? 'mx-auto' : ''} ${gradient && !isActive ? `w-7 h-7 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-shadow duration-500` : ''}`}>
          <Icon size={gradient && !isActive ? 14 : (isCollapsed ? 22 : 18)} className={`transition-all duration-300 group-hover:scale-110 ${isActive ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' : gradient ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
        </div>
        {!isCollapsed && (
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap overflow-hidden flex-1 group-hover:tracking-[0.25em] transition-all">
            {label}
          </span>
        )}
        {badge && !isCollapsed && (
          <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 uppercase neon-breathe-fast">{badge}</span>
        )}
        {isActive && !isCollapsed && (
          <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-blue-400 neon-breathe-fast shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
        )}
        {isCollapsed && isActive && (
          <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-r-full shadow-[0_0_15px_rgba(59,130,246,0.8)] neon-breathe"></div>
        )}
        {isCollapsed && (
          <div className="absolute left-full ml-4 px-4 py-2.5 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-[100] shadow-[0_0_30px_rgba(0,0,0,0.5),0_0_15px_rgba(59,130,246,0.2)] whitespace-nowrap translate-x-2 group-hover:translate-x-0">
            {label}
            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-900/95 border-l border-b border-white/10 rotate-45" />
          </div>
        )}
      </>
    )}
  </NavLink>
);


export default function Layout() {
  const user = AuthService.getUser();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('zen_sidebar_collapsed');
    return saved === 'true';
  });
  const [credits, setCredits] = useState<CreditsBalance>(CreditsService.getBalance());

  const isPublic = location.pathname.startsWith('/bot/');

  // Refresh credits periodically and on route change
  useEffect(() => {
    setCredits(CreditsService.getBalance());
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem('zen_sidebar_collapsed', String(isCollapsed));
  }, [isCollapsed]);

  if (isPublic) return <Outlet />;

  return (
    <div className="h-screen w-full flex bg-[#000205] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-700 ease-out bg-gradient-to-b from-slate-900/40 via-slate-900/30 to-slate-950/50 backdrop-blur-[80px] border-r border-white/[0.04] z-40 flex flex-col shrink-0 relative ${isCollapsed ? 'w-20' : 'w-72'
          }`}
        style={{ boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.02), 20px 0 80px rgba(0,0,0,0.3)' }}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-blue-400 flex items-center justify-center transition-all z-50 shadow-xl hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:border-blue-500/30 hover:scale-110 spring-hover"
        >
          <div className={`transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`}>
            <ChevronRight size={14} />
          </div>
        </button>

        <div className={`p-6 border-b border-white/5 flex items-center gap-4 transition-all duration-500 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-900 to-black flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4),inset_0_0_20px_rgba(59,130,246,0.1)] shrink-0 hover:scale-110 transition-transform border border-white/10 group">
            <Logo className="text-white w-7 h-7" animated={true} />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-[13px] font-black text-white tracking-tight leading-none uppercase">ZEN AI Co.</h1>
                <span className="text-[8px] font-bold text-slate-600">|</span>
                <span className="text-[10px] font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-widest uppercase">AI Arena</span>
              </div>
              <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                Systems Active
              </span>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-6 no-scrollbar">
          {/* Quick Create */}
          {!isCollapsed && (
            <div className="px-4 mb-4">
              <NavLink
                to="/create"
                className="group flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-[11px] uppercase tracking-widest hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all ripple shine-sweep neon-breathe"
              >
                <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                Create Agent
              </NavLink>
            </div>
          )}

          <section>
            {!isCollapsed && (
              <div className="px-6 pb-3 text-[8px] font-black text-slate-600 tracking-[0.4em] uppercase flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Hexagon size={8} className="text-white" />
                </div>
                Agent Hub
              </div>
            )}
            <SidebarItem to="/dashboard" icon={Terminal} label="Command" isCollapsed={isCollapsed} />
            <SidebarItem to="/marketplace" icon={LayoutGrid} label="Arenas" isCollapsed={isCollapsed} />
            <SidebarItem to="/knowledge" icon={BookOpen} label="Knowledge" isCollapsed={isCollapsed} />
          </section>

          <section>
            {!isCollapsed && (
              <div className="px-6 pb-3 text-[8px] font-black text-slate-600 tracking-[0.4em] uppercase flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles size={8} className="text-white" />
                </div>
                Creative Studios
                <span className="ml-auto px-1.5 py-0.5 rounded text-[6px] font-black bg-gradient-to-r from-cyan-500 to-blue-500 text-white">4</span>
              </div>
            )}
            <SidebarItem to="/studio/image" icon={Image} label="Image Studio" isCollapsed={isCollapsed} gradient="from-purple-600 to-pink-500" />
            <SidebarItem to="/studio/image-agents" icon={Sparkles} label="Agent Studio" isCollapsed={isCollapsed} gradient="from-rose-600 to-orange-500" badge="NEW" />
            <SidebarItem to="/studio/app" icon={Code} label="App Forge" isCollapsed={isCollapsed} gradient="from-emerald-600 to-teal-500" />
            <SidebarItem to="/studio/game" icon={Gamepad2} label="Game Lab" isCollapsed={isCollapsed} gradient="from-amber-600 to-yellow-500" badge="BETA" />
          </section>

          <section>
            {!isCollapsed && (
              <div className="px-6 pb-3 text-[8px] font-black text-slate-600 tracking-[0.4em] uppercase flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                  <Settings size={8} className="text-white" />
                </div>
                System
              </div>
            )}
            <SidebarItem to="/analytics" icon={Radar} label="Analytics" isCollapsed={isCollapsed} />
            <SidebarItem to="/keys" icon={Shield} label="API Keys" isCollapsed={isCollapsed} />
            <SidebarItem to="/subscription" icon={Crown} label="Subscription" isCollapsed={isCollapsed} />
          </section>
        </nav>

        <div className={`p-6 border-t border-white/5 bg-black/20 shrink-0 transition-all duration-500 ${isCollapsed ? 'px-2' : ''}`}>
          {!isCollapsed && (
            <NavLink
              to="/subscription"
              className={`block mb-4 p-4 rounded-2xl transition-all holographic gradient-border-glow group/credits ${credits.plan === 'pro' || credits.plan === 'enterprise'
                ? 'bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20'
                : credits.plan === 'plus'
                  ? 'bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/20'
                  : CreditsService.getLowCreditsWarning()
                    ? 'bg-gradient-to-r from-amber-600/10 to-red-600/10 border border-amber-500/30 animate-pulse'
                    : 'bg-gradient-to-r from-slate-600/10 to-slate-700/10 border border-white/10'
                }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {credits.plan === 'pro' || credits.plan === 'enterprise' ? (
                  <Crown size={16} className="text-purple-400 float-advanced" />
                ) : credits.plan === 'plus' ? (
                  <Zap size={16} className="text-blue-400 float-advanced" />
                ) : (
                  <Sparkles size={16} className="text-amber-400" />
                )}
                <span className="text-[10px] font-black text-white uppercase tracking-wider">
                  {credits.plan === 'pro' || credits.plan === 'enterprise' ? 'ZEN Pro' :
                    credits.plan === 'plus' ? 'ZEN Plus' : 'Free Trial'}
                </span>
                {credits.plan === 'free' && CreditsService.getLowCreditsWarning() && (
                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 uppercase ml-auto">Low</span>
                )}
              </div>
              <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 mb-1">
                <span>Credits</span>
                <span className={credits.plan === 'pro' || credits.plan === 'enterprise' ? 'text-purple-400' : credits.plan === 'plus' ? 'text-blue-400' : CreditsService.getLowCreditsWarning() ? 'text-amber-400' : 'text-slate-400'}>
                  {credits.plan === 'pro' || credits.plan === 'enterprise' ? '∞ Unlimited' : `${credits.remaining} / ${credits.total}`}
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all ${credits.plan === 'pro' || credits.plan === 'enterprise'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 w-full'
                    : credits.plan === 'plus'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      : CreditsService.getLowCreditsWarning()
                        ? 'bg-gradient-to-r from-amber-500 to-red-500'
                        : 'bg-gradient-to-r from-slate-500 to-slate-400'
                    }`}
                  style={{ width: credits.plan === 'pro' || credits.plan === 'enterprise' ? '100%' : `${(credits.remaining / credits.total) * 100}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
              {credits.plan === 'free' && (
                <div className="mt-3 text-[9px] font-bold text-slate-500 group-hover/credits:text-blue-400 transition-colors flex items-center gap-1">
                  Upgrade for more <ChevronRight size={10} />
                </div>
              )}
            </NavLink>
          )}

          <button
            onClick={AuthService.logout}
            className={`flex items-center gap-3 font-mono text-[9px] font-black text-slate-500 hover:text-rose-400 transition-all group ${isCollapsed ? 'justify-center w-full' : ''}`}
          >
            <div className={`${isCollapsed ? '' : 'p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 group-hover:bg-rose-500/20 transition-all'}`}>
              <Power size={isCollapsed ? 20 : 14} className="group-hover:rotate-180 transition-transform duration-500" />
            </div>
            {!isCollapsed && <span className="uppercase tracking-[0.2em]">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent relative overflow-hidden">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-slate-900/10 backdrop-blur-xl shrink-0 z-30">
          <div className="flex items-center gap-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Hexagon size={12} className="text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">ZEN</span>
            </div>
            <ChevronRight size={10} className="text-slate-700" />
            <span className="text-white uppercase">{location.pathname.substring(1).split('/')[0] || 'Dashboard'}</span>
            {/* Live Status Indicator */}
            <div className="flex items-center gap-2 ml-4 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 text-[8px]">LIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/40 border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-[10px] font-black">
                {user?.email.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <div className="text-[10px] font-bold text-white">{user?.email.split('@')[0]}</div>
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Pro Account</div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
          <div className="max-w-[1920px] mx-auto min-h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
