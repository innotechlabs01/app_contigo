export interface EvaluationAnswers {
  [questionId: string]: string | number | boolean;
}

export interface EvaluationResult {
  passed: boolean;
  score?: number;
  feedback?: string;
}

export interface DocumentUpload {
  file: File;
  type: 'cv' | 'reference' | 'video';
}

export interface UploadResult {
  url: string;
  fileName: string;
}

export interface VideoSubmission {
  presentation?: UploadResult;
  reference?: UploadResult;
}

export type OnboardingStep = 
  | 'evaluation'
  | 'documentation'
  | 'videos'
  | 'review';

export interface OnboardingState {
  currentStep: OnboardingStep;
  stepIndex: number;
  evaluation: EvaluationAnswers | null;
  documents: {
    cv: UploadResult | null;
  };
  videos: VideoSubmission;
  status: 'in_progress' | 'in_review' | 'approved' | 'rejected';
}

export interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  percentage: number;
}