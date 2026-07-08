import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fs_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      name: string;
      hasProfile: boolean;
    };

    // Pull the freshest name/avatar/profile flag from the DB (JWT can be stale after edits).
    let avatar = '';
    let name = payload.name;
    let hasProfile = payload.hasProfile;
    try {
      await connectDB();
      const user = await User.findById(payload.userId).select('name avatar hasProfile').lean();
      if (user) {
        avatar = user.avatar || '';
        name = user.name || payload.name;
        hasProfile = user.hasProfile;
      }
    } catch {
      // DB unreachable — fall back to JWT claims.
    }

    return NextResponse.json({
      user: { id: payload.userId, email: payload.email, name, avatar, hasProfile },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
