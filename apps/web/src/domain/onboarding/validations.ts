import { z } from 'zod';

export const EVALUATION_QUESTION_MIN_SCORE = 80;

export const evaluationSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]));

export const documentSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type),
    { message: 'Formato no permitido. Use PDF, DOC o DOCX' }
  ).refine(
    (file) => file.size <= 10 * 1024 * 1024,
    { message: 'El archivo no debe exceder 10MB' }
  ),
});

export const videoSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => ['video/mp4', 'video/quicktime'].includes(file.type),
    { message: 'Formato no permitido. Use MP4 o MOV' }
  ).refine(
    (file) => file.size <= 1024 * 1024 * 1024,
    { message: 'El video no debe exceder 1GB' }
  ),
});

export const onboardingSchema = z.object({
  evaluation: evaluationSchema.nullable(),
  cv: z.string().url().nullable(),
  videos: z.object({
    presentation: z.string().url().nullable(),
    reference: z.string().url().nullable(),
  }),
});

export type EvaluationFormData = z.infer<typeof evaluationSchema>;
export type DocumentFormData = z.infer<typeof documentSchema>;
export type VideoFormData = z.infer<typeof videoSchema>;
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