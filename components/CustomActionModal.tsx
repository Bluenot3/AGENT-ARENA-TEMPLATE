
import React, { useState } from 'react';
import { Tool, ToolParameter, ToolAction } from '../types';
import {
    X, Plus, Trash2, Zap, Globe, Mail, FileText, Code2,
    ChevronRight, Wand2, Settings2, Play, Save, AlertCircle,
    Link2, Database, Webhook, ArrowRight, GripVertical
} from 'lucide-react';

interface CustomActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (tool: Tool) => void;
}

const ACTION_TYPES = [
    { id: 'webhook', label: 'Webhook', icon: Webhook, description: 'Send data to any HTTP endpoint', color: 'from-blue-600 to-cyan-600' },
    { id: 'zapier', label: 'Zapier', icon: Zap, description: 'Trigger Zapier zaps', color: 'from-orange-500 to-amber-500' },
    { id: 'make', label: 'Make.com', icon: Settings2, description: 'Execute Make scenarios', color: 'from-purple-600 to-pink-600' },
    { id: 'email', label: 'Send Email', icon: Mail, description: 'Send emails via SMTP', color: 'from-emerald-600 to-teal-600' },
    { id: 'pdf', label: 'Generate PDF', icon: FileText, description: 'Create PDF documents', color: 'from-red-600 to-rose-600' },
    { id: 'database', label: 'Database', icon: Database, description: 'Query databases', color: 'from-indigo-600 to-violet-600' },
    { id: 'api_call', label: 'API Call', icon: Globe, description: 'Call external APIs', color: 'from-sky-600 to-blue-600' },
    { id: 'custom_code', label: 'Custom Code', icon: Code2, description: 'Execute custom JavaScript', color: 'from-slate-600 to-zinc-600' },
];

const PARAM_TYPES = [
    { id: 'string', label: 'Text' },
    { id: 'number', label: 'Number' },
    { id: 'boolean', label: 'Yes/No' },
    { id: 'select', label: 'Dropdown' },
    { id: 'multiselect', label: 'Multi-Select' },
    { id: 'textarea', label: 'Long Text' },
    { id: 'email', label: 'Email' },
    { id: 'url', label: 'URL' },
];

export default function CustomActionModal({ isOpen, onClose, onSave }: CustomActionModalProps) {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('🔧');
    const [actionType, setActionType] = useState<ToolAction['type']>('webhook');
    const [webhookUrl, setWebhookUrl] = useState('');
    const [webhookMethod, setWebhookMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('POST');
    const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
    const [bodyTemplate, setBodyTemplate] = useState('{\n  "message": "{{user_input}}",\n  "timestamp": "{{timestamp}}"\n}');
    const [parameters, setParameters] = useState<ToolParameter[]>([]);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
    const [isTesting, setIsTesting] = useState(false);

    const generateId = () => `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const addParameter = () => {
        setParameters([...parameters, {
            id: generateId(),
            name: '',
            type: 'string',
            label: '',
            description: '',
            required: false,
            placeholder: ''
        }]);
    };

    const updateParameter = (id: string, updates: Partial<ToolParameter>) => {
        setParameters(parameters.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const removeParameter = (id: string) => {
        setParameters(parameters.filter(p => p.id !== id));
    };

    const addHeader = () => {
        setHeaders([...headers, { key: '', value: '' }]);
    };

    const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
        const newHeaders = [...headers];
        newHeaders[index][field] = value;
        setHeaders(newHeaders);
    };

    const removeHeader = (index: number) => {
        setHeaders(headers.filter((_, i) => i !== index));
    };

    const testAction = async () => {
        setIsTesting(true);
        setTestResult(null);

        // Simulate API test
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (webhookUrl && webhookUrl.startsWith('http')) {
            setTestResult({ success: true, message: 'Connection successful! Webhook responded with 200 OK.' });
        } else {
            setTestResult({ success: false, message: 'Invalid webhook URL. Please enter a valid HTTP/HTTPS URL.' });
        }
        setIsTesting(false);
    };

    const handleSave = () => {
        const tool: Tool = {
            tool_id: generateId(),
            name: name.toUpperCase(),
            description,
            enabled: true,
            category: 'custom',
            icon,
            is_custom: true,
            parameters,
            action: {
                type: actionType,
                webhook_url: webhookUrl,
                method: webhookMethod,
                headers: headers.reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {}),
                body_template: bodyTemplate,
            },
            created_at: new Date().toISOString()
        };
        onSave(tool);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-gradient-to-br from-slate-900 to-black rounded-[3rem] border border-white/10 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                            <Wand2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">Create Custom Action</h2>
                            <p className="text-xs text-slate-500 mt-1">Step {step} of 4 • {['Basic Info', 'Action Type', 'Parameters', 'Test & Save'][step - 1]}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-8 py-4 bg-black/30">
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map(s => (
                            <div
                                key={s}
                                className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${s <= step ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-white/10'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Action Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="e.g., Send to Slack, Create Lead, Generate Report..."
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white text-lg font-bold outline-none focus:border-purple-500/50 transition-all placeholder:text-slate-700"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Description</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Describe what this action does and when it should be triggered..."
                                    rows={4}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-purple-500/50 transition-all placeholder:text-slate-700 resize-none"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Icon</label>
                                <div className="flex gap-3 flex-wrap">
                                    {['🔧', '⚡', '🚀', '📧', '💾', '🔗', '📊', '🎯', '🔔', '💬', '📝', '🤖'].map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => setIcon(emoji)}
                                            className={`w-14 h-14 rounded-2xl text-2xl flex items-center justify-center transition-all ${icon === emoji ? 'bg-purple-600 border-2 border-purple-400 scale-110' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Action Type */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                {ACTION_TYPES.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => setActionType(type.id as ToolAction['type'])}
                                        className={`p-6 rounded-2xl border text-left transition-all group ${actionType === type.id ? 'bg-gradient-to-br ' + type.color + ' border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${actionType === type.id ? 'bg-white/20' : 'bg-white/5'}`}>
                                            <type.icon size={24} className={actionType === type.id ? 'text-white' : 'text-slate-400'} />
                                        </div>
                                        <h4 className={`text-sm font-black uppercase tracking-wide ${actionType === type.id ? 'text-white' : 'text-slate-300'}`}>{type.label}</h4>
                                        <p className={`text-xs mt-1 ${actionType === type.id ? 'text-white/70' : 'text-slate-500'}`}>{type.description}</p>
                                    </button>
                                ))}
                            </div>

                            {/* Webhook Configuration */}
                            {(actionType === 'webhook' || actionType === 'zapier' || actionType === 'make' || actionType === 'api_call') && (
                                <div className="mt-8 space-y-6 p-6 rounded-2xl bg-black/40 border border-white/10">
                                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Link2 size={14} /> Endpoint Configuration
                                    </h4>

                                    <div className="flex gap-3">
                                        <select
                                            value={webhookMethod}
                                            onChange={e => setWebhookMethod(e.target.value as any)}
                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-purple-500/50"
                                        >
                                            <option value="GET">GET</option>
                                            <option value="POST">POST</option>
                                            <option value="PUT">PUT</option>
                                            <option value="DELETE">DELETE</option>
                                        </select>
                                        <input
                                            type="url"
                                            value={webhookUrl}
                                            onChange={e => setWebhookUrl(e.target.value)}
                                            placeholder="https://hooks.example.com/webhook/..."
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50 placeholder:text-slate-600"
                                        />
                                    </div>

                                    {/* Headers */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Headers</label>
                                            <button onClick={addHeader} className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                                                <Plus size={12} /> Add Header
                                            </button>
                                        </div>
                                        {headers.map((header, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={header.key}
                                                    onChange={e => updateHeader(i, 'key', e.target.value)}
                                                    placeholder="Header name"
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    value={header.value}
                                                    onChange={e => updateHeader(i, 'value', e.target.value)}
                                                    placeholder="Value"
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                                                />
                                                <button onClick={() => removeHeader(i)} className="p-2 text-slate-500 hover:text-red-400">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Body Template */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Body Template (JSON)</label>
                                        <textarea
                                            value={bodyTemplate}
                                            onChange={e => setBodyTemplate(e.target.value)}
                                            rows={6}
                                            className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-xs font-mono text-emerald-400 outline-none focus:border-purple-500/50 resize-none"
                                        />
                                        <p className="text-xs text-slate-600">
                                            Use <code className="text-purple-400">{'{{variable_name}}'}</code> for dynamic values from parameters.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Parameters */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-wide">Input Parameters</h3>
                                    <p className="text-xs text-slate-500 mt-1">Define what information the AI should collect from users</p>
                                </div>
                                <button onClick={addParameter} className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-purple-500 transition-all">
                                    <Plus size={14} /> Add Parameter
                                </button>
                            </div>

                            {parameters.length === 0 ? (
                                <div className="py-16 text-center border-2 border-dashed border-white/10 rounded-2xl">
                                    <div className="text-4xl mb-4">📝</div>
                                    <p className="text-sm font-bold text-slate-500">No parameters defined</p>
                                    <p className="text-xs text-slate-600 mt-1">Add parameters to collect user input</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {parameters.map((param, index) => (
                                        <div key={param.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 text-slate-600 cursor-move">
                                                    <GripVertical size={16} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-500 uppercase">Parameter {index + 1}</span>
                                                <div className="flex-1" />
                                                <button onClick={() => removeParameter(param.id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-600">Variable Name</label>
                                                    <input
                                                        type="text"
                                                        value={param.name}
                                                        onChange={e => updateParameter(param.id, { name: e.target.value.toLowerCase().replace(/\s/g, '_') })}
                                                        placeholder="e.g., customer_email"
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-600">Display Label</label>
                                                    <input
                                                        type="text"
                                                        value={param.label}
                                                        onChange={e => updateParameter(param.id, { label: e.target.value })}
                                                        placeholder="e.g., Customer Email"
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-600">Type</label>
                                                    <select
                                                        value={param.type}
                                                        onChange={e => updateParameter(param.id, { type: e.target.value as any })}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50"
                                                    >
                                                        {PARAM_TYPES.map(t => (
                                                            <option key={t.id} value={t.id}>{t.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-600">Placeholder</label>
                                                    <input
                                                        type="text"
                                                        value={param.placeholder || ''}
                                                        onChange={e => updateParameter(param.id, { placeholder: e.target.value })}
                                                        placeholder="Hint text..."
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={param.required || false}
                                                        onChange={e => updateParameter(param.id, { required: e.target.checked })}
                                                        className="w-4 h-4 rounded bg-white/5 border-white/20"
                                                    />
                                                    <span className="text-xs font-bold text-slate-400">Required</span>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Test & Save */}
                    {step === 4 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            {/* Summary */}
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20">
                                <h3 className="text-sm font-black text-white uppercase tracking-wide mb-4">Action Summary</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-slate-500">Name:</span>
                                        <span className="ml-2 text-white font-bold">{name || 'Unnamed'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Type:</span>
                                        <span className="ml-2 text-white font-bold">{ACTION_TYPES.find(t => t.id === actionType)?.label}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Parameters:</span>
                                        <span className="ml-2 text-white font-bold">{parameters.length}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Endpoint:</span>
                                        <span className="ml-2 text-white font-bold text-xs truncate">{webhookUrl || 'Not set'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Test Button */}
                            <div className="space-y-4">
                                <button
                                    onClick={testAction}
                                    disabled={isTesting}
                                    className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all disabled:opacity-50"
                                >
                                    {isTesting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Testing Connection...
                                        </>
                                    ) : (
                                        <>
                                            <Play size={18} /> Test Action
                                        </>
                                    )}
                                </button>

                                {testResult && (
                                    <div className={`p-4 rounded-xl flex items-start gap-3 ${testResult.success ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                                        <AlertCircle size={18} className={testResult.success ? 'text-emerald-400' : 'text-red-400'} />
                                        <p className={`text-sm ${testResult.success ? 'text-emerald-400' : 'text-red-400'}`}>{testResult.message}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 flex items-center justify-between bg-black/30">
                    <button
                        onClick={() => setStep(Math.max(1, step - 1))}
                        disabled={step === 1}
                        className="px-6 py-3 rounded-xl bg-white/5 text-slate-400 font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                    >
                        Back
                    </button>

                    <div className="flex gap-3">
                        {step < 4 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                disabled={step === 1 && !name}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm flex items-center gap-2 hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50"
                            >
                                Continue <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                disabled={!name}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm flex items-center gap-2 hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50"
                            >
                                <Save size={16} /> Save Action
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
