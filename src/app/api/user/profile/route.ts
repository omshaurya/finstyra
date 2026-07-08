import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import LoanProfile from '@/models/LoanProfile';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fs_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string };

    await connectDB();

    const profile = await LoanProfile.findOne({ userId: payload.userId }).lean();
    const user = await User.findById(payload.userId).select('email name avatar createdAt hasProfile').lean();

    return NextResponse.json({
      profile: profile || null,
      account: user
        ? { email: user.email, name: user.name, avatar: user.avatar || '', memberSince: user.createdAt, hasProfile: user.hasProfile }
        : null,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load profile.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fs_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string };

    const body = await req.json();
    // `name` lives on the User model + JWT, not the LoanProfile — pull it out.
    const { name, ...profileFields } = body as { name?: string } & Record<string, unknown>;
    const finalName = typeof name === 'string' && name.trim() ? name.trim() : payload.name;

    await connectDB();

    await LoanProfile.findOneAndUpdate(
      { userId: payload.userId },
      { userId: payload.userId, ...profileFields },
      { upsert: true, new: true }
    );

    await User.findByIdAndUpdate(payload.userId, { hasProfile: true, name: finalName });

    const newToken = jwt.sign(
      { userId: payload.userId, email: payload.email, name: finalName, hasProfile: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    cookieStore.set('fs_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: { id: payload.userId, email: payload.email, name: finalName, hasProfile: true },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to save profile.' }, { status: 500 });
  }
}
