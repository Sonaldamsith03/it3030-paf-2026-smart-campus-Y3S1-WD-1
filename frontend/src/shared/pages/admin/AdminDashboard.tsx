import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  Calendar, 
  Ticket, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../../lib/utils';
import { bookingService, Booking } from '../../../features/booking/bookingService';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const bookingData = await bookingService.getBookings();
      setBookings(bookingData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Resources', value: '42', icon: <Package size={20} />, trend: '+4 this month', color: 'blue' },
    { label: 'Total Bookings', value: bookings.length.toString(), icon: <Calendar size={20} />, trend: `+${bookings.filter(b => b.status === 'APPROVED').length} approved`, color: 'orange' },
    { label: 'Pending Bookings', value: bookings.filter(b => b.status === 'PENDING').length.toString(), icon: <Clock size={20} />, trend: 'Requires attention', color: 'purple' },
    { label: 'Active Tickets', value: '14', icon: <Ticket size={20} />, trend: '+3 new today', color: 'green' },
  ];

  const recentActivities = bookings.slice(0, 4).map(b => ({
    id: b.id,
    type: 'BOOKING',
    title: b.status === 'PENDING' ? 'New Booking Request' : `Booking ${b.status}`,
    detail: `${b.userName} requested ${b.resourceName}`,
    time: 'Recently',
    status: b.status
  }));

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2 text-ink uppercase">Admin Console</h1>
          <p className="text-xl serif-italic text-ink/30 lowercase">System-wide orchestration and resource management.</p>
        </div>
        <div className="flex items-center gap-4 bg-ink/5 px-8 py-4 rounded-[2rem] border border-[var(--border)] shadow-2xl">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-glow shadow-emerald-500/50" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/40">Core Systems Online</span>
        </div>
      </div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <StatCard 
            key={i} 
            label={stat.label} 
            value={stat.value} 
            icon={stat.icon} 
            trend={stat.trend} 
            color={stat.color} 
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card tactical-border rounded-[3.5rem] p-12 strat-shadow">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl font-black tracking-tighter text-ink uppercase">Neural Audit Logs</h3>
            <button className="text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:text-ink transition-colors">Dispatch Full View</button>
          </div>
          
          <div className="space-y-12">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-10 group cursor-pointer items-start">
                <div className={cn(
                  "w-16 h-16 rounded-[2rem] flex items-center justify-center shrink-0 transition-all duration-700 group-hover:rotate-12 group-hover:bg-accent group-hover:text-slate-950 border",
                  activity.type === 'BOOKING' ? "bg-fuchsia-500/5 text-fuchsia-600 border-fuchsia-500/20" : 
                  activity.type === 'TICKET' ? "bg-orange-500/5 text-orange-600 border-orange-500/20" : "bg-accent/5 text-accent border-accent/20"
                )}>
                  {activity.type === 'BOOKING' ? <Calendar size={24} /> : 
                   activity.type === 'TICKET' ? <Ticket size={24} /> : <Package size={24} />}
                </div>
                <div className="flex-1 border-b border-[var(--border)] pb-12 group-last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-black text-lg text-ink group-hover:text-accent transition-colors tracking-tight uppercase">{activity.title}</p>
                    <span className="text-[10px] font-black text-ink/20 uppercase tracking-[0.3em]">{activity.time}</span>
                  </div>
                  <p className="text-ink/30 text-sm mb-6 leading-relaxed font-bold lowercase tracking-wider italic serif-italic">{activity.detail}</p>
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border italic serif-italic",
                    activity.status === 'PENDING' ? "bg-orange-500/10 text-orange-600 border-orange-500/20" :
                    activity.status === 'APPROVED' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-ink/5 text-ink/30 border-white/10"
                  )}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Quick Actions */}
        <div className="space-y-10">
          <div className="bg-card tactical-border rounded-[3.5rem] p-12 relative overflow-hidden group strat-shadow ring-1 ring-white/5">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-accent opacity-10 group-hover:opacity-20 blur-[100px] transition-opacity duration-1000" />
            <h3 className="text-3xl font-black text-ink mb-4 tracking-tighter relative z-10 uppercase leading-none">System Node</h3>
            <p className="text-ink/20 text-[11px] mb-12 leading-relaxed font-black uppercase tracking-[0.2em] relative z-10 max-w-[200px]">Direct access to core administrative protocols.</p>
            <div className="space-y-4 relative z-10">
              <button className="premium-button-primary w-full h-16 text-[10px]">
                Add Resource <ArrowUpRight size={18} />
              </button>
              <button className="premium-button-ghost w-full h-16 text-[10px]">
                Platform Settings <Settings size={18} />
              </button>
            </div>
          </div>

          <div className="bg-card tactical-border rounded-[3.5rem] p-12 strat-shadow ring-1 ring-white/5">
            <h3 className="text-2xl font-black text-ink mb-10 tracking-tighter uppercase">Integrity</h3>
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ink/20 italic serif-italic">Registry Latency</span>
                  <span className="text-sm font-black text-emerald-600 tracking-tighter font-mono">24ms</span>
                </div>
                <div className="w-full bg-ink/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[95%] shadow-glow shadow-emerald-500/50" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ink/20 italic serif-italic">Node Saturation</span>
                  <span className="text-sm font-black text-orange-600 tracking-tighter font-mono">42%</span>
                </div>
                <div className="w-full bg-ink/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full w-[42%] shadow-glow shadow-orange-500/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

const StatCard: React.FC<{ label: string, value: string, icon: React.ReactNode, trend: string, color: string }> = ({ label, value, icon, trend, color }) => {
  const colors = {
    blue: "text-accent bg-accent/5 border-accent/20",
    orange: "text-orange-400 bg-orange-400/5 border-orange-400/20",
    green: "text-emerald-400 bg-emerald-400/5 border-emerald-400/20",
    purple: "text-fuchsia-400 bg-fuchsia-400/5 border-fuchsia-400/20",
  };
  
  return (
    <div className="bg-card tactical-border p-12 rounded-[3.5rem] card-hover group strat-shadow ring-1 ring-white/5">
      <div className={cn("w-16 h-16 rounded-[2rem] flex items-center justify-center mb-10 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 border", colors[color as keyof typeof colors])}>
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-ink/20 mb-4 italic serif-italic">{label}</p>
      <div className="flex items-end justify-between">
        <h4 className="text-5xl font-black tracking-tighter text-ink leading-none">{value}</h4>
        <span className="text-[10px] font-black text-emerald-600 mb-2 uppercase tracking-[0.2em] italic serif-italic">{trend}</span>
      </div>
    </div>
  );
}

