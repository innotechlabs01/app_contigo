'use client';

import { useOnboardingStore } from '@/infrastructure/store/onboarding-store';
import { Stepper } from './stepper';
import { EvaluationStep } from './steps/evaluation-step';
import { DocumentationStep } from './steps/documentation-step';
import { VideosStep } from './steps/videos-step';
import { ReviewStep } from './steps/review-step';
import { Progress } from '@/components/ui/progress';

const steps = [
  { id: 'evaluation', title: 'Evaluación' },
  { id: 'documentation', title: 'Documentos' },
  { id: 'videos', title: 'Videos' },
  { id: 'review', title: 'Revisión' },
];

export function OnboardingContainer() {
  const { stepIndex, status } = useOnboardingStore();

  const renderStep = () => {
    switch (stepIndex) {
      case 0:
        return <EvaluationStep />;
      case 1:
        return <DocumentationStep />;
      case 2:
        return <VideosStep />;
      case 3:
        return <ReviewStep />;
      default:
        return <EvaluationStep />;
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
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <Stepper steps={steps} currentStep={stepIndex} />
      </div>
      
      <div className="mb-6">
        <Progress value={(stepIndex + 1) * 25} />
        <p className="text-sm text-slate-500 mt-2 text-center">
          Paso {stepIndex + 1} de {steps.length}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-soft p-6">
        {renderStep()}
      </div>
    </div>
  );
}