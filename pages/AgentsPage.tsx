import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAgentStore } from '../stores/AgentStore';

export default function AgentsPage() {
  const navigate = useNavigate();
  const { agents, selectAgent, deleteAgent, usage } = useAgentStore();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'recent' | 'cost' | 'runs'>('recent');

  const filtered = useMemo(() => {
    const base = agents.filter((agent) => agent.name.toLowerCase().includes(query.toLowerCase()));
    if (sort === 'cost') {
      return [...base].sort((a, b) => usage.filter((u) => u.agentId === b.id).reduce((s, u) => s + u.costUSD, 0) - usage.filter((u) => u.agentId === a.id).reduce((s, u) => s + u.costUSD, 0));
    }
    if (sort === 'runs') {
      return [...base].sort((a, b) => usage.filter((u) => u.agentId === b.id).length - usage.filter((u) => u.agentId === a.id).length);
    }
    return [...base].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  }, [agents, query, sort, usage]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Agents</h1>
        <div className="flex items-center gap-2">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by name" aria-label="Filter agents" className="w-56" />
          <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="rounded-lg border border-white/10 bg-black/20 p-2 text-sm">
            <option value="recent">Recent</option>
            <option value="cost">Cost</option>
            <option value="runs">Runs</option>
          </select>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((agent) => (
          <Card key={agent.id} className="p-4">
            <div className="mb-2 text-lg font-medium">{agent.name}</div>
            <p className="mb-3 text-sm text-slate-400">{agent.description}</p>
            <div className="mb-4 flex flex-wrap gap-1 text-xs">{agent.tags.map((tag) => <span key={tag} className="rounded bg-white/10 px-2 py-0.5">#{tag}</span>)}</div>
            <div className="flex gap-2">
              <Button onClick={() => { selectAgent(agent.id); navigate(`/agents/${agent.id}`); }}>Open</Button>
              <Button variant="ghost" onClick={() => deleteAgent(agent.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
