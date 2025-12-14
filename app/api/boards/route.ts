// app/api/boards/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List all boards or get specific board
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
      // Get specific board
      const board = await prisma.board.findUnique({
        where: { id },
      });

      if (!board) {
        return NextResponse.json(
          { error: 'Board not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(board);
    } else {
      // List all boards
      const boards = await prisma.board.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 50,
      });

      return NextResponse.json(boards);
    }
  } catch (error) {
    console.error('Error fetching boards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch boards' },
      { status: 500 }
    );
  }
}

// POST - Create new board
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, data, viewport } = body;

    if (!name || !data) {
      return NextResponse.json(
        { error: 'Name and data are required' },
        { status: 400 }
      );
    }

    const board = await prisma.board.create({
      data: {
        name,
        data,
        viewport: viewport || null,
      },
    });

    return NextResponse.json(board, { status: 201 });
  } catch (error) {
    console.error('Error creating board:', error);
    return NextResponse.json(
      { error: 'Failed to create board' },
      { status: 500 }
    );
  }
}

// PUT - Update existing board
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, data, viewport } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Board ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (data !== undefined) updateData.data = data;
    if (viewport !== undefined) updateData.viewport = viewport;

    const board = await prisma.board.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(board);
  } catch (error) {
    console.error('Error updating board:', error);
    return NextResponse.json(
      { error: 'Failed to update board' },
      { status: 500 }
    );
  }
}

// DELETE - Delete board
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Board ID is required' },
        { status: 400 }
      );
    }

    await prisma.board.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting board:', error);
    return NextResponse.json(
      { error: 'Failed to delete board' },
      { status: 500 }
    );
  }
}