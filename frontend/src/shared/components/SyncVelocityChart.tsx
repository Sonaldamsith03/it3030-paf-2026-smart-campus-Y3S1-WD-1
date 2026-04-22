import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const data = [
  { name: 'Mon', pulse: 4000, capacity: 2400 },
  { name: 'Tue', pulse: 3000, capacity: 1398 },
  { name: 'Wed', pulse: 2000, capacity: 9800 },
  { name: 'Thu', pulse: 2780, capacity: 3908 },
  { name: 'Fri', pulse: 1890, capacity: 4800 },
  { name: 'Sat', pulse: 2390, capacity: 3800 },
  { name: 'Sun', pulse: 3490, capacity: 4300 },
];

export const SyncVelocityChart: React.FC = () => {
  return (
    <div className="premium-glass rounded-[3.5rem] p-10 md:p-14 border border-[var(--border)] strat-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-accent/10 transition-all duration-1000" />
      
      <div className="flex items-end justify-between mb-12 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-glow shadow-accent/50" />
            <h3 className="technical-label text-ink/30 text-[10px] tracking-[0.4em]">Campus Sync Analytics</h3>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-ink uppercase">Pulse Velocity</h2>
        </div>
        <div className="flex gap-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-[10px] technical-label text-ink/40">Active Nodes</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-slate-300" />
            <span className="text-[10px] technical-label text-ink/40">System Peak</span>
          </div>
        </div>
      </div>

      <div className="h-[400px] w-full relative z-10 -ml-10">
        <ResponsiveContainer width="105%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(0,0,0,0.2)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }} 
              dy={15}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)', 
                borderRadius: '2rem', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                padding: '1.5rem',
                fontFamily: 'inherit'
              }}
              labelStyle={{ color: 'var(--accent)', fontWeight: 900, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}
            />
            <Area 
              type="monotone" 
              dataKey="pulse" 
              stroke="var(--accent)" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorPulse)" 
              animationDuration={2500}
            />
            <Area 
              type="monotone" 
              dataKey="capacity" 
              stroke="rgba(0,0,0,0.1)" 
              strokeWidth={2} 
              fill="transparent" 
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-12 pt-12 border-t border-[var(--border)] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-10">
          <div>
            <p className="text-[9px] technical-label text-ink/20 italic mb-1">Grid Load</p>
            <p className="text-xl font-black text-ink uppercase tracking-tighter">Synchronized</p>
          </div>
          <div className="w-[1px] h-10 bg-[var(--border)]" />
          <div>
            <p className="text-[9px] technical-label text-ink/20 italic mb-1">Uplink Speed</p>
            <p className="text-xl font-black text-ink uppercase tracking-tighter">1.2 Gbps</p>
          </div>
        </div>
        <button className="premium-button-ghost h-14 scale-90">
           Initialize Diagnostic <Activity size={16} />
        </button>
      </div>
    </div>
  );
};
