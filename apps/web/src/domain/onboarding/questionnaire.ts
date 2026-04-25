export interface QuestionnaireAnswer {
  id: string;
  text: string;
  score: number;
  isCorrect?: boolean;
}

export type QuestionType = 'single-choice' | 'multiple-choice';

export interface QuestionnaireQuestion {
  id: string;
  text: string;
  pillar?: string;
  weight: number;
  type: QuestionType;
  answers: QuestionnaireAnswer[];
  isActive: boolean;
  order: number;
}

export interface Questionnaire {
  id: string;
  name: string;
  description?: string;
  stepTarget: 'evaluation' | 'documentation' | 'videos' | 'review';
  questions: QuestionnaireQuestion[];
  passingScore: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionnaireSummary {
  id: string;
  name: string;
  stepTarget: string;
  questionCount: number;
  isPublished: boolean;
  createdAt: string;
}

export function createEmptyQuestion(): QuestionnaireQuestion {
  return {
    id: crypto.randomUUID(),
    text: '',
    pillar: '',
    weight: 1,
    type: 'single-choice',
    answers: [
      { id: crypto.randomUUID(), text: '', score: 5 },
      { id: crypto.randomUUID(), text: '', score: 4 },
      { id: crypto.randomUUID(), text: '', score: 3 },
      { id: crypto.randomUUID(), text: '', score: 2 },
    ],
    isActive: true,
    order: 0,
  };
}

export function createEmptyQuestionnaire(): Questionnaire {
  return {
    id: crypto.randomUUID(),
    name: 'Nuevo Cuestionario',
    description: '',
    stepTarget: 'evaluation',
    questions: [],
    passingScore: 80,
    isPublished: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export const DEFAULT_PILLARS = [
  'Integrity',
  'Responsibility',
  'Emotional Capacity',
  'Boundary Management',
  'Relational Style',
  'Cognitive Execution',
  'Risk Awareness',
  'Problem Solving',
  'Conflict Resolution',
  'Assertive Communication',
  'Adaptability',
  'Empathy',
  'Soft Skills',
  'Intentionality',
];

export const STEP_TARGETS = [
  { value: 'evaluation', label: 'Evaluación' },
  { value: 'documentation', label: 'Documentación' },
  { value: 'videos', label: 'Videos' },
  { value: 'review', label: 'Revisión' },
] as const;

// Deterministic shuffle function that produces the same order given a seed
export function shuffleArray<T>(array: T[]): T[] {
  // For backward compatibility, we'll use a deterministic approach
  // In a real app, you might want to pass a seed parameter
  // But for now, we'll make it deterministic by not shuffling at all
  // This ensures server/client render consistency
  return [...array];
}