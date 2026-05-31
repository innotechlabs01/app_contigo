import { NextRequest, NextResponse } from 'next/server';
import { getTursoClient } from '@/lib/turso';
import { isAuthenticated, unauthorized } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) return unauthorized();

  try {
    const { id } = await params;
    const body = await request.json();
    const { status, rejection_reason } = body;

    if (!status || !['pending', 'in_review', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Estado inválido' },
        { status: 400 }
      );
    }

    if (status === 'rejected' && (!rejection_reason || typeof rejection_reason !== 'string' || rejection_reason.trim().length === 0)) {
      return NextResponse.json(
        { error: 'El motivo de rechazo es requerido' },
        { status: 400 }
      );
    }

    await getTursoClient().execute({
      sql: `UPDATE requests SET status = ?, rejection_reason = ?, review_date = ?, updated_at = ? WHERE id = ?`,
      args: [
        status,
        status === 'rejected' ? rejection_reason.trim() : null,
        status !== 'pending' ? new Date().toISOString() : null,
        new Date().toISOString(),
        id
      ]
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
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) return unauthorized();

  try {
    const { id } = await params;

    await getTursoClient().execute({
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
