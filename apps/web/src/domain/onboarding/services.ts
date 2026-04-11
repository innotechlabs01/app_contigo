import { EvaluationResult, UploadResult } from './types';
import { apiEndpoints } from './contracts';

export class OnboardingService {
  async evaluate(answers: Record<string, unknown>): Promise<EvaluationResult> {
    const response = await fetch(apiEndpoints.evaluate, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    return response.json();
  }

  async uploadDocument(file: File, type: string): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await fetch(apiEndpoints.upload, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  }
}

export const onboardingService = new OnboardingService();