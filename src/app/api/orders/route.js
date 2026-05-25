import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    let userId = null;
    if (session?.user?.id) {
      userId = session.user.id;
    }

    const { items, totalAmount, payerName, email, orderNotes, bankHolderName, transactionId, couponCode } = await request.json();

    if (!items?.length || !totalAmount || !payerName || !transactionId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        payerName,
        email: email || '',
        orderNotes: orderNotes || '',
        bankHolderName: bankHolderName || '',
        transactionId,
        status: 'pending',
        items: {
          create: items.map(item => ({
            productId: item.id,
            price: item.newPrice,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    if (couponCode) {
      await prisma.coupon.update({
        where: { code: couponCode },
        data: { usedCount: { increment: 1 } },
      }).catch(e => console.error('Failed to increment coupon count:', e));
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Please login first' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
