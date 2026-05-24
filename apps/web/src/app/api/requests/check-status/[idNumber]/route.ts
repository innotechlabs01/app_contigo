import { NextRequest, NextResponse } from 'next/server';
import { tursoClient } from '@/lib/turso';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ idNumber: string }> }
) {
  try {
    const { idNumber } = await params;

    if (!idNumber || typeof idNumber !== 'string' || idNumber.length > 15) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      );
    }

    if (!/^\d+$/.test(idNumber)) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      );
    }

    const result = await tursoClient.execute({
      sql: 'SELECT status FROM requests WHERE id_number = ? LIMIT 1',
      args: [idNumber]
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      );
    }

    const status = result.rows[0][0];

    return NextResponse.json({ status });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
