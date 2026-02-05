'use server';

import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const findMatchesSchema = z.object({
  listingId: z.string().uuid(),
});

const listingMetadataSchema = z.object({
  price: z.number(),
}).passthrough();


export async function findMatches(input: z.infer<typeof findMatchesSchema>) {
  try {
    const { listingId } = findMatchesSchema.parse(input);

    const listing = await prisma.deal.findUnique({ where: { id: listingId } });
    if (!listing) {
      throw new Error('Listing not found');
    }

    const listingMetadata = listingMetadataSchema.parse(listing.metadata);
    const price = listingMetadata.price || 0;

    // Prisma's JSON filtering for the budget.
    const matchingContacts = await prisma.contact.findMany({
      where: {
        workspaceId: listing.workspaceId,
        metadata: {
          path: ['budget'],
          gte: price,
        },
      },
      take: 10,
    });

    return { success: true, data: matchingContacts };

  } catch (error) {
    console.error("Error finding matches:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
