import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

// Body payload can be a base64 data URL — allow a larger request body.
const MAX_LEN = 1_500_000; // ~1.5MB of base64 (~1MB image)

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fs_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    const { avatar } = await req.json();

    if (typeof avatar !== 'string' || !avatar.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Invalid image.' }, { status: 400 });
    }
    if (avatar.length > MAX_LEN) {
      return NextResponse.json({ error: 'Image too large. Please use one under 1MB.' }, { status: 413 });
    }

    await connectDB();
    await User.findByIdAndUpdate(payload.userId, { avatar });

    return NextResponse.json({ success: true, avatar });
  } catch {
    return NextResponse.json({ error: 'Failed to upload image.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fs_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    await connectDB();
    await User.findByIdAndUpdate(payload.userId, { avatar: '' });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to remove image.' }, { status: 500 });
  }
}
