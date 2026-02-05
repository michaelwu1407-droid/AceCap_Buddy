'use server';

import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const quoteItemSchema = z.object({
  desc: z.string().min(1),
  price: z.number().positive(),
});

const generateQuoteSchema = z.object({
  dealId: z.string().uuid(),
  items: z.array(quoteItemSchema),
});

export async function generateQuote(input: z.infer<typeof generateQuoteSchema>) {
  try {
    const validatedInput = generateQuoteSchema.parse(input);
    const { dealId, items } = validatedInput;

    const totalValue = items.reduce((sum, item) => sum + item.price, 0);

    const updatedDeal = await prisma.deal.update({
      where: { id: dealId },
      data: {
        value: totalValue,
        stage: 'INVOICED',
        metadata: {
          ...((await prisma.deal.findUnique({ where: { id: dealId } }))?.metadata as object || {}),
          quote_items: items,
        },
      },
    });

    return { success: true, data: updatedDeal };
  } catch (error) {
    console.error("Error generating quote:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues };
    }
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
