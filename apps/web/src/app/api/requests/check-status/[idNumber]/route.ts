import { NextRequest, NextResponse } from 'next/server';
import { tursoClient } from '@/lib/turso';

export async function GET(request: NextRequest, { params }: { params: { idNumber: string } }) {
  try {
    const { idNumber } = params;

    const result = await tursoClient.execute({
      sql: 'SELECT status FROM requests WHERE id_number = ? LIMIT 1',
      args: [idNumber]
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    const status = result.rows[0][0]; // First column is status

    return NextResponse.json({ status });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
