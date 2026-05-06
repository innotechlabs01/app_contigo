import { NextRequest, NextResponse } from 'next/server';
import { tursoClient } from '@/lib/turso';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const firstName = formData.get('first_name') as string;
    const lastName = formData.get('last_name') as string;
    const idNumber = formData.get('id_number') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const location = formData.get('location') as string;
    const serviceType = formData.get('service_type') as string;
    const evaluation = formData.get('evaluation') as string;
    const evaluationScore = parseInt(formData.get('evaluation_score') as string);
    const experience = formData.get('experience') as string;
    const message = formData.get('message') as string;

    // Validate required fields
    if (!firstName || !lastName || !idNumber || !email) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Check if ID number already exists
    const existingCheck = await tursoClient.execute({
      sql: 'SELECT id FROM requests WHERE id_number = ? LIMIT 1',
      args: [idNumber]
    });

    if (existingCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'Ya existe una solicitud con esta cédula' },
        { status: 409 }
      );
    }

    // Get file URLs (already uploaded to Vercel Blob)
    let cvUrl = formData.get('cv_url') as string || null;
    let cvFileName = formData.get('cv_file_name') as string || null;
    let presentationVideoUrl = formData.get('presentation_video_url') as string || null;
    let presentationVideoName = formData.get('presentation_video_name') as string || null;
    let referenceVideoUrl = formData.get('reference_video_url') as string || null;
    let referenceVideoName = formData.get('reference_video_name') as string || null;

    // If files are sent as File objects (from onboarding), upload them
    const cvFile = formData.get('cv') as File;
    if (cvFile && cvFile instanceof File) {
      const blob = await put(`documents/cv/${idNumber}/${cvFile.name}`, cvFile, {
        access: 'public',
      });
      cvUrl = blob.url;
      cvFileName = cvFile.name;
    }

    const presentationFile = formData.get('presentation_video') as File;
    if (presentationFile && presentationFile instanceof File) {
      const blob = await put(`videos/presentation/${idNumber}/${presentationFile.name}`, presentationFile, {
        access: 'public',
      });
      presentationVideoUrl = blob.url;
      presentationVideoName = presentationFile.name;
    }

    const referenceFile = formData.get('reference_video') as File;
    if (referenceFile && referenceFile instanceof File) {
      const blob = await put(`videos/reference/${idNumber}/${referenceFile.name}`, referenceFile, {
        access: 'public',
      });
      referenceVideoUrl = blob.url;
      referenceVideoName = referenceFile.name;
    }

    // Insert into TursoDB
    await tursoClient.execute({
      sql: `INSERT INTO requests (
        first_name, last_name, id_number, email, phone, location, service_type,
        evaluation, evaluation_score, evaluation_passed,
        cv_url, cv_file_name,
        presentation_video_url, presentation_video_name,
        reference_video_url, reference_video_name,
        experience, message, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'in_review')`,
      args: [
        firstName, lastName, idNumber, email, phone, location, serviceType,
        evaluation, evaluationScore, evaluationScore >= 80 ? 1 : 0,
        cvUrl, cvFileName,
        presentationVideoUrl, presentationVideoName,
        referenceVideoUrl, referenceVideoName,
        experience, message
      ]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = 'SELECT * FROM requests';
    let args: any[] = [];

    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      args.push(status);
    }

    query += ' ORDER BY application_date DESC';

    const result = await tursoClient.execute({
      sql: query,
      args
    });

    // Convert rows to objects and ensure UTC dates
    const requests = result.rows.map(row => {
      const columns = result.columns;
      const obj: any = {};
      columns.forEach((col, idx) => {
        let value = row[idx];
        // Convert date to UTC string if it's a date field
        if ((col === 'application_date' || col === 'review_date') && value) {
          // Handle bigint from TursoDB
          if (typeof value === 'bigint') {
            value = new Date(Number(value)).toUTCString();
          } else if (typeof value === 'string') {
            value = new Date(value).toUTCString();
          }
        }
        obj[col] = value;
      });
      return obj;
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
