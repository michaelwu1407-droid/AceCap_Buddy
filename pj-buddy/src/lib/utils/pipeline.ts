import { differenceInDays } from 'date-fns';

export type DealHealth = 'HEALTHY' | 'STALE' | 'ROTTING';

/**
 * Calculates the "health" of a deal based on its last activity date.
 * @param lastActivity The date of the last activity on the deal.
 * @returns DealHealth status.
 */
export function getDealHealth(lastActivity: Date): DealHealth {
  const today = new Date();
  const daysSinceLastActivity = differenceInDays(today, lastActivity);

  if (daysSinceLastActivity <= 3) {
    return 'HEALTHY'; // Green
  } else if (daysSinceLastActivity <= 7) {
    return 'STALE'; // Yellow
  } else {
    return 'ROTTING'; // Red
  }
}
