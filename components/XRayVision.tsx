
import React from 'react';
import { TelemetryStep, SessionAccumulator } from '../types';
import { 
  Terminal, Activity, Radio, Database, Brain, 
  Workflow, Cpu, Gauge, BarChart3, Zap, Hash, Layers, Timer
} from 'lucide-react';

interface XRayVisionProps {
  telemetry: TelemetryStep[];
  thinking?: string;
  accumulatedStats?: SessionAccumulator;
}

export default function XRayVision({ telemetry, thinking, accumulatedStats }: XRayVisionProps) {
  const stats = accumulatedStats || { total_tokens: 0, total_energy: 0, tool_calls: 0, avg_latency: 0, messages_count: 0 };

  return (
    <div className="h-full flex flex-col font-mono bg-[#01040a]/90 text-slate-400">
      <header className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-2">
            <Terminal size={14} className="text-blue-500" />
            Neural_Anatomy.XRAY
          </h3>
          <p className="text-[8px] font-bold text-slate-600 uppercase">Internal Logic & Energy Monitor</p>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 status-pulse"></div>
      </header>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar pb-32">
        {/* Cumulative Session Anatomy */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900/10 to-black border border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.05)]">
           <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
              <Activity size={14} className="text-blue-400" />
              <h4 className="text-[9px] font-black text-white uppercase tracking-widest">Session_Accumulation</h4>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <AnatomyStat 
                 label="Total Energy" 
                 value={`${stats.total_energy.toFixed(2)} J`} 
                 icon={Zap} 
                 color="text-amber-400" 
              />
              <AnatomyStat 
                 label="Neural Load" 
                 value={`${stats.total_tokens.toLocaleString()} TKN`} 
                 icon={Hash} 
                 color="text-blue-400" 
              />
              <AnatomyStat 
                 label="Tool Operations" 
                 value={`${stats.tool_calls}`} 
                 icon={Cpu} 
                 color="text-purple-400" 
              />
              <AnatomyStat 
                 label="Avg Latency" 
                 value={`${stats.avg_latency.toFixed(0)} ms`} 
                 icon={Timer} 
                 color="text-emerald-400" 
              />
           </div>

           {/* Live Energy Graph Simulation */}
           <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex justify-between text-[7px] font-bold text-slate-600 uppercase mb-1">
                 <span>Energy Consumption Flux</span>
                 <span>Real-time</span>
              </div>
              <div className="h-8 flex items-end gap-0.5">
                 {[...Array(20)].map((_, i) => (
                    <div 
                       key={i} 
                       className="w-full bg-blue-500/20 rounded-t-sm transition-all duration-300"
                       style={{ height: `${Math.random() * 100}%`, opacity: 0.3 + (Math.random() * 0.7) }}
                    ></div>
                 ))}
              </div>
           </div>
        </div>

        {/* Live Telemetry Stream */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Current_Process_Stack</span>
            <div className="flex gap-1">
               <div className="w-1 h-1 bg-blue-500 rounded-full animate-ping"></div>
            </div>
          </div>
          
          <div className="space-y-4">
            {telemetry.length === 0 ? (
              <div className="p-10 border border-dashed border-white/5 rounded-2xl text-center opacity-30">
                 <Radio size={24} className="mx-auto mb-3" />
                 <span className="text-[8px] font-black uppercase">Awaiting_Neural_Handshake...</span>
              </div>
            ) : (
              telemetry.map((step) => (
                <div key={step.id} className="p-5 bg-black/40 border border-white/5 rounded-2xl space-y-4 group transition-all hover:border-blue-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                          {getStepIcon(step.type)}
                       </div>
                       <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">{step.label}</span>
                    </div>
                    <span className="text-[7px] text-slate-600 font-bold">{step.metrics?.latency?.toFixed(0)}ms</span>
                  </div>
                  {step.detail && (
                    <div className="text-[9px] text-slate-500 leading-relaxed font-bold bg-white/5 p-3 rounded-xl border border-white/5">
                      {step.detail}
                    </div>
                  )}
                  {step.metrics && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                       <MetricStat icon={Gauge} label="TOKEN_VELOCITY" val={`${step.metrics.tokens_per_sec?.toFixed(1)}/s`} />
                       <MetricStat icon={Cpu} label="COMPUTE_LOAD" val={`${step.metrics.vram_usage?.toFixed(1)}%`} />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Thought Trace Display */}
        {thinking && (
          <div className="space-y-4 pt-6 border-t border-white/5">
             <div className="flex items-center gap-3 px-1">
                <Brain size={12} className="text-purple-500" />
                <span className="text-[8px] font-black text-purple-500 uppercase tracking-widest">Latent_State_Reasoning</span>
             </div>
             <div className="p-5 bg-purple-500/[0.03] border border-purple-500/10 rounded-2xl text-[10px] text-purple-300 leading-relaxed whitespace-pre-wrap font-medium shadow-inner italic">
                {thinking}
             </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-black/95 backdrop-blur-3xl border-t border-white/5">
         <div className="flex justify-between items-center mb-3">
            <span className="text-[8px] font-black uppercase tracking-widest">System_Integrity</span>
            <span className="text-[8px] font-black text-blue-500">99.99%</span>
         </div>
         <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 w-[98%] animate-pulse"></div>
         </div>
      </div>
    </div>
  );
}

function AnatomyStat({ label, value, icon: Icon, color }: any) {
   return (
      <div className="flex flex-col gap-1">
         <div className="flex items-center gap-2 text-[8px] font-bold text-slate-500 uppercase tracking-tight">
            <Icon size={10} /> {label}
         </div>
         <div className={`text-[13px] font-black ${color} tracking-tighter`}>{value}</div>
      </div>
   );
}

function getStepIcon(type: TelemetryStep['type']) {
  switch (type) {
    case 'UPLINK': return <Radio size={12} className="text-blue-500" />;
    case 'RETRIEVAL': return <Database size={12} className="text-cyan-500" />;
    case 'REASONING': return <Brain size={12} className="text-purple-500" />;
    case 'TOOL_EXEC': return <Cpu size={12} className="text-amber-500" />;
    case 'SYNTHESIS': return <Workflow size={12} className="text-emerald-500" />;
    case 'IMAGE_GEN': return <Zap size={12} className="text-pink-500" />;
    case 'ENTROPY_ANALYSIS': return <BarChart3 size={12} className="text-rose-500" />;
    default: return <Activity size={12} className="text-slate-500" />;
  }
}

function MetricStat({ icon: Icon, label, val }: any) {
  return (
    <div className="flex items-center gap-2">
       <Icon size={10} className="text-slate-600" />
       <div className="flex flex-col">
          <span className="text-[6px] font-black text-slate-700 uppercase">{label}</span>
          <span className="text-[9px] font-black text-slate-300">{val}</span>
       </div>
    </div>
  );
}
