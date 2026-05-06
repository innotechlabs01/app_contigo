import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const dynamic = 'force-dynamic';

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

    console.log('Upload request:', {
      fileName: file instanceof File ? file.name : 'not a file',
      fileType: file instanceof File ? file.type : typeof file,
      fileSize: file instanceof File ? file.size : 'N/A',
      path,
      isVideo: path?.includes('videos'),
      isDocument: path?.includes('documents')
    });

    // Validate that file is actually a File instance
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'El archivo no es válido. Asegúrate de seleccionar un archivo correcto.' },
        { status: 400 }
      );
    }

    // Determine if it's a video or document based on path
    const isVideo = path.includes('videos');
    const isDocument = path.includes('documents');

    if (isVideo) {
      // Video validation: max 1GB, MP4/MOV
      if (file.size > 1024 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'El video excede el tamaño máximo de 1GB' },
          { status: 400 }
        );
      }

      const allowedVideoTypes = ['video/mp4', 'video/quicktime'];
      if (!allowedVideoTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Formato de video no permitido: ${file.type}. Usa MP4 o MOV.` },
          { status: 400 }
        );
      }
    } else if (isDocument) {
      // Document validation: max 10MB, PDF/DOC/DOCX
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'El archivo excede el tamaño máximo de 10MB' },
          { status: 400 }
        );
      }

      const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedDocTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Formato no permitido: ${file.type}. Usa PDF, DOC o DOCX.` },
          { status: 400 }
        );
      }
    }

    const blob = await put(`${path}/${file.name}`, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN!,
    });

    console.log('Upload success:', blob.url);

    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Error al subir archivo' },
      { status: 500 }
    );
  }
}
