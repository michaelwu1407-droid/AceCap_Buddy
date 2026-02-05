import { differenceInDays } from 'date-fns';

export type HealthStatus = 'HEALTHY' | 'STALE' | 'ROTTING';

export function getDealHealth(lastActivity: Date): HealthStatus {
  const days = differenceInDays(new Date(), lastActivity);

  if (days > 14) return 'ROTTING';
  if (days > 7) return 'STALE';
  return 'HEALTHY';
}
