import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { name, email, courseName } = await request.json();

    if (!name || !email || !courseName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const courseRequest = await prisma.courseRequest.create({
      data: { name, email, courseName },
    });

    return NextResponse.json({ success: true, id: courseRequest.id });
  } catch (error) {
    console.error('Course request error:', error);
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
  }
}
