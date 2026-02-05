import React from 'react';
import { Hammer, ArrowRight } from 'lucide-react';
import { BentoCard } from '../../ui/BentoCard';

const RECENT_JOBS = [
  { id: 1, name: 'Kitchen Reno - Smith', value: '$4,500', status: 'In Progress' },
  { id: 2, name: 'Leak Fix - 12 Main St', value: '$250', status: 'Pending' },
  { id: 3, name: 'Boiler Install - Jones', value: '$3,200', status: 'Invoiced' },
];

export const QuickQuoteWidget = () => {
  return (
    <BentoCard title="Quick Quote" icon={<Hammer size={20} />} className="col-span-1" delay={0.1}>
      <div className="space-y-3">
        {RECENT_JOBS.map((job) => (
          <div key={job.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/50 hover:border-slate-700 transition-colors cursor-pointer group/item">
            <div>
              <div className="text-sm font-medium text-slate-300 group-hover/item:text-white">{job.name}</div>
              <div className="text-xs text-slate-500">{job.status}</div>
            </div>
            <div className="text-sm font-semibold text-slate-400">{job.value}</div>
          </div>
        ))}
        
        <button className="w-full mt-2 py-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
          Create New Quote <ArrowRight size={14} />
        </button>
      </div>
    </BentoCard>
  );
};
