'use client';

import { create } from 'zustand';
import {
  Questionnaire,
  QuestionnaireQuestion,
  createEmptyQuestionnaire,
  createEmptyQuestion,
} from '@/domain/onboarding/questionnaire';

interface QuestionnaireStore {
  questionnaires: Questionnaire[];
  currentQuestionnaire: Questionnaire | null;
  isLoading: boolean;
  error: string | null;

  fetchQuestionnaires: () => Promise<void>;
  fetchQuestionnaire: (id: string) => Promise<Questionnaire | null>;
  createQuestionnaire: () => Questionnaire;
  saveQuestionnaire: (q: Questionnaire) => Promise<void>;
  deleteQuestionnaire: (id: string) => Promise<void>;
  publishQuestionnaire: (id: string) => Promise<void>;
  setCurrentQuestionnaire: (q: Questionnaire | null) => void;

  addQuestion: () => void;
  updateQuestion: (questionId: string, updates: Partial<QuestionnaireQuestion>) => void;
  removeQuestion: (questionId: string) => void;
  reorderQuestions: (fromIndex: number, toIndex: number) => void;
  duplicateQuestion: (questionId: string) => void;
}

const API_BASE = '/api/questionnaires';

export const useQuestionnaireStore = create<QuestionnaireStore>((set, get) => ({
  questionnaires: [],
  currentQuestionnaire: null,
  isLoading: false,
  error: null,

  fetchQuestionnaires: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Error al cargar cuestionarios');
      const data = await res.json();
      set({ questionnaires: data, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  fetchQuestionnaire: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      if (!res.ok) throw new Error('Error al cargar cuestionario');
      const data = await res.json();
      set({ currentQuestionnaire: data, isLoading: false });
      return data;
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
      return null;
    }
  },

  createQuestionnaire: () => {
    const newQ = createEmptyQuestionnaire();
    set({ currentQuestionnaire: newQ });
    return newQ;
  },

  saveQuestionnaire: async (q: Questionnaire) => {
    set({ isLoading: true, error: null });
    try {
      const isExisting = get().questionnaires.some((x) => x.id === q.id);
      const method = isExisting ? 'PUT' : 'POST';
      const url = isExisting ? `${API_BASE}/${q.id}` : API_BASE;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(q),
      });
      if (!res.ok) throw new Error('Error al guardar cuestionario');
      const saved = await res.json();
      set((state) => {
        const existing = state.questionnaires.find((x) => x.id === saved.id);
        if (existing) {
          return {
            questionnaires: state.questionnaires.map((x) =>
              x.id === saved.id ? saved : x
            ),
            currentQuestionnaire: saved,
            isLoading: false,
          };
        }
        return {
          questionnaires: [...state.questionnaires, saved],
          currentQuestionnaire: saved,
          isLoading: false,
        };
      });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  deleteQuestionnaire: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar cuestionario');
      set((state) => ({
        questionnaires: state.questionnaires.filter((x) => x.id !== id),
        currentQuestionnaire: null,
        isLoading: false,
      }));
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  publishQuestionnaire: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/${id}/publish`, { method: 'POST' });
      if (!res.ok) throw new Error('Error al publicar cuestionario');
      const updated = await res.json();
      set((state) => ({
        questionnaires: state.questionnaires.map((x) =>
          x.id === id ? updated : x
        ),
        currentQuestionnaire:
          state.currentQuestionnaire?.id === id ? updated : state.currentQuestionnaire,
        isLoading: false,
      }));
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  setCurrentQuestionnaire: (q) => set({ currentQuestionnaire: q }),

  addQuestion: () => {
    const { currentQuestionnaire } = get();
    if (!currentQuestionnaire) return;
    const newQuestion = createEmptyQuestion();
    newQuestion.order = currentQuestionnaire.questions.length;
    set({
      currentQuestionnaire: {
        ...currentQuestionnaire,
        questions: [...currentQuestionnaire.questions, newQuestion],
      },
    });
  },

  updateQuestion: (questionId, updates) => {
    const { currentQuestionnaire } = get();
    if (!currentQuestionnaire) return;
    set({
      currentQuestionnaire: {
        ...currentQuestionnaire,
        questions: currentQuestionnaire.questions.map((q) =>
          q.id === questionId ? { ...q, ...updates } : q
        ),
      },
    });
  },

  removeQuestion: (questionId) => {
    const { currentQuestionnaire } = get();
    if (!currentQuestionnaire) return;
    const filtered = currentQuestionnaire.questions
      .filter((q) => q.id !== questionId)
      .map((q, idx) => ({ ...q, order: idx }));
    set({
      currentQuestionnaire: {
        ...currentQuestionnaire,
        questions: filtered,
      },
    });
  },

  reorderQuestions: (fromIndex, toIndex) => {
    const { currentQuestionnaire } = get();
    if (!currentQuestionnaire) return;
    const questions = [...currentQuestionnaire.questions];
    const [removed] = questions.splice(fromIndex, 1);
    questions.splice(toIndex, 0, removed);
    const reordered = questions.map((q, idx) => ({ ...q, order: idx }));
    set({
      currentQuestionnaire: {
        ...currentQuestionnaire,
        questions: reordered,
      },
    });
  },

  duplicateQuestion: (questionId) => {
    const { currentQuestionnaire } = get();
    if (!currentQuestionnaire) return;
    const question = currentQuestionnaire.questions.find((q) => q.id === questionId);
    if (!question) return;
    const duplicated: QuestionnaireQuestion = {
      ...question,
      id: crypto.randomUUID(),
      order: currentQuestionnaire.questions.length,
      answers: question.answers.map((a) => ({ ...a, id: crypto.randomUUID() })),
    };
    set({
      currentQuestionnaire: {
        ...currentQuestionnaire,
        questions: [...currentQuestionnaire.questions, duplicated],
      },
    });
  },
}));