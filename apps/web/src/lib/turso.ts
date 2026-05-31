import { createClient } from '@libsql/client';

let client: ReturnType<typeof createClient> | null = null;

export function getTursoClient() {
  if (client) return client;

  const url = process.env.TURSO_URL;
  const authToken = process.env.TURSO_KEY;

  if (!url || !authToken) {
    throw new Error('TURSO_URL and TURSO_KEY environment variables are required');
  }

  client = createClient({ url, authToken });
  return client;
}
