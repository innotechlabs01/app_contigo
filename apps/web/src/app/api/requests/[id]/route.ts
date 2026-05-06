import { NextRequest, NextResponse } from 'next/server';
import { tursoClient } from '@/lib/turso';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['pending', 'in_review', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Estado inválido' },
        { status: 400 }
      );
    }

    await tursoClient.execute({
      sql: `UPDATE requests SET status = ?, review_date = ?, updated_at = ? WHERE id = ?`,
      args: [status, status !== 'pending' ? new Date().toISOString() : null, new Date().toISOString(), id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await tursoClient.execute({
      sql: 'DELETE FROM requests WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
