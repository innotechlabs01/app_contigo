import { NextResponse } from 'next/server';
import { getTursoClient } from '@/lib/turso';
import { isAuthenticated, unauthorized } from '@/lib/auth';
import type { Questionnaire } from '@/domain/onboarding/questionnaire';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) return unauthorized();

  try {
    const { id } = await params;

    const existing = await getTursoClient().execute({
      sql: 'SELECT * FROM questionnaires WHERE id = ?',
      args: [id],
    });

    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    }

    const now = new Date().toISOString();

    await getTursoClient().execute({
      sql: 'UPDATE questionnaires SET is_published = 1, updated_at = ? WHERE id = ?',
      args: [now, id],
    });

    const row = existing.rows[0];
    const columns = existing.columns;
    const obj: any = {};
    columns.forEach((col, idx) => {
      obj[col] = row[idx];
    });

    if (obj.questions && typeof obj.questions === 'string') {
      obj.questions = JSON.parse(obj.questions);
    }

    const updated: Questionnaire = {
      ...obj,
      isPublished: true,
      updatedAt: now,
    };
    delete (updated as any).is_published;

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error publishing questionnaire:', error);
    return NextResponse.json(
      { error: 'Error al publicar cuestionario' },
      { status: 500 }
    );
  }
}
