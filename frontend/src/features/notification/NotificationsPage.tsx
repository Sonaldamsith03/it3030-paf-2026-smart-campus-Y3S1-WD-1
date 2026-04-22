import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  MoreHorizontal, 
  Calendar, 
  Ticket, 
  Settings,
  Check,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { notificationService, Notification, NotificationType } from './notificationService';
import { useAuth } from '../../shared/context/AuthContext';
import { ConfirmModal } from '../../shared/components/ConfirmModal';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      setIsLoading(true);
      const data = await notificationService.getNotifications(user.id);
      setNotifications(data);
      setIsLoading(false);
    };
    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDeleteClick = (id: string) => {
    setNotificationToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (notificationToDelete) {
      await notificationService.deleteNotification(notificationToDelete);
      setNotifications(prev => prev.filter(n => n.id !== notificationToDelete));
      setNotificationToDelete(null);
    }
  };

  const filteredNotifications = notifications;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle2 size={18} />;
      case 'WARNING': return <Clock size={18} />;
      case 'ERROR': return <AlertCircle size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-orange-500';
      case 'LOW': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-[1400px] mx-auto w-full space-y-20 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2 text-ink uppercase">Intelligence Feed</h1>
          <p className="text-xl serif-italic text-ink/30 lowercase font-medium">Real-time synchronization of infrastructure and booking events.</p>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={handleMarkAllAsRead}
            className="px-10 h-16 premium-glass border border-[var(--border)] rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-ink/20 hover:text-accent hover:border-accent/40 hover:bg-accent/5 transition-all duration-500 strat-shadow"
          >
            Acknowledge All Data
          </button>
        </div>
      </div>


      {/* Notifications List */}
      <div className="space-y-10">
        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-[var(--input-bg)] animate-pulse rounded-[3rem] tactical-border" />
            ))}
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id}
                className={cn(
                  "premium-glass p-10 rounded-[3.5rem] border border-[var(--border)] flex items-center gap-12 transition-all duration-700 group relative overflow-hidden strat-shadow",
                  !notification.isRead ? "bg-accent/5 ring-2 ring-accent/10" : "card-hover"
                )}
              >
                {!notification.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-accent shadow-glow shadow-accent/50" />
                )}

                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 border tactical-border",
                  notification.type === 'SUCCESS' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : 
                  notification.type === 'WARNING' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : 
                  notification.type === 'ERROR' ? "bg-red-500/10 text-red-600 border-red-500/20" : 
                  "bg-[var(--input-bg)] text-accent border-[var(--border)]"
                )}>
                  {getIcon(notification.type)}
                </div>
 
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <h3 className="text-xl font-black tracking-tight text-ink uppercase italic leading-none">
                        {notification.type} Log Entry
                      </h3>
                      {!notification.isRead && (
                        <span className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse shadow-glow shadow-accent/50" />
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ink/10 italic serif-italic">
                      {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xl leading-relaxed text-ink/50 font-medium max-w-[90%] lowercase serif-italic">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-6 pt-3">
                    <span className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-ink/20">
                      <Clock size={16} className="text-accent/60" /> {new Date(notification.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
 
                <div className="flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                  <button 
                    onClick={() => handleDeleteClick(notification.id)}
                    className="w-14 h-14 bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-600 hover:bg-red-500/20 hover:border-red-500/40 transition-all rounded-2xl"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-40 bg-card tactical-border rounded-[5rem] text-center relative overflow-hidden group strat-shadow">
            <div className="w-24 h-24 bg-[var(--input-bg)] rounded-[3rem] flex items-center justify-center mx-auto mb-10 tactical-border relative z-10 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
              <Bell className="text-ink/10 group-hover:text-accent/20 transition-colors" size={48} />
            </div>
            <h3 className="text-4xl font-black text-ink mb-4 tracking-tighter uppercase relative z-10">Vault Registry Synced</h3>
            <p className="text-xl serif-italic text-ink/20 lowercase relative z-10 max-w-sm mx-auto">No intelligence entries were found in the current temporal stream.</p>
          </div>
        )}
      </div>


      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Notification?"
        message="Are you sure you want to permanently remove this notification from your inbox? This action cannot be undone."
      />
    </div>
  );
};
