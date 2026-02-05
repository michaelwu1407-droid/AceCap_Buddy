import React from 'react';

export const BentoCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      {children}
    </div>
  );
};
