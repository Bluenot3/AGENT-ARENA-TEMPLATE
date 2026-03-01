import React, { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import BotPublic from './pages/BotPublic';
import Marketplace from './pages/Marketplace';
import BotBuilder from './pages/BotBuilder';
import KeysVault from './pages/KeysVault';
import Analytics from './pages/Analytics';
import Subscription from './pages/Subscription';
import KnowledgeVault from './pages/KnowledgeVault';
import ArenaDesigner from './pages/ArenaDesigner';
import ImageStudio from './pages/ImageStudio';
import ImageAgentStudio from './pages/ImageAgentStudio';
import AppForge from './pages/AppForge';
import GameLab from './pages/GameLab';
import Workspace from './pages/Workspace';
import DashboardPage from './pages/DashboardPage';
import AgentsPage from './pages/AgentsPage';
import AgentDetailPage from './pages/AgentDetailPage';
import MarketplacePage from './pages/MarketplacePage';
import LabsPage from './pages/LabsPage';
import SettingsPage from './pages/SettingsPage';
import { AppShell } from './components/shell/AppShell';
import { AuthService } from './services/store';
import { AgentStoreProvider } from './stores/AgentStore';
import { ToastProvider } from './components/ui/Toast';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(Boolean(AuthService.getUser()));
    setLoading(false);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">Booting Agent OS...</div>;

  return (
    <HashRouter>
      <ToastProvider>
        <AgentStoreProvider>
          <Routes>
            <Route path="/" element={<Landing onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/bot/:slug" element={<BotPublic />} />

            <Route element={isAuthenticated ? <AppShell /> : <Navigate to="/" />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/agents/:id" element={<AgentDetailPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/settings" element={<SettingsPage />} />

              <Route path="/labs" element={<LabsPage />}>
                <Route path="legacy/marketplace" element={<Marketplace />} />
                <Route path="legacy/workspace/:id" element={<Workspace />} />
                <Route path="legacy/knowledge" element={<KnowledgeVault />} />
                <Route path="legacy/create" element={<BotBuilder />} />
                <Route path="legacy/edit/:id" element={<BotBuilder />} />
                <Route path="legacy/arena/new" element={<ArenaDesigner />} />
                <Route path="legacy/arena/edit/:id" element={<ArenaDesigner />} />
                <Route path="legacy/keys" element={<KeysVault />} />
                <Route path="legacy/analytics" element={<Analytics />} />
                <Route path="legacy/subscription" element={<Subscription />} />
                <Route path="legacy/studio/image" element={<ImageStudio />} />
                <Route path="legacy/studio/image-agents" element={<ImageAgentStudio />} />
                <Route path="legacy/studio/app" element={<AppForge />} />
                <Route path="legacy/studio/game" element={<GameLab />} />
              </Route>
            </Route>
          </Routes>
        </AgentStoreProvider>
      </ToastProvider>
    </HashRouter>
  );
}
