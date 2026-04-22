import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Booking } from '../../features/booking/bookingService';

interface DashboardCalendarProps {
  bookings: Booking[];
}

export const DashboardCalendar: React.FC<DashboardCalendarProps> = ({ bookings }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-xl font-black tracking-tighter text-ink uppercase italic serif-italic">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="w-10 h-10 bg-[var(--input-bg)] rounded-xl flex items-center justify-center text-ink/20 hover:text-accent transition-all duration-500 tactical-border"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="w-10 h-10 bg-[var(--input-bg)] rounded-xl flex items-center justify-center text-ink/20 hover:text-accent transition-all duration-500 tactical-border"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };


  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-6">
        {days.map((day) => (
          <div key={day} className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-ink/10 italic serif-italic">
            {day}
          </div>
        ))}
      </div>
    );
  };


  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return (
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day) => {
          const dayBookings = bookings.filter(b => 
            b.status === 'APPROVED' && b.date && isSameDay(parseISO(b.date), day)
          );
          
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());
 
          return (
            <div
              key={day.toString()}
              className={cn(
                "aspect-square p-3 rounded-2xl transition-all relative group cursor-pointer overflow-hidden",
                !isCurrentMonth ? "bg-transparent opacity-10" : "bg-ink/5 hover:bg-ink/10",
                isToday && "bg-accent/10 border border-accent/40 shadow-glow shadow-accent/10"
              )}
            >
              <span className={cn(
                "text-[12px] font-black italic serif-italic",
                isToday ? "text-accent" : "text-ink/40"
              )}>
                {format(day, 'd')}
              </span>
              
              <div className="mt-2 flex flex-wrap gap-1">
                {dayBookings.slice(0, 3).map((b, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shadow-glow",
                      (b.resourceName || '').toLowerCase().includes('lab') ? "bg-accent shadow-accent/40" : "bg-fuchsia-500 shadow-fuchsia-500/40"
                    )} 
                    title={b.resourceName}
                  />
                ))}
              </div>
 
              {dayBookings.length > 0 && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-56 bg-card tactical-border p-6 rounded-[2rem] text-[10px] opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-50 shadow-2xl scale-95 group-hover:scale-100">
                  <p className="font-black uppercase tracking-[0.3em] mb-4 text-accent border-b border-[var(--border)] pb-3 italic serif-italic">Active Nodes</p>
                  <div className="space-y-3">
                    {dayBookings.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full shadow-glow",
                          (b.resourceName || '').toLowerCase().includes('lab') ? "bg-accent shadow-accent/40" : "bg-fuchsia-500 shadow-fuchsia-500/40"
                        )} />
                        <span className="font-black text-ink/70 truncate uppercase tracking-tighter">{b.resourceName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );

  };

  return (
    <div className="bg-card rounded-[3.5rem] tactical-border p-12 strat-shadow group">
       <div className="absolute -left-24 -top-24 w-64 h-64 bg-accent/5 rounded-full blur-[100px] group-hover:bg-accent/10 transition-all duration-1000" />
      
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      <div className="mt-10 pt-10 border-t border-[var(--border)] flex items-center gap-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-glow shadow-accent/50" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-ink/20 italic serif-italic">Logic Nodes</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 shadow-glow shadow-fuchsia-500/50" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-ink/20 italic serif-italic">Global Hubs</span>
        </div>
      </div>
    </div>
  );
};

