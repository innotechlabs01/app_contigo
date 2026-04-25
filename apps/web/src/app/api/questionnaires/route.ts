import { NextResponse } from 'next/server';
import type { Questionnaire } from '@/domain/onboarding/questionnaire';

const questionnaires: Map<string, Questionnaire> = new Map();

export async function GET() {
  const all = Array.from(questionnaires.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const data = await request.json();
  const now = new Date().toISOString();

  const questionnaire: Questionnaire = {
    ...data,
    id: data.id || crypto.randomUUID(),
    createdAt: data.createdAt || now,
    updatedAt: now,
  };

  questionnaires.set(questionnaire.id, questionnaire);
  return NextResponse.json(questionnaire, { status: 201 });
}