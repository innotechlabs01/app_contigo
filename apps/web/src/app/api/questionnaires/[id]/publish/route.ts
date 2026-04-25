import { NextResponse } from 'next/server';
import type { Questionnaire } from '@/domain/onboarding/questionnaire';

const questionnaires: Map<string, Questionnaire> = new Map();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const q = questionnaires.get(id);

  if (!q) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  const updated: Questionnaire = {
    ...q,
    isPublished: true,
    updatedAt: new Date().toISOString(),
  };

  questionnaires.set(id, updated);
  return NextResponse.json(updated);
}