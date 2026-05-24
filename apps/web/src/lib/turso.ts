import { createClient } from '@libsql/client';

const url = process.env.TURSO_URL || '';
const authToken = process.env.TURSO_KEY || '';

if (!url || !authToken) {
  console.warn('TursoDB credentials not found in server env. Some features may not work.');
}

export const tursoClient = createClient({
  url,
  authToken,
});
