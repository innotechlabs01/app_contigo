'use client';

import { create } from 'zustand';
import { EvaluationAnswers, EvaluationResponse, OnboardingStep, OnboardingState } from '@/domain/onboarding/types';

interface OnboardingStore extends OnboardingState {
  setStep: (step: OnboardingStep, index: number) => void;
  setEvaluation: (data: EvaluationAnswers | null) => void;
  setEvaluationResult: (score: number, passed: boolean) => void;
  setDocument: (type: 'cv', url: string, fileName: string) => void;
  setVideos: (type: 'presentation' | 'reference', url: string, fileName: string) => void;
  setPersonalInfo: (info: OnboardingState['personalInfo']) => void;
  setStatus: (status: OnboardingState['status']) => void;
  setRequestIdNumber: (idNumber: string | null) => void;
  reset: () => void;
  canProceed: (stepIndex: number) => boolean;
}

const initialState: OnboardingState = {
  currentStep: 'personal',
  stepIndex: 0,
  status: 'idle',
  requestIdNumber: null,
  personalInfo: null,
  evaluation: null,
  evaluationScore: null,
  evaluationPassed: null,
  documents: { cv: null },
  videos: { presentation: undefined, reference: undefined },
};

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  ...initialState,

  setStep: (step, index) => set({ currentStep: step, stepIndex: index }),

  setEvaluation: (data) => set({ evaluation: data }),

  setEvaluationResult: (score, passed) => set({ evaluationScore: score, evaluationPassed: passed }),

  setDocument: (type, url, fileName) =>
    set((state) => ({
      documents: { ...state.documents, [type]: { url, fileName } },
    })),

  setVideos: (type, url, fileName) =>
    set((state) => ({
      videos: { ...state.videos, [type]: { url, fileName } },
    })),

  setPersonalInfo: (info) => set({ personalInfo: info }),

  setStatus: (status) => set({ status }),

  setRequestIdNumber: (idNumber) => set({ requestIdNumber: idNumber }),

  reset: () => set({
    ...initialState,
    evaluation: null,
    evaluationScore: null,
    evaluationPassed: null,
    documents: { cv: null },
    videos: { presentation: undefined, reference: undefined },
  }),

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