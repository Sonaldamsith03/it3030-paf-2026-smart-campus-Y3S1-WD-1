import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronRight, Clock, AlertCircle, Ticket as TicketIcon, UserCheck, Inbox, MapPin } from 'lucide-react';
import { technicianService } from './technicianService';
import { useAuth } from '../../shared/context/AuthContext';
import { Ticket, TicketStatus, TicketPriority } from './ticket';
import { TicketStatusBadge } from './TicketStatusBadge';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

type TabType = 'ASSIGNED' | 'ALL';

export const MyTicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('ASSIGNED');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTickets = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const data = activeTab === 'ASSIGNED' 
        ? await technicianService.getAssignedTickets(user.id)
        : await technicianService.getAllTickets();
      setTickets(data);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [activeTab]);

  const handleSelfAssign = async (ticketId: string) => {
    if (!user?.id || !user?.name) return;
    try {
      await technicianService.selfAssignTicket(ticketId, user.id, user.name);
      toast.success('Ticket assigned to you');
      fetchTickets();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to self-assign ticket');
    }
  };

  const filteredTickets = tickets.filter(t => {
    // For Assigned tab, only show what was explicitly assigned by Admin (as requested)
    if (activeTab === 'ASSIGNED' && t.assignedByAdmin === false) return false;
    
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const matchesSearch = (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case 'HIGH': return 'text-red-500 bg-red-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'LOW': return 'text-green-500 bg-green-50';
      default: return 'text-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-16 transition-all duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2 text-ink uppercase">Maintenance Ledger</h1>
          <p className="text-xl serif-italic text-ink/30 lowercase italic">
            {activeTab === 'ASSIGNED' 
              ? 'Specific diagnostic nodes assigned for your neural resolution.' 
              : 'The collective public registry of infrastructure anomalies.'}
          </p>
        </div>
      </div>


      {/* Tabs */}
      <div className="flex p-2 bg-ink/5 rounded-[2.5rem] tactical-border w-fit strat-shadow">
        <button
          onClick={() => setActiveTab('ASSIGNED')}
          className={cn(
            "px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-3",
            activeTab === 'ASSIGNED' 
              ? "bg-accent text-slate-950 shadow-glow shadow-accent/20 scale-[1.05]" 
              : "text-ink/20 hover:text-ink/40"
          )}
        >
          <Inbox size={18} /> Assigned Nodes
        </button>
        <button
          onClick={() => setActiveTab('ALL')}
          className={cn(
            "px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-3",
            activeTab === 'ALL' 
              ? "bg-accent text-slate-950 shadow-glow shadow-accent/20 scale-[1.05]" 
              : "text-ink/20 hover:text-ink/40"
          )}
        >
          <TicketIcon size={18} /> Public Registry
        </button>
      </div>


      {/* Filters & Search */}
      <div className="bg-card p-12 rounded-[3.5rem] tactical-border strat-shadow shadow-glow shadow-accent/5 space-y-10 relative overflow-hidden group">
        <div className="absolute -right-24 -top-24 w-64 h-64 bg-accent/5 rounded-full blur-[100px] group-hover:bg-accent/10 transition-all duration-1000" />
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="relative group flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={20} />
            <input
              type="text"
              placeholder="Query Intelligence Files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="premium-input w-full pl-16 py-5"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-6">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="premium-input px-8 py-5 appearance-none cursor-pointer text-[10px] font-black uppercase tracking-[0.2em] min-w-[200px]"
            >
              <option value="ALL">All Status States</option>
              <option value="OPEN">Open Sync</option>
              <option value="IN_PROGRESS">Resolving</option>
              <option value="RESOLVED">Archived</option>
            </select>
 
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="premium-input px-8 py-5 appearance-none cursor-pointer text-[10px] font-black uppercase tracking-[0.2em] min-w-[200px]"
            >
              <option value="ALL">All Urgencies</option>
              <option value="HIGH">Critical Delta</option>
              <option value="MEDIUM">Standard Echo</option>
              <option value="LOW">Low Latency</option>
            </select>
          </div>
        </div>
      </div>


      {/* Tickets List */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-ink/5 animate-pulse rounded-[3.5rem] border border-[var(--border)]" />
          ))}
        </div>
      ) : filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {filteredTickets.map((ticket) => (
            <div 
              key={ticket.id}
              className="bg-card p-10 rounded-[3.5rem] tactical-border flex flex-col md:flex-row md:items-center gap-10 relative overflow-hidden group strat-shadow active:scale-[0.99] transition-all"
            >
              <div className="flex-1 cursor-pointer" onClick={() => navigate(`/technician/tickets/${ticket.id}`)}>
                <div className="flex items-center gap-6 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20 shadow-glow shadow-accent/10">
                    {ticket.id}
                  </span>
                  <TicketStatusBadge status={ticket.status} />
                  <span className={cn("text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border shadow-glow italic serif-italic", 
                    ticket.priority === 'HIGH' ? 'text-red-400 border-red-400/20 bg-red-400/5 shadow-red-400/10' : 
                    ticket.priority === 'MEDIUM' ? 'text-amber-500 border-amber-500/20 bg-amber-500/5 shadow-amber-500/10' : 
                    'text-accent border-accent/20 bg-accent/5 shadow-accent/10'
                  )}>
                    <AlertCircle size={14} className="inline mr-2" /> {ticket.priority} Urgency
                  </span>
                </div>
                <h3 className="text-3xl font-black text-ink mb-2 tracking-tighter group-hover:text-accent transition-colors duration-500 uppercase">
                  {ticket.title}
                </h3>
                <div className="flex flex-wrap items-center gap-8 text-[11px] font-black text-ink/20 uppercase tracking-[0.25em] italic serif-italic">
                  <span className="flex items-center gap-3">
                    <Clock size={16} className="text-accent/40" /> {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-3 text-ink/40">
                    <MapPin size={16} className="text-accent" /> {ticket.location}
                  </span>
                  {ticket.assignedToName && (
                    <span className="flex items-center gap-3 text-ink/30 lowercase">
                      <UserCheck size={16} className="text-accent/60" /> assigned to {ticket.assignedToName}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 md:border-l border-[var(--border)] pt-10 md:pt-0 md:pl-12">
                {activeTab === 'ALL' && !ticket.assignedTo && (
                  <button
                    onClick={() => handleSelfAssign(ticket.id)}
                    className="h-14 px-8 bg-accent text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-glow shadow-accent/20 active:scale-95 flex items-center gap-3"
                  >
                    <UserCheck size={20} /> Self Assign
                  </button>
                )}
                <div 
                  onClick={() => navigate(`/technician/tickets/${ticket.id}`)}
                  className="w-14 h-14 bg-ink/5 rounded-2xl flex items-center justify-center text-ink/10 group-hover:text-accent group-hover:bg-ink/10 border border-[var(--border)] transition-all duration-500 cursor-pointer"
                >
                  <ChevronRight size={28} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-32 bg-card tactical-border rounded-[4rem] text-center border border-dashed border-ink/10 strat-shadow">
          <div className="w-24 h-24 bg-ink/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-[var(--border)] shadow-2xl">
            <Inbox className="text-accent/20" size={48} />
          </div>
          <h3 className="text-4xl font-black text-ink mb-4 tracking-tighter uppercase">Registry Null State</h3>
          <p className="text-ink/20 serif-italic text-lg lowercase font-medium">No intelligence files matched your operational queue parameters.</p>
        </div>
      )}

    </div>
  );
};
