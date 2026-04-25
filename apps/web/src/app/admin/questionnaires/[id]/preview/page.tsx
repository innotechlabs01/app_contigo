'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuestionnaireStore } from '@/infrastructure/store/questionnaire-store';
import { Questionnaire, shuffleArray, type QuestionType } from '@/domain/onboarding/questionnaire';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

export default function QuestionnairePreviewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { fetchQuestionnaire, currentQuestionnaire, isLoading } = useQuestionnaireStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);

  useEffect(() => {
    if (currentQuestionnaire && currentQuestionnaire.id === id) {
      return;
    }
    if (id) {
      fetchQuestionnaire(id);
    }
  }, [id, currentQuestionnaire, fetchQuestionnaire]);

  const questions = useMemo(() => {
    if (!currentQuestionnaire?.questions) return [];
    return currentQuestionnaire.questions
      .filter((q) => q.isActive !== false)
      .sort((a, b) => a.order - b.order);
  }, [currentQuestionnaire]);

  const shuffledQuestions = useMemo(() => {
    return questions.map((q) => ({
      ...q,
      answers: shuffleArray(q.answers),
    }));
  }, [questions]);

  const totalPages = Math.ceil(shuffledQuestions.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentQuestions = shuffledQuestions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSelectAnswer = (questionId: string, answerId: string, questionType: 'single-choice' | 'multiple-choice') => {
    setSelectedAnswers((prev) => {
      const current = prev[questionId] || [];
      if (questionType === 'single-choice') {
        return { ...prev, [questionId]: [answerId] };
      }
      if (current.includes(answerId)) {
        return { ...prev, [questionId]: current.filter((id) => id !== answerId) };
      }
      return { ...prev, [questionId]: [...current, answerId] };
    });
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    if (!currentQuestionnaire) return { score: 0, passed: false };
    let total = 0;
    const maxScore = questions.reduce((sum, q) => {
      const perQuestionMax = q.type === 'multiple-choice'
        ? q.answers.reduce((s, a) => s + a.score, 0)
        : Math.max(...q.answers.map((a) => a.score));
      return sum + perQuestionMax;
    }, 0);

    questions.forEach((q) => {
      const selected = selectedAnswers[q.id] || [];
      selected.forEach((answerId) => {
        const answer = q.answers.find((a) => a.id === answerId);
        if (answer) total += answer.score;
      });
    });

    const percentage = maxScore > 0 ? (total / maxScore) * 100 : 0;
    return {
      score: Math.round(percentage),
      passed: percentage >= currentQuestionnaire.passingScore,
    };
  };

  const handleSubmit = () => {
    const { score, passed } = calculateScore();
    setResult({ score, passed });
  };

  const isCurrentPageComplete = currentQuestions.every((q) => {
    const selected = selectedAnswers[q.id] || [];
    return selected.length > 0;
  });
  const isAllComplete = questions.every((q) => {
    const selected = selectedAnswers[q.id] || [];
    return selected.length > 0;
  });

  if (isLoading || !currentQuestionnaire) {
    return <div className="container mx-auto py-8">Cargando...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <button
        onClick={() => router.push('/admin/questionnaires')}
        className="flex items-center text-slate-500 hover:text-primary mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a cuestionarios
      </button>

      <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
        <h1 className="text-2xl font-bold text-primary">{currentQuestionnaire.name}</h1>
        {currentQuestionnaire.description && (
          <p className="text-slate-600 mt-1">{currentQuestionnaire.description}</p>
        )}
        <p className="text-sm text-slate-500 mt-2">
          {questions.length} preguntas · Puntaje mínimo: {currentQuestionnaire.passingScore}%
        </p>
      </div>

      {!result ? (
        <>
          <Progress
            value={((currentPage + 1) / totalPages) * 100}
            className="h-2 mb-2"
          />
          <p className="text-center text-sm text-slate-500 mb-4">
            Pregunta {startIndex + 1} - {startIndex + currentQuestions.length} de {questions.length}
          </p>

          <div className="space-y-4">
            {currentQuestions.map((q) => (
              <div key={q.id} className="bg-white p-4 rounded-2xl shadow-soft">
                <p className="font-medium text-slate-700 mb-3">
                  {q.text}
                  {q.pillar && (
                    <span className="text-xs text-slate-400 block mt-1">Pilar: {q.pillar}</span>
                  )}
                </p>
                <div className="space-y-2">
                  {q.answers.map((answer) => {
                    const questionType = q.type || 'single-choice';
                    const isSelected = (selectedAnswers[q.id] || []).includes(answer.id);
                    return (
                      <button
                        key={answer.id}
                        type="button"
                        onClick={() => handleSelectAnswer(q.id, answer.id, questionType)}
                        className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary-50'
                            : 'border-slate-200 hover:border-primary-200'
                        }`}
                      >
                        <span className="text-slate-700">{answer.text}</span>
                        {questionType === 'multiple-choice' && isSelected && (
                          <span className="ml-2 text-primary">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className="flex-1"
            >
              Anterior
            </Button>
            {currentPage < totalPages - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!isCurrentPageComplete}
                className="flex-1"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isAllComplete}
                className="flex-1"
              >
                Finalizar
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className={`p-6 rounded-2xl text-center border-2 ${
          result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex justify-center mb-4">
            {result.passed ? (
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500" />
            )}
          </div>
          <p className="text-3xl font-bold mb-2">{result.score}%</p>
          <p className="text-lg font-semibold mb-2">
            {result.passed ? 'Aprobado' : 'No aprobado'}
          </p>
          <p className="text-slate-600 text-sm">
            Puntaje mínimo requerido: {currentQuestionnaire.passingScore}%
          </p>
          <Button
             onClick={() => {
               setResult(null);
               setSelectedAnswers({});
               setCurrentPage(0);
             }}
            variant="outline"
            className="mt-4"
          >
            Repetir Cuestionario
          </Button>
        </div>
      )}
    </div>
  );
}