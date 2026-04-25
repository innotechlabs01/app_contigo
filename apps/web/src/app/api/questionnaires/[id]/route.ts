import { NextResponse } from 'next/server';
import type { Questionnaire } from '@/domain/onboarding/questionnaire';

const questionnaires: Map<string, Questionnaire> = new Map();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const q = questionnaires.get(id);
  if (!q) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }
  return NextResponse.json(q);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await request.json();
  const existing = questionnaires.get(id);

  if (!existing) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }

  const updated: Questionnaire = {
    ...existing,
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  };

  questionnaires.set(id, updated);
  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = questionnaires.delete(id);
  if (!deleted) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}