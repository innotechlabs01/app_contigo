'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useOnboardingStore } from '@/infrastructure/store/onboarding-store';
import { useQuestionnaireStore } from '@/infrastructure/store/questionnaire-store';
import {
  evaluationQuestions,
  shuffleArray,
} from '@/domain/onboarding/evaluation-questions';
import { Questionnaire } from '@/domain/onboarding/questionnaire';
import { ArrowRight } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

export function EvaluationStep() {
  const [currentPage, setCurrentPage] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const { setEvaluation, setStep } = useOnboardingStore();
  const { questionnaires, fetchQuestionnaires } = useQuestionnaireStore();
  const [evaluationQuestionnaire, setEvaluationQuestionnaire] = useState<Questionnaire | null>(null);

  const evaluation = useOnboardingStore((state) => state.evaluation);

  useEffect(() => {
    if (evaluation) {
      setResponses(evaluation as Record<number, number>);
    }
  }, [evaluation]);

  useEffect(() => {
    fetchQuestionnaires();
  }, [fetchQuestionnaires]);

  useEffect(() => {
    if (questionnaires.length === 0) return;
    const found = questionnaires.find(
      (q) => q.stepTarget === 'evaluation' && q.isPublished
    );
    if (found) {
      setEvaluationQuestionnaire(found);
    }
  }, [questionnaires]);

  const dynamicQuestions = useMemo(() => {
    if (!evaluationQuestionnaire) return null;
    return evaluationQuestionnaire.questions
      .filter((q) => q.isActive !== false)
      .sort((a, b) => a.order - b.order)
      .map((q, idx) => ({
        id: idx + 1,
        text: q.text,
        pillar: q.pillar || 'General',
        pillarWeight: q.weight || 1,
        answers: q.answers
          .filter((a) => a.isActive !== false)
          .map((a) => ({
            text: a.text,
            score: a.score,
          })),
      }))
      .filter((q) => q.answers.length > 0);
  }, [evaluationQuestionnaire]);

  const questions = dynamicQuestions || evaluationQuestions;
  const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentQuestions = questions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Shuffle answers when page changes (NOT when questionnaire loads)
  const [shuffledAnswers, setShuffledAnswers] = useState<Record<number, typeof currentQuestions[0]['answers']>>({});

  useEffect(() => {
    if (!currentQuestions || currentQuestions.length === 0) return;
    
    const shuffledMap: Record<number, typeof currentQuestions[0]['answers']> = {};
    currentQuestions.forEach((q) => {
      shuffledMap[q.id] = shuffleArray(q.answers);
    });
    setShuffledAnswers(shuffledMap);
  }, [currentPage]); // Re-shuffle when page changes

  const handleAnswer = (questionId: number, score: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
      // Scroll after React renders
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      // Scroll after React renders
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleSubmit = () => {
    // Just save responses and move to next step
    // The result will be calculated later in admin requests
    setEvaluation(responses);
    setStep('documentation', 2);
  };

  const isCurrentPageComplete = currentQuestions.every((q) => responses[q.id] !== undefined);
  const isAllComplete = Object.keys(responses).length === questions.length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-secondary">
          {evaluationQuestionnaire?.name || 'Evaluación de Confiabilidad'}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          {evaluationQuestionnaire?.description || 'Responde las siguientes situaciones hipotéticas'}
        </p>
        {evaluationQuestionnaire && (
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {evaluationQuestionnaire.questions.length} preguntas · Puntaje mínimo: {evaluationQuestionnaire.passingScore}%
          </p>
        )}
      </div>

      <>
        <Progress
          value={((currentPage + 1) / totalPages) * 100}
          className="h-2"
        />
        <p className="text-center text-xs sm:text-sm text-slate-500">
          Pregunta {startIndex + 1} - {startIndex + currentQuestions.length} de {questions.length}
        </p>

        <div className="space-y-3 sm:space-y-4">
          {currentQuestions.map((question) => (
            <div key={question.id} className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-soft">
              <p className="font-medium text-sm sm:text-base text-slate-700 mb-2 sm:mb-3">
                {question.id}. {question.text}
                <span className="text-xs sm:text-sm text-slate-500 block mt-1">
                  (Pilar: {question.pillar})
                </span>
              </p>
              <div className="space-y-2">
                {(shuffledAnswers[question.id] || question.answers).map((answer, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAnswer(question.id, answer.score)}
                    className={`w-full text-left p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all text-sm sm:text-base ${
                      responses[question.id] === answer.score
                        ? 'border-secondary bg-secondary/10'
                        : 'border-slate-200 hover:border-secondary/30'
                    }`}
                  >
                    <span className="text-slate-700 text-sm sm:text-base">{answer.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className="flex-1 text-sm sm:text-base py-2 sm:py-3"
          >
            <span className="hidden sm:inline">Anterior</span>
            <span className="sm:hidden">←</span>
          </Button>
          {currentPage < totalPages - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!isCurrentPageComplete}
              className="flex-1 text-sm sm:text-base py-2 sm:py-3"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <span className="sm:hidden">→</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isAllComplete}
              className="flex-1 text-sm sm:text-base py-2 sm:py-3"
            >
              <span className="hidden sm:inline">Finalizar Evaluación</span>
              <span className="sm:hidden">Finalizar</span>
            </Button>
          )}
        </div>
      </>
    </div>
  );
}