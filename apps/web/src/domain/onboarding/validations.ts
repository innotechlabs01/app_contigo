import { z } from 'zod';

export const EVALUATION_QUESTION_MIN_SCORE = 80;

export const evaluationSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]));

export const documentSchema = z.object({
  file: z.custom<File>((val) => {
    if (!(val instanceof File)) {
      console.log('Validation failed: not a File instance', val);
      return false;
    }
    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(val.type)) {
      console.log('Validation failed: invalid type', val.type);
      return false;
    }
    if (val.size > 10 * 1024 * 1024) {
      console.log('Validation failed: file too large', val.size);
      return false;
    }
    return true;
  }, {
    message: 'Archivo no válido. Usa PDF, DOC o DOCX menor a 10MB',
  }),
});

export const videoSchema = z.object({
  file: z.any()
    .refine((val) => val instanceof File, {
      message: 'Debe seleccionar un video válido',
    })
    .refine((val) => val instanceof File && ['video/mp4', 'video/quicktime'].includes(val.type), {
      message: 'Formato no permitido. Use MP4 o MOV',
    })
    .refine((val) => val instanceof File && val.size <= 1024 * 1024 * 1024, {
      message: 'El video no debe exceder 1GB',
    }),
});

export const onboardingSchema = z.object({
  evaluation: evaluationSchema.nullable(),
  cv: z.string().url().nullable(),
  videos: z.object({
    presentation: z.string().url().nullable(),
    reference: z.string().url().nullable(),
  }),
});

export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'Mínimo 2 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s'-]+$/, 'Solo letras y espacios'),
  lastName: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'Mínimo 2 caracteres')
    .max(50, 'Máximo 50 caracteres')
    .regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s'-]+$/, 'Solo letras y espacios'),
  idNumber: z
    .string()
    .min(1, 'La cédula es requerida')
    .min(5, 'Mínimo 5 dígitos')
    .max(15, 'Máximo 15 dígitos')
    .regex(/^\d+$/, 'Solo se permiten números')
    .transform((val) => val.replace(/\D/g, '')),
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Correo inválido (ej: usuario@dominio.com)')
    .max(254, 'Correo demasiado largo'),
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .max(20, 'Máximo 20 caracteres')
    .regex(/^[\d\s+\-()]{7,20}$/, 'Ingresa un teléfono válido (solo números y +)'),
  location: z
    .string()
    .min(1, 'La ubicación es requerida'),
  serviceType: z
    .array(z.enum(['Acompañamiento', 'Cuidado', 'Apoyo']))
    .min(1, 'Selecciona al menos un servicio'),
  experience: z
    .string()
    .max(2000, 'Máximo 2000 caracteres')
    .optional()
    .default(''),
  message: z
    .string()
    .max(2000, 'Máximo 2000 caracteres')
    .optional()
    .default(''),
});

export type EvaluationFormData = z.infer<typeof evaluationSchema>;
export type DocumentFormData = z.infer<typeof documentSchema>;
export type VideoFormData = z.infer<typeof videoSchema>;
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;

export function validateStepCompletion(step: string, data: unknown): boolean {
  switch (step) {
    case 'evaluation':
      if (!data || typeof data !== 'object') return false;
      return Object.keys(data as object).length > 0;
    case 'documentation':
      return data !== null && typeof data === 'object' && 'url' in (data as object);
    case 'videos':
      if (!data || typeof data !== 'object') return false;
      const videos = data as { presentation?: { url?: string }; reference?: { url?: string } };
      return !!(videos.presentation?.url && videos.reference?.url);
    case 'review':
      return true;
    default:
      return false;
  }
}