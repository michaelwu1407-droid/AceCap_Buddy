'use server';

import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const findMatchesSchema = z.object({
  listingId: z.string().uuid(),
});

// Define what the metadata for listings and contacts should look like.
// This helps with type safety when accessing JSON fields.
const listingMetadataSchema = z.object({
  price: z.number(),
  bedrooms_req: z.number().optional(),
}).passthrough();

const contactMetadataSchema = z.object({
  budget: z.number().optional(),
  bedrooms_req: z.number().optional(),
}).passthrough();


export async function findMatches(input: z.infer<typeof findMatchesSchema>) {
  try {
    const { listingId } = findMatchesSchema.parse(input);

    const listing = await prisma.deal.findUnique({ where: { id: listingId } });
    if (!listing) {
      throw new Error('Listing not found');
    }

    const listingMetadata = listingMetadataSchema.parse(listing.metadata);

    // Build the query conditions for Prisma's JSON filtering
    const conditions: any[] = [];
    if (listingMetadata.price) {
      conditions.push({
        metadata: {
          path: ['budget'],
          gte: listingMetadata.price,
        }
      });
    }
    // Add more conditions like bedrooms if needed

    const matches = await prisma.contact.findMany({
      where: {
        workspace_id: listing.workspace_id,
        AND: conditions,
      },
      take: 5,
    });

    return { success: true, data: matches };

  } catch (error) {
    console.error("Error finding matches:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
