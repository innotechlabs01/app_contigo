'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/infrastructure/store/onboarding-store';
import { Stepper } from './stepper';
import { EvaluationStep } from './steps/evaluation-step';
import { DocumentationStep } from './steps/documentation-step';
import { VideosStep } from './steps/videos-step';
import { PersonalInfoStep } from './steps/personal-info-step';
import { ReviewStep } from './steps/review-step';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const steps = [
  { id: 'personal', title: 'Datos' },
  { id: 'evaluation', title: 'Evaluación' },
  { id: 'documentation', title: 'Documentos' },
  { id: 'videos', title: 'Videos' },
  { id: 'review', title: 'Revisión' },
];

export function OnboardingContainer() {
  const { stepIndex, status, reset, requestIdNumber, setStatus } = useOnboardingStore();
  const router = useRouter();
  const [showExitModal, setShowExitModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Polling for status updates when in review
  useEffect(() => {
    if (status === 'in_review' && requestIdNumber) {
      const pollStatus = async () => {
        try {
          const res = await fetch(`/api/requests/check-status/${requestIdNumber}`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === 'approved' || data.status === 'rejected') {
              setStatus(data.status);
              if (data.status === 'rejected' && data.rejection_reason) {
                setRejectionReason(data.rejection_reason);
              }
              // Stop polling
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
              }
            }
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      };

      // Poll immediately
      pollStatus();

      // Then poll every 30 seconds
      pollingIntervalRef.current = setInterval(pollStatus, 30000);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [status, requestIdNumber, setStatus]);

  const handleExit = () => {
    reset();
    router.push('/');
  };

  const renderStep = () => {
    switch (stepIndex) {
      case 0:
        return <PersonalInfoStep />;
      case 1:
        return <EvaluationStep />;
      case 2:
        return <DocumentationStep />;
      case 3:
        return <VideosStep />;
      case 4:
        return <ReviewStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  if (status === 'in_review') {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="bg-white rounded-3xl shadow-soft p-8">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">⏳</span>
          </div>
          <h2 className="text-2xl font-semibold text-slate-800">En Revisión</h2>
          <p className="text-slate-600 mt-2">Tu solicitud está siendo evaluada por nuestro equipo</p>
          <p className="text-sm text-slate-500 mt-4">Te notificaremos cuando haya una actualización. Esta página se actualiza automáticamente.</p>
        </div>
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="bg-white rounded-3xl shadow-soft p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800">¡Bienvenido a Contigo!</h2>
          <p className="text-slate-600 mt-2">En 24 a 48 horas recibirás un correo con tus accesos y la aplicación para que comiences a trabajar con nosotros.</p>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="bg-white rounded-3xl shadow-soft p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800">No apto</h2>
          <p className="text-slate-600 mt-2">
            {rejectionReason || 'En este momento no cumples con la totalidad del perfil requerido para participar en la APP'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 px-3 sm:px-4 relative">
      <div className="text-center mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Únete a Contigo</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">Completa el proceso de registro para convertirte en Compañero</p>
      </div>
      <div className="absolute top-0 right-2 sm:right-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowExitModal(true)}
          className="rounded-full hover:bg-slate-100 w-8 h-8 sm:w-10 sm:h-10"
          aria-label="Salir del proceso"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>

      <div className="mb-6 sm:mb-8">
        <Stepper steps={steps} currentStep={stepIndex} />
      </div>

      <div className="mb-4 sm:mb-6">
        <Progress value={(stepIndex + 1) * 20} />
        <p className="text-xs sm:text-sm text-slate-500 mt-2 text-center">
          Paso {stepIndex + 1} de {steps.length}: {steps[stepIndex]?.title}
        </p>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-soft p-4 sm:p-6">
        {renderStep()}
      </div>

      {showExitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">¿Deseas salir del proceso?</h3>
              <p className="text-slate-600 mt-2">
                Si sales ahora, perderás el progreso del onboarding. Podrás continuar más tarde desde tu dashboard.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowExitModal(false)}
                className="flex-1"
              >
                Continuar
              </Button>
              <Button
                variant="destructive"
                onClick={handleExit}
                className="flex-1"
              >
                Salir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}