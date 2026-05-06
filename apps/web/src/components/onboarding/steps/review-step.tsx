'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/infrastructure/store/onboarding-store';
import { CheckCircle2, FileText, Video, Clock, Award } from 'lucide-react';

export function ReviewStep() {
  const { evaluation, documents, videos, evaluationScore, personalInfo, setStatus, setRequestIdNumber } = useOnboardingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!personalInfo) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Calculate evaluation score if not already calculated
      let finalScore = evaluationScore;
      if (finalScore === null && evaluation) {
        // Import and calculate
        const { calculateEvaluationResult } = await import('@/domain/onboarding/evaluation-questions');
        const result = calculateEvaluationResult(evaluation as Record<number, number>);
        finalScore = result.globalScore;
      }

      console.log('Submitting with score:', finalScore);

      // Create FormData to send to API
      const formData = new FormData();
      formData.append('first_name', personalInfo.firstName);
      formData.append('last_name', personalInfo.lastName);
      formData.append('id_number', personalInfo.idNumber);
      formData.append('email', personalInfo.email);
      formData.append('phone', personalInfo.phone);
      formData.append('location', personalInfo.location);
      formData.append('service_type', personalInfo.serviceType);
      formData.append('evaluation', JSON.stringify(evaluation));
      formData.append('evaluation_score', (finalScore || 0).toString());
      formData.append('experience', personalInfo.experience || '');
      formData.append('message', personalInfo.message || '');

      // Append file URLs directly (already uploaded to Vercel Blob)
      if (documents.cv?.url) {
        formData.append('cv_url', documents.cv.url);
        formData.append('cv_file_name', documents.cv.fileName || 'cv');
      }

      if (videos.presentation?.url) {
        formData.append('presentation_video_url', videos.presentation.url);
        formData.append('presentation_video_name', videos.presentation.fileName || '');
      }

      if (videos.reference?.url) {
        formData.append('reference_video_url', videos.reference.url);
        formData.append('reference_video_name', videos.reference.fileName || '');
      }

      console.log('Submitting form data...');

      const res = await fetch('/api/requests', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.error || 'Error al enviar la solicitud.');
        return;
      }

      setStatus('in_review');
      setRequestIdNumber(personalInfo?.idNumber || null);
    } catch (error: any) {
      console.error('Submit error:', error);
      setSubmitError(error.message || 'Error interno. Intenta más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passed = evaluationScore !== null && evaluationScore >= 80;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-primary">Revisión Final</h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2">Verifica que todos los datos estén correctos</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* Personal Information */}
        {personalInfo && (
          <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-soft">
            <h3 className="font-medium text-sm sm:text-base text-slate-700 mb-2">Información Personal</h3>
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              <p><strong>Nombre:</strong> {personalInfo.firstName} {personalInfo.lastName}</p>
              <p><strong>Cédula:</strong> {personalInfo.idNumber}</p>
              <p><strong>Email:</strong> {personalInfo.email}</p>
              <p><strong>Teléfono:</strong> {personalInfo.phone}</p>
              <p><strong>Ubicación:</strong> {personalInfo.location}</p>
              <p><strong>Servicio:</strong> {personalInfo.serviceType}</p>
            </div>
          </div>
        )}

        {/* <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-soft flex items-center gap-3 sm:gap-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm sm:text-base text-slate-700">Evaluación</p>
            <p className="text-xs sm:text-sm text-slate-500 truncate">
              {evaluationScore !== null ? `Completada • Score: ${evaluationScore}%` : 'Completada'}
            </p>
          </div>
          {evaluationScore !== null && (
            <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
              {passed ? 'Aprobado' : 'No aprobado'}
            </div>
          )}
        </div> */}

        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-soft flex items-center gap-3 sm:gap-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm sm:text-base text-slate-700">Documentación</p>
            <p className="text-xs sm:text-sm text-slate-500 truncate">{documents.cv?.fileName || 'CV subido'}</p>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-soft flex items-center gap-3 sm:gap-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Video className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm sm:text-base text-slate-700">Videos</p>
            <p className="text-xs sm:text-sm text-slate-500">
              {videos.presentation?.url ? 'Present. ✓' : 'Falta'} • {videos.reference?.url ? 'Referencia ✓' : 'Falta'}
            </p>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
        </div>
      </div>

      {submitError && (
        <div className="bg-red-50 p-3 sm:p-4 rounded-xl text-red-700 text-sm">
          {submitError}
        </div>
      )}

      {!isSubmitting && (
        <div className="bg-amber-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-start gap-2 sm:gap-3">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm sm:text-base text-amber-800">Al enviar tu solicitud</p>
            <p className="text-xs sm:text-sm text-amber-700">
              Tu información será revisada en un tiempo de 24 a 48 horas por nuestro equipo. Te contactaremos pronto.
            </p>
          </div>
        </div>
      )}

      <Button onClick={handleSubmit} className="w-full text-sm sm:text-base py-2 sm:py-3" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
      </Button>
    </div>
  );
}