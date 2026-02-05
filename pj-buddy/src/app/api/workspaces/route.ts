import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, type, brandingColor } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    const newWorkspace = await prisma.workspace.create({
      data: {
        name,
        type,
        brandingColor,
      },
    });

    return NextResponse.json(newWorkspace, { status: 201 });
  } catch (error) {
    console.error('Error creating workspace:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the workspace' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const workspaces = await prisma.workspace.findMany();
    return NextResponse.json(workspaces);
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching workspaces' },
      { status: 500 }
    );
  }
}
