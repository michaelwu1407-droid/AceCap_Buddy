import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const workspace = await prisma.workspace.findUnique({
      where: { id },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    return NextResponse.json(workspace);
  } catch (error) {
    console.error(`Error fetching workspace ${params.id}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the workspace' },
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
    const { name, type, brandingColor } = body;

    const updatedWorkspace = await prisma.workspace.update({
      where: { id },
      data: {
        name,
        type,
        brandingColor,
      },
    });

    return NextResponse.json(updatedWorkspace);
  } catch (error) {
    console.error(`Error updating workspace ${params.id}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while updating the workspace' },
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
    await prisma.workspace.delete({
      where: { id },
    });

    return NextResponse.json({}, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting workspace ${params.id}:`, error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the workspace' },
      { status: 500 }
    );
  }
}
