import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Ticket, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  Wrench,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { technicianService } from '../../features/ticket/technicianService';
import { Ticket as TicketType } from '../../features/ticket/ticket';
import { cn } from '../../lib/utils';
import { TicketStatusBadge } from '../../features/ticket/TicketStatusBadge';

export const TechnicianDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const data = await technicianService.getAssignedTickets(user.id);
        setTickets(data);
      } catch (error) {
        console.error('Failed to fetch assigned tickets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS');
  const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED');

  return (
    <div className="p-6 md:p-12 max-w-[1400px] mx-auto w-full space-y-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-slate-950 shadow-glow shadow-accent/40">
              <Wrench size={28} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-accent">Strategic Operations Console</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2 text-ink uppercase">Maintenance Nexus</h1>
          <p className="text-xl serif-italic text-ink/30 lowercase font-medium">Real-time status monitoring for operator {user?.name}.</p>
        </div>
      </div>


      {/* Command Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <StatCard 
          label="Registry Load" 
          value={tickets.length.toString()} 
          icon={<Ticket size={24} />} 
          trend="Lifetime throughput"
          color="blue"
        />
        <StatCard 
          label="Active Tasks" 
          value={inProgressTickets.length.toString()} 
          icon={<Clock size={24} />} 
          trend="Real-time occupancy"
          color="orange"
        />
        <StatCard 
          label="Resolved Delays" 
          value={resolvedTickets.length.toString()} 
          icon={<CheckCircle2 size={24} />} 
          trend="Synchronization success"
          color="green"
        />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
        {/* Assignment Feed */}
        <div className="lg:col-span-3 space-y-12">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-3xl font-black tracking-tighter text-ink uppercase">Deployment Queue</h2>
            <button 
              onClick={() => navigate('/technician/tickets')} 
              className="text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:text-ink transition-colors flex items-center gap-2"
            >
              Access Vault Registry <ArrowUpRight size={16} />
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-[var(--input-bg)] animate-pulse rounded-[3rem] tactical-border" />
              ))}
            </div>
          ) : tickets.filter(t => t.status !== 'RESOLVED').length > 0 ? (
            <div className="space-y-8">
              {tickets.filter(t => t.status !== 'RESOLVED').slice(0, 5).map((ticket) => (
                <div 
                  key={ticket.id}
                  onClick={() => navigate(`/technician/tickets/${ticket.id}`)}
                  className="premium-glass p-10 rounded-[3rem] card-hover cursor-pointer flex items-center gap-12 border border-[var(--border)] strat-shadow"
                >
                  <div className="w-16 h-16 bg-[var(--input-bg)] rounded-[2rem] flex items-center justify-center text-ink/10 group-hover:bg-accent group-hover:text-slate-950 tactical-border transition-all duration-700 group-hover:rotate-12 group-hover:scale-110">
                    <Ticket size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-5 mb-4 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">{ticket.id.slice(-8)}</span>
                      <TicketStatusBadge status={ticket.status} />
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-[0.3em] px-3.5 py-1.5 rounded-full border",
                        ticket.priority === 'HIGH' ? 'text-red-600 border-red-500/20 bg-red-500/5' : 
                        ticket.priority === 'MEDIUM' ? 'text-amber-600 border-amber-500/20 bg-amber-500/5' : 
                        'text-emerald-600 border-emerald-500/20 bg-emerald-500/5'
                      )}>
                        {ticket.priority} Priority
                      </span>
                    </div>
                    <h4 className="font-black text-2xl text-ink tracking-tight group-hover:text-accent transition-colors uppercase leading-none">{ticket.title}</h4>
                    <p className="text-[11px] text-ink/30 font-bold lowercase tracking-[0.15em] mt-3 italic serif-italic">{ticket.location} <span className="mx-3 opacity-20">/</span> {ticket.category}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[var(--input-bg)] flex items-center justify-center text-ink/10 group-hover:text-accent group-hover:bg-accent group-hover:text-slate-950 transition-all duration-500 tactical-border">
                    <ChevronRight size={20} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-32 bg-card tactical-border rounded-[4rem] text-center strat-shadow">
              <div className="w-20 h-20 bg-[var(--input-bg)] rounded-[2rem] flex items-center justify-center mx-auto mb-10 tactical-border">
                <Ticket className="text-accent/20" size={32} />
              </div>
              <h3 className="text-3xl font-black text-ink mb-4 tracking-tighter uppercase">Queue Synchronized</h3>
              <p className="text-ink/20 serif-italic text-lg">No active assignments were detected in the primary backlog.</p>
            </div>
          )}
        </div>


        {/* Strategic Intelligence Sidebar */}
        <div className="space-y-12">
          <div className="bg-card tactical-border rounded-[3.5rem] p-12 relative overflow-hidden group strat-shadow ring-1 ring-white/5">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-accent opacity-10 group-hover:opacity-20 blur-[100px] transition-opacity duration-1000" />
            <h3 className="text-3xl font-black text-ink mb-8 tracking-tighter uppercase relative z-10">Uplink Status</h3>
            <div className="space-y-8 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-ink/20 uppercase tracking-[0.4em]">Node Connection</span>
                <span className="flex items-center gap-3 text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-glow shadow-emerald-500/50" /> Secure
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-ink/20 uppercase tracking-[0.4em]">Spectral Sync</span>
                <span className="text-[10px] font-black text-ink/50 uppercase tracking-[0.4em]">99.9%</span>
              </div>
            </div>
          </div>

          <div className="bg-card tactical-border rounded-[3.5rem] p-12 strat-shadow">
            <h3 className="text-2xl font-black text-ink mb-12 tracking-tighter uppercase">Core Metrics</h3>
            <div className="space-y-12">
              <MetricItem label="Resolution Phase" value="4.2 hrs" />
              <MetricItem label="Protocol Success" value="98.5%" />
              <MetricItem label="Satisfaction Index" value="4.9/5" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

function MetricItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-ink/20 uppercase tracking-[0.4em] italic serif-italic">{label}</span>
        <span className="text-base font-black text-ink tracking-tighter">{value}</span>
      </div>
      <div className="h-2 bg-ink/5 rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full w-[85%] shadow-glow shadow-accent/20" />
      </div>
    </div>
  );
}


function StatCard({ label, value, icon, trend, color }: { label: string, value: string, icon: React.ReactNode, trend: string, color: string }) {
  const colors = {
    blue: "text-accent bg-accent/5 border-accent/20 shadow-accent/5",
    orange: "text-orange-600 dark:text-orange-400 bg-orange-500/5 border-orange-500/20 shadow-orange-500/5",
    green: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border-emerald-500/20 shadow-emerald-500/5",
  };
  
  return (
    <div className="bg-card tactical-border p-12 rounded-[4rem] card-hover group strat-shadow ring-1 ring-white/5">
      <div className="flex items-center justify-between mb-12">
        <div className={cn("w-14 h-14 rounded-[2rem] flex items-center justify-center border transition-all duration-700 group-hover:rotate-12 group-hover:scale-110", colors[color as keyof typeof colors])}>
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ink/10 italic serif-italic">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-6xl font-black tracking-tighter text-ink leading-none">{value}</span>
      </div>
      <div className="flex items-center gap-4 mt-8">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-glow shadow-accent/50" />
        <p className="text-[10px] font-black text-ink/30 uppercase tracking-[0.3em] font-medium">{trend}</p>
      </div>
    </div>
  );
}

