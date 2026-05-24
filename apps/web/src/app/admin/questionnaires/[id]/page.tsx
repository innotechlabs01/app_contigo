'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuestionnaireStore } from '@/infrastructure/store/questionnaire-store';
import { Button } from '@/components/ui/button';
import { DEFAULT_PILLARS, STEP_TARGETS, type QuestionType, createEmptyQuestion, redistributeWeights } from '@/domain/onboarding/questionnaire';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Eye, X, AlertTriangle, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react';

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
    toggleQuestionActive,
    reorderQuestions,
    duplicateQuestion,
    isLoading,
    error,
  } = useQuestionnaireStore();

  const [mounted, setMounted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    if (isNew) {
      createQuestionnaire();
    } else if (id) {
      fetchQuestionnaire(id);
    }
  }, [id, isNew, fetchQuestionnaire, createQuestionnaire]);

  // Calculate total possible score
  const totalPossibleScore = currentQuestionnaire?.questions
    ?.filter(q => q.isActive !== false)
    .reduce((total, q) => {
      const maxScore = Math.max(...q.answers.map(a => a.score));
      return total + (q.weight || 1) * maxScore;
    }, 0) || 0;

  // Check if total exceeds passing score
  const exceedsPassingScore = totalPossibleScore > (currentQuestionnaire?.passingScore || 0);

  const handleSave = async () => {
    if (!currentQuestionnaire) return;

    const errors: Record<string, string> = {};

    if (!currentQuestionnaire.name.trim() || currentQuestionnaire.name.trim().length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres';
    }
    if (currentQuestionnaire.name.length > 200) {
      errors.name = 'El nombre no debe exceder 200 caracteres';
    }
    if ((currentQuestionnaire.description || '').length > 500) {
      errors.description = 'La descripción no debe exceder 500 caracteres';
    }

    currentQuestionnaire.questions.forEach((q) => {
      if (!q.text.trim() || q.text.trim().length < 5) {
        errors[`q_${q.id}_text`] = 'La pregunta debe tener al menos 5 caracteres';
      }
      if (q.text.length > 500) {
        errors[`q_${q.id}_text`] = 'La pregunta no debe exceder 500 caracteres';
      }
      if (q.answers.some(a => a.isActive !== false)) {
        q.answers.forEach((a, aIdx) => {
          if (a.isActive === false) return;
          if (!a.text.trim()) {
            errors[`q_${q.id}_a_${aIdx}_text`] = 'El texto de la respuesta no puede estar vacío';
          }
          if (a.text.length > 200) {
            errors[`q_${q.id}_a_${aIdx}_text`] = 'La respuesta no debe exceder 200 caracteres';
          }
          if (typeof a.score !== 'number' || a.score < 0 || a.score > 10 || !Number.isFinite(a.score)) {
            errors[`q_${q.id}_a_${aIdx}_score`] = 'El puntaje debe ser un número entre 0 y 10';
          }
        });
      }
    });

    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

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

  // Calculate active weight sum
  const activeWeightSum = currentQuestionnaire?.questions
    ?.filter(q => q.isActive !== false)
    .reduce((sum, q) => sum + (q.weight || 0), 0) || 0;
  const weightsNot100 = activeWeightSum !== 100;

  const toggleAnswerActive = (questionId: string, answerIdx: number) => {
    if (!currentQuestionnaire) return;
    const questions = currentQuestionnaire.questions.map((q) => {
      if (q.id !== questionId) return q;
      const answers = [...q.answers];
      answers[answerIdx] = { 
        ...answers[answerIdx], 
        isActive: answers[answerIdx].isActive === false ? true : false 
      };
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
              onChange={(e) => {
                setValidationErrors(prev => ({ ...prev, name: '' }));
                handleFieldChange('name', e.target.value);
              }}
              className={`w-full h-12 px-4 rounded-full border-2 focus:outline-none ${validationErrors.name ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-primary'}`}
            />
            {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>}
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
              onChange={(e) => {
                setValidationErrors(prev => ({ ...prev, description: '' }));
                handleFieldChange('description', e.target.value);
              }}
              className={`w-full h-12 px-4 rounded-full border-2 focus:outline-none ${validationErrors.description ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-primary'}`}
            />
            {validationErrors.description && <p className="text-red-500 text-xs mt-1">{validationErrors.description}</p>}
          </div>
        </div>

        {/* Score Warning */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Puntaje Total Posible:</span>
            <span className={`text-lg font-bold ${exceedsPassingScore ? 'text-red-600' : 'text-green-600'}`}>
              {totalPossibleScore} pts
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Puntaje Mínimo Requerido:</span>
            <span className="text-lg font-bold text-slate-800">{currentQuestionnaire.passingScore}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Suma de Pesos activos:</span>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${weightsNot100 ? 'text-red-600' : 'text-green-600'}`}>
                {activeWeightSum}%
              </span>
              {weightsNot100 && (
                <button
                  onClick={() => {
                    if (!currentQuestionnaire) return;
                    setCurrentQuestionnaire({
                      ...currentQuestionnaire,
                      questions: redistributeWeights(currentQuestionnaire.questions),
                    });
                  }}
                  className="p-1 text-primary hover:text-primary/70"
                  title="Redistribuir pesos equitativamente"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
              {!weightsNot100 && activeWeightSum > 0 && (
                <span className="text-xs text-green-600 font-medium">✓</span>
              )}
            </div>
          </div>
          {weightsNot100 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">
                La suma de pesos debe ser 100%. Usa el botón <RefreshCw className="w-3 h-3 inline" /> para redistribuir automáticamente.
              </p>
            </div>
          )}
          {exceedsPassingScore && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-700">
                El puntaje total ({totalPossibleScore}) supera el puntaje mínimo ({currentQuestionnaire.passingScore}%). 
                Ajusta los puntajes de las respuestas.
              </p>
            </div>
          )}
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

              <div className={`flex-1 space-y-4 ${q.isActive === false ? 'opacity-50' : ''}`}>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">Texto de la pregunta</label>
                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => {
                        setValidationErrors(prev => ({ ...prev, [`q_${q.id}_text`]: '' }));
                        updateQuestion(q.id, { text: e.target.value });
                      }}
                      placeholder="Escribe la pregunta..."
                      className={`w-full h-11 px-3 rounded-xl border focus:outline-none ${q.isActive === false ? 'bg-slate-100' : ''} ${validationErrors[`q_${q.id}_text`] ? 'border-red-400' : 'focus:border-primary'}`}
                      disabled={q.isActive === false}
                    />
                    {validationErrors[`q_${q.id}_text`] && <p className="text-red-500 text-xs mt-1">{validationErrors[`q_${q.id}_text`]}</p>}
                  </div>
                  <div className="w-32">
                    <label className="block text-xs text-slate-500 mb-1">Pilar</label>
                    <select
                      value={q.pillar || ''}
                      onChange={(e) => updateQuestion(q.id, { pillar: e.target.value })}
                      className={`w-full h-11 px-3 rounded-xl border focus:border-primary focus:outline-none ${q.isActive === false ? 'bg-slate-100' : ''}`}
                      disabled={q.isActive === false}
                    >
                      <option value="">Sin pilar</option>
                      {DEFAULT_PILLARS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                <div className="w-20">
                  <label className="block text-xs text-slate-500 mb-1">Peso %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={q.weight}
                    onChange={(e) => updateQuestion(q.id, { weight: parseInt(e.target.value) || 0 })}
                    className={`w-full h-11 px-3 rounded-xl border focus:border-primary focus:outline-none ${q.isActive === false ? 'bg-slate-100' : ''}`}
                    disabled={q.isActive === false}
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
                    className={`w-full h-11 px-3 rounded-xl border focus:border-primary focus:outline-none ${q.isActive === false ? 'bg-slate-100' : ''}`}
                    disabled={q.isActive === false}
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
                      <div key={a.id} className={`flex items-center gap-2 ${a.isActive === false ? 'opacity-50' : ''}`}>
                        <button
                          onClick={() => toggleAnswerActive(q.id, aIdx)}
                          className={`${a.isActive === false ? 'text-red-500' : 'text-green-500'} hover:opacity-70`}
                          title={a.isActive === false ? 'Activar opción' : 'Desactivar opción'}
                        >
                          {a.isActive === false ? <ToggleLeft className="w-3 h-3" /> : <ToggleRight className="w-3 h-3" />}
                        </button>
                        <input
                          type="text"
                          value={a.text}
                          onChange={(e) => {
                            setValidationErrors(prev => ({ ...prev, [`q_${q.id}_a_${aIdx}_text`]: '' }));
                            handleAnswerChange(q.id, aIdx, 'text', e.target.value);
                          }}
                          placeholder={`Opción ${aIdx + 1}`}
                          className={`flex-1 h-10 px-3 rounded-lg border text-sm ${a.isActive === false ? 'bg-slate-100' : ''} ${validationErrors[`q_${q.id}_a_${aIdx}_text`] ? 'border-red-400' : 'border-slate-200 focus:border-primary'} focus:outline-none`}
                          disabled={a.isActive === false}
                        />
                        {validationErrors[`q_${q.id}_a_${aIdx}_text`] && <p className="text-red-500 text-xs col-span-full">{validationErrors[`q_${q.id}_a_${aIdx}_text`]}</p>}
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={a.score}
                          onChange={(e) => {
                            setValidationErrors(prev => ({ ...prev, [`q_${q.id}_a_${aIdx}_score`]: '' }));
                            handleAnswerChange(q.id, aIdx, 'score', parseInt(e.target.value));
                          }}
                          className={`w-14 h-10 px-2 rounded-lg border text-center text-sm ${a.isActive === false ? 'bg-slate-100' : ''} ${validationErrors[`q_${q.id}_a_${aIdx}_score`] ? 'border-red-400' : 'border-slate-200 focus:border-primary'} focus:outline-none`}
                          title="Puntaje"
                          disabled={a.isActive === false}
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
                      <div key={a.id} className={`flex items-center gap-2 p-3 bg-slate-50 rounded-lg ${a.isActive === false ? 'opacity-50' : ''}`}>
                        <button
                          onClick={() => toggleAnswerActive(q.id, aIdx)}
                          className={`${a.isActive === false ? 'text-red-500' : 'text-green-500'} hover:opacity-70`}
                          title={a.isActive === false ? 'Activar opción' : 'Desactivar opción'}
                        >
                          {a.isActive === false ? <ToggleLeft className="w-3 h-3" /> : <ToggleRight className="w-3 h-3" />}
                        </button>
                        <span className={`font-medium ${a.isActive === false ? 'line-through' : ''}`}>{a.text}</span>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={a.score}
                          onChange={(e) => handleAnswerChange(q.id, aIdx, 'score', parseInt(e.target.value))}
                          className={`w-14 h-10 px-2 rounded-lg border border-slate-200 focus:border-primary focus:outline-none text-center text-sm ${a.isActive === false ? 'bg-slate-100' : ''}`}
                          title="Puntaje"
                          disabled={a.isActive === false}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => toggleQuestionActive(q.id)}
                  className={`p-2 ${q.isActive === false ? 'text-red-500' : 'text-green-500'} hover:opacity-70`}
                  title={q.isActive === false ? 'Activar pregunta' : 'Desactivar pregunta'}
                >
                  {q.isActive === false ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                </button>
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