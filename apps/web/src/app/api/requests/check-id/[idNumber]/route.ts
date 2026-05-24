import { NextRequest, NextResponse } from 'next/server';
import { tursoClient } from '@/lib/turso';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ idNumber: string }> }
) {
  try {
    const { idNumber } = await params;

    if (!idNumber || typeof idNumber !== 'string' || idNumber.length > 15) {
      return NextResponse.json({ exists: false });
    }

    if (!/^\d+$/.test(idNumber)) {
      return NextResponse.json({ exists: false });
    }

    const result = await tursoClient.execute({
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
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
