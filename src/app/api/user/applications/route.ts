import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import LoanApplication from '@/models/LoanApplication';

const JWT_SECRET = process.env.JWT_SECRET as string;

async function requireUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('fs_token')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

// List the user's applications
export async function GET() {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const applications = await LoanApplication.find({ userId: auth.userId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ applications });
}

// Add (apply to) a loan — idempotent per loanId
export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body.loanId) return NextResponse.json({ error: 'loanId required.' }, { status: 400 });

  await connectDB();
  try {
    const application = await LoanApplication.findOneAndUpdate(
      { userId: auth.userId, loanId: body.loanId },
      { userId: auth.userId, ...body },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
    return NextResponse.json({ success: true, application });
  } catch {
    return NextResponse.json({ error: 'Failed to save application.' }, { status: 500 });
  }
}

// Remove an application
export async function DELETE(req: NextRequest) {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const loanId = searchParams.get('loanId');
  if (!loanId) return NextResponse.json({ error: 'loanId required.' }, { status: 400 });

  await connectDB();
  await LoanApplication.deleteOne({ userId: auth.userId, loanId });
  return NextResponse.json({ success: true });
}
