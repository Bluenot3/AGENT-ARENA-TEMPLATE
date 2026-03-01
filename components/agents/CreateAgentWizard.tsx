import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAgentStore } from '../../stores/AgentStore';
import { useToast } from '../ui/Toast';

interface Props {
  open: boolean;
  onClose: () => void;
}

const modelOptions = ['gpt-4.1-mini', 'gemini-2.5-flash', 'claude-3.5-sonnet'];

export const CreateAgentWizard = ({ open, onClose }: Props) => {
  const { createAgent } = useAgentStore();
  const { show } = useToast();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('ops,assistant');
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState(modelOptions[0]);
  const [tools, setTools] = useState({ memoryEnabled: true, ragEnabled: false, webEnabled: true, imageEnabled: false });

  const complete = () => {
    createAgent({
      name: name || 'Untitled Agent',
      description,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      promptTemplate: 'You are a production-grade AI agent. Provide concise and reliable outputs.',
      modelConfig: { provider, model, temperature: 0.4, top_p: 1, maxTokens: 2048 },
      toolConfig: tools
    });
    show('Agent created successfully');
    onClose();
    setStep(1);
  };

  return (
    <Modal open={open} title="Create Agent" onClose={onClose}>
      <div className="space-y-4 text-slate-200">
        <div className="text-xs uppercase tracking-wider text-slate-400">Step {step} of 4</div>

        {step === 1 && (
          <div className="space-y-3">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Agent name" aria-label="Agent name" />
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Purpose" aria-label="Agent purpose" />
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tags comma separated" aria-label="Agent tags" />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <Input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Provider" aria-label="Model provider" />
            <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/20 p-2" aria-label="Model selection">
              {modelOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(tools).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between rounded-lg border border-white/10 p-3">
                <span className="text-sm">{key.replace('Enabled', '')}</span>
                <input type="checkbox" checked={value} onChange={() => setTools((prev) => ({ ...prev, [key]: !value }))} />
              </label>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
            <div>{name || 'Untitled Agent'}</div>
            <div className="text-slate-400">{description || 'No description provided'}</div>
            <div className="mt-2 text-xs">Model: {provider}/{model}</div>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => (step > 1 ? setStep(step - 1) : onClose())}>{step === 1 ? 'Cancel' : 'Back'}</Button>
          {step < 4 ? <Button onClick={() => setStep(step + 1)}>Next</Button> : <Button onClick={complete}>Create Agent</Button>}
        </div>
      </div>
    </Modal>
  );
};
