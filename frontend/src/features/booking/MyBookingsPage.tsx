import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { bookingService, Booking } from './bookingService';
import { useAuth } from '../../shared/context/AuthContext';
import { ConfirmModal } from '../../shared/components/ConfirmModal';

export const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'>('ALL');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const [bookingsData, resourcesData] = await Promise.all([
          bookingService.getBookings(user.id),
          bookingService.getResources()
        ]);
        
        // Enrich bookings with names for display
        const enriched = bookingsData.map(b => {
          const res = resourcesData.find(r => r.id === b.resourceId);
          // Simple fallback for old records using their creation date
          const fallbackDate = b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Date Pending';
          
          return {
            ...b,
            resourceName: b.resourceName || res?.name || b.resourceId,
            date: b.date || fallbackDate,
            timeSlot: b.timeSlot || 'Not Specified'
          } as Booking;
        });

        setBookings(enriched);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [user]);

  const filteredBookings = bookings.filter(b => 
    filter === 'ALL' || b.status === filter
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle2 className="text-green-500" size={18} />;
      case 'REJECTED': return <XCircle className="text-red-500" size={18} />;
      case 'CANCELLED': return <XCircle className="text-gray-400" size={18} />;
      default: return <AlertCircle className="text-orange-500" size={18} />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'APPROVED': return "bg-green-50 text-green-700 border-green-100";
      case 'REJECTED': return "bg-red-50 text-red-700 border-red-100";
      case 'CANCELLED': return "bg-gray-50 text-gray-500 border-gray-100";
      default: return "bg-orange-50 text-orange-700 border-orange-100";
    }
  };

  const handleCancelClick = (id: string) => {
    setBookingToCancel(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmCancel = async (reason?: string) => {
    if (bookingToCancel && user && reason) {
      try {
        await bookingService.cancelBooking(bookingToCancel, user.id, reason);
        setBookings(prev => prev.map(b => 
          b.id === bookingToCancel ? { ...b, status: 'CANCELLED' as any } : b
        ));
      } catch (error) {
        console.error('Failed to cancel booking:', error);
      } finally {
        setBookingToCancel(null);
      }
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-[1400px] mx-auto w-full space-y-20 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2 text-ink uppercase">Reservation Vault</h1>
          <p className="text-xl serif-italic text-ink/60 lowercase font-medium">Personal facility allocation and spatial occupancy registry.</p>
        </div>
      </div>


      {/* Command Console (Filters) */}
      <div className="flex p-2 bg-card tactical-border rounded-[2.5rem] w-fit strat-shadow overflow-x-auto no-scrollbar">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={cn(
              "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 whitespace-nowrap",
              filter === f 
                ? "bg-accent text-slate-950 shadow-glow shadow-accent/20 scale-[1.05]" 
                : "text-ink/20 hover:text-ink/40"
            )}
          >
            {f}
          </button>
        ))}
      </div>


      {/* Operations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {isLoading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-80 bg-[var(--input-bg)] rounded-[4rem] tactical-border animate-pulse shadow-2xl" />
          ))
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div 
              key={booking.id}
              className="premium-glass rounded-[4rem] border border-[var(--border)] overflow-hidden strat-shadow card-hover group flex flex-col relative"
            >
              <div className="absolute -right-24 -top-24 w-64 h-64 bg-accent/5 rounded-full blur-[100px] group-hover:bg-accent/10 transition-all duration-1000" />
              
              <div className="p-12 flex-1 relative z-10">
                <div className="flex items-start justify-between mb-10">
                  <div className="space-y-6">
                    <span className={cn(
                      "px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border italic serif-italic backdrop-blur-md",
                      booking.status === 'APPROVED' ? "text-emerald-600 border-emerald-500/20 bg-emerald-500/5 shadow-glow shadow-emerald-500/5" :
                      booking.status === 'REJECTED' ? "text-red-600 border-red-500/20 bg-red-500/5 shadow-glow shadow-red-500/5" :
                      booking.status === 'CANCELLED' ? "text-ink/20 border-[var(--border)] bg-ink/5" :
                      "text-amber-600 border-amber-500/20 bg-amber-500/5 shadow-glow shadow-amber-500/5"
                    )}>
                      {booking.status} Active
                    </span>
                    <h3 className="text-3xl font-black tracking-tighter text-ink uppercase group-hover:text-accent transition-colors duration-500 leading-none mt-4">
                      {booking.resourceName || 'Global Sector'}
                    </h3>
                  </div>
                  <div className="w-16 h-16 bg-[var(--input-bg)] rounded-[2rem] flex items-center justify-center text-ink/10 group-hover:text-accent group-hover:bg-accent group-hover:text-slate-950 transition-all duration-700 tactical-border strat-shadow">
                    <Calendar size={24} />
                  </div>
                </div>
 
                <div className="space-y-4 mb-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-ink/50 italic serif-italic">Occupancy Justification</p>
                  <p className="text-base font-medium text-ink/70 leading-relaxed max-w-xl lowercase serif-italic">
                    {booking.purpose || 'No strategic narrative recorded.'}
                  </p>
                </div>
 
                {booking.rejectionReason && (
                  <div className="p-8 bg-red-500/5 rounded-[2.5rem] border border-red-500/20 mb-8 strat-shadow">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 mb-3 italic serif-italic">Rescission Logic</p>
                    <p className="text-base text-red-900/60 dark:text-red-100/60 serif-italic font-light leading-relaxed">"{booking.rejectionReason}"</p>
                  </div>
                )}
 
                {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                  <button 
                    onClick={() => handleCancelClick(booking.id)}
                    className="w-full h-16 premium-glass border border-red-500/20 hover:border-red-500/60 text-red-600 hover:bg-red-500/20 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-2xl shadow-red-500/5"
                  >
                    Rescind Reservation
                  </button>
                )}
              </div>
 
              <div className="px-12 py-8 bg-ink/5 border-t border-[var(--border)] flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-accent animate-pulse shadow-glow shadow-accent/50" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ink/40 italic serif-italic truncate">Nexus: {booking.id.slice(-12)}</span>
                </div>
                <div className="flex items-center gap-3 text-ink/50">
                   <Clock size={16} /> <span className="text-[10px] font-black tracking-[0.2em]">{booking.timeSlot}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-40 bg-card tactical-border rounded-[5rem] text-center relative overflow-hidden group strat-shadow transition-all duration-700 hover:scale-[1.01]">
            <div className="w-24 h-24 bg-[var(--input-bg)] rounded-[3rem] flex items-center justify-center mx-auto mb-12 tactical-border relative z-10 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
              <Calendar className="text-ink/10 group-hover:text-accent/20 transition-colors" size={48} />
            </div>
            <h3 className="text-4xl font-black text-ink mb-4 tracking-tighter uppercase relative z-10">Vault Registry Empty</h3>
            <p className="text-xl serif-italic text-ink/20 lowercase max-w-sm mx-auto relative z-10">No spatial reservation records were detected in the personal registry.</p>
            <button 
              onClick={() => window.location.href = '/bookings'}
              className="mt-12 premium-button-primary px-12 h-18 text-[10px]"
            >
              Initialize New Request
            </button>
          </div>
        )}
      </div>



      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Booking?"
        message="Please provide a reason for cancelling this booking. This will help administrators manage campus resources more effectively."
        hasInput={true}
        inputPlaceholder="e.g. Event postponed, found better venue..."
        confirmText="Cancel Booking"
      />
    </div>
  );
};

