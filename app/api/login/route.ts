import { createSession } from '@/lib/session';
import { NextResponse } from 'next/server';

const ADMIN_EMAIL = 'athilalexandre@gmail.com';
const ADMIN_PASSWORD = 'aa123';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    await createSession(email); // Using email as a simple userId for the session
    return NextResponse.json({ message: 'Login successful' });
  } else {
    return new NextResponse('Invalid credentials', { status: 401 });
  }
} 