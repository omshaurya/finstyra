import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import InsuranceProfile from '@/models/InsuranceProfile';

const JWT_SECRET = process.env.JWT_SECRET as string;

async function auth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('fs_token')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string };
  } catch {
    return null;
  }
}

export async function GET() {
  const user = await auth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const profile = await InsuranceProfile.findOne({ userId: user.userId }).lean();
  const acc = await User.findById(user.userId).select('email name avatar createdAt').lean();

  return NextResponse.json({
    profile: profile || null,
    account: acc ? { email: acc.email, name: acc.name, avatar: acc.avatar || '', memberSince: acc.createdAt } : null,
  });
}

export async function POST(req: NextRequest) {
  const user = await auth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, ...fields } = body as { name?: string } & Record<string, unknown>;

  await connectDB();
  await InsuranceProfile.findOneAndUpdate(
    { userId: user.userId },
    { userId: user.userId, ...fields },
    { upsert: true, new: true }
  );
  if (typeof name === 'string' && name.trim()) {
    await User.findByIdAndUpdate(user.userId, { name: name.trim() });
  }

  return NextResponse.json({ success: true });
}
