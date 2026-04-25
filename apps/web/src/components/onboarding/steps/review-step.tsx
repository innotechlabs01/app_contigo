'use client';

import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/infrastructure/store/onboarding-store';
import { CheckCircle2, FileText, Video, Clock, Award } from 'lucide-react';

export function ReviewStep() {
  const { evaluation, documents, videos, evaluationScore, setStatus } = useOnboardingStore();

  const handleSubmit = () => {
    setStatus('in_review');
  };

  const passed = evaluationScore !== null && evaluationScore >= 80;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-primary">Revisión Final</h2>
        <p className="text-slate-600 mt-2">Verifica que todos los datos estén correctos</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-2xl shadow-soft flex items-center gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-700">Evaluación</p>
            <p className="text-sm text-slate-500">
              {evaluationScore !== null ? `Completada • Score: ${evaluationScore}%` : 'Completada'}
            </p>
          </div>
          {evaluationScore !== null && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {passed ? 'Aprobado' : 'No aprobado'}
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-soft flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-700">Documentación</p>
            <p className="text-sm text-slate-500">{documents.cv?.fileName || 'CV subido'}</p>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full" />
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-soft flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Video className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-700">Videos</p>
            <p className="text-sm text-slate-500">
              {videos.presentation?.url ? 'Present. ✓' : 'Falta'} • {videos.reference?.url ? 'Referencia ✓' : 'Falta'}
            </p>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full" />
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-2xl flex items-start gap-3">
        <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
        <div>
          <p className="font-medium text-amber-800">Tu solicitud está siendo validada</p>
          <p className="text-sm text-amber-700">
            Por favor espera mientras nuestro equipo revisa tu información. El proceso puede tomar hasta 1 hora.
          </p>
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Enviar Solicitud
      </Button>
    </div>
  );
}