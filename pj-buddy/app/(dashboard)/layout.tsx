import React from 'react';
import SplitShell from '@/components/layout/SplitShell';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SplitShell>
      {children}
    </SplitShell>
  );
}
