export interface EvaluationAnswers {
  [questionId: string]: string | number | boolean;
}

export interface EvaluationResponse {
  [questionId: number]: number;
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
  | 'personal'
  | 'review';

export interface OnboardingState {
  currentStep: OnboardingStep;
  stepIndex: number;
  evaluation: EvaluationAnswers | EvaluationResponse | null;
  evaluationScore: number | null;
  evaluationPassed: boolean | null;
  documents: {
    cv: UploadResult | null;
  };
  videos: VideoSubmission;
  personalInfo: {
    firstName: string;
    lastName: string;
    idNumber: string;
    email: string;
    phone: string;
    location: string;
    serviceType: string[];
    experience: string;
    message: string;
  } | null;
  status: 'idle' | 'in_progress' | 'in_review' | 'approved' | 'rejected';
  requestIdNumber: string | null;
}

export interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  percentage: number;
}