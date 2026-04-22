import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  User, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Play, 
  AlertCircle,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { technicianService } from './technicianService';
import { Ticket, TicketStatus } from './ticket';
import { TicketStatusBadge } from './TicketStatusBadge';
import { cn } from '../../lib/utils';

export const TechnicianTicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await technicianService.getTicketById(id);
        setTicket(data);
        setResolutionNotes(data.resolutionNotes || '');
      } catch (error) {
        console.error('Failed to fetch ticket details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  const handleStatusUpdate = async (newStatus: TicketStatus) => {
    if (!id || !ticket) return;
    setIsSubmitting(true);
    try {
      const updatedTicket = await technicianService.updateTicketStatus(id, newStatus, resolutionNotes);
      setTicket(updatedTicket);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !comment.trim()) return;
    setIsSubmitting(true);
    try {
      await technicianService.addComment(id, comment);
      setComment('');
      // Refresh ticket to show new comment
      const updatedTicket = await technicianService.getTicketById(id);
      setTicket(updatedTicket);
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[10px] font-black uppercase tracking-[0.5em] text-ink/10 animate-pulse italic">
        Synchronizing Diagnostic Node...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8">
        <div className="w-24 h-24 bg-ink/5 rounded-[2.5rem] flex items-center justify-center border border-[var(--border)] shadow-2xl">
          <AlertCircle className="text-red-500/20" size={48} />
        </div>
        <h2 className="text-4xl font-black text-ink uppercase tracking-tighter">Diagnostic Node Not Found</h2>
        <button 
          onClick={() => navigate('/technician/tickets')} 
          className="h-16 px-10 bg-ink/5 hover:bg-ink hover:text-paper rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all border border-[var(--border)] active:scale-95"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-[1400px] mx-auto w-full space-y-20 pb-32">
      <div className="flex items-center gap-10">
        <button 
          onClick={() => navigate('/technician/tickets')}
          className="w-16 h-16 bg-card tactical-border rounded-2xl flex items-center justify-center text-ink/20 hover:text-accent hover:border-accent/40 transition-all duration-500 strat-shadow group"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-ink uppercase">Workstation Alpha</h1>
          <p className="text-xl serif-italic text-ink/30 lowercase font-medium">Operational diagnostic interface for anomaly resolution.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-16">
          <div className="bg-card tactical-border rounded-[4rem] p-12 md:p-16 strat-shadow group relative overflow-hidden">
             <div className="absolute -right-32 -top-32 w-80 h-80 bg-accent/5 rounded-full blur-[120px] group-hover:bg-accent/10 transition-all duration-1000" />
            
            <div className="flex flex-wrap items-center justify-between gap-8 mb-16 relative z-10">
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent bg-accent/5 px-5 py-2 rounded-full border border-accent/20 shadow-glow shadow-accent/5">
                  {ticket.id.slice(-8)}
                </span>
                <TicketStatusBadge status={ticket.status} />
              </div>
              <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-[0.4em] text-ink/20 italic serif-italic">
                <Clock size={18} className="text-accent/60" /> {new Date(ticket.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="space-y-10 relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-ink uppercase leading-tight">{ticket.title}</h2>
              <div className="flex flex-wrap gap-10 text-[11px] font-black text-ink/20 uppercase tracking-[0.3em] italic serif-italic font-semibold">
                <span className="flex items-center gap-3"><MapPin size={20} className="text-accent" /> {ticket.location}</span>
                <span className="flex items-center gap-3"><User size={20} className="text-accent/60" /> Origin Node: {ticket.createdByName}</span>
              </div>
            </div>

            <div className="mt-16 pt-16 border-t border-[var(--border)] relative z-10">
              <p className="text-2xl leading-relaxed text-ink/60 font-medium italic serif-italic">{ticket.description}</p>
            </div>

            {ticket.attachments && Array.isArray(ticket.attachments) && ticket.attachments.length > 0 && (
              <div className="space-y-10 pt-16 border-t border-[var(--border)] mt-16 relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-ink/10 italic serif-italic flex items-center gap-5">
                  <ImageIcon size={20} className="text-accent/40" /> Visual Telemetry Data
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {ticket.attachments.map((att) => (
                    <a 
                      key={att.id} 
                      href={att.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative aspect-video rounded-3xl overflow-hidden border border-[var(--border)] strat-shadow block"
                    >
                      <div className="absolute inset-0 bg-paper/20 group-hover:bg-transparent transition-all duration-500 z-10" />
                      <img src={att.url} alt={att.fileName} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>


          {/* Communication Nexus */}
          <div className="bg-card tactical-border rounded-[4rem] p-12 md:p-16 strat-shadow space-y-16 group relative overflow-hidden">
             <div className="absolute -left-32 -bottom-32 w-80 h-80 bg-accent/5 rounded-full blur-[120px] group-hover:bg-accent/10 transition-all duration-1000" />
            
            <h3 className="text-3xl font-black tracking-tighter flex items-center gap-6 text-ink uppercase relative z-10">
              <MessageSquare size={36} className="text-accent" /> Uplink registry
            </h3>

            <div className="space-y-12 relative z-10">
              {ticket.comments.map((c) => (
                <div key={c.id} className="flex gap-8 group/comment">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--input-bg)] border border-[var(--border)] flex items-center justify-center text-accent/60 group-hover/comment:bg-accent group-hover/comment:text-slate-950 transition-all duration-500 font-black shrink-0 text-xl tactical-border ring-1 ring-white/5">
                    {c.userName.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-black text-ink uppercase tracking-tight">{c.userName}</span>
                      <span className="text-[10px] font-black text-ink/10 uppercase tracking-[0.3em]">{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-xl text-ink/50 leading-relaxed lowercase serif-italic italic font-medium">{c.content}</p>
                  </div>
                </div>
              ))}

              <form onSubmit={handleAddComment} className="relative pt-10">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Initiate technician transmission..."
                  className="premium-input w-full p-8 h-40 group-focus-within:border-accent/40 pr-24 text-xl serif-italic lowercase font-medium"
                />
                <button 
                  type="submit"
                  disabled={isSubmitting || !comment.trim()}
                  className="absolute bottom-10 right-10 w-16 h-16 bg-accent text-slate-950 rounded-2xl flex items-center justify-center hover:bg-ink hover:text-paper transition-all duration-500 disabled:opacity-50 shadow-glow shadow-accent/20"
                >
                  <Send size={24} />
                </button>
              </form>
            </div>
          </div>
        </div>


        {/* Operations Sidebar */}
        <div className="space-y-12">
          <div className="bg-card tactical-border rounded-[4.5rem] p-12 space-y-12 strat-shadow relative overflow-hidden group">
            <div className="absolute -right-24 -top-24 w-64 h-64 bg-accent/10 rounded-full blur-[100px] group-hover:opacity-100 transition-all duration-1000 opacity-50" />
            <h3 className="text-3xl font-black tracking-tighter text-ink uppercase relative z-10 italic">State Control</h3>
            
            <div className="space-y-10 relative z-10">
              {ticket.status === 'OPEN' && (
                <button 
                  onClick={() => handleStatusUpdate('IN_PROGRESS')}
                  disabled={isSubmitting}
                  className="w-full h-20 bg-accent text-slate-950 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-6 hover:bg-ink hover:text-paper transition-all shadow-glow shadow-accent/40 active:scale-95"
                >
                  <Play size={24} /> Initialize Ops
                </button>
              )}

              {ticket.status === 'IN_PROGRESS' && (
                <button 
                  onClick={() => handleStatusUpdate('RESOLVED')}
                  disabled={isSubmitting}
                  className="w-full h-20 bg-emerald-600 text-paper rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-6 hover:bg-ink hover:text-paper transition-all shadow-glow shadow-emerald-500/40 active:scale-95"
                >
                  <CheckCircle2 size={24} /> Finalize Protocol
                </button>
              )}

              {ticket.status === 'RESOLVED' && (
                <div className="bg-[var(--input-bg)] p-8 rounded-[2.5rem] tactical-border flex items-center gap-5 ring-1 ring-white/5 shadow-xl">
                  <CheckCircle2 size={28} className="text-emerald-600 shadow-glow shadow-emerald-500/20" />
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-ink/30 italic">Target Locked: Resolved</span>
                </div>
              )}
            </div>

            <div className="space-y-8 pt-12 border-t border-[var(--border)] relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-ink/10 italic serif-italic">Final Diagnostic Matrix</h4>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Specify the technical corrective measures..."
                className="premium-input w-full p-6 text-lg h-48 resize-none font-medium serif-italic lowercase"
              />
              <button 
                onClick={() => handleStatusUpdate(ticket.status)}
                disabled={isSubmitting}
                className="w-full h-16 bg-ink text-paper rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-accent hover:text-slate-950 transition-colors shadow-xl"
              >
                Log Archive Delta
              </button>
            </div>
          </div>

          <div className="bg-card tactical-border rounded-[4.5rem] p-12 space-y-10 strat-shadow ring-1 ring-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-ink/10 italic serif-italic">Node Metadata</h3>
            <div className="space-y-10">
              <div className="flex flex-col gap-3 group/meta">
                <span className="text-[9px] text-ink/10 font-black uppercase tracking-[0.4em] italic">Priority Protocol</span>
                <span className={cn(
                  "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border italic shadow-glow text-center",
                  ticket.priority === 'HIGH' ? 'text-red-600 border-red-500/20 bg-red-500/5 shadow-red-500/5' : 
                  ticket.priority === 'MEDIUM' ? 'text-amber-600 border-amber-500/20 bg-amber-500/5 shadow-amber-500/5' : 
                  'text-accent border-accent/20 bg-accent/5 shadow-accent/5'
                )}>
                  {ticket.priority} Urgency
                </span>
              </div>
              <div className="flex justify-between items-center group/meta border-t border-[var(--border)] pt-8">
                <span className="text-[9px] text-ink/10 font-black uppercase tracking-[0.4em] italic">Category Hub</span>
                <span className="text-base font-black text-ink/70 tracking-tight lowercase">{ticket.category}</span>
              </div>
              <div className="flex justify-between items-center group/meta border-t border-[var(--border)] pt-8">
                <span className="text-[9px] text-ink/10 font-black uppercase tracking-[0.4em] italic">Origin Dept</span>
                <span className="text-base font-black text-ink/70 tracking-tight lowercase">{ticket.faculty} Faculty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

