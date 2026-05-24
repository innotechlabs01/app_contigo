import { NextRequest, NextResponse } from 'next/server';
import { tursoClient } from '@/lib/turso';
import { put } from '@vercel/blob';
import { isAuthenticated, unauthorized } from '@/lib/auth';
import { sanitizeText, sanitizeName, sanitizeEmail, sanitizePhone, sanitizeIdNumber, sanitizeFileName } from '@/lib/sanitize';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PHONE_REGEX = /^[\d\s+\-()]{7,20}$/;
const ID_REGEX = /^\d+$/;

function calculateScore(evaluation: Record<string, number>): number {
  if (!evaluation || Object.keys(evaluation).length === 0) return 0;
  const values = Object.values(evaluation);
  const totalScore = values.reduce((sum, s) => sum + s, 0);
  const maxPossible = values.length * 5;
  return maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
}

interface ValidationError {
  field: string;
  message: string;
}

function validateField(value: unknown, rules: { required?: boolean; pattern?: RegExp; minLength?: number; maxLength?: number; allowedValues?: readonly string[]; message: string }): string | null {
  const str = typeof value === 'string' ? value.trim() : '';
  if (rules.required && !str) return rules.message;
  if (str && rules.minLength && str.length < rules.minLength) return rules.message;
  if (str && rules.maxLength && str.length > rules.maxLength) return rules.message;
  if (str && rules.pattern && !rules.pattern.test(str)) return rules.message;
  if (str && rules.allowedValues && !rules.allowedValues.includes(str)) return rules.message;
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const firstName = (formData.get('first_name') as string) || '';
    const lastName = (formData.get('last_name') as string) || '';
    const idNumber = (formData.get('id_number') as string) || '';
    const email = (formData.get('email') as string) || '';
    const phone = (formData.get('phone') as string) || '';
    const location = (formData.get('location') as string) || '';
    const serviceType = (formData.get('service_type') as string) || '';
    const evaluationRaw = formData.get('evaluation') as string;
    const experience = (formData.get('experience') as string) || '';
    const message = (formData.get('message') as string) || '';

    const serviceTypes = ['Acompañamiento', 'Cuidado', 'Apoyo'];
    const locations = [
      'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá',
      'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
      'Cundinamarca', 'Córdoba', 'Guainía', 'Guaviare', 'Huila', 'La Guajira',
      'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío',
      'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
      'Valle del Cauca', 'Vaupés', 'Vichada',
      'Bogotá D.C.',
    ];

    const errors: ValidationError[] = [];

    const nameErr = validateField(firstName, { required: true, minLength: 2, maxLength: 50, pattern: /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s'-]+$/, message: 'Nombre inválido' });
    if (nameErr) errors.push({ field: 'first_name', message: nameErr });

    const lastNameErr = validateField(lastName, { required: true, minLength: 2, maxLength: 50, pattern: /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s'-]+$/, message: 'Apellido inválido' });
    if (lastNameErr) errors.push({ field: 'last_name', message: lastNameErr });

    const idErr = validateField(idNumber, { required: true, pattern: ID_REGEX, minLength: 5, maxLength: 15, message: 'Cédula inválida' });
    if (idErr) errors.push({ field: 'id_number', message: idErr });

    const emailErr = validateField(email, { required: true, maxLength: 254, pattern: EMAIL_REGEX, message: 'Correo electrónico inválido' });
    if (emailErr) errors.push({ field: 'email', message: emailErr });

    const phoneErr = validateField(phone, { required: true, pattern: PHONE_REGEX, message: 'Teléfono inválido' });
    if (phoneErr) errors.push({ field: 'phone', message: phoneErr });

    const locationErr = validateField(location, { required: true, allowedValues: locations as readonly string[], message: 'Ubicación inválida' });
    if (locationErr) errors.push({ field: 'location', message: locationErr });

    const serviceErr = validateField(serviceType, { required: true, allowedValues: serviceTypes as readonly string[], message: 'Tipo de servicio inválido' });
    if (serviceErr) errors.push({ field: 'service_type', message: serviceErr });

    const expErr = validateField(experience, { maxLength: 2000, message: 'Experiencia demasiado larga' });
    if (expErr) errors.push({ field: 'experience', message: expErr });

    const msgErr = validateField(message, { maxLength: 2000, message: 'Mensaje demasiado largo' });
    if (msgErr) errors.push({ field: 'message', message: msgErr });

    if (evaluationRaw) {
      try {
        const parsed = JSON.parse(evaluationRaw);
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
          errors.push({ field: 'evaluation', message: 'Evaluación inválida' });
        } else {
          for (const [key, val] of Object.entries(parsed)) {
            if (typeof key !== 'string' || key.length > 100) {
              errors.push({ field: 'evaluation', message: 'Clave de evaluación inválida' });
              break;
            }
            if (typeof val !== 'number' || val < 0 || val > 10 || !Number.isFinite(val)) {
              errors.push({ field: 'evaluation', message: `Valor de evaluación inválido para la pregunta ${key}` });
              break;
            }
          }
        }
      } catch {
        errors.push({ field: 'evaluation', message: 'Formato de evaluación inválido' });
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Sanitize all text fields
    const sanitizedFirstName = sanitizeName(firstName);
    const sanitizedLastName = sanitizeName(lastName);
    const sanitizedIdNumber = sanitizeIdNumber(idNumber);
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedPhone = sanitizePhone(phone);
    const sanitizedExperience = sanitizeText(experience, 2000);
    const sanitizedMessage = sanitizeText(message, 2000);

    // Check duplicate using sanitized idNumber to prevent directory traversal via idNumber
    const existingCheck = await tursoClient.execute({
      sql: 'SELECT id FROM requests WHERE id_number = ? LIMIT 1',
      args: [sanitizedIdNumber],
    });

    if (existingCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'Ya existe una solicitud con esta cédula' },
        { status: 409 }
      );
    }

    let evaluationScore = 0;
    let evaluationPassed = false;
    if (evaluationRaw) {
      try {
        const parsed = JSON.parse(evaluationRaw);
        evaluationScore = calculateScore(parsed);
        evaluationPassed = evaluationScore >= 80;
      } catch {
        // already validated above
      }
    }

    let cvUrl = formData.get('cv_url') as string || null;
    let cvFileName = formData.get('cv_file_name') as string || null;
    let presentationVideoUrl = formData.get('presentation_video_url') as string || null;
    let presentationVideoName = formData.get('presentation_video_name') as string || null;
    let referenceVideoUrl = formData.get('reference_video_url') as string || null;
    let referenceVideoName = formData.get('reference_video_name') as string || null;

    const cvFile = formData.get('cv') as File;
    if (cvFile && cvFile instanceof File) {
      const safeName = sanitizeFileName(cvFile.name);
      const blob = await put(`documents/cv/${sanitizedIdNumber}/${safeName}`, cvFile, {
        access: 'public',
      });
      cvUrl = blob.url;
      cvFileName = cvFile.name;
    }

    const presentationFile = formData.get('presentation_video') as File;
    if (presentationFile && presentationFile instanceof File) {
      const safeName = sanitizeFileName(presentationFile.name);
      const blob = await put(`videos/presentation/${sanitizedIdNumber}/${safeName}`, presentationFile, {
        access: 'public',
      });
      presentationVideoUrl = blob.url;
      presentationVideoName = presentationFile.name;
    }

    const referenceFile = formData.get('reference_video') as File;
    if (referenceFile && referenceFile instanceof File) {
      const safeName = sanitizeFileName(referenceFile.name);
      const blob = await put(`videos/reference/${sanitizedIdNumber}/${safeName}`, referenceFile, {
        access: 'public',
      });
      referenceVideoUrl = blob.url;
      referenceVideoName = referenceFile.name;
    }

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
        sanitizedFirstName, sanitizedLastName, sanitizedIdNumber, sanitizedEmail, sanitizedPhone, location, serviceType,
        evaluationRaw, evaluationScore, evaluationPassed ? 1 : 0,
        cvUrl, cvFileName,
        presentationVideoUrl, presentationVideoName,
        referenceVideoUrl, referenceVideoName,
        sanitizedExperience, sanitizedMessage,
      ],
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
  const authed = await isAuthenticated();
  if (!authed) return unauthorized();

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
      args,
    });

    const requests = result.rows.map(row => {
      const columns = result.columns;
      const obj: any = {};
      columns.forEach((col, idx) => {
        let value = row[idx];
        if ((col === 'application_date' || col === 'review_date') && value) {
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
