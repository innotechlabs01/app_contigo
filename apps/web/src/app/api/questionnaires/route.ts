import { NextResponse } from 'next/server';
import { getTursoClient } from '@/lib/turso';
import { isAuthenticated, unauthorized } from '@/lib/auth';
import { sanitizeText, sanitizeName } from '@/lib/sanitize';
import type { Questionnaire } from '@/domain/onboarding/questionnaire';

export async function GET() {
  try {
    const result = await getTursoClient().execute({
      sql: 'SELECT * FROM questionnaires ORDER BY created_at DESC',
      args: []
    });

    const questionnaires = result.rows.map(row => {
      const columns = result.columns;
      const obj: any = {};
      columns.forEach((col, idx) => {
        obj[col] = row[idx];
      });
      
      if (obj.questions && typeof obj.questions === 'string') {
        try {
          obj.questions = JSON.parse(obj.questions);
        } catch {
          obj.questions = [];
        }
      }
      
      obj.isPublished = obj.is_published === 1;
      delete obj.is_published;
      
      return obj as Questionnaire;
    });

    return NextResponse.json(questionnaires);
  } catch (error) {
    console.error('Error fetching questionnaires:', error);
    return NextResponse.json(
      { error: 'Error al obtener cuestionarios' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) return unauthorized();

  try {
    const data = await request.json();
    const now = new Date().toISOString();

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

    const questionnaire: Questionnaire = {
      ...data,
      id: data.id || crypto.randomUUID(),
      name: sanitizeName(data.name, 200),
      description: sanitizeText(data.description || '', 500),
      stepTarget: data.stepTarget || 'evaluation',
      passingScore: data.passingScore,
      isPublished: !!data.isPublished,
      questions: data.questions,
      createdAt: data.createdAt || now,
      updatedAt: now,
    };

    await getTursoClient().execute({
      sql: `INSERT INTO questionnaires (id, name, description, step_target, passing_score, is_published, questions, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        questionnaire.id,
        questionnaire.name,
        questionnaire.description || '',
        questionnaire.stepTarget,
        questionnaire.passingScore,
        questionnaire.isPublished ? 1 : 0,
        JSON.stringify(questionnaire.questions),
        questionnaire.createdAt,
        questionnaire.updatedAt
      ]
    });

    return NextResponse.json(questionnaire, { status: 201 });
  } catch (error) {
    console.error('Error creating questionnaire:', error);
    return NextResponse.json(
      { error: 'Error al crear cuestionario' },
      { status: 500 }
    );
  }
}
