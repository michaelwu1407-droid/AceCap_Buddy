import React from 'react';

type BentoCardProps = {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
  className?: string; // Add className as an optional prop
  delay?: number;
};

export const BentoCard = ({ children, title, icon, className }: BentoCardProps) => {
  // A simple way to combine the default styles with the passed className
  const combinedClassName = `border border-gray-700 rounded-lg p-4 ${className || ''}`;

  return (
    <div className={combinedClassName}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
};
