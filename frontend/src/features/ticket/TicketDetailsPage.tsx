import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Tag, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Send,
  UserPlus,
  CheckCircle,
  XCircle,
  Lock,
  ExternalLink,
  ChevronRight,
  Mail,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../shared/context/AuthContext';
import { ticketService } from './ticketService';
import { userService, User as Technician } from '../../shared/services/userService';
import { Ticket, TicketStatus } from './ticket';
import { TicketStatusBadge } from './TicketStatusBadge';
import { cn } from '../../lib/utils';

export const TicketDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setIsLoading(true);
        const [ticketData, techData] = await Promise.all([
          ticketService.getTicketById(id),
          userService.getTechnicians()
        ]);
        if (ticketData) setTicket(ticketData);
        setTechnicians(techData);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !ticket || !user) return;

    setIsSubmitting(true);
    await ticketService.addComment(ticket.id, user.id, user.name, comment);
    setComment('');
    // Refresh ticket
    const updated = await ticketService.getTicketById(ticket.id);
    if (updated) setTicket(updated);
    setIsSubmitting(false);
  };

  const handleStatusUpdate = async (status: TicketStatus, reason?: string) => {
    if (!ticket) return;
    setIsSubmitting(true);
    await ticketService.updateStatus(ticket.id, status, reason);
    const updated = await ticketService.getTicketById(ticket.id);
    if (updated) setTicket(updated);
    setIsSubmitting(false);
    setShowResolveModal(false);
    setShowRejectModal(false);
    setNotes('');
  };

  const handleAssign = async (techId: string, techName: string) => {
    if (!ticket) return;
    setIsSubmitting(true);
    await ticketService.assignTechnician(ticket.id, techId, techName);
    const updated = await ticketService.getTicketById(ticket.id);
    if (updated) setTicket(updated);
    setIsSubmitting(false);
    setShowAssignModal(false);
  };

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center text-[10px] font-black uppercase tracking-[0.5em] text-white/10 animate-pulse italic">Synchronizing Neural Data...</div>;
  if (!ticket) return <div className="min-h-[60vh] flex items-center justify-center text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic">Intelligence File Not Found</div>;

  const canAssign = user?.role === 'ADMIN' && ticket.status === 'OPEN';
  const canResolve = user?.role === 'TECHNICIAN' && ticket.status === 'IN_PROGRESS' && ticket.assignedTo === user.id;
  const canClose = (user?.role === 'ADMIN' || (user?.role === 'USER' && ticket.createdBy === user.id)) && ticket.status === 'RESOLVED';
  const canReject = user?.role === 'ADMIN' && ticket.status === 'OPEN';

  const isCreator = user?.id === ticket.createdBy;
  const canUserResolve = isCreator && (ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS');
  const canUserUnresolve = isCreator && (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED');

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-16 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => navigate(-1)}
            className="w-16 h-16 premium-glass rounded-2xl flex items-center justify-center text-white/20 hover:text-accent border border-white/5 transition-all duration-500 hover:rotate-[-10deg]"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-6 mb-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20 shadow-glow shadow-accent/10">
                {ticket.id}
              </span>
              <TicketStatusBadge status={ticket.status} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">{ticket.title}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {canAssign && (
            <button 
              onClick={() => setShowAssignModal(true)}
              className="px-8 h-14 bg-accent text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white transition-all shadow-glow shadow-accent/30"
            >
              <UserPlus size={18} /> Assign Handler
            </button>
          )}
          {(canResolve || canUserResolve) && (
            <button 
              onClick={() => setShowResolveModal(true)}
              className="px-8 h-14 bg-emerald-500 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white transition-all shadow-glow shadow-emerald-500/30"
            >
              <CheckCircle size={18} /> Resolve Node
            </button>
          )}
          {canUserUnresolve && (
            <button 
              onClick={() => handleStatusUpdate('OPEN', 'Marked as unresolved by creator')}
              className="px-8 h-14 bg-amber-500 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white transition-all shadow-glow shadow-amber-500/30"
            >
              <AlertCircle size={18} /> Reopen Node
            </button>
          )}
          {canReject && (
            <button 
              onClick={() => setShowRejectModal(true)}
              className="px-8 h-14 bg-red-500 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white transition-all shadow-glow shadow-red-500/30"
            >
              <XCircle size={18} /> Reject Delta
            </button>
          )}
          {canClose && (
            <button 
              onClick={() => handleStatusUpdate('CLOSED')}
              className="px-8 h-14 premium-button-ghost"
            >
              <Lock size={18} className="mr-3" /> Archive File
            </button>
          )}
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-16">
          {/* Description Card */}
          <div className="premium-glass rounded-[4rem] p-12 border border-white/5 space-y-12 relative overflow-hidden group shadow-2xl">
            <div className="absolute -right-32 -top-32 w-80 h-80 bg-accent/5 rounded-full blur-[120px] group-hover:bg-accent/10 transition-all duration-1000" />
            
            <div className="space-y-6 relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic serif-italic">System Diagnostic Breakdown</h3>
              <p className="text-2xl leading-relaxed text-white/70 font-light">{ticket.description}</p>
            </div>
 
            {ticket.attachments && Array.isArray(ticket.attachments) && ticket.attachments.length > 0 && (
              <div className="space-y-6 relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic serif-italic">Visual Data Evidence</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                  {ticket.attachments.map((att) => (
                    <a 
                      key={att.id} 
                      href={att.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="group relative aspect-square rounded-[2rem] overflow-hidden border border-white/5 block shadow-2xl"
                    >
                      <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-all duration-500" />
                      <img src={att.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt={att.fileName} />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white">
                          <ExternalLink size={24} />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
 
            {ticket.resolutionNotes && (
              <div className="p-10 bg-emerald-500/5 rounded-[2.5rem] border border-emerald-500/20 space-y-4 relative z-10 shadow-glow shadow-emerald-500/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 italic serif-italic">Resolution Protocol Executed</h3>
                <p className="text-emerald-100/70 text-lg leading-relaxed">{ticket.resolutionNotes}</p>
              </div>
            )}
 
            {ticket.rejectionReason && (
              <div className="p-10 bg-red-500/5 rounded-[2.5rem] border border-red-500/20 space-y-4 relative z-10 shadow-glow shadow-red-500/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-400 italic serif-italic">System Rejection Reason</h3>
                <p className="text-red-100/70 text-lg leading-relaxed">{ticket.rejectionReason}</p>
              </div>
            )}
          </div>


          {/* Comments Section */}
          <div className="space-y-10">
            <div className="flex items-center justify-between px-6">
              <h2 className="text-3xl font-black tracking-tighter text-white uppercase flex items-center gap-4">
                <MessageSquare size={32} className="text-accent" /> Uplink Logs
              </h2>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10 italic serif-italic">
                {(ticket.comments || []).length} transmissions recorded
              </span>
            </div>
            
            <div className="space-y-8">
              {(ticket.comments || []).map((c) => (
                <div key={c.id} className="premium-glass rounded-[2.5rem] p-8 border border-white/5 shadow-xl flex gap-8 group">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 text-white/10 group-hover:text-accent transition-all duration-500">
                    <User size={28} />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-white italic tracking-tight">{c.userName}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/10">
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-white/50 leading-relaxed text-lg lowercase serif-italic">{c.content}</p>
                  </div>
                </div>
              ))}
 
              <form onSubmit={handleAddComment} className="relative group">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Initiate communication uplink..."
                  className="premium-input w-full px-10 py-8 resize-none h-[180px] pr-28 text-lg"
                />
                <button 
                  type="submit"
                  disabled={isSubmitting || !comment.trim()}
                  className="absolute right-8 bottom-8 w-16 h-16 bg-accent text-slate-950 rounded-2xl hover:bg-white transition-all duration-500 disabled:opacity-5 shadow-glow shadow-accent/20 flex items-center justify-center p-0"
                >
                  <Send size={24} />
                </button>
              </form>
            </div>
          </div>
        </div>


        {/* Sidebar Info */}
        <div className="space-y-10">
          <div className="premium-glass rounded-[3.5rem] p-12 border border-white/5 shadow-2xl space-y-12 shrink-0">
            <div className="space-y-8">
              {[
                { icon: Tag, label: 'Node Class', value: ticket.category },
                { icon: MapPin, label: 'Temporal Coordinates', value: ticket.location },
                { icon: User, label: 'Originator', value: ticket.createdByName },
                { icon: Mail, label: 'Neural Uplink', value: ticket.email },
                { icon: GraduationCap, label: 'Affiliated Core', value: ticket.faculty },
                { icon: Clock, label: 'Temporal Stamp', value: new Date(ticket.createdAt).toLocaleString() },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-accent/40 border border-white/10 group-hover:text-accent group-hover:bg-white/10 transition-all duration-500 shrink-0">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10 mb-1 italic serif-italic">{item.label}</p>
                    <p className="text-sm font-black text-white/70 tracking-tight">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
 
            <div className="pt-12 border-t border-white/5 space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center text-accent border border-accent/20 shrink-0 shadow-glow shadow-accent/10">
                  <UserPlus size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10 mb-1 italic serif-italic">Assigned Handler</p>
                  <p className="text-sm font-black text-accent tracking-tighter uppercase">{ticket.assignedToName || 'Unassigned Node'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="premium-glass rounded-[4rem] p-16 max-w-2xl w-full border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute -left-24 -top-24 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
            <div className="relative z-10 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-black tracking-tighter text-white uppercase">Appoint Handler</h2>
                <p className="text-lg font-light text-white/30 lowercase italic serif-italic">Select a neural node to authorize intervention</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {technicians.length > 0 ? (
                  technicians.map((tech) => (
                    <button
                      key={tech.id}
                      onClick={() => handleAssign(tech.id, tech.name)}
                      className="group p-8 bg-white/5 rounded-[2.5rem] border border-white/5 hover:border-accent/40 text-left transition-all duration-500 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-all duration-700" />
                      <div className="relative z-10 space-y-2">
                        <span className="text-lg font-black text-white group-hover:text-accent transition-colors">{tech.name}</span>
                        <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest">{tech.email}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-2 py-20 text-center text-white/10 italic font-black uppercase tracking-[0.3em]">
                    No Handler Nodes Available
                  </div>
                )}
              </div>
              
              <button onClick={() => setShowAssignModal(false)} className="w-full h-18 premium-button-ghost text-xs tracking-[0.5em]">Deauthorize Protocol</button>
            </div>
          </div>
        </div>
      )}


      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="premium-glass rounded-[4rem] p-16 max-w-2xl w-full border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-32 -top-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px]" />
            <div className="relative z-10 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-black tracking-tighter text-white uppercase">Resolution Protocol</h2>
                <p className="text-lg font-light text-white/30 lowercase italic serif-italic">Document the intervention narrative for final audit</p>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-4 italic serif-italic">Intervention Record</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="premium-input w-full px-10 py-8 resize-none h-[200px] text-lg"
                  placeholder="Summarize the corrective actions deployed..."
                />
              </div>

              <div className="flex gap-8">
                <button onClick={() => setShowResolveModal(false)} className="flex-1 h-18 premium-button-ghost">Retract</button>
                <button 
                  onClick={() => handleStatusUpdate('RESOLVED', notes)}
                  disabled={!notes.trim()}
                  className="flex-[2] h-18 bg-emerald-500 text-slate-950 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-glow shadow-emerald-500/30 disabled:opacity-5"
                >
                  Confirm Resolution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="premium-glass rounded-[4rem] p-16 max-w-2xl w-full border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-32 -top-32 w-80 h-80 bg-red-500/10 rounded-full blur-[120px]" />
            <div className="relative z-10 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-black tracking-tighter text-red-500 uppercase">Rejection Logic</h2>
                <p className="text-lg font-light text-white/30 lowercase italic serif-italic">Specify the logical grounds for file rejection</p>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-4 italic serif-italic">Nullification Narrative</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="premium-input w-full px-10 py-8 border-red-500/20 focus:border-red-500 resize-none h-[200px] text-lg"
                  placeholder="Specify protocol misalignment..."
                />
              </div>

              <div className="flex gap-8">
                <button onClick={() => setShowRejectModal(false)} className="flex-1 h-18 premium-button-ghost">Abort Nullification</button>
                <button 
                  onClick={() => handleStatusUpdate('REJECTED', notes)}
                  disabled={!notes.trim()}
                  className="flex-[2] h-18 bg-red-500 text-slate-950 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-glow shadow-red-500/30 disabled:opacity-5"
                >
                  Execute Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
