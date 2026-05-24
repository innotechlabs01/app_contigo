'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuestionnaireStore } from '@/infrastructure/store/questionnaire-store';
import { Questionnaire, shuffleArray, type QuestionType } from '@/domain/onboarding/questionnaire';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft, CheckCircle2, XCircle, ChevronRight, ChevronLeft, FileText
} from 'lucide-react';

const ITEMS_PER_PAGE = 5;

export default function QuestionnairePreviewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { fetchQuestionnaire, currentQuestionnaire, isLoading } = useQuestionnaireStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [animatingResult, setAnimatingResult] = useState(false);

  useEffect(() => {
    if (currentQuestionnaire && currentQuestionnaire.id === id) return;
    if (id) fetchQuestionnaire(id);
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

  const handleSelectAnswer = (questionId: string, answerId: string, questionType: QuestionType) => {
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
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo(0, 0);
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
    setAnimatingResult(true);
    setTimeout(() => setAnimatingResult(false), 800);
  };

  const isCurrentPageComplete = currentQuestions.every((q) => {
    const selected = selectedAnswers[q.id] || [];
    return selected.length > 0;
  });
  const isAllComplete = questions.every((q) => {
    const selected = selectedAnswers[q.id] || [];
    return selected.length > 0;
  });

  const answeredCount = Object.keys(selectedAnswers).length;

  if (isLoading || !currentQuestionnaire) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#00668A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Cargando cuestionario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.push('/admin/questionnaires')}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#00668A] transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Volver a cuestionarios
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#87CEEB] to-[#00668A] flex items-center justify-center shadow-lg shadow-[#00668A]/20 shrink-0">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800">{currentQuestionnaire.name}</h1>
            {currentQuestionnaire.description && (
              <p className="text-sm text-slate-500 mt-1">{currentQuestionnaire.description}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
              <span>{questions.length} preguntas</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>Puntaje mínimo: {currentQuestionnaire.passingScore}%</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>{totalPages} página{totalPages > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {!result ? (
        <>
          {/* Progress */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">Progreso</span>
                <span className="text-xs text-slate-400">
                  {answeredCount}/{questions.length} respondidas
                </span>
              </div>
              <span className="text-xs font-medium text-[#00668A]">
                Página {currentPage + 1} de {totalPages}
              </span>
            </div>
            <div className="relative">
              <Progress
                value={((currentPage + 1) / totalPages) * 100}
                className="h-2.5"
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-slate-400">Pregunta {startIndex + 1}</span>
                <span className="text-[10px] text-slate-400">Pregunta {Math.min(startIndex + ITEMS_PER_PAGE, questions.length)}</span>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4 mb-6">
            {currentQuestions.map((q) => (
              <div key={q.id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <span className="w-7 h-7 rounded-lg bg-[#00668A]/10 text-[#00668A] flex items-center justify-center text-xs font-bold shrink-0">
                    {questions.indexOf(q) + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-slate-700">{q.text}</p>
                    {q.pillar && (
                      <span className="inline-block mt-1 text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                        Pilar: {q.pillar}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  {q.answers.map((answer) => {
                    const questionType = q.type || 'single-choice';
                    const isSelected = (selectedAnswers[q.id] || []).includes(answer.id);
                    return (
                      <button
                        key={answer.id}
                        type="button"
                        onClick={() => handleSelectAnswer(q.id, answer.id, questionType)}
                        className={`w-full text-left p-3.5 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-[#00668A] bg-[#00668A]/5 shadow-sm'
                            : 'border-slate-200 hover:border-[#87CEEB] hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${isSelected ? 'text-[#00668A] font-medium' : 'text-slate-600'}`}>
                            {answer.text}
                          </span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-[#00668A] flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </Button>
            {currentPage < totalPages - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!isCurrentPageComplete}
                className="flex-1"
              >
                Siguiente
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isAllComplete}
                className="flex-1"
              >
                Finalizar Evaluación
              </Button>
            )}
          </div>

          {/* Page indicator dots */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-1.5 mt-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentPage ? 'bg-[#00668A] w-6' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className={`bg-white rounded-2xl border-2 p-8 text-center ${
          result.passed ? 'border-emerald-200' : 'border-red-200'
        } ${animatingResult ? 'scale-[1.02]' : 'scale-100'} transition-transform duration-300`}>
          {/* Score Circle */}
          <div className={`w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center ${
            result.passed ? 'bg-gradient-to-br from-emerald-400 to-green-500' : 'bg-gradient-to-br from-red-400 to-rose-500'
          } shadow-lg ${result.passed ? 'shadow-emerald-500/30' : 'shadow-red-500/30'}`}>
            {result.passed ? (
              <CheckCircle2 className="w-12 h-12 text-white" />
            ) : (
              <XCircle className="w-12 h-12 text-white" />
            )}
          </div>

          <p className="text-4xl font-bold text-slate-800 mb-2">{result.score}%</p>
          <p className={`text-lg font-semibold mb-1 ${
            result.passed ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {result.passed ? 'Aprobado' : 'No aprobado'}
          </p>

          <div className="max-w-xs mx-auto mt-4 mb-6">
            <div className="flex justify-between text-sm text-slate-500 mb-1">
              <span>Tu puntaje</span>
              <span>Mínimo: {currentQuestionnaire.passingScore}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  result.passed ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-rose-500'
                }`}
                style={{ width: `${result.score}%` }}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => {
                setResult(null);
                setSelectedAnswers({});
                setCurrentPage(0);
              }}
              variant="outline"
            >
              Repetir Cuestionario
            </Button>
            <Button onClick={() => router.push('/admin/questionnaires')}>
              Volver
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
