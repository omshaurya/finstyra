import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import InsuranceApplication from '@/models/InsuranceApplication';

const JWT_SECRET = process.env.JWT_SECRET as string;

async function auth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('fs_token')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function GET() {
  const user = await auth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const applications = await InsuranceApplication.find({ userId: user.userId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ applications });
}

export async function POST(req: NextRequest) {
  const user = await auth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!body.planId) return NextResponse.json({ error: 'planId required.' }, { status: 400 });
  await connectDB();
  try {
    const application = await InsuranceApplication.findOneAndUpdate(
      { userId: user.userId, planId: body.planId },
      { userId: user.userId, ...body },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    return NextResponse.json({ success: true, application });
  } catch {
    return NextResponse.json({ error: 'Failed to save.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await auth();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const planId = new URL(req.url).searchParams.get('planId');
  if (!planId) return NextResponse.json({ error: 'planId required.' }, { status: 400 });
  await connectDB();
  await InsuranceApplication.deleteOne({ userId: user.userId, planId });
  return NextResponse.json({ success: true });
}
