'use client';

import { create } from 'zustand';
import { EvaluationAnswers, OnboardingStep, OnboardingState } from '@/domain/onboarding/types';

interface OnboardingStore extends OnboardingState {
  setStep: (step: OnboardingStep, index: number) => void;
  setEvaluation: (data: EvaluationAnswers | null) => void;
  setDocument: (type: 'cv', url: string, fileName: string) => void;
  setVideos: (type: 'presentation' | 'reference', url: string, fileName: string) => void;
  setStatus: (status: OnboardingState['status']) => void;
  reset: () => void;
  canProceed: (stepIndex: number) => boolean;
}

const initialState: OnboardingState = {
  currentStep: 'evaluation',
  stepIndex: 0,
  evaluation: null,
  documents: { cv: null },
  videos: { presentation: undefined, reference: undefined },
  status: 'in_progress',
};

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  ...initialState,

  setStep: (step, index) => set({ currentStep: step, stepIndex: index }),

  setEvaluation: (data) => set({ evaluation: data }),

  setDocument: (type, url, fileName) =>
    set((state) => ({
      documents: { ...state.documents, [type]: { url, fileName } },
    })),

  setVideos: (type, url, fileName) =>
    set((state) => ({
      videos: { ...state.videos, [type]: { url, fileName } },
    })),

  setStatus: (status) => set({ status }),

  reset: () => set(initialState),

  canProceed: (stepIndex) => {
    const state = get();
    switch (stepIndex) {
      case 0:
        return state.evaluation !== null && Object.keys(state.evaluation).length > 0;
      case 1:
        return state.documents.cv !== null;
      case 2:
        return !!(state.videos.presentation?.url && state.videos.reference?.url);
      case 3:
        return true;
      default:
        return false;
    }
  },
}));