import React from 'react';

type BentoCardProps = {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
  delay?: number; // Make delay optional as it might not always be used
};

export const BentoCard = ({ children, title, icon }: BentoCardProps) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
};
