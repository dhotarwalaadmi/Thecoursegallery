import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Please login first' }, { status: 401 });
    }

    const { items, totalAmount, payerName, email, orderNotes, bankHolderName, transactionId } = await request.json();

    if (!items?.length || !totalAmount || !payerName || !transactionId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
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
