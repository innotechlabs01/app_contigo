import { EvaluationResult, UploadResult } from './types';

export interface IEvaluationApi {
  evaluate(answers: Record<string, unknown>): Promise<EvaluationResult>;
}

export interface IDocumentApi {
  uploadDocument(file: File, type: string): Promise<UploadResult>;
}

export interface OnboardingApiContracts {
  'POST /onboarding/evaluate': {
    request: { answers: Record<string, unknown> };
    response: { passed: boolean; score?: number; feedback?: string };
  };
  'POST /onboarding/upload': {
    request: { file: File; type: string };
    response: { url: string; fileName: string };
  };
}

export const apiEndpoints = {
  evaluate: '/api/onboarding/evaluate',
  upload: '/api/onboarding/upload',
} as const;