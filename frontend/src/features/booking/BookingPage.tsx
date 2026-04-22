import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronRight,
  Plus,
  CheckCircle2,
  Settings,
  Building,
  GraduationCap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { bookingService, Resource, ResourceType } from './bookingService';
import { useAuth } from '../../shared/context/AuthContext';
import { OngoingBookingsChart } from './OngoingBookingsChart';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export const BookingPage: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [typeFilter, setTypeFilter] = useState<ResourceType | 'ALL'>('ALL');
  const [facultyFilter, setFacultyFilter] = useState<string>('ALL');
  const [buildingFilter, setBuildingFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      const data = await bookingService.getResources();
      setResources(data);
      setIsLoading(false);
    };
    fetchResources();
  }, []);

  const faculties = ['ALL', ...new Set(resources.map(r => r.faculty))];
  const buildings = ['ALL', ...new Set(resources.map(r => r.building))];

  const filteredResources = resources.filter(r => {
    const matchesType = typeFilter === 'ALL' || r.type === typeFilter;
    const matchesFaculty = facultyFilter === 'ALL' || r.faculty === facultyFilter;
    const matchesBuilding = buildingFilter === 'ALL' || r.building === buildingFilter;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesFaculty && matchesBuilding && matchesSearch;
  });

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResource || !user) return;

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const bookingData = {
      resourceId: selectedResource.id,
      resourceName: selectedResource.name,
      userId: user.id,
      userName: user.name,
      userRole: user.role as any,
      date: formData.get('date') as string,
      timeSlot: formData.get('timeSlot') as string,
      purpose: formData.get('purpose') as string,
      attendees: parseInt(formData.get('attendees') as string) || 1,
    };

    await bookingService.createBooking(bookingData);
    setBookingSuccess(true);
    toast.success('Booking request submitted successfully!');
    setTimeout(() => {
      setBookingSuccess(false);
      setShowForm(false);
      setSelectedResource(null);
    }, 3000);
  };

  return (
    <div className="p-6 md:p-12 max-w-[1400px] mx-auto w-full space-y-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2 text-ink uppercase">Neural Registry</h1>
          <p className="text-xl serif-italic text-ink/60 lowercase font-medium">Coordinate and reserve spatial nodes for academic operations.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group flex-1 min-w-[360px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={20} />
            <input
              type="text"
              placeholder="Scan for available nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 h-16 premium-input font-bold"
            />
          </div>
        </div>
      </div>


      {/* Command Console (Filters) */}
      <div className="bg-card tactical-border rounded-[3rem] p-10 md:p-14 strat-shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Type Filter */}
          <div className="space-y-8">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-ink/20 ml-2 italic serif-italic">Operation Class</label>
            <div className="flex flex-wrap gap-3">
              {['ALL', 'LECTURE_HALL', 'LAB', 'EQUIPMENT'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t as any)}
                  className={cn(
                    "px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 border",
                    typeFilter === t 
                      ? "bg-accent text-slate-950 border-accent shadow-glow shadow-accent/20" 
                      : "bg-[var(--input-bg)] text-ink/40 border-transparent hover:border-accent/30 hover:text-ink"
                  )}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Faculty Filter */}
          <div className="space-y-8">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-ink/20 ml-2 italic serif-italic">Command Sector</label>
            <select 
              value={facultyFilter}
              onChange={(e) => setFacultyFilter(e.target.value)}
              className="w-full premium-input h-16 appearance-none font-bold"
            >
              {faculties.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Building Filter */}
          <div className="space-y-8">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-ink/20 ml-2 italic serif-italic">Deployment Zone</label>
            <select 
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="w-full premium-input h-16 appearance-none font-bold"
            >
              {buildings.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>


      {/* Node Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-96 bg-[var(--input-bg)] animate-pulse rounded-[3.5rem] tactical-border" />
          ))}
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredResources.map((res) => (
            <div 
              key={res.id} 
              className="premium-glass p-10 rounded-[3.5rem] card-hover group relative overflow-hidden flex flex-col border border-[var(--border)] strat-shadow"
            >
              <div className="absolute top-0 right-0 p-10">
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-500",
                  res.status === 'ACTIVE' || res.status === 'AVAILABLE' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : 
                  res.status === 'MAINTENANCE' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : 
                  "bg-red-500/10 text-red-600 border-red-500/20"
                )}>
                  {res.status === 'ACTIVE' ? 'ONLINE' : res.status === 'OUT_OF_SERVICE' ? 'OFFLINE' : res.status}
                </span>
              </div>

              <div className="w-14 h-14 bg-[var(--input-bg)] rounded-2xl flex items-center justify-center mb-10 group-hover:bg-accent group-hover:text-slate-950 tactical-border transition-all duration-700 group-hover:rotate-12 group-hover:scale-110">
                {res.type === 'LECTURE_HALL' ? <Users size={24} /> : 
                 res.type === 'LAB' ? <Settings size={24} /> : 
                 <Search size={24} />}
              </div>

              <h3 className="text-3xl font-black text-ink mb-2 tracking-tighter group-hover:text-accent transition-colors uppercase leading-tight">{res.name}</h3>
              <p className="text-sm text-ink/50 mb-10 line-clamp-2 leading-relaxed font-bold lowercase tracking-wider">{res.description}</p>
              
              <div className="space-y-5 mb-12 flex-1 relative z-10">
                <div className="flex items-center gap-4 text-ink/60 group-hover:text-ink transition-all duration-500">
                  <div className="w-10 h-10 rounded-xl bg-[var(--input-bg)] flex items-center justify-center tactical-border">
                    <Building size={16} className="text-accent/60" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{res.building}</span>
                </div>
                <div className="flex items-center gap-4 text-ink/60 group-hover:text-ink transition-all duration-500">
                  <div className="w-10 h-10 rounded-xl bg-[var(--input-bg)] flex items-center justify-center tactical-border">
                    <GraduationCap size={16} className="text-accent/60" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{res.faculty}</span>
                </div>
                <div className="flex items-center gap-4 text-ink/60 group-hover:text-ink transition-all duration-500">
                  <div className="w-10 h-10 rounded-xl bg-[var(--input-bg)] flex items-center justify-center tactical-border">
                    <Users size={16} className="text-accent/60" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{res.capacity} pax</span>
                </div>
              </div>

              <button
                disabled={res.status !== 'ACTIVE' && res.status !== 'AVAILABLE'}
                onClick={() => {
                  setSelectedResource(res);
                  setShowForm(true);
                }}
                className="premium-button-primary w-full h-16 disabled:opacity-20 disabled:grayscale text-[10px]"
              >
                Initialize Request <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-32 bg-card tactical-border rounded-[4rem] text-center strat-shadow">
          <div className="w-20 h-20 bg-[var(--input-bg)] rounded-[2rem] flex items-center justify-center mx-auto mb-10 tactical-border">
            <Search className="text-accent/40" size={32} />
          </div>
          <h3 className="text-3xl font-black text-ink mb-4 tracking-tighter uppercase">Null Response</h3>
          <p className="text-ink/20 serif-italic text-lg">No resource identifiers matched the current parameters.</p>
        </div>
      )}


      {/* Session Intelligence Area */}
      <OngoingBookingsChart />

      {/* Booking Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-paper w-full max-w-3xl rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-12 md:p-16 border border-[var(--border)] relative overflow-hidden"
            >
              {bookingSuccess ? (
                <div className="py-20 text-center space-y-10 relative z-10">
                  <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-glow shadow-emerald-500/20">
                    <CheckCircle2 size={48} className="text-slate-950" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black tracking-tighter text-ink uppercase">Uplink Confirmed</h2>
                    <p className="text-ink/40 serif-italic text-xl lowercase font-medium">Your node reservation has been queued for synchronization.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-16 relative z-10">
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter text-ink uppercase">Initialize Node</h2>
                      <p className="text-accent text-[11px] mt-2 font-black uppercase tracking-[0.3em] italic serif-italic">Protocol: {selectedResource?.name}</p>
                    </div>
                    <button onClick={() => setShowForm(false)} className="p-4 bg-[var(--input-bg)] hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all border border-transparent hover:border-red-500/20">
                      <X size={24} />
                    </button>
                  </div>

                  <form className="space-y-12 relative z-10" onSubmit={handleBookingSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-5">
                        <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-ink/20 ml-2">Temporal Phase</label>
                        <div className="relative group">
                          <CalendarIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={20} />
                          <input 
                            name="date" 
                            type="date" 
                            required 
                            className="premium-input w-full pl-16 py-5 font-bold" 
                          />
                        </div>
                      </div>

                      <div className="space-y-5">
                        <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-ink/20 ml-2">Access Slot</label>
                        <div className="relative group">
                          <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={20} />
                          <select 
                            name="timeSlot" 
                            required 
                            className="premium-input w-full pl-16 py-5 appearance-none cursor-pointer font-bold"
                          >
                            <option value="">Select Protocol</option>
                            <option value="08:00 - 10:00">08:00 - 10:00</option>
                            <option value="10:00 - 12:00">10:00 - 12:00</option>
                            <option value="12:00 - 14:00">12:00 - 14:00</option>
                            <option value="14:00 - 16:00">14:00 - 16:00</option>
                            <option value="16:00 - 18:00">16:00 - 18:00</option>
                            <option value="18:00 - 20:00">18:00 - 20:00</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-ink/20 ml-2">Occupancy Load</label>
                      <div className="relative group">
                        <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={20} />
                        <input 
                          name="attendees" 
                          type="number" 
                          required 
                          min="1" 
                          max={selectedResource?.capacity} 
                          placeholder={`Limit: ${selectedResource?.capacity} pax`}
                          className="premium-input w-full pl-16 py-5 font-bold" 
                        />
                      </div>
                    </div>

                    <div className="space-y-5">
                      <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-ink/20 ml-2">Operation Objective</label>
                      <textarea 
                        name="purpose"
                        rows={4} 
                        required
                        className="premium-input w-full px-8 py-6 resize-none h-40 font-bold"
                        placeholder="Define the strategic objective for this reservation delta..."
                      ></textarea>
                    </div>

                    <button type="submit" className="premium-button-primary w-full h-20 text-[11px]">
                      Establish Reservation Sync
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const X = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
