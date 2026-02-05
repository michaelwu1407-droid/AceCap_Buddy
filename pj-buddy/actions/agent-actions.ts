'use server';

import { prisma } from '@/lib/prisma';

export async function findMatches(listingId: string) {
  const listing = await prisma.deal.findUnique({
    where: { id: listingId },
  });

  if (!listing) throw new Error('Listing not found');

  const listingMeta = listing.metadata as any;
  const price = Number(listingMeta?.price || listing.value || 0);

  // Fetch contacts in the same workspace
  const contacts = await prisma.contact.findMany({
    where: { workspaceId: listing.workspaceId },
  });

  // Filter in memory for JSON numeric comparison (Prisma JSON filtering can be complex)
  const matches = contacts
    .filter((contact) => {
      const contactMeta = contact.metadata as any;
      const budget = Number(contactMeta?.buyer_budget_max || 0);
      return budget >= price;
    })
    .sort((a, b) => {
      const budgetA = Number((a.metadata as any)?.buyer_budget_max || 0);
      const budgetB = Number((b.metadata as any)?.buyer_budget_max || 0);
      return budgetB - budgetA; // Highest budget first
    });

  return matches.slice(0, 5);
}
