import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  ReferenceLine,
  Label
} from 'recharts';
import { Clock, Monitor, GraduationCap, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

interface OngoingBooking {
  id: string;
  resourceName: string;
  lectureName: string;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  type: 'LECTURE_HALL' | 'LAB' | 'EQUIPMENT';
  faculty: string;
}

const MOCK_ONGOING: OngoingBooking[] = [
  { id: '1', resourceName: 'Lecture Hall 01', lectureName: 'Advanced Programming', startTime: '08:30', endTime: '10:30', type: 'LECTURE_HALL', faculty: 'Computing' },
  { id: '2', resourceName: 'Lab 04', lectureName: 'Database Systems Practical', startTime: '09:00', endTime: '12:00', type: 'LAB', faculty: 'Computing' },
  { id: '3', resourceName: 'Lecture Hall 05', lectureName: 'Software Engineering', startTime: '10:00', endTime: '12:00', type: 'LECTURE_HALL', faculty: 'Engineering' },
  { id: '4', resourceName: 'Lab 02', lectureName: 'Network Security Lab', startTime: '13:00', endTime: '15:30', type: 'LAB', faculty: 'Computing' },
  { id: '5', resourceName: 'Mini Auditorium', lectureName: 'Guest Lecture: AI Trends', startTime: '14:00', endTime: '16:00', type: 'LECTURE_HALL', faculty: 'Business' },
  { id: '6', resourceName: 'Lab 01', lectureName: 'Web Development', startTime: '15:00', endTime: '17:00', type: 'LAB', faculty: 'Computing' },
];

const timeToDecimal = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours + minutes / 60;
};

export const OngoingBookingsChart: React.FC = () => {
  const currentTimeDecimal = useMemo(() => {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60;
  }, []);

  const chartData = useMemo(() => 
    MOCK_ONGOING.map(booking => ({
      name: booking.resourceName,
      lecture: booking.lectureName,
      timeRange: [timeToDecimal(booking.startTime), timeToDecimal(booking.endTime)],
      startTime: booking.startTime,
      endTime: booking.endTime,
      type: booking.type,
      faculty: booking.faculty,
      duration: timeToDecimal(booking.endTime) - timeToDecimal(booking.startTime)
    })).sort((a, b) => a.timeRange[0] - b.timeRange[0])
  , []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card p-6 rounded-[2rem] shadow-2xl border border-[var(--border)] min-w-[240px] animate-in fade-in zoom-in duration-300 backdrop-blur-3xl">
          <div className="flex items-center justify-between mb-4">
            <span className={cn(
              "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest italic serif-italic",
              data.type === 'LECTURE_HALL' ? "bg-ink text-paper" : "bg-accent text-slate-950 shadow-glow shadow-accent/20"
            )}>
              {data.type.replace('_', ' ')}
            </span>
            <span className="text-[9px] font-black text-ink/20 uppercase tracking-[0.2em] italic serif-italic">{data.faculty}</span>
          </div>
          <h4 className="text-xl font-black text-ink leading-tight mb-2 tracking-tighter uppercase">{data.lecture}</h4>
          <p className="text-[11px] font-bold text-ink/30 mb-4 flex items-center gap-2 lowercase italic serif-italic">
            <Monitor size={12} className="text-accent" /> {data.name}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 text-ink/60">
              <Clock size={14} className="text-accent" />
              <span className="text-xs font-black">{data.startTime} - {data.endTime}</span>
            </div>
            <span className="text-[10px] font-black text-ink/20 uppercase tracking-widest">{data.duration.toFixed(1)}h</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-[3.5rem] tactical-border p-10 space-y-12 strat-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center text-slate-950 shadow-glow shadow-accent/20">
              <Clock size={20} />
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-ink uppercase">Live Timeline</h2>
          </div>
          <p className="text-xl serif-italic text-ink/30 lowercase font-medium">Real-time campus facility utilization and session tracking.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 px-6 py-3 bg-[var(--input-bg)] rounded-2xl tactical-border">
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-ping shadow-glow shadow-accent/50" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent italic serif-italic">Live Now</span>
          </div>
        </div>
      </div>

      <div className="h-[450px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
            barSize={40}
            barGap={12}
          >
            <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="rgba(var(--ink-rgb), 0.05)" />
            
            <XAxis 
              type="number" 
              domain={[7, 21]} 
              ticks={[8, 10, 12, 14, 16, 18, 20]}
              tickFormatter={(tick) => `${tick}:00`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontPadding: 0, fontWeight: 900, fill: 'var(--ink)', opacity: 0.1, letterSpacing: '0.1em' }}
              dy={15}
            />
            
            <YAxis 
              type="category" 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 900, fill: 'var(--ink)', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              width={120}
            />
            
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(var(--ink-rgb), 0.02)', radius: 12 }} 
              offset={20}
            />

            {currentTimeDecimal >= 7 && currentTimeDecimal <= 21 && (
              <ReferenceLine x={currentTimeDecimal} stroke="var(--accent)" strokeWidth={2} strokeDasharray="5 5">
                <Label 
                  value="NOW" 
                  position="top" 
                  fill="var(--accent)" 
                  fontSize={9} 
                  fontWeight={900} 
                  offset={10}
                  className="italic serif-italic tracking-[0.3em]"
                />
              </ReferenceLine>
            )}

            <Bar 
              dataKey="timeRange" 
              radius={[12, 12, 12, 12]}
              background={{ fill: 'rgba(var(--ink-rgb), 0.02)', radius: 12 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.type === 'LECTURE_HALL' ? 'var(--ink)' : 'var(--accent)'}
                  opacity={entry.type === 'LECTURE_HALL' ? 0.9 : 1}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-[var(--border)]">
        <div className="flex flex-wrap items-center gap-10">
          <div className="flex items-center gap-4 group">
            <div className="w-4 h-4 rounded-lg bg-ink shadow-lg shadow-ink/10 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ink">Lecture Halls</span>
              <span className="text-[8px] font-bold text-ink/30 uppercase tracking-widest italic serif-italic">Academic Sessions</span>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-4 h-4 rounded-lg bg-accent shadow-glow shadow-accent/20 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-ink">Labs & Practical</span>
              <span className="text-[8px] font-bold text-ink/30 uppercase tracking-widest italic serif-italic">Hands-on Learning</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-ink/20 px-6 py-3 bg-[var(--input-bg)] rounded-2xl tactical-border">
          <GraduationCap size={16} />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] italic serif-italic">Tactical Core OS v2.0</span>
        </div>
      </div>
    </div>
  );
};
