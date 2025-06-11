import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SESSION_NAME = 'session';
const SESSION_EXPIRATION_DAYS = 7;

export async function createSession(userId: string) {
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_EXPIRATION_DAYS);

  cookies().set(SESSION_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    path: '/',
  });
}

export async function getSession() {
  return cookies().get(SESSION_NAME)?.value;
}

export async function deleteSession() {
  cookies().delete(SESSION_NAME);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }
  return session;
} 