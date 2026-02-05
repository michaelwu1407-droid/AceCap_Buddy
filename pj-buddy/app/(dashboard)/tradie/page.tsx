'use client';

import React from 'react';
import { QuickQuoteWidget } from '@/components/modules/tradie/QuickQuoteWidget';
import { BentoCard } from '@/components/ui/BentoCard';
import { Map, DollarSign } from 'lucide-react';

export default function TradieDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Tradie Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* The Quick Quote Widget */}
        <QuickQuoteWidget />

        {/* Placeholder Map Widget */}
        <BentoCard title="Job Map" icon={<Map size={20} />} delay={0.2}>
          <div className="h-32 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-sm">
            [Map View Component]
          </div>
        </BentoCard>

        {/* Revenue Widget */}
        <BentoCard title="This Week" icon={<DollarSign size={20} />} className="md:col-span-2" delay={0.3}>
           <div className="h-24 bg-slate-800/50 rounded-lg flex items-center justify-center text-slate-400">
             Revenue Chart Placeholder
           </div>
        </BentoCard>
      </div>
    </div>
  );
}
