import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs } from '../components/ui/Tabs';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAgentStore } from '../stores/AgentStore';

export default function AgentDetailPage() {
  const { id = '' } = useParams();
  const { agents, updateAgent, runAgent, usage, versions } = useAgentStore();
  const [tab, setTab] = useState('builder');
  const agent = useMemo(() => agents.find((item) => item.id === id), [agents, id]);

  if (!agent) return <div>Agent not found</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{agent.name}</h1>
      <Tabs items={[{ id: 'builder', label: 'Builder' }, { id: 'runs', label: 'Runs' }, { id: 'analytics', label: 'Analytics' }]} activeTab={tab} onChange={setTab} />

      {tab === 'builder' && (
        <Card className="space-y-3 p-4">
          <Input value={agent.name} onChange={(e) => updateAgent({ ...agent, name: e.target.value })} aria-label="Agent name" />
          <textarea className="min-h-40 w-full rounded-lg border border-white/10 bg-black/20 p-3 text-sm" value={agent.promptTemplate} onChange={(e) => updateAgent({ ...agent, promptTemplate: e.target.value })} aria-label="Prompt template" />
          <div className="flex gap-2">
            <Button onClick={() => runAgent(agent.id)}>Run Agent</Button>
            <Button variant="secondary" onClick={() => updateAgent({ ...agent })}>Save Version</Button>
          </div>
          <div className="text-xs text-slate-400">Version history: {versions.filter((version) => version.agentId === agent.id).length} versions</div>
        </Card>
      )}

      {tab === 'runs' && (
        <Card className="p-4">
          <div className="space-y-2 text-sm">
            {usage.filter((event) => event.agentId === agent.id).map((event) => (
              <div key={event.id} className="flex items-center justify-between rounded border border-white/10 p-2">
                <span>{new Date(event.createdAt).toLocaleString()}</span>
                <span>{event.tokensIn + event.tokensOut} tokens · ${event.costUSD} · {event.status}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'analytics' && (
        <div className="grid gap-3 md:grid-cols-3">
          <Card className="p-4"><div className="text-sm text-slate-400">Total tokens</div><div className="text-xl">{usage.filter((event) => event.agentId === agent.id).reduce((sum, event) => sum + event.tokensIn + event.tokensOut, 0)}</div></Card>
          <Card className="p-4"><div className="text-sm text-slate-400">Cost</div><div className="text-xl">${usage.filter((event) => event.agentId === agent.id).reduce((sum, event) => sum + event.costUSD, 0).toFixed(2)}</div></Card>
          <Card className="p-4"><div className="text-sm text-slate-400">Latency avg</div><div className="text-xl">{Math.round(usage.filter((event) => event.agentId === agent.id).reduce((sum, event) => sum + event.latencyMs, 0) / Math.max(1, usage.filter((event) => event.agentId === agent.id).length))}ms</div></Card>
        </div>
      )}
    </div>
  );
}
