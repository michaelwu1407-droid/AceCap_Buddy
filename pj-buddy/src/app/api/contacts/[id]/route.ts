import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error(`Error fetching contact ${params.id}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the contact' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, email, phone, address, metadata } = body;

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        metadata,
      },
    });

    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error(`Error updating contact ${params.id}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while updating the contact' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.contact.delete({
      where: { id },
    });

    return NextResponse.json({}, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting contact ${params.id}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the contact' },
      { status: 500 }
    );
  }
}
