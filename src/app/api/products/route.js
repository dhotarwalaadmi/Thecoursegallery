import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const popular = searchParams.get('popular') === 'true';

    const where = {};
    
    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive'
      };
    }
    
    if (category) {
      where.categories = {
        some: {
          category: { slug: category }
        }
      };
    }

    if (popular) {
      where.isPopular = true;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        categories: {
          include: { category: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    // Flatten categories for frontend
    const formatted = products.map(p => ({
      ...p,
      categories: p.categories.map(pc => pc.category),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
