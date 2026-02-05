'use server';

import { prisma } from '@/lib/prisma';
import { DealStage } from '@prisma/client';
import { z } from 'zod';

const ItemSchema = z.object({
  desc: z.string(),
  price: z.number().min(0),
});

export async function generateQuote(dealId: string, items: { desc: string; price: number }[]) {
  // Validate
  const validItems = z.array(ItemSchema).parse(items);
  
  // Calculate total
  const total = validItems.reduce((sum, item) => sum + item.price, 0);

  // Update Deal
  await prisma.deal.update({
    where: { id: dealId },
    data: {
      value: total,
      stage: DealStage.INVOICED,
      metadata: {
        line_items: validItems,
        quoted_at: new Date().toISOString()
      }
    }
  });

  return { success: true, total };
}
