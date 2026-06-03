import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return null;
  return session;
}

// Export Database Data (GET)
export async function GET() {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const categories = await prisma.category.findMany();
    const products = await prisma.product.findMany();
    const productCategories = await prisma.productCategory.findMany();
    const coupons = await prisma.coupon.findMany();
    const settings = await prisma.settings.findMany();
    const users = await prisma.user.findMany();
    const orders = await prisma.order.findMany();
    const orderItems = await prisma.orderItem.findMany();
    const courseRequests = await prisma.courseRequest.findMany();

    return NextResponse.json({
      categories,
      products,
      productCategories,
      coupons,
      settings,
      users,
      orders,
      orderItems,
      courseRequests,
    });
  } catch (error) {
    return NextResponse.json({ error: `Failed to export data: ${error.message}` }, { status: 500 });
  }
}

// Import Database Data (POST)
export async function POST(request) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const data = await request.json();
    const {
      categories = [],
      products = [],
      productCategories = [],
      coupons = [],
      settings = [],
      users = [],
      orders = [],
      orderItems = [],
      courseRequests = [],
    } = data;

    // Use a transaction to safely clean up and write everything in dependency order
    await prisma.$transaction(async (tx) => {
      // 1. Delete all existing data in reverse dependency order
      await tx.productCategory.deleteMany({});
      await tx.orderItem.deleteMany({});
      await tx.order.deleteMany({});
      await tx.product.deleteMany({});
      await tx.category.deleteMany({});
      await tx.coupon.deleteMany({});
      await tx.settings.deleteMany({});
      await tx.courseRequest.deleteMany({});
      await tx.user.deleteMany({});

      // 2. Re-insert users first
      if (users.length > 0) {
        const formattedUsers = users.map(u => ({
          ...u,
          createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
        }));
        await tx.user.createMany({ data: formattedUsers });
      }

      // 3. Re-insert categories
      if (categories.length > 0) {
        await tx.category.createMany({ data: categories });
      }

      // 4. Re-insert products
      if (products.length > 0) {
        const formattedProducts = products.map(p => ({
          ...p,
          createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
        }));
        await tx.product.createMany({ data: formattedProducts });
      }

      // 5. Re-insert product categories mappings
      if (productCategories.length > 0) {
        await tx.productCategory.createMany({ data: productCategories });
      }

      // 6. Re-insert coupons
      if (coupons.length > 0) {
        const formattedCoupons = coupons.map(c => ({
          ...c,
          createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
        }));
        await tx.coupon.createMany({ data: formattedCoupons });
      }

      // 7. Re-insert settings
      if (settings.length > 0) {
        await tx.settings.createMany({ data: settings });
      }

      // 8. Re-insert orders
      if (orders.length > 0) {
        const formattedOrders = orders.map(o => ({
          ...o,
          createdAt: o.createdAt ? new Date(o.createdAt) : new Date(),
        }));
        await tx.order.createMany({ data: formattedOrders });
      }

      // 9. Re-insert order items
      if (orderItems.length > 0) {
        await tx.orderItem.createMany({ data: orderItems });
      }

      // 10. Re-insert course requests
      if (courseRequests.length > 0) {
        const formattedRequests = courseRequests.map(cr => ({
          ...cr,
          createdAt: cr.createdAt ? new Date(cr.createdAt) : new Date(),
        }));
        await tx.courseRequest.createMany({ data: formattedRequests });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: `Import failed: ${error.message}` }, { status: 500 });
  }
}
