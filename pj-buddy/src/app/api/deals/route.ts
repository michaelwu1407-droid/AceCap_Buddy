import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Create a new deal
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, value, contactId, workspaceId, metadata } = body;

    if (!title || !contactId || !workspaceId) {
      return NextResponse.json(
        { error: 'Title, contactId, and workspaceId are required' },
        { status: 400 }
      );
    }

    // Ensure metadata is always an object
    const dealMetadata = metadata || {};

    const newDeal = await prisma.deal.create({
      data: {
        title,
        value,
        contactId,
        workspaceId,
        metadata: dealMetadata,
      },
    });

    return NextResponse.json(newDeal, { status: 201 });
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the deal' },
      { status: 500 }
    );
  }
}

// Get all deals for a workspace
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
        return NextResponse.json(
            { error: 'workspaceId query parameter is required' },
            { status: 400 }
        );
    }

    try {
        const deals = await prisma.deal.findMany({
            where: {
                workspace_id: workspaceId
            },
            include: {
                contact: true // Include related contact information
            }
        });
        return NextResponse.json(deals);
    } catch (error) {
        console.error('Error fetching deals:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching deals' },
            { status: 500 }
        );
    }
}
