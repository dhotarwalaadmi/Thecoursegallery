import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return null;
  return session;
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } }
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: 'Category already exists' }, { status: 400 });

    const category = await prisma.category.create({
      data: { name: name.toUpperCase(), slug },
    });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(request) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const { id, name } = await request.json();
    if (!id || !name) return NextResponse.json({ error: 'ID and name required' }, { status: 400 });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const category = await prisma.category.update({
      where: { id },
      data: { name: name.toUpperCase(), slug },
    });
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Category ID required' }, { status: 400 });

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
