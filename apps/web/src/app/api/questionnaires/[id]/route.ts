import { NextResponse } from 'next/server';
import type { Questionnaire } from '@/domain/onboarding/questionnaire';
import { createStorage } from '@/infrastructure/storage/storage-factory';

const COLLECTION = 'questionnaires';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const storage = createStorage();
  const { id } = await params;
  const q = await storage.getById<Questionnaire>(COLLECTION, id);
  if (!q) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }
  return NextResponse.json(q);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const storage = createStorage();
  const { id } = await params;
  const data = await request.json();
  const existing = await storage.getById<Questionnaire>(COLLECTION, id);

  if (!existing) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  const updated: Questionnaire = {
    ...existing,
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  };

  await storage.set(COLLECTION, id, updated);
  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const storage = createStorage();
  const { id } = await params;
  const deleted = await storage.delete(COLLECTION, id);
  if (!deleted) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}