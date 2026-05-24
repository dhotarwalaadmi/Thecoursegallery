import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - check site status (public, no auth needed)
export async function GET() {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: 'site_active' },
    });
    const isActive = setting ? setting.value === 'true' : true;
    return NextResponse.json({ active: isActive });
  } catch (error) {
    return NextResponse.json({ active: true });
  }
}

// POST - toggle site status (requires secret key)
export async function POST(request) {
  try {
    const { action, secret } = await request.json();

    // Simple secret key protection — change this to your own secret
    if (secret !== 'KILLSWITCH_SECRET_2026') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 403 });
    }

    if (!['on', 'off'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const value = action === 'on' ? 'true' : 'false';

    await prisma.settings.upsert({
      where: { key: 'site_active' },
      update: { value },
      create: { key: 'site_active', value },
    });

    return NextResponse.json({ success: true, active: action === 'on' });
  } catch (error) {
    console.error('Killswitch error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
