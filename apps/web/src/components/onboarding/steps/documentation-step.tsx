'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { documentSchema, type DocumentFormData } from '@/domain/onboarding/validations';
import { useOnboardingStore } from '@/infrastructure/store/onboarding-store';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DocumentationStep() {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { setDocument, setStep } = useOnboardingStore();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    mode: 'onChange',
  });

  const fileWatch = watch('file');

  const onSubmit = async (data: DocumentFormData) => {
    setUploading(true);
    // Simular upload - en producción usar onboardingService.uploadDocument
    setTimeout(() => {
      setDocument('cv', URL.createObjectURL(data.file), data.file.name);
      setUploading(false);
      setStep('videos', 2);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-secondary">Documentación</h2>
        <p className="text-slate-600 mt-2">Sube tu CV y documentos requeridos</p>
      </div>

      <div className="bg-secondary/10 p-4 rounded-2xl">
        <p className="text-sm text-secondary font-medium">📋 Requisitos:</p>
        <ul className="text-sm text-slate-600 mt-2 space-y-1">
          <li>• Formatos: PDF, DOC, DOCX</li>
          <li>• Tamaño máximo: 10MB</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-secondary transition-colors">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            id="cv-upload"
            {...register('file')}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setFile(f);
            }}
          />
          <label htmlFor="cv-upload" className="cursor-pointer">
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-secondary" />
                <span className="font-medium">{file.name}</span>
                <button type="button" onClick={(e) => { e.preventDefault(); setFile(null); }} className="ml-2">
                  <X className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">Arrastra tu CV o <span className="text-secondary font-medium">explora</span></p>
              </>
            )}
          </label>
          {errors.file && <p className="text-red-500 text-sm mt-2">{errors.file.message}</p>}
        </div>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => setStep('evaluation', 0)}>
            Atrás
          </Button>
          <Button type="submit" disabled={!file || uploading} className="flex-1">
            {uploading ? 'Subiendo...' : 'Continuar'}
          </Button>
        </div>
      </form>
    </div>
  );
}