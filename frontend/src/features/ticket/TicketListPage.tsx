import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Search, Filter, ChevronRight, Clock, AlertCircle, CheckCircle2, MoreHorizontal, Ticket as TicketIcon, GraduationCap } from 'lucide-react';
import { useAuth } from '../../shared/context/AuthContext';
import { ticketService } from './ticketService';
import { Ticket, TicketStatus, TicketPriority } from './ticket';
import { TicketStatusBadge } from './TicketStatusBadge';
import { cn } from '../../lib/utils';

export const TicketListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<TicketStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const queryParams = new URLSearchParams(location.search);
  const [showOnlyMine, setShowOnlyMine] = useState(queryParams.get('filter') === 'mine');

  useEffect(() => {
    const fetchTickets = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const data = await ticketService.getTickets(user.role, user.id);
          setTickets(data);
        } catch (error) {
          console.error('Failed to fetch tickets:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchTickets();
  }, [user]);

  const filteredTickets = tickets.filter(t => {
    const matchesFilter = filter === 'ALL' || t.status === filter;
    const matchesSearch = (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMine = !showOnlyMine || t.createdBy === user?.id;
    return matchesFilter && matchesSearch && matchesMine;
  });

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case 'HIGH': return 'text-red-500';
      case 'MEDIUM': return 'text-orange-500';
      case 'LOW': return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-[1400px] mx-auto w-full space-y-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2 text-ink uppercase">Transmission Logs</h1>
          <p className="text-xl serif-italic text-ink/60 lowercase font-medium">Issue reporting and maintenance synchronization across the neural campus.</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => setShowOnlyMine(!showOnlyMine)}
            className={cn(
              "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 border strat-shadow",
              showOnlyMine 
                ? "bg-accent text-slate-950 border-accent shadow-glow shadow-accent/20" 
                : "bg-ink/5 text-ink/30 border-transparent hover:border-accent/40 hover:text-ink"
            )}
          >
            <TicketIcon size={18} className="mr-2" /> Personal Files
          </button>
          <button 
            onClick={() => navigate('create')}
            className="premium-button-primary px-10 h-16 shadow-glow"
          >
            <Plus size={20} /> Deploy Ticket
          </button>
        </div>
      </div>


      {/* Command Console (Filters & Search) */}
      <div className="bg-card tactical-border rounded-[3rem] p-10 md:p-12 strat-shadow">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="flex flex-wrap items-center gap-4">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s as any)}
                className={cn(
                  "px-6 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 border",
                  filter === s 
                    ? "bg-accent text-slate-950 border-accent shadow-glow shadow-accent/20" 
                    : "bg-[var(--input-bg)] text-ink/40 border-transparent hover:border-accent/30 hover:text-ink"
                )}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative group flex-1 max-w-lg">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={20} />
            <input
              type="text"
              placeholder="Query Intelligence Database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 h-16 premium-input font-bold"
            />
          </div>
        </div>
      </div>


      {/* Operations Feed */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-44 bg-[var(--input-bg)] animate-pulse rounded-[3.5rem] tactical-border" />
          ))}
        </div>
      ) : filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {filteredTickets.map((ticket) => (
            <div 
              key={ticket.id}
              onClick={() => navigate(ticket.id)}
              className="premium-glass p-10 md:p-14 rounded-[4rem] card-hover border border-[var(--border)] flex flex-col md:flex-row md:items-center gap-12 group cursor-pointer relative overflow-hidden strat-shadow"
            >
              <div className="absolute top-0 right-0 p-12 opacity-0 group-hover:opacity-100 transition-all duration-500">
                 <div className="w-14 h-14 rounded-2xl bg-accent text-slate-950 flex items-center justify-center shadow-glow rotate-45 group-hover:rotate-0 transition-transform">
                   <ChevronRight size={28} />
                 </div>
              </div>

              <div className="flex-1 space-y-8">
                <div className="flex items-center gap-6 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent bg-accent/10 px-5 py-2 rounded-full border border-accent/20 shadow-glow shadow-accent/5">
                    {ticket.id.slice(-8)}
                  </span>
                  <TicketStatusBadge status={ticket.status} />
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 italic serif-italic", 
                    getPriorityColor(ticket.priority).replace('text-red-500', 'text-red-600').replace('text-orange-500', 'text-amber-600').replace('text-blue-500', 'text-accent')
                  )}>
                    <AlertCircle size={16} /> {ticket.priority} Priority
                  </span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-black text-ink tracking-tighter group-hover:text-accent transition-colors duration-500 leading-tight pr-12 uppercase">
                  {ticket.title}
                </h3>

                <div className="flex flex-wrap items-center gap-10 text-[10px] font-black text-ink/60 uppercase tracking-[0.25em] italic serif-italic">
                  <span className="flex items-center gap-3 group-hover:text-ink transition-colors">
                    <Clock size={16} className="text-accent/60" /> {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-3 group-hover:text-ink transition-colors">
                    <Filter size={16} className="text-accent/60" /> {ticket.category}
                  </span>
                  <span className="flex items-center gap-3 text-ink/70 group-hover:text-ink transition-colors">
                    <AlertCircle size={16} className="text-accent" /> {ticket.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-12 shrink-0 border-t md:border-t-0 md:border-l border-[var(--border)] pt-12 md:pt-0 md:pl-16">
                <div className="text-left md:text-right hidden sm:block">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-ink/50 mb-3">Sync Node</p>
                  <p className="text-base font-black text-ink tracking-tight uppercase">{ticket.assignedToName || 'Unlinked Registry'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-40 bg-card tactical-border rounded-[5rem] text-center strat-shadow">
          <div className="w-24 h-24 bg-[var(--input-bg)] rounded-[3rem] flex items-center justify-center mx-auto mb-12 tactical-border shadow-2xl">
            <Search className="text-accent/20" size={56} />
          </div>
          <h3 className="text-4xl font-black text-ink mb-6 tracking-tighter uppercase">Query Null State</h3>
          <p className="text-ink/20 serif-italic text-xl">No intelligence files matched the transmission query.</p>
        </div>
      )}

    </div>
  );
};

