import React from 'react';
import { Card } from '../components/ui/Card';
import { useAgentStore } from '../stores/AgentStore';
import { Badge } from '../components/ui/Badge';

export default function DashboardPage() {
  const { agents, usage } = useAgentStore();
  const usageToday = usage.filter((event) => new Date(event.createdAt).toDateString() === new Date().toDateString());
  const costMTD = usage.reduce((sum, event) => sum + event.costUSD, 0);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4"><div className="text-sm text-slate-400">Agents</div><div className="text-2xl font-semibold">{agents.length}</div></Card>
        <Card className="p-4"><div className="text-sm text-slate-400">Usage Today</div><div className="text-2xl font-semibold">{usageToday.length} runs</div></Card>
        <Card className="p-4"><div className="text-sm text-slate-400">Cost MTD</div><div className="text-2xl font-semibold">${costMTD.toFixed(2)}</div></Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <div className="mb-3 text-sm text-slate-400">Recent agents</div>
          <div className="space-y-2">
            {agents.slice(0, 5).map((agent) => <div key={agent.id} className="flex items-center justify-between"><span>{agent.name}</span><Badge>{agent.modelConfig.model}</Badge></div>)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="mb-3 text-sm text-slate-400">Recent runs</div>
          <div className="space-y-2 text-sm">
            {usage.slice(0, 6).map((event) => <div key={event.id} className="flex justify-between"><span>{event.status}</span><span>{event.tokensIn + event.tokensOut} tokens · ${event.costUSD}</span></div>)}
          </div>
        </Card>
      </div>
    </div>
  );
}
