import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Ticket, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  Search,
  User,
  Settings,
  Sun,
  Moon,
  Megaphone,
  ChevronRight,
  Command,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../../lib/utils';

export const DashboardLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdminOrTech = user?.role === 'ADMIN' || user?.role === 'TECHNICIAN';

  const navItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Campus Pulse', path: '/' },
    
    // Management Tools (Role Specific)
    ...(user?.role === 'ADMIN' ? [
      { icon: <Layout size={18} />, label: 'Admin Console', path: '/admin/overview' },
      { icon: <Settings size={18} />, label: 'Resources', path: '/admin/resources' },
      { icon: <Calendar size={18} />, label: 'Manage Bookings', path: '/admin/bookings' },
      { icon: <Megaphone size={18} />, label: 'Publish Notice', path: '/admin/notices' }
    ] : []),
    ...(user?.role === 'TECHNICIAN' ? [
      { icon: <Layout size={18} />, label: 'Tech Console', path: '/technician/overview' },
      { icon: <Ticket size={18} />, label: 'Task Inbox', path: '/technician/tickets' }
    ] : []),

    // Universal Campus Services
    { icon: <Calendar size={18} />, label: 'Book Facility', path: '/bookings' },
    { icon: <Calendar size={18} />, label: 'My Bookings', path: '/my-bookings' },
    { icon: <Ticket size={18} />, label: 'Support Tickets', path: '/tickets' },
    { icon: <Bell size={18} />, label: 'Notifications', path: '/notifications' },
  ];

  const NavLinks = ({ className, itemClassName }: { className?: string, itemClassName?: (isActive: boolean) => string }) => (
    <nav className={className}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={() => setIsMobileMenuOpen(false)}
          className={({ isActive }) => itemClassName ? itemClassName(isActive) : cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative text-[13px] font-medium",
            isActive 
              ? "bg-accent text-white shadow-lg shadow-accent/20" 
              : "text-ink/50 hover:text-ink hover:bg-surface"
          )}
        >
          <span className="shrink-0 transition-transform duration-300 group-hover:scale-110">
            {item.icon}
          </span>
          <span className="relative font-semibold">
            {item.label}
          </span>
          {location.pathname === item.path && (
            <motion.div 
              layoutId="nav-pill"
              className="absolute inset-0 bg-accent rounded-xl -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col transition-colors duration-500 mesh-gradient select-none">
      {/* Tactical Top Navigation */}
      <header className="h-[var(--nav-height)] border-b border-[var(--border)] sticky top-0 z-50 bg-paper/60 backdrop-blur-3xl px-6 md:px-12 flex items-center justify-between">
        {/* Left: Brand & Pulse */}
        <div className="flex items-center gap-8">
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-slate-950 shadow-glow transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
              <Command size={22} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-lg text-ink tracking-tighter">CourseWeb</span>
              <span className="text-[7px] font-bold tracking-[0.3em] text-accent uppercase opacity-80">Strategic Core</span>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-2 bg-[var(--input-bg)] px-5 py-2.5 rounded-xl tactical-border ring-1 ring-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-ink/40 leading-none">Nominal Status</span>
          </div>
        </div>

        {/* Center: Primary Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-[var(--input-bg)] p-1.5 rounded-2xl tactical-border relative">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "px-5 py-2.5 rounded-[1.125rem] transition-all duration-500 text-[11px] font-black uppercase tracking-widest relative z-10",
                isActive ? "text-slate-950" : "text-ink/40 hover:text-ink"
              )}
            >
              {item.label}
              {location.pathname === item.path && (
                <motion.div 
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-accent rounded-[1.125rem] -z-10 shadow-glow shadow-accent/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </NavLink>
          ))}
          
          {/* Dropdown for overflow nav items if needed, or just more links */}
          {navItems.length > 5 && (
            <div className="relative group px-4">
              <button className="text-ink/40 hover:text-ink transition-colors pb-1">
                <Menu size={16} />
              </button>
              <div className="absolute right-0 top-full mt-4 w-64 bg-card rounded-3xl p-4 tactical-border strat-shadow opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-[60]">
                {navItems.slice(5).map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-[var(--input-bg)] text-ink/60 hover:text-ink font-bold transition-all text-[11px] uppercase tracking-widest"
                  >
                    {item.icon} {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative hidden xl:block group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search Nexus..." 
              className="pl-12 pr-6 py-2.5 premium-input w-48 focus:w-64 transition-all duration-700 bg-[var(--input-bg)] border-transparent hover:border-[var(--border)] font-bold text-[11px] lowercase"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-3 dynamic-hover rounded-xl text-ink/30 hover:text-accent"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            <button className="p-3 dynamic-hover rounded-xl text-ink/30">
              <Bell size={20} />
            </button>
          </div>

          <div className="h-8 w-[1px] bg-[var(--border)] mx-1 hidden md:block" />

          {/* User Profile Hook */}
          <div className="relative" ref={profileMenuRef}>
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-[var(--input-bg)] tactical-border group transition-all duration-500 hover:scale-[1.02] active:scale-95"
            >
              <div className="w-9 h-9 rounded-[0.85rem] border-2 border-accent/20 overflow-hidden shadow-glow shadow-accent/5">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="" />
              </div>
              <div className="hidden md:flex flex-col items-start leading-none">
                <span className="text-[10px] font-black uppercase tracking-tight text-ink">{user?.name}</span>
                <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-accent mt-1">{user?.role}</span>
              </div>
            </button>

            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-4 w-72 bg-card rounded-[2.5rem] p-8 tactical-border strat-shadow z-[70]"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-5 p-2 mb-2">
                      <div className="w-16 h-16 rounded-[1.25rem] border-2 border-accent/20 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black uppercase text-ink">{user?.name}</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent mt-1 italic serif-italic">Active Session</span>
                      </div>
                    </div>
                    <div className="h-[1px] bg-[var(--border)] w-full" />
                    <button className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[var(--input-bg)] text-ink/60 hover:text-ink font-bold transition-all text-[11px] uppercase tracking-widest">
                      <User size={18} /> Profile Registry
                    </button>
                    <button className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[var(--input-bg)] text-ink/60 hover:text-ink font-bold transition-all text-[11px] uppercase tracking-widest">
                      <Settings size={18} /> Architecture
                    </button>
                    <div className="h-[1px] bg-[var(--border)] w-full" />
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-red-500/5 hover:bg-red-500/10 text-red-500 font-black transition-all text-[11px] uppercase tracking-[0.2em]"
                    >
                      <LogOut size={18} /> Terminate
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 bg-[var(--input-bg)] rounded-xl tactical-border text-ink/60"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[80] lg:hidden"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="lg:hidden fixed inset-y-0 right-0 w-80 bg-card z-[90] shadow-2xl p-8 flex flex-col"
              >
                <div className="flex items-center justify-between mb-12">
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-accent">Menu</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-[var(--input-bg)] rounded-xl tactical-border">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 space-y-3">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => cn(
                        "flex items-center gap-5 px-6 py-5 rounded-2xl transition-all duration-300 text-[11px] font-black uppercase tracking-widest",
                        isActive 
                          ? "bg-accent text-slate-950 shadow-glow" 
                          : "text-ink/40 hover:text-ink hover:bg-[var(--input-bg)]"
                      )}
                    >
                      {item.icon} {item.label}
                    </NavLink>
                  ))}
                </div>
                <div className="mt-auto pt-8 border-t border-[var(--border)]">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-4 px-6 py-5 rounded-2xl bg-red-500/10 text-red-500 font-black text-[11px] uppercase tracking-widest"
                  >
                    <LogOut size={20} /> Terminate
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="p-0"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

