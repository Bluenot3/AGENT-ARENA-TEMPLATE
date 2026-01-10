
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  Terminal, Shield, Activity, Power, ChevronRight, 
  BookOpen, Layers, Radar, PanelLeftClose, PanelLeft,
  ChevronLeft, LayoutGrid, Briefcase, Zap, Settings,
  Cpu, Database, Box
} from 'lucide-react';
import { AuthService } from '../services/store';
import Logo from './Logo';

const SidebarItem = ({ to, icon: Icon, label, isCollapsed }: { to: string; icon: any; label: string, isCollapsed: boolean }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 transition-all duration-300 group relative mx-2 rounded-xl mb-1 ${
        isActive
          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
          : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border border-transparent'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <Icon size={isCollapsed ? 22 : 18} className={`transition-all duration-300 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'} ${isCollapsed ? 'mx-auto' : ''}`} />
        {!isCollapsed && (
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap overflow-hidden">
            {label}
          </span>
        )}
        {isActive && !isCollapsed && (
          <div className="absolute right-4 w-1 h-1 rounded-full bg-blue-400 animate-pulse"></div>
        )}
        {isCollapsed && isActive && (
          <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
        )}
        {isCollapsed && (
          <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-[10px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[100] shadow-2xl whitespace-nowrap">
            {label}
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

  const isPublic = location.pathname.startsWith('/bot/');

  useEffect(() => {
    localStorage.setItem('zen_sidebar_collapsed', String(isCollapsed));
  }, [isCollapsed]);

  if (isPublic) return <Outlet />;

  return (
    <div className="h-screen w-full flex bg-[#000205] overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`transition-all duration-500 ease-in-out bg-slate-900/20 backdrop-blur-3xl border-r border-white/5 z-40 flex flex-col shrink-0 relative ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-blue-400 flex items-center justify-center transition-all z-50 shadow-xl"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className={`p-6 border-b border-white/5 flex items-center gap-4 transition-all duration-500 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shrink-0">
            <Logo className="text-white w-4 h-4" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-[12px] font-black text-white tracking-tighter leading-none uppercase">Zen Foundry</h1>
              <span className="text-[7px] text-emerald-500 font-black uppercase tracking-[0.2em]">Core Secure</span>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-8 no-scrollbar">
          <section>
            {!isCollapsed && <div className="px-8 pb-3 text-[8px] font-black text-slate-600 tracking-[0.4em] uppercase">Intelligence</div>}
            <SidebarItem to="/dashboard" icon={Terminal} label="Command" isCollapsed={isCollapsed} />
            <SidebarItem to="/knowledge" icon={BookOpen} label="Vault" isCollapsed={isCollapsed} />
            <SidebarItem to="/marketplace" icon={LayoutGrid} label="Arena" isCollapsed={isCollapsed} />
            <SidebarItem to="/analytics" icon={Radar} label="Telemetry" isCollapsed={isCollapsed} />
          </section>
          
          <section>
            {!isCollapsed && <div className="px-8 pb-3 text-[8px] font-black text-slate-600 tracking-[0.4em] uppercase">Resources</div>}
            <SidebarItem to="/keys" icon={Shield} label="Credentials" isCollapsed={isCollapsed} />
            <SidebarItem to="/subscription" icon={Activity} label="System" isCollapsed={isCollapsed} />
          </section>
        </nav>

        <div className={`p-6 border-t border-white/5 bg-black/20 shrink-0 transition-all duration-500 ${isCollapsed ? 'px-2' : ''}`}>
          {!isCollapsed && (
            <div className="mb-4">
              <div className="flex justify-between items-center text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">
                <span>Sync Status</span>
                <span className="text-blue-400">98.2%</span>
              </div>
              <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[98%]"></div>
              </div>
            </div>
          )}

          <button 
            onClick={AuthService.logout}
            className={`flex items-center gap-3 font-mono text-[9px] font-black text-slate-500 hover:text-rose-400 transition-all group ${isCollapsed ? 'justify-center w-full' : ''}`}
          >
            <Power size={isCollapsed ? 20 : 14} />
            {!isCollapsed && <span className="uppercase tracking-[0.2em]">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent relative overflow-hidden">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-8 bg-slate-900/10 backdrop-blur-xl shrink-0 z-30">
          <div className="flex items-center gap-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">
            <Layers size={14} className="text-blue-500" />
            <span>Foundry</span>
            <ChevronRight size={10} className="text-slate-700" />
            <span className="text-slate-100 uppercase">{location.pathname.substring(1).split('/')[0] || 'Dashboard'}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-lg bg-black/40 border border-white/5">
              <span className="text-[8px] font-mono text-blue-400 uppercase tracking-tighter">OP: {user?.email.split('@')[0].toUpperCase()}</span>
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
