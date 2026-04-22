import React, { useState } from 'react';
import { 
  Megaphone, 
  Send, 
  Type, 
  User, 
  Bell,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  History,
  Trash2,
  Search
} from 'lucide-react';
import { notificationService, NotificationType, Notification } from '../../../features/notification/notificationService';
import { toast } from 'sonner';
import { cn } from '../../../lib/utils';
import { format } from 'date-fns';
import { ConfirmModal } from '../../components/ConfirmModal';

export const AdminNoticePage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('INFO');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentNotices, setRecentNotices] = useState<Notification[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const data = await notificationService.getNotifications();
      // Filter for global notices (userId is null or empty)
      const globalNotices = data.filter(n => !n.userId).slice(0, 5);
      setRecentNotices(globalNotices);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSubmitting(true);
    try {
      await notificationService.createNotification({
        message,
        type,
      });
      toast.success('Notice published successfully');
      setMessage('');
      fetchHistory();
    } catch (error) {
      toast.error('Failed to publish notice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setNoticeToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (noticeToDelete) {
      try {
        await notificationService.deleteNotification(noticeToDelete);
        toast.success('Notice deleted');
        fetchHistory();
      } catch (error) {
        toast.error('Failed to delete notice');
      } finally {
        setNoticeToDelete(null);
      }
    }
  };

  const typeOptions: { value: NotificationType; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'INFO', label: 'Information', icon: <Info size={16} />, color: 'text-blue-500' },
    { value: 'SUCCESS', label: 'Success', icon: <CheckCircle2 size={16} />, color: 'text-green-500' },
    { value: 'WARNING', label: 'Warning', icon: <AlertTriangle size={16} />, color: 'text-amber-500' },
    { value: 'ERROR', label: 'Urgent/Error', icon: <AlertCircle size={16} />, color: 'text-red-500' },
  ];

  return (
    <div className="p-6 md:p-12 max-w-[1400px] mx-auto space-y-20 pb-40">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-5 text-accent">
            <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-slate-950 shadow-glow shadow-accent/40">
              <Megaphone size={28} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.5em] italic serif-italic">High Command Console</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-ink uppercase leading-tight">
            Broadcast <span className="text-ink/40">Intel</span>
          </h1>
          <p className="text-ink/30 text-xl font-medium max-w-2xl lowercase serif-italic font-semibold">
            Synchronize system-wide intelligence and infrastructure updates across the neural network.
          </p>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
        {/* Compose Form */}
        <div className="lg:col-span-3 space-y-12">
          <div className="bg-card tactical-border rounded-[4rem] p-12 md:p-16 strat-shadow relative overflow-hidden group">
            <div className="absolute -right-32 -top-32 w-80 h-80 bg-accent/5 rounded-full blur-[120px] group-hover:bg-accent/10 transition-all duration-1000" />
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-16">
              <div className="grid grid-cols-1 gap-12">
                {/* Type Selection */}
                <div className="space-y-8">
                  <label className="text-[10px] font-black uppercase tracking-[0.5em] text-ink/10 italic serif-italic ml-4">Transmission Protocol</label>
                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                    {typeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setType(opt.value)}
                        className={cn(
                          "flex items-center gap-5 px-8 py-5 rounded-2xl border transition-all duration-500 text-[10px] font-black uppercase tracking-widest",
                          type === opt.value 
                            ? "bg-accent text-slate-950 border-accent shadow-glow shadow-accent/20 scale-[1.02]" 
                            : "bg-[var(--input-bg)] border-transparent text-ink/20 hover:border-accent/30 hover:text-ink"
                        )}
                      >
                        <span className={cn("transition-transform duration-500", type === opt.value ? "text-slate-950 scale-110" : opt.color.replace('blue-500', 'blue-600').replace('green-500', 'emerald-600').replace('amber-500', 'amber-600').replace('red-500', 'red-600'))}>
                          {opt.icon}
                        </span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-8">
                <label className="text-[10px] font-black uppercase tracking-[0.5em] text-ink/10 italic serif-italic ml-4">Narrative Payload</label>
                <div className="relative group/input">
                  <Type className="absolute left-8 top-10 text-ink/10 group-focus-within/input:text-accent transition-colors" size={24} />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter announcement telemetry..."
                    rows={6}
                    className="premium-input w-full pl-20 pr-10 py-10 h-60 focus:border-accent/40 text-xl leading-relaxed lowercase serif-italic font-medium"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-10 border-t border-[var(--border)]">
                <p className="text-[10px] text-ink/10 font-black uppercase tracking-[0.3em] italic serif-italic max-w-sm">
                  * Global synchronization will broadcast to all active network nodes.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto h-20 px-20 bg-accent text-slate-950 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-ink hover:text-paper transition-all duration-500 disabled:opacity-50 shadow-glow shadow-accent/20 active:scale-95"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-3 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  ) : (
                    <div className="flex items-center gap-5">
                      <span>Deploy Notice</span>
                      <Send size={22} />
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>


        {/* Strategic History Sidebar */}
        <div className="space-y-12">
          <div className="bg-card tactical-border rounded-[3.5rem] p-12 space-y-12 strat-shadow relative overflow-hidden group">
            <div className="absolute -left-24 -top-24 w-64 h-64 bg-accent/5 rounded-full blur-[100px] group-hover:bg-accent/10 transition-all duration-1000" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <History size={20} className="text-ink/20" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-ink/20 italic serif-italic">Transmission Log</h3>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse shadow-glow shadow-accent/50" />
              </div>
            </div>

            <div className="space-y-8 relative z-10">
              {isLoadingHistory ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="h-28 bg-[var(--input-bg)] rounded-[2.5rem] animate-pulse tactical-border" />
                ))
              ) : recentNotices.length > 0 ? (
                recentNotices.map((notice) => (
                  <div 
                    key={notice.id} 
                    className="group/item relative bg-[var(--input-bg)] border border-[var(--border)] p-8 rounded-[2.5rem] hover:bg-paper hover:border-accent/20 transition-all duration-700 strat-shadow"
                  >
                    <div className="flex items-start justify-between gap-5 mb-6">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center border shadow-glow",
                        notice.type === 'INFO' ? 'bg-accent/5 border-accent/20 text-accent shadow-accent/5' :
                        notice.type === 'SUCCESS' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 shadow-emerald-500/5' :
                        notice.type === 'WARNING' ? 'bg-amber-500/5 border-amber-500/20 text-amber-600 shadow-amber-500/5' :
                        'bg-red-500/5 border-red-500/20 text-red-600 shadow-red-500/5'
                      )}>
                        {notice.type === 'INFO' && <Info size={20} />}
                        {notice.type === 'SUCCESS' && <CheckCircle2 size={20} />}
                        {notice.type === 'WARNING' && <AlertTriangle size={20} />}
                        {notice.type === 'ERROR' && <AlertCircle size={20} />}
                      </div>
                      <button 
                        onClick={() => handleDeleteClick(notice.id)}
                        className="opacity-0 group-hover/item:opacity-100 w-12 h-12 bg-red-500/5 flex items-center justify-center text-red-600 hover:bg-red-500/10 transition-all rounded-xl border border-red-500/10"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-base font-medium text-ink/60 line-clamp-2 leading-relaxed mb-6 lowercase serif-italic italic">
                      {notice.message}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.4em] text-ink/10">
                      <span>{notice.userId ? 'Priority Node' : 'Global Hub'}</span>
                      <span>{format(new Date(notice.timestamp), 'MMM dd')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-24 bg-[var(--input-bg)] rounded-[3rem] tactical-border italic">
                  <Bell className="text-ink/5 mx-auto mb-6" size={48} />
                  <p className="text-[10px] font-black text-ink/10 uppercase tracking-[0.5em]">Log Clear</p>
                </div>
              )}
            </div>

            <button 
              onClick={fetchHistory}
              className="w-full h-16 bg-[var(--input-bg)] border border-[var(--border)] rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-ink/20 hover:text-accent hover:border-accent/40 transition-all duration-500 relative z-10"
            >
              Recalibrate Logs
            </button>
          </div>

          <div className="bg-ink rounded-[4rem] p-12 text-paper relative overflow-hidden group shadow-2xl">
            <div className="absolute -right-20 -bottom-20 opacity-5 group-hover:scale-110 transition-transform duration-1000 rotate-12">
              <Megaphone size={200} />
            </div>
            <div className="relative z-10">
              <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-accent mb-8 italic serif-italic">Strategic Memo</h4>
              <p className="text-paper/40 text-lg leading-relaxed lowercase serif-italic font-medium">
                Broadcast critical maintenance updates using "Urgent" protocols. These synchronize instantly across all neural nodes to ensure core stability.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Global Notice?"
        message="Are you sure you want to delete this announcement? It will be removed from all users' notification feeds permanently."
      />
    </div>
  );
};

