'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { videoSchema, type VideoFormData } from '@/domain/onboarding/validations';
import { useOnboardingStore } from '@/infrastructure/store/onboarding-store';
import { Video, X, Play } from 'lucide-react';

interface VideoUploadProps {
  type: 'presentation' | 'reference';
  label: string;
  description: string;
}

function VideoUpload({ type, label, description }: VideoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { setVideos, personalInfo } = useOnboardingStore();

  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !personalInfo) return;
    
    setFile(selectedFile);
    setUploading(true);
    setUploadError(null);
    
    try {
      console.log('Uploading video:', { 
        name: selectedFile.name, 
        type: selectedFile.type, 
        size: selectedFile.size,
        path: `videos/${type}/${personalInfo.idNumber}`
      });

      // Upload to Vercel Blob via FormData
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('path', `videos/${type}/${personalInfo.idNumber}`);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      console.log('Upload response:', { status: res.status, ok: res.ok });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
      }
      
      const { url } = await res.json();
      
      console.log('Upload success:', url);
      
      setPreview(url);
      setVideos(type, url, selectedFile.name);
      setUploading(false);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploading(false);
      setUploadError(error.message || 'Error al subir el video');
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-soft">
      <h3 className="font-semibold text-sm sm:text-base text-slate-700 mb-1">{label}</h3>
      <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">{description}</p>
      
      <input
        type="file"
        accept="video/mp4,video/quicktime"
        className="hidden"
        id={`video-${type}`}
        onChange={handleFileChange}
      />
      
      {preview ? (
        <div className="relative aspect-video bg-slate-900 rounded-lg sm:rounded-xl overflow-hidden">
          <video src={preview} className="w-full h-full object-contain" controls />
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              setFile(null);
            }}
            className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-white/90 p-1 rounded-full"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={`video-${type}`}
          className="flex flex-col items-center justify-center aspect-video bg-slate-100 rounded-lg sm:rounded-xl border-2 border-dashed border-slate-300 cursor-pointer hover:border-secondary transition-colors"
        >
          <Video className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 mb-1 sm:mb-2" />
          <span className="text-xs sm:text-sm text-slate-500">Subir video</span>
          <span className="text-xs text-slate-400 mt-1">MP4, MOV • máx 1GB</span>
        </label>
      )}

      {uploading && (
        <div className="mt-2 sm:mt-3 flex items-center gap-2">
          <div className="animate-spin w-3 h-3 sm:w-4 sm:h-4 border-2 border-secondary border-t-transparent rounded-full" />
          <span className="text-xs sm:text-sm text-slate-600">Subiendo...</span>
        </div>
      )}
    </div>
  );
}

export function VideosStep() {
  const { setStep } = useOnboardingStore();
  const { videos } = useOnboardingStore();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-secondary">Videos de Presentación</h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2">Graba un video presentándote y una referencia</p>
      </div>

      <div className="bg-secondary/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
        <p className="text-xs sm:text-sm text-secondary font-medium">🎥 Requisitos:</p>
        <ul className="text-xs sm:text-sm text-slate-600 mt-2 space-y-1">
          <li>• Duración mínima: 60 segundos</li>
          <li>• Formatos: MP4, MOV</li>
          <li>• Tamaño máximo: 1GB</li>
        </ul>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <VideoUpload
          type="presentation"
          label="Video de Presentación"
          description="Preséntate y cuenta tu experiencia"
        />
        <VideoUpload
          type="reference"
          label="Video de Referencia"
          description="Video de referencia personal"
        />
      </div>

        <div className="flex gap-2 sm:gap-4">
          <Button type="button" variant="outline" onClick={() => setStep('documentation', 2)} className="text-sm sm:text-base py-2 sm:py-3">
            <span className="hidden sm:inline">Atrás</span>
            <span className="sm:hidden">←</span>
          </Button>
          <Button 
            type="button" 
            onClick={() => setStep('review', 4)} 
            disabled={!videos.presentation || !videos.reference} 
            className="flex-1 text-sm sm:text-base py-2 sm:py-3"
          >
          <span className="hidden sm:inline">Continuar</span>
          <span className="sm:hidden">Siguiente</span>
        </Button>
      </div>
    </div>
  );
}