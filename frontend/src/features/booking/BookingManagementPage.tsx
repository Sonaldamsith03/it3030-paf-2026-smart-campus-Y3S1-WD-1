import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Calendar,
  User,
  Clock,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { bookingService, Booking, BookingStatus } from './bookingService';
import { userService } from '../../shared/services/userService';
import { useAuth } from '../../shared/context/AuthContext';

export const BookingManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [bookingsData, resourcesData, usersData] = await Promise.all([
          bookingService.getBookings(),
          bookingService.getResources(),
          userService.getAllUsers()
        ]);
        
        // Map missing names and roles for legacy bookings
        const enrichedBookings = bookingsData.map(b => {
          const res = resourcesData.find(r => r.id === b.resourceId);
          const usr = usersData.find(u => u.id === b.userId);
          
          return { 
            ...b, 
            resourceName: b.resourceName || res?.name || b.resourceId,
            resourceType: (b as any).resourceType || res?.type || 'FACILITY',
            userName: b.userName || usr?.name || b.userId,
            userRole: b.userRole || usr?.role || 'STUDENT'
          } as Booking;
        });

        setBookings(enrichedBookings);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    await bookingService.approveBooking(id, user?.email, user?.name);
    const data = await bookingService.getBookings();
    setBookings([...data]);
  };

  const handleReject = async (id: string) => {
    await bookingService.rejectBooking(id, rejectionReason, user?.email, user?.name);
    const data = await bookingService.getBookings();
    setBookings([...data]);
    setShowRejectModal(null);
    setRejectionReason('');
  };

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = filter === 'ALL' || b.status === filter;
    const matchesSearch = (b.resourceName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (b.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (b.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStyle = (status: BookingStatus) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-50 text-green-600 border-green-100';
      case 'REJECTED': return 'bg-red-50 text-red-600 border-red-100';
      case 'PENDING': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'CANCELLED': return 'bg-gray-50 text-gray-600 border-gray-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2 text-ink uppercase">Reservation Registry</h1>
          <p className="text-xl serif-italic text-ink/30 lowercase italic font-medium">Approve or reject campus facility booking requests.</p>
        </div>
      </div>


      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex flex-wrap items-center gap-4">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={cn(
                "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 border",
                filter === s 
                  ? "bg-accent text-slate-950 border-accent shadow-glow shadow-accent/20" 
                  : "bg-ink/5 text-ink/30 border-[var(--border)] hover:border-accent hover:text-ink"
              )}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search Intelligence Registry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-8 h-18 premium-input"
          />
        </div>
      </div>


      {/* Bookings List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-ink/5 animate-pulse rounded-[3rem] border border-[var(--border)]" />
            ))}
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div 
                key={booking.id} 
                className="bg-card tactical-border p-10 rounded-[3rem] flex flex-col md:flex-row items-center gap-10 justify-between group strat-shadow ring-1 ring-white/5"
              >
                <div className="flex items-center gap-10 flex-1">
                  <div className="w-16 h-16 bg-ink/5 rounded-3xl flex items-center justify-center text-ink/10 group-hover:text-accent border border-[var(--border)] transition-all duration-700 group-hover:rotate-12 group-hover:scale-110">
                    <Calendar size={28} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <h3 className="font-black text-2xl text-ink tracking-tight uppercase leading-none">{booking.purpose}</h3>
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border italic serif-italic shadow-glow",
                        booking.status === 'APPROVED' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-emerald-500/10" :
                        booking.status === 'REJECTED' ? "bg-red-500/10 text-red-600 border-red-500/20 shadow-red-500/10" :
                        booking.status === 'PENDING' ? "bg-orange-500/10 text-orange-600 border-orange-500/20 shadow-orange-500/10" :
                        "bg-ink/5 text-ink/30 border-white/10 shadow-transparent font-medium"
                      )}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-ink/20 uppercase tracking-[0.25em] italic serif-italic">
                      <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent/30" /> {booking.resourceName || booking.resourceId}</span>
                      <span className="flex items-center gap-2 font-black text-accent/60 tracking-[0.4em] font-mono">{booking.id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-12 border-x border-[var(--border)] px-12">
                  <div className="space-y-1 text-center md:text-left">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ink/10 italic serif-italic">Entity</span>
                    <div className="flex items-center gap-3 text-ink/40 group-hover:text-ink transition-colors">
                      <User size={20} className="text-accent/40" />
                      <div className="flex flex-col">
                        <span className="text-sm font-black tracking-tight uppercase leading-none">{booking.userName || booking.userId}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-ink/20">{booking.userRole || 'STUDENT'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 text-center md:text-left">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ink/10 italic serif-italic">Temporal</span>
                    <div className="flex items-center gap-3 text-ink/40 group-hover:text-ink transition-colors">
                      <Clock size={20} className="text-accent/40" />
                      <div className="flex flex-col">
                        <span className="text-sm font-black tracking-tight uppercase leading-none">{booking.date || 'Pending'}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-ink/20">{booking.timeSlot || 'Pending'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pl-4">
                  {booking.status === 'PENDING' ? (
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleApprove(booking.id)}
                        className="h-14 px-10 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-glow shadow-emerald-500/20 active:scale-95"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => setShowRejectModal(booking.id)}
                        className="h-14 px-10 bg-ink/5 hover:bg-red-600 text-ink/60 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-[var(--border)] active:scale-95"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-ink/5 flex items-center justify-center border border-[var(--border)] text-ink/10 group-hover:text-accent transition-colors">
                      <ChevronRight size={28} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-32 bg-card tactical-border rounded-[4rem] text-center border border-dashed border-ink/10 strat-shadow">
            <div className="w-24 h-24 bg-ink/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-[var(--border)]">
              <AlertCircle className="text-accent/20" size={48} />
            </div>
            <h3 className="text-4xl font-black text-ink mb-4 tracking-tighter uppercase">Registry Null State</h3>
            <p className="text-ink/20 serif-italic text-xl lowercase font-medium">No reservation records matched your query parameters.</p>
          </div>
        )}
      </div>


      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
          <div className="bg-card rounded-[4rem] p-16 max-w-2xl w-full tactical-border strat-shadow shadow-glow shadow-accent/5 relative overflow-hidden">
            <div className="absolute -right-24 -top-24 w-80 h-80 bg-red-500/5 rounded-full blur-[100px]" />
            <h2 className="text-5xl font-black tracking-tighter text-red-600 uppercase mb-4 relative z-10 leading-none">Rejection Protocol</h2>
            <p className="text-xl serif-italic text-ink/30 lowercase italic mb-12 relative z-10 font-medium max-w-[80%]">Providing formal justification for resource denial and system orchestration.</p>
            
            <div className="space-y-6 relative z-10">
              <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-ink/20 ml-2 italic serif-italic">Justification Narrative</label>
              <textarea
                autoFocus
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="premium-input w-full px-8 py-6 resize-none h-48 font-bold placeholder:font-normal placeholder:lowercase placeholder:serif-italic"
                placeholder="Declare the technical or administrative reason for this rejection..."
              />
            </div>
            <div className="flex flex-col md:flex-row gap-6 mt-12 relative z-10">
              <button 
                onClick={() => setShowRejectModal(null)} 
                className="flex-1 h-18 premium-button-ghost text-[10px]"
              >
                Abundance Action
              </button>
              <button 
                onClick={() => handleReject(showRejectModal)}
                disabled={!rejectionReason.trim()}
                className="flex-[2] h-18 bg-red-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-red-700 transition-all disabled:opacity-20 disabled:grayscale shadow-glow shadow-red-500/20 active:scale-95"
              >
                Confirm Rejection Phase
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
