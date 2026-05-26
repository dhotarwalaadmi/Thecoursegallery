import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return null;
  return session;
}

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function GET() {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const products = await prisma.product.findMany({
      include: {
        categories: { include: { category: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    const formatted = products.map(p => ({
      ...p,
      categories: p.categories.map(pc => pc.category),
    }));
    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const { title, description, imageUrl, oldPrice, newPrice, discountBadge, isFeatured, isPopular, downloadUrl, categoryIds, extraImages } = await request.json();

    if (!title || !imageUrl || !oldPrice || !newPrice || !discountBadge) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    let slug = generateSlug(title);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) slug = slug + '-' + Date.now();

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description: description || '',
        imageUrl,
        oldPrice: parseFloat(oldPrice),
        newPrice: parseFloat(newPrice),
        discountBadge,
        isFeatured: isFeatured || false,
        isPopular: isPopular || false,
        downloadUrl: downloadUrl || '',
        extraImages: extraImages || '',
        categories: categoryIds?.length ? {
          create: categoryIds.map(catId => ({ categoryId: catId }))
        } : undefined,
      },
      include: {
        categories: { include: { category: true } },
      },
    });

    return NextResponse.json({
      ...product,
      categories: product.categories.map(pc => pc.category),
    });
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const { id, title, description, imageUrl, oldPrice, newPrice, discountBadge, isFeatured, isPopular, downloadUrl, categoryIds, extraImages } = await request.json();

    if (!id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    // Delete existing category relations
    await prisma.productCategory.deleteMany({ where: { productId: id } });

    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        description: description || '',
        imageUrl,
        oldPrice: parseFloat(oldPrice),
        newPrice: parseFloat(newPrice),
        discountBadge,
        isFeatured: isFeatured || false,
        isPopular: isPopular || false,
        downloadUrl: downloadUrl || '',
        extraImages: extraImages || '',
        categories: categoryIds?.length ? {
          create: categoryIds.map(catId => ({ categoryId: catId }))
        } : undefined,
      },
      include: {
        categories: { include: { category: true } },
      },
    });

    return NextResponse.json({
      ...product,
      categories: product.categories.map(pc => pc.category),
    });
  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
