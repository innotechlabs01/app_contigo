'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useOnboardingStore } from '@/infrastructure/store/onboarding-store';
import { useQuestionnaireStore } from '@/infrastructure/store/questionnaire-store';
import {
  evaluationQuestions,
  calculateEvaluationResult,
  shuffleArray,
  type EvaluationResult,
} from '@/domain/onboarding/evaluation-questions';
import { Questionnaire } from '@/domain/onboarding/questionnaire';
import { CheckCircle2, XCircle, AlertTriangle, Award, ArrowRight, RefreshCw } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

export function EvaluationStep() {
  const [currentPage, setCurrentPage] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const { setEvaluation, setEvaluationResult, setStep } = useOnboardingStore();
  const { questionnaires, fetchQuestionnaires } = useQuestionnaireStore();
  const [evaluationQuestionnaire, setEvaluationQuestionnaire] = useState<Questionnaire | null>(null);

  useEffect(() => {
    fetchQuestionnaires();
  }, [fetchQuestionnaires]);

  useEffect(() => {
    const evalQ = questionnaires.find(
      (q) => q.stepTarget === 'evaluation' && q.isPublished
    );
    setEvaluationQuestionnaire(evalQ || null);
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
        answers: q.answers.map((a) => ({
          text: a.text,
          score: a.score,
        })),
      }));
  }, [evaluationQuestionnaire]);

  const questions = dynamicQuestions || evaluationQuestions;
  const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentQuestions = questions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const shuffledAnswers = useMemo(() => {
    const map: Record<number, { id: number; answers: typeof currentQuestions[0]['answers'] }[]> = {};
    for (const q of currentQuestions) {
      map[q.id] = [{ id: q.id, answers: shuffleArray(q.answers) }];
    }
    return map;
  }, [currentPage, currentQuestions]);

  const handleAnswer = (questionId: number, score: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: score }));
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

  const handleSubmit = () => {
    const evalResult = calculateEvaluationResult(responses);
    setEvaluation(responses);
    setEvaluationResult(evalResult.globalScore, evalResult.passed);
    setStep('documentation', 1);
  };

  const isCurrentPageComplete = currentQuestions.every((q) => responses[q.id] !== undefined);
  const isAllComplete = Object.keys(responses).length === evaluationQuestions.length;

  const getResultIcon = () => {
    if (!result) return null;
    switch (result.finalResult) {
      case 'ELITE_HIRE':
        return <Award className="w-16 h-16 text-yellow-500" />;
      case 'REVIEW':
        return <AlertTriangle className="w-16 h-16 text-orange-500" />;
      case 'REJECT':
        return <XCircle className="w-16 h-16 text-red-500" />;
    }
  };

  const getResultColor = () => {
    if (!result) return '';
    switch (result.finalResult) {
      case 'ELITE_HIRE':
        return 'bg-yellow-50 border-yellow-200';
      case 'REVIEW':
        return 'bg-orange-50 border-orange-200';
      case 'REJECT':
        return 'bg-red-50 border-red-200';
    }
  };

  const getResultLabel = () => {
    if (!result) return '';
    switch (result.finalResult) {
      case 'ELITE_HIRE':
        return 'Contratación Elite';
      case 'REVIEW':
        return 'Revisión Requerida';
      case 'REJECT':
        return 'No Apto';
    }
  };

  const handleRetry = () => {
    setResult(null);
    setResponses({});
    setCurrentPage(0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-secondary">
          {evaluationQuestionnaire?.name || 'Evaluación de Confiabilidad'}
        </h2>
        <p className="text-slate-600 mt-2">
          {evaluationQuestionnaire?.description || 'Responde las siguientes situaciones hipotéticas'}
        </p>
        {evaluationQuestionnaire && (
          <p className="text-sm text-slate-500 mt-1">
            {evaluationQuestionnaire.questions.length} preguntas · Puntaje mínimo: {evaluationQuestionnaire.passingScore}%
          </p>
        )}
      </div>

      {!result ? (
        <>
          <Progress
            value={((currentPage + 1) / totalPages) * 100}
            className="h-2"
          />
          <p className="text-center text-sm text-slate-500">
            Pregunta {startIndex + 1} - {startIndex + currentQuestions.length} de {questions.length}
          </p>

          <div className="space-y-4">
            {currentQuestions.map((question) => (
              <div key={question.id} className="bg-white p-4 rounded-2xl shadow-soft">
                <p className="font-medium text-slate-700 mb-3">
                  {question.id}. {question.text}
                  <span className="text-sm text-slate-500 block mt-1">
                    (Pilar: {question.pillar})
                  </span>
                </p>
                <div className="space-y-2">
                  {shuffledAnswers[question.id]?.[0]?.answers.map((answer, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAnswer(question.id, answer.score)}
                      className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                        responses[question.id] === answer.score
                          ? 'border-secondary bg-secondary/10'
                          : 'border-slate-200 hover:border-secondary/30'
                      }`}
                    >
                      <span className="text-slate-700">{answer.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
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
                Siguiente <ArrowRight className="w-4 h-4 ml-2" />
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
        </>
      ) : (
        <div className={`p-6 rounded-2xl text-center border-2 ${getResultColor()}`}>
          <div className="flex justify-center mb-4">{getResultIcon()}</div>
          <p className="text-3xl font-bold mb-2">{result.globalScore}</p>
          <p className="text-lg font-semibold mb-2">{getResultLabel()}</p>
          <p className="text-slate-600 text-sm mb-4">
            {result.finalResult === 'ELITE_HIRE'
              ? '¡Excelente! Continuando al siguiente paso...'
              : result.finalResult === 'REVIEW'
              ? 'Tu perfil requiere revisión. Te contactaremos pronto.'
              : 'No cumpliste los requisitos mínimos. Intenta de nuevo.'}
          </p>

          <div className="text-left text-sm bg-white/50 p-3 rounded-lg mb-4">
            <p><strong>Puntaje Ponderado:</strong> {result.weightedScore}</p>
            {result.flags.hardFlag && (
              <p className="text-red-600">⚠️ Alerta crítica detectada</p>
            )}
            {result.flags.softFlag && (
              <p className="text-orange-600">⚠️ Múltiples respuestas de bajo puntaje</p>
            )}
          </div>

          {result.finalResult === 'REJECT' && (
            <Button onClick={handleRetry} variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Repetir Evaluación
            </Button>
          )}
        </div>
      )}
    </div>
  );
}