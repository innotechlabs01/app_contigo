import { createClient } from '@libsql/client';

const url = process.env.NEXT_PUBLIC_TURSO_URL || '';
const authToken = process.env.NEXT_PUBLIC_TURSO_KEY || '';

if (!url || !authToken) {
  console.warn('TursoDB credentials not found. Some features may not work.');
}

export const tursoClient = createClient({
  url,
  authToken,
});
