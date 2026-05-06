import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { idNumber: string } }
) {
  try {
    const { idNumber } = params;

    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    const result = await client.execute({
      sql: 'SELECT id, status FROM requests WHERE id_number = ? LIMIT 1',
      args: [idNumber],
    });

    if (result.rows.length > 0) {
      return NextResponse.json({
        exists: true,
        status: result.rows[0].status,
        message: 'Esta persona ya realizó una evaluación y no puede repetirla',
      });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error('Error checking ID:', error);
    return NextResponse.json(
      { error: 'Error checking ID number' },
      { status: 500 }
    );
  }
}
