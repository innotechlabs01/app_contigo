'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuestionnaireStore } from '@/infrastructure/store/questionnaire-store';
import { Button } from '@/components/ui/button';
import { DEFAULT_PILLARS, STEP_TARGETS, type QuestionType } from '@/domain/onboarding/questionnaire';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Eye, X } from 'lucide-react';

const QUESTION_TYPES = [
  { value: 'single-choice' as QuestionType, label: 'Selección única (Radio)' },
  { value: 'multiple-choice' as QuestionType, label: 'Múltiple (Checkbox)' },
];

export default function QuestionnaireEditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';

  const {
    currentQuestionnaire,
    fetchQuestionnaire,
    createQuestionnaire,
    saveQuestionnaire,
    setCurrentQuestionnaire,
    addQuestion,
    updateQuestion,
    removeQuestion,
    reorderQuestions,
    duplicateQuestion,
    isLoading,
    error,
  } = useQuestionnaireStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isNew) {
      createQuestionnaire();
    } else if (id) {
      fetchQuestionnaire(id);
    }
  }, [id, isNew, fetchQuestionnaire, createQuestionnaire]);

  const handleSave = async () => {
    if (!currentQuestionnaire) return;
    await saveQuestionnaire(currentQuestionnaire);
    router.push('/admin/questionnaires');
  };

  const handleFieldChange = (field: string, value: unknown) => {
    if (!currentQuestionnaire) return;
    setCurrentQuestionnaire({
      ...currentQuestionnaire,
      [field]: value,
    });
  };

  const handleAnswerChange = (questionId: string, answerIdx: number, field: string, value: string | number) => {
    if (!currentQuestionnaire) return;
    const questions = currentQuestionnaire.questions.map((q) => {
      if (q.id !== questionId) return q;
      const answers = [...q.answers];
      answers[answerIdx] = { ...answers[answerIdx], [field]: value };
      return { ...q, answers };
    });
    setCurrentQuestionnaire({ ...currentQuestionnaire, questions });
  };

  if (!mounted || !currentQuestionnaire) {
    return <div className="container mx-auto py-8">Cargando...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            {isNew ? 'Nuevo Cuestionario' : 'Editar Cuestionario'}
          </h1>
          <p className="text-slate-500 text-sm">Configura las opciones generales</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/questionnaires')}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input
              type="text"
              value={currentQuestionnaire.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className="w-full h-12 px-4 rounded-full border-2 border-slate-200 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Step Objetivo</label>
            <select
              value={currentQuestionnaire.stepTarget}
              onChange={(e) => handleFieldChange('stepTarget', e.target.value)}
              className="w-full h-12 px-4 rounded-full border-2 border-slate-200 focus:border-primary focus:outline-none"
            >
              {STEP_TARGETS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Puntaje Mínimo (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={currentQuestionnaire.passingScore}
              onChange={(e) => handleFieldChange('passingScore', parseInt(e.target.value))}
              className="w-full h-12 px-4 rounded-full border-2 border-slate-200 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <input
              type="text"
              value={currentQuestionnaire.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="w-full h-12 px-4 rounded-full border-2 border-slate-200 focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Preguntas ({currentQuestionnaire.questions.length})</h2>
        <Button onClick={addQuestion}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Pregunta
        </Button>
      </div>

      <div className="space-y-4">
        {currentQuestionnaire.questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-2xl shadow-soft p-4">
            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-1 text-slate-400">
                <button
                  disabled={idx === 0}
                  onClick={() => reorderQuestions(idx, idx - 1)}
                  className="p-1 hover:text-primary disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-center">{idx + 1}</span>
                <button
                  disabled={idx === currentQuestionnaire.questions.length - 1}
                  onClick={() => reorderQuestions(idx, idx + 1)}
                  className="p-1 hover:text-primary disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">Texto de la pregunta</label>
                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                      placeholder="Escribe la pregunta..."
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs text-slate-500 mb-1">Pilar</label>
                    <select
                      value={q.pillar || ''}
                      onChange={(e) => updateQuestion(q.id, { pillar: e.target.value })}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 focus:border-primary focus:outline-none"
                    >
                      <option value="">Sin pilar</option>
                      {DEFAULT_PILLARS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                <div className="w-20">
                  <label className="block text-xs text-slate-500 mb-1">Peso</label>
                  <input
                    type="number"
                    min="0.5"
                    max="3"
                    step="0.5"
                    value={q.weight}
                    onChange={(e) => updateQuestion(q.id, { weight: parseFloat(e.target.value) })}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="w-48">
                  <label className="block text-xs text-slate-500 mb-1">Tipo</label>
                  <select
                    value={q.type || 'single-choice'}
                    onChange={(e) => updateQuestion(q.id, { type: e.target.value as QuestionType })}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 focus:border-primary focus:outline-none"
                  >
                    {QUESTION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {q.answers.map((a, aIdx) => (
                    <div key={a.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={a.text}
                        onChange={(e) => handleAnswerChange(q.id, aIdx, 'text', e.target.value)}
                        placeholder={`Opción ${aIdx + 1}`}
                        className="flex-1 h-10 px-3 rounded-lg border border-slate-200 focus:border-primary focus:outline-none text-sm"
                      />
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={a.score}
                        onChange={(e) => handleAnswerChange(q.id, aIdx, 'score', parseInt(e.target.value))}
                        className="w-14 h-10 px-2 rounded-lg border border-slate-200 focus:border-primary focus:outline-none text-center text-sm"
                        title="Puntaje"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => duplicateQuestion(q.id)}
                  className="p-2 text-slate-400 hover:text-primary"
                  title="Duplicar"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeQuestion(q.id)}
                  className="p-2 text-slate-400 hover:text-red-500"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {currentQuestionnaire.questions.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl">
            <p className="text-slate-500 mb-4">No hay preguntas</p>
            <Button onClick={addQuestion}>Agregar primera pregunta</Button>
          </div>
        )}
      </div>
    </div>
  );
}