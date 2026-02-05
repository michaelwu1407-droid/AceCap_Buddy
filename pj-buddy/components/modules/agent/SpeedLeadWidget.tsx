import React from 'react';
import { Timer, Flame } from 'lucide-react';
import { BentoCard } from '../../ui/BentoCard';

export const SpeedLeadWidget = () => {
  return (
    <BentoCard title="Speed to Lead" icon={<Flame size={20} className="text-orange-500" />} className="col-span-1" delay={0.2}>
      <div className="flex flex-col items-center justify-center py-2">
        <div className="text-4xl font-bold text-white tabular-nums tracking-tight">
          04:52
        </div>
        <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">Avg Response Time</div>
        
        <div className="w-full mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-start gap-3">
          <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-500 animate-pulse" />
          <div>
            <div className="text-sm font-medium text-orange-200">New Inquiry: 124 Park Ave</div>
            <div className="text-xs text-orange-400/80 mt-0.5">Just now via RealEstate.com</div>
          </div>
          <button className="ml-auto text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 transition-colors">
            Reply
          </button>
        </div>
      </div>
    </BentoCard>
  );
};
