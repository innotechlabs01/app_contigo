'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuestionnaireStore } from '@/infrastructure/store/questionnaire-store';
import { Button } from '@/components/ui/button';
import { DEFAULT_PILLARS, STEP_TARGETS, type QuestionType, createEmptyQuestion } from '@/domain/onboarding/questionnaire';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Eye, X } from 'lucide-react';

const QUESTION_TYPES = [
  { value: 'single-choice' as QuestionType, label: 'Selección única (Radio)' },
  { value: 'multiple-choice' as QuestionType, label: 'Múltiple (Checkbox)' },
  { value: 'dropdown' as QuestionType, label: 'Desplegable (Dropdown)' },
  { value: 'text' as QuestionType, label: 'Texto corto' },
  { value: 'textarea' as QuestionType, label: 'Texto largo' },
  { value: 'number' as QuestionType, label: 'Número' },
  { value: 'email' as QuestionType, label: 'Correo electrónico' },
  { value: 'phone' as QuestionType, label: 'Teléfono' },
  { value: 'date' as QuestionType, label: 'Fecha' },
  { value: 'scale' as QuestionType, label: 'Escala (1-5)' },
  { value: 'yes-no' as QuestionType, label: 'Sí/No' },
  { value: 'file-upload' as QuestionType, label: 'Subir archivo' },
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
                    onChange={(e) => {
                      const newType = e.target.value as QuestionType;
                      const newQuestion = createEmptyQuestion(newType);
                      updateQuestion(q.id, { 
                        type: newType, 
                        answers: newQuestion.answers, 
                        config: newQuestion.config 
                      });
                    }}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 focus:border-primary focus:outline-none"
                  >
                    {QUESTION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                </div>

                {(q.type === 'single-choice' || q.type === 'multiple-choice' || q.type === 'dropdown') && (
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
                )}

                {q.type === 'scale' && (
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-600 mb-2">Escala del {q.config?.min || 1} al {q.config?.max || 5}</p>
                    <div className="flex gap-2">
                      {q.answers.map((a, aIdx) => (
                        <div key={a.id} className="flex-1 text-center p-2 bg-white rounded-lg border border-slate-200">
                          <div className="font-semibold">{a.text}</div>
                          <div className="text-xs text-slate-500">Score: {a.score}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(q.type === 'text' || q.type === 'textarea' || q.type === 'email' || q.type === 'phone' || q.type === 'number' || q.type === 'date') && (
                  <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-slate-500 mb-1">Placeholder</label>
                        <input
                          type="text"
                          value={q.config?.placeholder || ''}
                          onChange={(e) => updateQuestion(q.id, { config: { ...q.config, placeholder: e.target.value } })}
                          placeholder="Texto de ayuda..."
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-primary focus:outline-none text-sm"
                        />
                      </div>
                      {q.type === 'text' && (
                        <div className="w-32">
                          <label className="block text-xs text-slate-500 mb-1">Max caracteres</label>
                          <input
                            type="number"
                            value={q.config?.maxLength || ''}
                            onChange={(e) => updateQuestion(q.id, { config: { ...q.config, maxLength: parseInt(e.target.value) } })}
                            placeholder="Sin límite"
                            className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-primary focus:outline-none text-sm"
                          />
                        </div>
                      )}
                      <div className="w-24">
                        <label className="block text-xs text-slate-500 mb-1">Requerido</label>
                        <input
                          type="checkbox"
                          checked={q.config?.required || false}
                          onChange={(e) => updateQuestion(q.id, { config: { ...q.config, required: e.target.checked } })}
                          className="w-5 h-5 mt-2"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {q.type === 'file-upload' && (
                  <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-xs text-slate-500 mb-1">Tipos permitidos</label>
                        <input
                          type="text"
                          value={q.config?.allowedTypes?.join(', ') || ''}
                          onChange={(e) => updateQuestion(q.id, { config: { ...q.config, allowedTypes: e.target.value.split(',').map(s => s.trim()) } })}
                          placeholder=".pdf, .doc, .docx"
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-primary focus:outline-none text-sm"
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-xs text-slate-500 mb-1">Tamaño máx (MB)</label>
                        <input
                          type="number"
                          value={q.config?.maxSizeMB || 10}
                          onChange={(e) => updateQuestion(q.id, { config: { ...q.config, maxSizeMB: parseInt(e.target.value) } })}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-primary focus:outline-none text-sm"
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-xs text-slate-500 mb-1">Max archivos</label>
                        <input
                          type="number"
                          value={q.config?.maxFiles || 1}
                          onChange={(e) => updateQuestion(q.id, { config: { ...q.config, maxFiles: parseInt(e.target.value) } })}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:border-primary focus:outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {q.type === 'yes-no' && (
                  <div className="grid grid-cols-2 gap-3">
                    {q.answers.map((a, aIdx) => (
                      <div key={a.id} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium">{a.text}</span>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={a.score}
                          onChange={(e) => handleAnswerChange(q.id, aIdx, 'score', parseInt(e.target.value))}
                          className="w-14 h-10 px-2 rounded-lg border border-slate-200 focus:border-primary focus:outline-none text-center text-sm ml-auto"
                          title="Puntaje"
                        />
                      </div>
                    ))}
                  </div>
                )}
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