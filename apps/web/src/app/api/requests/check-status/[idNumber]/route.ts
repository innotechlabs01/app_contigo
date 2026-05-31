import { NextRequest, NextResponse } from 'next/server';
import { getTursoClient } from '@/lib/turso';

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

    const result = await getTursoClient().execute({
      sql: 'SELECT status, rejection_reason FROM requests WHERE id_number = ? LIMIT 1',
      args: [idNumber]
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      );
    }

    const status = result.rows[0][0];
    const rejectionReason = result.rows[0][1];

    return NextResponse.json({
      status,
      rejection_reason: rejectionReason || null
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
