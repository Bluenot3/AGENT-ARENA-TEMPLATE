import React, { useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Bot, Command, FlaskConical, Moon, PanelsTopLeft, Store, Sun, Wrench } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Tooltip } from '../ui/Tooltip';
import { useAgentStore } from '../../stores/AgentStore';
import { CreateAgentWizard } from '../agents/CreateAgentWizard';
import { AuthService } from '../../services/store';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: PanelsTopLeft },
  { to: '/agents', label: 'My Agents', icon: Bot },
  { to: '/marketplace', label: 'Marketplace', icon: Store },
  { to: '/labs', label: 'Labs', icon: FlaskConical },
  { to: '/settings', label: 'Settings', icon: Wrench }
];

export const AppShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { agents, usage, selectedAgentId, runAgent, duplicateAgent } = useAgentStore();
  const [isInspectorOpen, setInspectorOpen] = useState(true);
  const [isWizardOpen, setWizardOpen] = useState(false);
  const [isDark, setDark] = useState(() => localStorage.getItem('agent_os_theme') !== 'light');

  const selectedAgent = useMemo(() => agents.find((agent) => agent.id === selectedAgentId), [agents, selectedAgentId]);
  const lastRun = usage.find((item) => item.agentId === selectedAgentId);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setWizardOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  React.useEffect(() => {
    localStorage.setItem('agent_os_theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#060b18] text-white' : 'bg-slate-100 text-slate-900'}`}>
      <CreateAgentWizard open={isWizardOpen} onClose={() => setWizardOpen(false)} />
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-2 text-lg font-semibold"><Command /> Agent OS</div>
          <nav className="space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-indigo-500 text-white' : 'hover:bg-white/10'}`}>
                <Icon size={16} /> {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b border-white/10 bg-white/5 px-4 backdrop-blur-xl">
            <button onClick={() => setWizardOpen(true)} className="flex items-center gap-2 text-sm text-slate-300">
              <span className="rounded bg-white/10 px-2 py-1">⌘K</span> Command palette
            </button>
            <div className="flex items-center gap-2">
              <Input aria-label="Search agents" placeholder="Search..." className="w-56" />
              <Button onClick={() => setWizardOpen(true)}>Create Agent</Button>
              <Tooltip label="Toggle theme">
                <button aria-label="Toggle dark mode" onClick={() => setDark((prev) => !prev)} className="rounded-lg border border-white/10 p-2 hover:bg-white/10">
                  {isDark ? <Sun size={15} /> : <Moon size={15} />}
                </button>
              </Tooltip>
              <Button variant="ghost" onClick={AuthService.logout}>Logout</Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-5">
            <Outlet />
          </main>
        </div>

        <aside className={`border-l border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all ${isInspectorOpen ? 'w-80' : 'w-14'}`}>
          <button aria-label="Toggle inspector" onClick={() => setInspectorOpen((prev) => !prev)} className="mb-3 rounded-md border border-white/10 p-2 hover:bg-white/10">
            <BarChart3 size={16} />
          </button>
          {isInspectorOpen && (
            <div className="space-y-3 text-sm">
              <Card className="p-3">
                <div className="mb-1 text-xs uppercase text-slate-400">Selected agent</div>
                <div className="font-medium">{selectedAgent?.name ?? 'None selected'}</div>
                <div className="mt-2 text-xs text-slate-400">{selectedAgent?.description}</div>
              </Card>
              <Card className="p-3">
                <div className="mb-1 text-xs uppercase text-slate-400">Last run</div>
                {lastRun ? <div>${lastRun.costUSD} · {lastRun.tokensIn + lastRun.tokensOut} tokens</div> : <div className="text-slate-400">No runs yet</div>}
              </Card>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => selectedAgent && runAgent(selectedAgent.id)}>Run</Button>
                <Button variant="secondary" onClick={() => selectedAgent && duplicateAgent(selectedAgent.id)}>Duplicate</Button>
                <Button variant="ghost" onClick={() => selectedAgent && navigator.clipboard.writeText(JSON.stringify(selectedAgent, null, 2))}>Export JSON</Button>
                <Button variant="ghost" onClick={() => navigate('/marketplace')}>Share</Button>
              </div>
              <Link to={location.pathname} className="block text-xs text-slate-500">Inspector synced with current route</Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
