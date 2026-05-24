import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@contigo.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!process.env.AUTH_SECRET) {
  console.warn('WARNING: AUTH_SECRET not set in environment. Using insecure fallback for development.');
}
const AUTH_SECRET: string = process.env.AUTH_SECRET || 'fallback-secret-change-me';

const SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

function encodeToken(payload: Record<string, unknown>): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64');
  const sigData = data + '.' + AUTH_SECRET;
  const signature = Array.from(new TextEncoder().encode(sigData))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return data + '.' + signature;
}

function decodeToken(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    const sigData = data + '.' + AUTH_SECRET;
    const expectedSig = Array.from(new TextEncoder().encode(sigData))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    if (signature !== expectedSig) return null;
    return JSON.parse(Buffer.from(data, 'base64').toString());
  } catch {
    return null;
  }
}

export async function setAdminSession(): Promise<string> {
  const payload = {
    role: 'admin',
    exp: Date.now() + SESSION_MAX_AGE * 1000,
    jti: crypto.randomUUID(),
  };
  const token = encodeToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
  return token;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE);
    if (!session?.value) return false;
    const payload = decodeToken(session.value);
    if (!payload) return false;
    const exp = payload.exp as number;
    if (exp < Date.now()) return false;
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
}
