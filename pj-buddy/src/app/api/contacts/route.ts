import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, workspaceId, metadata } = body;

    if (!name || !workspaceId) {
      return NextResponse.json(
        { error: 'Name and workspaceId are required' },
        { status: 400 }
      );
    }

    const newContact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        address,
        workspaceId,
        metadata,
      },
    });

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the contact' },
      { status: 500 }
    );
  }
}

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
        const contacts = await prisma.contact.findMany({
            where: {
                workspace_id: workspaceId
            }
        });
        return NextResponse.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching contacts' },
            { status: 500 }
        );
    }
}
