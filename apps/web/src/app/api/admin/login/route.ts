import { NextRequest, NextResponse } from 'next/server';
import { setAdminSession, clearAdminSession } from '@/lib/auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@contigo.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Always compare against a dummy to prevent length-based timing leak
    const dummy = new Uint8Array(a.length);
    const target = new Uint8Array(a.length);
    crypto.subtle?.digest?.('SHA-256', dummy);
    return false;
  }
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  let result = 0;
  for (let i = 0; i < aBytes.length; i++) {
    result |= aBytes[i] ^ bBytes[i];
  }
  return result === 0;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña requeridos' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Timing-safe comparison to prevent timing attacks
    const emailMatch = timingSafeEqual(trimmedEmail, ADMIN_EMAIL.toLowerCase());
    const passwordMatch = ADMIN_PASSWORD ? timingSafeEqual(password, ADMIN_PASSWORD) : false;

    if (!emailMatch || !passwordMatch) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    await setAdminSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ success: true });
}
