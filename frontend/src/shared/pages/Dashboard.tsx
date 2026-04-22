import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Ticket as TicketIcon, 
  Bell,
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../../lib/utils';
import { DashboardCalendar } from '../components/DashboardCalendar';
import { bookingService, Booking } from '../../features/booking/bookingService';
import { ticketService } from '../../features/ticket/ticketService';
import { notificationService, Notification } from '../../features/notification/notificationService';
import { Ticket } from '../../features/ticket/ticket';
import { WeatherWidget } from '../components/WeatherWidget';
import { SyncVelocityChart } from '../components/SyncVelocityChart';

const HERO_IMAGES = [
  "https://static.sliit.lk/wp-content/uploads/2024/07/15041028/SLIIT-Metro-Campus-welcomed-new-batch-for-July-2024-intake-2.jpeg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlHpGxyvgIGgAyY5fkJwaOPJSh_Jxvl4a50g&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwF5WQv-Xid1GPpOIHLYfpBANUAbHxVJXoBQ&s"
];

const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);

  return (
    <div className="relative w-full h-[90vh] overflow-hidden group rounded-b-[4rem] shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img 
            src={HERO_IMAGES[currentIndex]} 
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-paper via-transparent to-transparent hidden lg:block" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-24 pb-40 md:pb-52">
            <div className="max-w-7xl mx-auto w-full">
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="max-w-4xl"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-[2px] bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]" />
                  <span className="text-[10px] technical-label text-accent tracking-[0.5em]">Academic Intelligence</span>
                </div>
                <h2 className="text-7xl md:text-[10rem] font-black text-white mb-10 tracking-tighter leading-[0.8] drop-shadow-2xl">
                  Course<br />
                  <span className="serif-italic lowercase font-medium text-accent">Excellence</span>.
                </h2>
                <p className="text-white/60 text-lg md:text-2xl max-w-xl font-medium leading-relaxed mb-12">
                  Navigate campus services with unprecedented speed and elegance. The primary orchestration node for CourseWeb.
                </p>
                <div className="flex flex-wrap gap-6">
                  <button 
                    onClick={() => navigate('/bookings')}
                    className="premium-button-primary scale-110"
                  >
                    Establish Booking <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => navigate('/tickets')}
                    className="premium-button-ghost scale-110"
                  >
                    Infrastructure Support
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>


      <div className="absolute bottom-12 right-24 hidden md:flex gap-4">
        <button 
          onClick={prevSlide}
          className="p-4 rounded-2xl bg-card/40 backdrop-blur-xl text-ink border border-ink/5 hover:bg-card/60 transition-all shadow-xl group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={nextSlide}
          className="p-4 rounded-2xl bg-card/40 backdrop-blur-xl text-ink border border-ink/5 hover:bg-card/60 transition-all shadow-xl group"
        >
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "h-1 rounded-full transition-all duration-700",
              currentIndex === idx ? "w-12 bg-accent shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]" : "w-3 bg-ink/10"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [bookingsData, ticketsData, notificationsData] = await Promise.all([
          bookingService.getBookings(),
          ticketService.getTickets(user?.role || 'USER', user?.id || ''),
          notificationService.getNotifications(user?.id)
        ]);
        setBookings(bookingsData);
        setTickets(ticketsData);
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const activeBookings = bookings.filter(b => b.status === 'APPROVED').length;
  const openTickets = tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length;
  const unreadNotifications = notifications.length; // Assuming all fetched are unread or just latest
  
  // Dynamic Integrity Algorithm
  const integrityValue = Math.max(85, 100 - (openTickets * 3));

  return (
    <div className="flex flex-col pb-24">
      <HeroCarousel />

      <div className="px-6 md:px-12 max-w-[1400px] mx-auto w-full -mt-24 md:-mt-32 relative z-20 space-y-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard 
            label="Neural Reservations" 
            value={activeBookings.toString().padStart(2, '0')} 
            icon={<Calendar size={20} />} 
            trend={isLoading ? "..." : "+12%"}
            color="accent"
          />
          <StatCard 
            label="Service Tickets" 
            value={openTickets.toString().padStart(2, '0')} 
            icon={<Zap size={20} />} 
            trend={isLoading ? "..." : "-5%"}
            color="orange"
          />
          <StatCard 
            label="System Notices" 
            value={unreadNotifications.toString().padStart(2, '0')} 
            icon={<Bell size={20} />} 
            trend="Active"
            color="purple"
          />
          <StatCard 
            label="Core Integrity" 
            value={`${integrityValue}%`} 
            icon={<Shield size={20} />} 
            trend="Monitored"
            color="green"
          />
        </div>

        <div className="w-full">
           <SyncVelocityChart />
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 xl:gap-24">
          <div className="lg:col-span-2 space-y-12">
            <div className="flex items-end justify-between px-2">
              <div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-ink uppercase">Pulse Feed</h2>
                <p className="text-lg md:text-xl serif-italic text-ink/30 lowercase font-medium">Infrastructure activity synchronized in real-time.</p>
              </div>
              <button className="p-4 text-ink/20 hover:bg-[var(--input-bg)] rounded-2xl transition-all border border-transparent hover:border-[var(--border)]">
                <Activity size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="premium-glass rounded-[3.5rem] p-10 md:p-14 overflow-hidden relative border border-[var(--border)] strat-shadow">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="space-y-12 relative z-10">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 3).map((notif, idx) => (
                      <ActivityItem 
                        key={notif.id}
                        title={notif.message.split('.')[0]} 
                        desc={notif.message} 
                        time={new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        icon={notif.type === 'SUCCESS' ? <CheckCircle2 size={22} /> : notif.type === 'WARNING' ? <AlertCircle size={22} /> : <Zap size={22} />}
                        type={notif.type.toLowerCase() as any}
                      />
                    ))
                  ) : (
                    <div className="py-10 text-center text-ink/20 font-black uppercase tracking-widest italic serif-italic">
                      No active synchronization signals.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-950 rounded-[3.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden font-mono text-[11px] text-emerald-500/60 flex flex-col h-[500px]">
                 <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/20">System Console</span>
                    <div className="flex gap-2">
                       <div className="w-2 h-2 rounded-full bg-red-500/20" />
                       <div className="w-2 h-2 rounded-full bg-amber-500/20" />
                       <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
                    </div>
                 </div>
                 <div className="flex-1 space-y-3 overflow-hidden">
                    <p><span className="text-white/20">[{new Date().toLocaleTimeString()}]</span> <span className="text-emerald-400">SYS_INIT:</span> Orchestration layer synchronized.</p>
                    <p><span className="text-white/20">[{new Date().toLocaleTimeString()}]</span> <span className="text-emerald-400">NET_READY:</span> All campus nodes reachable.</p>
                    <p><span className="text-white/20">[{new Date().toLocaleTimeString()}]</span> <span className="text-emerald-400">SEC_CHECK:</span> Perimeter authentication active.</p>
                    {notifications.map((n, i) => (
                      <p key={i}><span className="text-white/20">[{new Date(n.timestamp).toLocaleTimeString()}]</span> <span className="text-blue-400">PUSH_LOG:</span> {n.message.substring(0, 40)}...</p>
                    ))}
                    <p className="animate-pulse">_</p>
                 </div>
              </div>
            </div>
          </div>


          <div className="space-y-12">
            <div className="bg-card tactical-border rounded-[3.5rem] p-12 relative overflow-hidden group strat-shadow transition-all duration-700 hover:scale-[1.02]">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent opacity-5 group-hover:opacity-10 blur-[100px] transition-opacity duration-700" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-accent rounded-3xl flex items-center justify-center mb-10 shadow-glow shadow-accent/20 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110">
                  <TicketIcon className="text-slate-950" size={28} />
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tighter text-ink uppercase">Nexus Support</h3>
                <p className="text-ink/40 text-[11px] mb-12 leading-relaxed font-black uppercase tracking-[0.2em] max-w-[200px]">Encountering issues? Initialize a support delta.</p>
                <div className="space-y-4">
                  <button 
                    onClick={() => navigate('/tickets/create')}
                    className="premium-button-primary w-full h-16 text-[10px]"
                  >
                    Open Ticket <ArrowUpRight size={18} />
                  </button>
                  <button 
                    onClick={() => navigate('/tickets')}
                    className="premium-button-ghost w-full h-16 text-[10px]"
                  >
                    Active Requests
                  </button>
                </div>
              </div>
            </div>


            <div className="premium-glass rounded-[3.5rem] p-12 border border-[var(--border)] strat-shadow relative overflow-hidden group">
              <div className="flex items-center justify-between mb-10 relative z-10">
                <h3 className="technical-label text-ink/20 text-[9px] italic serif-italic">Temporal Pulse</h3>
                <span className="px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-[9px] technical-label text-accent italic serif-italic">Registry</span>
              </div>
              <div className="space-y-10 relative z-10">
                <EventItem date="28" month="MAR" title="Quantum Summit" location="North Auditorium" pulse />
                <EventItem date="02" month="APR" title="Eco-Sync Hall" location="Research Block" />
              </div>
            </div>


            <div className="space-y-8">
              <DashboardCalendar bookings={bookings} />
              <WeatherWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string, value: string, icon: React.ReactNode, trend: string, color: string }> = ({ label, value, icon, trend, color }) => {
  const colors = {
    accent: "text-accent bg-accent/10 border-accent/20",
    orange: "text-amber-600 bg-amber-600/10 border-amber-600/20",
    green: "text-emerald-600 bg-emerald-600/10 border-emerald-600/20",
    purple: "text-indigo-600 bg-indigo-600/10 border-indigo-600/20",
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-glass p-10 rounded-[3rem] card-hover group border border-[var(--border)] strat-shadow"
    >
      <div className="flex items-center justify-between mb-10">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-700 group-hover:rotate-12", colors[color as keyof typeof colors])}>
          {icon}
        </div>
        <div className="px-4 py-1.5 bg-ink/5 rounded-full tactical-border">
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-ink/40">{trend}</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-6xl font-black tracking-tighter text-ink mb-2">{value}</span>
        <span className="text-[10px] technical-label text-accent/60 italic serif-italic">{label}</span>
      </div>
    </motion.div>
  );
}

const ActivityItem: React.FC<{ title: string, desc: string, time: string, icon: React.ReactNode, type: 'success' | 'info' | 'warning' | 'error' }> = ({ title, desc, time, icon, type }) => {
  const colors = {
    success: "text-emerald-600 bg-emerald-600/5 border-emerald-600/20",
    info: "text-accent bg-accent/5 border-accent/20",
    warning: "text-amber-600 bg-amber-600/5 border-amber-600/20",
    error: "text-rose-600 bg-rose-600/5 border-rose-600/20",
  };

  return (
    <div className="flex gap-10 group cursor-pointer items-start">
      <div className={cn("w-16 h-16 rounded-3xl border flex items-center justify-center shrink-0 transition-all duration-700 group-hover:rotate-12", colors[type])}>
        {icon}
      </div>
      <div className="flex-1 border-b border-[var(--border)] pb-10 group-last:border-0">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-black text-xl text-ink group-hover:text-accent transition-colors tracking-tighter uppercase">{title}</h4>
          <span className="text-[10px] font-black text-ink/20 uppercase tracking-[0.3em]">{time}</span>
        </div>
        <p className="text-sm text-ink/40 leading-relaxed font-bold lowercase tracking-wider">{desc}</p>
      </div>
    </div>
  );
}

function EventItem({ date, month, title, location, pulse }: { date: string, month: string, title: string, location: string, pulse?: boolean }) {
  return (
    <div className="flex gap-8 group cursor-pointer items-center transition-all duration-500 hover:translate-x-2">
      <div className="relative">
        <div className={cn(
          "w-16 h-16 rounded-[1.5rem] flex flex-col items-center justify-center shrink-0 transition-all duration-700 border group-hover:bg-accent group-hover:text-slate-950 group-hover:border-accent group-hover:shadow-glow group-hover:shadow-accent/40",
          pulse ? "bg-accent/10 border-accent/20 text-accent" : "bg-ink/5 border-[var(--border)] text-ink/20"
        )}>
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">{month}</span>
          <span className="text-2xl font-black leading-none">{date}</span>
        </div>
        {pulse && <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping" />}
      </div>
      <div className="flex flex-col min-w-0">
        <p className="font-black text-lg mb-1 truncate text-ink group-hover:text-accent transition-colors uppercase tracking-tighter leading-none">{title}</p>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-ink/10 truncate italic serif-italic">{location}</p>
      </div>
    </div>
  );
}


