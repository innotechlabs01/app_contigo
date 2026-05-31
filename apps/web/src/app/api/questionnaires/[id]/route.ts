import { NextResponse } from 'next/server';
import { getTursoClient } from '@/lib/turso';
import { isAuthenticated, unauthorized } from '@/lib/auth';
import { sanitizeText, sanitizeName } from '@/lib/sanitize';
import type { Questionnaire } from '@/domain/onboarding/questionnaire';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await getTursoClient().execute({
      sql: 'SELECT * FROM questionnaires WHERE id = ?',
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    }

    const row = result.rows[0];
    const columns = result.columns;
    const obj: any = {};
    columns.forEach((col, idx) => {
      obj[col] = row[idx];
    });

    if (obj.questions && typeof obj.questions === 'string') {
      try {
        obj.questions = JSON.parse(obj.questions);
      } catch (e) {
        obj.questions = [];
      }
    }

    obj.isPublished = obj.is_published === 1;
    delete obj.is_published;

    return NextResponse.json(obj as Questionnaire);
  } catch (error) {
    console.error('Error fetching questionnaire:', error);
    return NextResponse.json(
      { error: 'Error al obtener cuestionario' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) return unauthorized();

  try {
    const { id } = await params;
    const data = await request.json();

    const existing = await getTursoClient().execute({
      sql: 'SELECT * FROM questionnaires WHERE id = ?',
      args: [id],
    });

    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    }

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 3) {
      return NextResponse.json(
        { error: 'El nombre debe tener al menos 3 caracteres' },
        { status: 400 }
      );
    }
    if (data.name.length > 200) {
      return NextResponse.json(
        { error: 'El nombre no debe exceder 200 caracteres' },
        { status: 400 }
      );
    }
    if (data.description && data.description.length > 500) {
      return NextResponse.json(
        { error: 'La descripción no debe exceder 500 caracteres' },
        { status: 400 }
      );
    }
    if (typeof data.passingScore !== 'number' || data.passingScore < 0 || data.passingScore > 100 || !Number.isFinite(data.passingScore)) {
      return NextResponse.json(
        { error: 'Puntaje mínimo inválido' },
        { status: 400 }
      );
    }
    if (!Array.isArray(data.questions)) {
      return NextResponse.json(
        { error: 'Las preguntas deben ser un arreglo' },
        { status: 400 }
      );
    }
    for (const q of data.questions) {
      if (typeof q.text !== 'string' || q.text.trim().length < 5) {
        return NextResponse.json(
          { error: 'Cada pregunta debe tener al menos 5 caracteres' },
          { status: 400 }
        );
      }
      if (q.text.length > 500) {
        return NextResponse.json(
          { error: 'Cada pregunta no debe exceder 500 caracteres' },
          { status: 400 }
        );
      }
      if (Array.isArray(q.answers)) {
        for (const a of q.answers) {
          if (typeof a.text !== 'string' || !a.text.trim()) {
            return NextResponse.json(
              { error: 'Cada respuesta debe tener texto' },
              { status: 400 }
            );
          }
          if (a.text.length > 200) {
            return NextResponse.json(
              { error: 'Cada respuesta no debe exceder 200 caracteres' },
              { status: 400 }
            );
          }
          if (typeof a.score !== 'number' || a.score < 0 || a.score > 10 || !Number.isFinite(a.score)) {
            return NextResponse.json(
              { error: 'Cada respuesta debe tener un puntaje entre 0 y 10' },
              { status: 400 }
            );
          }
        }
      }
    }

    const now = new Date().toISOString();

    await getTursoClient().execute({
      sql: `UPDATE questionnaires SET
        name = ?, description = ?, step_target = ?, passing_score = ?,
        is_published = ?, questions = ?, updated_at = ?
        WHERE id = ?`,
      args: [
        sanitizeName(data.name, 200),
        sanitizeText(data.description || '', 500),
        data.stepTarget || 'evaluation',
        data.passingScore,
        data.isPublished ? 1 : 0,
        JSON.stringify(data.questions),
        now,
        id,
      ],
    });

    const updated: Questionnaire = {
      ...data,
      id,
      name: sanitizeName(data.name, 200),
      description: sanitizeText(data.description || '', 500),
      updatedAt: now,
    };

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating questionnaire:', error);
    return NextResponse.json(
      { error: 'Error al actualizar cuestionario' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) return unauthorized();

  try {
    const { id } = await params;

    const existing = await getTursoClient().execute({
      sql: 'SELECT id FROM questionnaires WHERE id = ?',
      args: [id],
    });

    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    }

    await getTursoClient().execute({
      sql: 'DELETE FROM questionnaires WHERE id = ?',
      args: [id],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting questionnaire:', error);
    return NextResponse.json(
      { error: 'Error al eliminar cuestionario' },
      { status: 500 }
    );
  }
}
