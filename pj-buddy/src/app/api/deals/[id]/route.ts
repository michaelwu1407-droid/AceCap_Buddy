import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Get a single deal by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: { contact: true },
    });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json(deal);
  } catch (error) {
    console.error(`Error fetching deal ${params.id}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the deal' },
      { status: 500 }
    );
  }
}

// Update a deal
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, value, stage, contact_id, metadata } = body;

    const updatedDeal = await prisma.deal.update({
      where: { id },
      data: {
        title,
        value,
        stage,
        contact_id,
        metadata,
      },
    });

    return NextResponse.json(updatedDeal);
  } catch (error) {
    console.error(`Error updating deal ${params.id}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while updating the deal' },
      { status: 500 }
    );
  }
}

// Delete a deal
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.deal.delete({
      where: { id },
    });

    return NextResponse.json({}, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting deal ${params.id}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the deal' },
      { status: 500 }
    );
  }
}
