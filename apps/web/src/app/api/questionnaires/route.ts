import { NextResponse } from 'next/server';
import type { Questionnaire } from '@/domain/onboarding/questionnaire';
import { createStorage } from '@/infrastructure/storage/storage-factory';

const COLLECTION = 'questionnaires';

export async function GET() {
  const storage = createStorage();
  const all = await storage.getAll<Questionnaire>(COLLECTION);
  const sorted = all.sort(
    (a: Questionnaire, b: Questionnaire) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(sorted);
}

export async function POST(request: Request) {
  const storage = createStorage();
  const data = await request.json();
  const now = new Date().toISOString();

  const questionnaire: Questionnaire = {
    ...data,
    id: data.id || crypto.randomUUID(),
    createdAt: data.createdAt || now,
    updatedAt: now,
  };

  await storage.set(COLLECTION, questionnaire.id, questionnaire);
  return NextResponse.json(questionnaire, { status: 201 });
}