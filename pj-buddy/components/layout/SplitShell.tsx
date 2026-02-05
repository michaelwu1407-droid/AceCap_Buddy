'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, LayoutGrid, Users, FileText, Settings, Command } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for classes
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------
// Navigation Rail
// ---------------------------
const NavItem = ({ icon: Icon, label }: { icon: any, label: string }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors group relative"
    >
      <Icon size={24} strokeWidth={1.5} />
      <span className="absolute left-14 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
        {label}
      </span>
    </motion.button>
  );
};

const NavigationRail = () => {
  return (
    <div className="w-16 h-full border-r border-slate-800 bg-slate-950 flex flex-col items-center py-6 gap-6 z-20 relative">
      <div className="w-8 h-8 bg-blue-600 rounded-lg mb-4 flex items-center justify-center font-bold text-white">
        PB
      </div>
      <NavItem icon={Home} label="Home" />
      <NavItem icon={LayoutGrid} label="Pipeline" />
      <NavItem icon={Users} label="Contacts" />
      <NavItem icon={FileText} label="Invoices" />
      <div className="flex-1" />
      <NavItem icon={Settings} label="Settings" />
    </div>
  );
};

// ---------------------------
// The Assistant (Right Pane)
// ---------------------------
const AssistantPane = () => {
  return (
    <div className="h-full flex flex-col bg-slate-950/50 backdrop-blur-md">
      <div className="p-4 border-b border-slate-800 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm font-medium text-slate-200">Pj Buddy Assistant</span>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Placeholder Chat Message */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs">
            AI
          </div>
          <div className="bg-slate-900 rounded-2xl rounded-tl-none p-3 text-sm text-slate-300 max-w-[85%] border border-slate-800">
            <p>Welcome back! I've noticed 3 new leads in the pipeline. Should we draft quotes for them?</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Ask Pj Buddy..." 
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-slate-600"
          />
          <button className="absolute right-2 top-2 p-1 text-slate-500 hover:text-white transition-colors">
            <Command size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------
// Main Split Shell
// ---------------------------
interface SplitShellProps {
  children: React.ReactNode;
}

export default function SplitShell({ children }: SplitShellProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#020617] text-slate-50 selection:bg-blue-500/30">
      {/* 1. Navigation Rail */}
      <NavigationRail />

      {/* 2. Main Content Area (Grid) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Pane: The Canvas (65%) */}
        <main className="flex-[0.65] relative overflow-hidden flex flex-col border-r border-slate-800/50">
           {/* Top Bar / Header could go here */}
           <div className="flex-1 overflow-y-auto relative p-6">
             <AnimatePresence mode="wait">
               <motion.div
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                 className="h-full"
               >
                 {children}
               </motion.div>
             </AnimatePresence>
           </div>
        </main>

        {/* Right Pane: The Assistant (35%) */}
        <aside className="flex-[0.35] relative border-l border-slate-800 bg-slate-950/30">
          <AssistantPane />
        </aside>

      </div>
    </div>
  );
}
