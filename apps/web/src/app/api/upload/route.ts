import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const dynamic = 'force-dynamic';

const ALLOWED_PATHS = ['documents/cv', 'videos/presentation', 'videos/reference'];

function sanitizePath(path: string): string | null {
  const normalized = path.replace(/\.\.\//g, '').replace(/\.\./g, '').replace(/^\/+|\/+$/g, '');
  const isValid = ALLOWED_PATHS.some((allowed) => normalized.startsWith(allowed));
  if (!isValid) return null;
  return normalized;
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 200);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const path = formData.get('path') as string;

    if (!file || !path) {
      return NextResponse.json(
        { error: 'Archivo o ruta no proporcionados' },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'El archivo no es válido' },
        { status: 400 }
      );
    }

    const safePath = sanitizePath(path);
    if (!safePath) {
      return NextResponse.json(
        { error: 'Ruta no permitida' },
        { status: 400 }
      );
    }

    const safeName = sanitizeFileName(file.name);

    const isVideo = safePath.includes('videos');
    const isDocument = safePath.includes('documents');

    if (isVideo) {
      if (file.size > 1024 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'El video excede el tamaño máximo de 1GB' },
          { status: 400 }
        );
      }

      const allowedVideoTypes = ['video/mp4', 'video/quicktime'];
      if (!allowedVideoTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Formato de video no permitido. Usa MP4 o MOV.` },
          { status: 400 }
        );
      }
    } else if (isDocument) {
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'El archivo excede el tamaño máximo de 10MB' },
          { status: 400 }
        );
      }

      const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedDocTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Formato no permitido. Usa PDF, DOC o DOCX.' },
          { status: 400 }
        );
      }
    }

    const blob = await put(`${safePath}/${safeName}`, file, {
      access: 'public',
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error al subir archivo' },
      { status: 500 }
    );
  }
}
