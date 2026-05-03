import { NextResponse } from 'next/server';
import type { Questionnaire } from '@/domain/onboarding/questionnaire';
import { createStorage } from '@/infrastructure/storage/storage-factory';

const COLLECTION = 'questionnaires';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const storage = createStorage();
  const { id } = await params;
  const q = await storage.getById<Questionnaire>(COLLECTION, id);

  if (!q) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  const updated: Questionnaire = {
    ...q,
    isPublished: true,
    updatedAt: new Date().toISOString(),
  };

  await storage.set(COLLECTION, id, updated);
  return NextResponse.json(updated);
}