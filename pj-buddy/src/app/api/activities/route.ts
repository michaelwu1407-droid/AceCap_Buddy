import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Create a new activity
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, content, dealId, contactId } = body;

    if (!type || !content) {
      return NextResponse.json(
        { error: 'Type and content are required' },
        { status: 400 }
      );
    }
    
    if (!dealId && !contactId) {
        return NextResponse.json(
            { error: 'An activity must be related to either a deal or a contact.' },
            { status: 400 }
        );
    }

    const newActivity = await prisma.activity.create({
      data: {
        type,
        content,
        dealId,
        contactId,
      },
    });

    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the activity' },
      { status: 500 }
    );
  }
}

// Get activities (for a deal or a contact)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dealId = searchParams.get('dealId');
    const contactId = searchParams.get('contactId');

    if (!dealId && !contactId) {
        return NextResponse.json(
            { error: 'Either dealId or contactId query parameter is required' },
            { status: 400 }
        );
    }

    const whereClause = dealId ? { dealId: dealId } : { contactId: contactId };

    try {
        const activities = await prisma.activity.findMany({
            where: whereClause,
            orderBy: {
                created_at: 'desc'
            }
        });
        return NextResponse.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching activities' },
            { status: 500 }
        );
    }
}
