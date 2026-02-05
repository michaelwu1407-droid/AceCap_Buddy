import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface BentoCardProps {
  title: string;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  delay?: number;
}

export const BentoCard = ({ title, className, children, icon, delay = 0 }: BentoCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        delay: delay 
      }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm hover:bg-slate-900/80 transition-colors",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        {icon && <div className="text-slate-400 group-hover:text-blue-400 transition-colors">{icon}</div>}
        <h3 className="font-semibold text-slate-200">{title}</h3>
      </div>
      
      <div className="relative z-10">
        {children}
      </div>

      {/* Decorative gradient blob */}
      <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />
    </motion.div>
  );
};
