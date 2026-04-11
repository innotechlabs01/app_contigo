'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { evaluationSchema, type EvaluationFormData } from '@/domain/onboarding/validations';
import { useOnboardingStore } from '@/infrastructure/store/onboarding-store';
import { CheckCircle2, Circle } from 'lucide-react';

const questions = [
  { id: 'exp_years', label: '¿Cuántos años de experiencia tienes en cuidado de adultos mayores?', type: 'select', options: ['0-1', '1-3', '3-5', '5+'] },
  { id: 'certified', label: '¿Tienes certificación en primeros auxilios?', type: 'boolean' },
  { id: 'availability', label: '¿Disponibilidad para turnos de 24h?', type: 'boolean' },
  { id: 'languages', label: '¿Hablas más de un idioma?', type: 'boolean' },
  { id: 'transport', label: '¿Tienes transporte propio?', type: 'boolean' },
];

export function EvaluationStep() {
  const [score, setScore] = useState<number | null>(null);
  const { setEvaluation, setStep } = useOnboardingStore();
  
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: EvaluationFormData) => {
    const positiveAnswers = Object.values(data).filter(Boolean).length;
    const calculatedScore = (positiveAnswers / questions.length) * 100;
    setScore(calculatedScore);
    setEvaluation(data);
    
    if (calculatedScore >= 80) {
      setTimeout(() => setStep('documentation', 1), 1500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-primary">Evaluación Inicial</h2>
        <p className="text-slate-600 mt-2">Responde las siguientes preguntas para continuar</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="bg-white p-4 rounded-2xl shadow-soft">
            <label className="block text-base font-medium text-slate-700 mb-3">
              {q.label}
            </label>
            {q.type === 'select' ? (
              <select
                {...register(q.id)}
                className="w-full h-12 px-4 rounded-full border-2 border-slate-200 focus:border-primary focus:outline-none transition-colors"
              >
                <option value="">Selecciona una opción</option>
                {q.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" {...register(q.id)} value="true" className="w-5 h-5 text-primary" />
                  <span>Sí</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" {...register(q.id)} value="false" className="w-5 h-5 text-primary" />
                  <span>No</span>
                </label>
              </div>
            )}
            {errors[q.id] && <p className="text-red-500 text-sm mt-1">Este campo es obligatorio</p>}
          </div>
        ))}

        <Button type="submit" disabled={!isValid} className="w-full">
          Enviar Evaluación
        </Button>
      </form>

      {score !== null && (
        <div className={`p-6 rounded-2xl text-center ${score >= 80 ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex justify-center mb-2">
            {score >= 80 ? <CheckCircle2 className="w-12 h-12 text-green-500" /> : <Circle className="w-12 h-12 text-red-500" />}
          </div>
          <p className="text-2xl font-bold">{score.toFixed(0)}%</p>
          <p className="text-slate-600">{score >= 80 ? '¡Aprobado! Continuando al siguiente paso...' : 'No alcanzaste el puntaje mínimo (80%). Intenta de nuevo.'}</p>
          {score < 80 && (
            <Button onClick={() => setScore(null)} variant="outline" className="mt-4">
              Repetir Evaluación
            </Button>
          )}
        </div>
      )}
    </div>
  );
}