import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer } from 'lucide-react';
import { cn } from '../../lib/utils';

interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  humidity: number;
  windSpeed: number;
}

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setWeather({
        temp: 28,
        condition: 'Partly Cloudy',
        location: 'Colombo Nexus',
        humidity: 65,
        windSpeed: 12
      });
      setIsLoading(false);
    };
    fetchWeather();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-card rounded-[3.5rem] tactical-border p-12 h-80 flex items-center justify-center strat-shadow">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ink/10 italic serif-italic">Syncing Atmospheric Data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-[3.5rem] tactical-border p-12 strat-shadow group relative overflow-hidden">
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent/5 rounded-full blur-[100px] group-hover:bg-accent/10 transition-all duration-1000" />
      
      <div className="flex items-center justify-between mb-12 relative z-10">
        <div className="space-y-3">
          <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-ink/10 italic serif-italic">Atmospheric Telemetry</h3>
          <p className="text-2xl font-black text-ink tracking-tighter uppercase">{weather?.location}</p>
        </div>
        <div className="w-16 h-16 bg-accent rounded-[1.5rem] flex items-center justify-center text-slate-950 shadow-glow shadow-accent/20 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110">
          <Cloud size={28} />
        </div>
      </div>

      <div className="flex items-end gap-6 mb-12 relative z-10">
        <span className="text-8xl font-black tracking-tighter text-ink leading-none">{weather?.temp}°</span>
        <div className="pb-2">
          <p className="text-xl font-black text-ink tracking-tighter uppercase italic serif-italic leading-none mb-3">{weather?.condition}</p>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-glow shadow-accent/50" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/20 italic serif-italic">Optimal Protocol</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 relative z-10">
        <div className="flex items-center gap-5 p-6 bg-ink/5 rounded-[2.5rem] tactical-border hover:bg-ink/10 transition-all duration-500 group/stat">
          <Wind size={20} className="text-accent group-hover/stat:rotate-45 transition-transform duration-700" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-ink/10 italic serif-italic">Velocity</span>
            <span className="text-sm font-black text-ink/70 uppercase tracking-tighter font-mono">{weather?.windSpeed} km/h</span>
          </div>
        </div>
        <div className="flex items-center gap-5 p-6 bg-ink/5 rounded-[2.5rem] tactical-border hover:bg-ink/10 transition-all duration-500 group/stat">
          <Thermometer size={20} className="text-accent group-hover/stat:scale-110 transition-transform duration-700" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-ink/10 italic serif-italic">Humidity</span>
            <span className="text-sm font-black text-ink/70 uppercase tracking-tighter font-mono">{weather?.humidity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

