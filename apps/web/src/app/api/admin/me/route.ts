import { NextResponse } from 'next/server';
import { isAuthenticated, unauthorized } from '@/lib/auth';

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) return unauthorized();
  return NextResponse.json({ authenticated: true });
}
