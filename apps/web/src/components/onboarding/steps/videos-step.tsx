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
  register: any;
  errors: any;
}

function VideoUpload({ type, label, description, register, errors }: VideoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { setVideos } = useOnboardingStore();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // Simular upload
    await new Promise(r => setTimeout(r, 2000));
    const url = URL.createObjectURL(file);
    setPreview(url);
    setVideos(type, url, file.name);
    setUploading(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-soft">
      <h3 className="font-semibold text-slate-700 mb-1">{label}</h3>
      <p className="text-sm text-slate-500 mb-4">{description}</p>
      
      <input
        type="file"
        accept="video/mp4,video/quicktime"
        className="hidden"
        id={`video-${type}`}
        {...register}
        onChange={handleUpload}
      />
      
      {preview ? (
        <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden">
          <video src={preview} className="w-full h-full object-contain" controls />
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 bg-white/90 p-1 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={`video-${type}`}
          className="flex flex-col items-center justify-center aspect-video bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 cursor-pointer hover:border-secondary transition-colors"
        >
          <Video className="w-10 h-10 text-slate-400 mb-2" />
          <span className="text-sm text-slate-500">Subir video</span>
          <span className="text-xs text-slate-400 mt-1">MP4, MOV • máx 1GB</span>
        </label>
      )}

      {uploading && (
        <div className="mt-3 flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-secondary border-t-transparent rounded-full" />
          <span className="text-sm text-slate-600">Subiendo...</span>
        </div>
      )}
      {errors?.file && <p className="text-red-500 text-sm mt-2">{errors.file.message}</p>}
    </div>
  );
}

export function VideosStep() {
  const { register, formState: { errors }, watch } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    mode: 'onChange',
  });
  
  const { setStep } = useOnboardingStore();
  const hasPresentation = watch('file');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-secondary">Videos de Presentación</h2>
        <p className="text-slate-600 mt-2">Graba un video presentándote y una referencia</p>
      </div>

      <div className="bg-secondary/10 p-4 rounded-2xl">
        <p className="text-sm text-secondary font-medium">🎥 Requisitos:</p>
        <ul className="text-sm text-slate-600 mt-2 space-y-1">
          <li>• Duración mínima: 60 segundos</li>
          <li>• Formatos: MP4, MOV</li>
          <li>• Tamaño máximo: 1GB</li>
        </ul>
      </div>

      <div className="space-y-4">
        <VideoUpload
          type="presentation"
          label="Video de Presentación"
          description="Preséntate y cuenta tu experiencia"
          register={register('file')}
          errors={errors}
        />
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => setStep('documentation', 1)}>
          Atrás
        </Button>
        <Button type="button" onClick={() => setStep('review', 3)} disabled={!hasPresentation} className="flex-1">
          Continuar
        </Button>
      </div>
    </div>
  );
}