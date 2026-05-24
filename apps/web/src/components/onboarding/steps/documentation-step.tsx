'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { documentSchema, type DocumentFormData } from '@/domain/onboarding/validations';
import { useOnboardingStore } from '@/infrastructure/store/onboarding-store';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';

export function DocumentationStep() {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setDocument, setStep, personalInfo } = useOnboardingStore();
  
  const { handleSubmit, formState: { errors }, setValue } = useForm<DocumentFormData>({
    mode: 'onSubmit',
  });

  const onSubmit = async () => {
    console.log('onSubmit triggered', { 
      hasFile: !!file, 
      fileName: file?.name, 
      fileType: file?.type, 
      fileSize: file?.size,
      hasPersonalInfo: !!personalInfo 
    });

    if (!file || !personalInfo) {
      setUploadError('Debe seleccionar un archivo');
      return;
    }

    // Manual validation
    if (!(file instanceof File)) {
      setUploadError('El archivo no es válido');
      return;
    }

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError(`Formato no permitido: ${file.type}. Use PDF, DOC o DOCX.`);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('El archivo excede 10MB');
      return;
    }

    setUploading(true);
    setUploadError(null);
    
    try {
      // Upload to Vercel Blob via API route
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', `documents/cv/${personalInfo.idNumber}`);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      console.log('Upload response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
      }
      
      const result = await res.json();
      console.log('Upload result:', result);
      
      const { url } = result;
      
      if (!url) {
        throw new Error('No se recibió la URL del archivo subido');
      }
      
      setDocument('cv', url, file.name);
      setUploading(false);
      setStep('videos', 3);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploading(false);
      setUploadError(error.message || 'Error al subir el archivo. Intenta de nuevo.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setValue('file', f, { shouldValidate: true });
    } else {
      setFile(null);
      setValue('file', undefined as any, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-secondary">Documentación</h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2">Sube tu CV y documentos requeridos</p>
      </div>

      <div className="bg-secondary/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
        <p className="text-xs sm:text-sm text-secondary font-medium">📋 Requisitos:</p>
        <ul className="text-xs sm:text-sm text-slate-600 mt-2 space-y-1">
          <li>• Formatos: PDF, DOC, DOCX</li>
          <li>• Tamaño máximo: 10MB</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        <div className="border-2 border-dashed border-slate-300 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center hover:border-secondary transition-colors">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            id="cv-upload"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <label htmlFor="cv-upload" className="cursor-pointer">
            {file ? (
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
                <span className="font-medium text-sm sm:text-base break-all">{file.name}</span>
                <button 
                  type="button" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    setFile(null); 
                    setValue('file', undefined as any, { shouldValidate: true });
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }} 
                  className="ml-1 sm:ml-2"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-2 sm:mb-3" />
                <p className="text-sm sm:text-base text-slate-600">Arrastra tu CV o <span className="text-secondary font-medium">explora</span></p>
              </>
            )}
          </label>
          {uploadError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{uploadError}</p>
            </div>
          )}
         </div>

        <div className="flex gap-2 sm:gap-4">
          <Button type="button" variant="outline" onClick={() => setStep('evaluation', 0)} className="text-sm sm:text-base py-2 sm:py-3">
            <span className="hidden sm:inline">Atrás</span>
            <span className="sm:hidden">←</span>
          </Button>
          <Button type="submit" disabled={!file || uploading} className="flex-1 text-sm sm:text-base py-2 sm:py-3">
            {uploading ? 'Subiendo...' : <span className="hidden sm:inline">Continuar</span>}
            {uploading ? '' : <span className="sm:hidden">Siguiente</span>}
          </Button>
        </div>
      </form>
    </div>
  );
}