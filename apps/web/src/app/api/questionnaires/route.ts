import { NextResponse } from 'next/server';
import { tursoClient } from '@/lib/turso';
import type { Questionnaire } from '@/domain/onboarding/questionnaire';

export async function GET() {
  try {
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM questionnaires ORDER BY created_at DESC',
      args: []
    });

    // Convert rows to objects
    const questionnaires = result.rows.map(row => {
      const columns = result.columns;
      const obj: any = {};
      columns.forEach((col, idx) => {
        obj[col] = row[idx];
      });
      
      // Parse JSON fields
      if (obj.questions && typeof obj.questions === 'string') {
        try {
          obj.questions = JSON.parse(obj.questions);
        } catch (e) {
          obj.questions = [];
        }
      }
      
      // Convert integer booleans
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
  try {
    const data = await request.json();
    const now = new Date().toISOString();
    
    const questionnaire: Questionnaire = {
      ...data,
      id: data.id || crypto.randomUUID(),
      createdAt: data.createdAt || now,
      updatedAt: now,
    };

    await tursoClient.execute({
      sql: `INSERT INTO questionnaires (id, name, description, step_target, passing_score, is_published, questions, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        questionnaire.id,
        questionnaire.name,
        questionnaire.description || '',
        questionnaire.stepTarget,
        questionnaire.passingScore || 80,
        questionnaire.isPublished ? 1 : 0,
        JSON.stringify(questionnaire.questions || []),
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
