'use client';

import React from 'react';
import { SpeedLeadWidget } from '@/components/modules/agent/SpeedLeadWidget';
import { BentoCard } from '@/components/ui/BentoCard';
import { Users, Building } from 'lucide-react';

export default function AgentDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Agent Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* The Speed Lead Widget */}
        <SpeedLeadWidget />

        {/* Active Open Houses */}
        <BentoCard title="Open Houses" icon={<Building size={20} />} delay={0.2}>
          <div className="space-y-2">
             <div className="p-2 bg-slate-950/50 rounded flex justify-between items-center">
                <span className="text-sm text-slate-300">123 Sunset Blvd</span>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Active</span>
             </div>
             <div className="p-2 bg-slate-950/50 rounded flex justify-between items-center">
                <span className="text-sm text-slate-300">88 Ocean Dr</span>
                <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">Upcoming</span>
             </div>
          </div>
        </BentoCard>

        {/* Buyer Matches */}
        <BentoCard title="Hot Buyer Matches" icon={<Users size={20} />} className="md:col-span-2" delay={0.3}>
           <div className="h-24 bg-slate-800/50 rounded-lg flex items-center justify-center text-slate-400">
             Matchmaking Interface Placeholder
           </div>
        </BentoCard>
      </div>
    </div>
  );
}
