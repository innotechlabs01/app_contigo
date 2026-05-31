'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/infrastructure/store/onboarding-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { personalInfoSchema, PersonalInfoFormData } from '@/domain/onboarding/validations';

const serviceTypes = [
  { value: 'Acompañamiento', label: 'Acompañamiento' },
  { value: 'Cuidado', label: 'Cuidado' },
  { value: 'Apoyo', label: 'Apoyo' },
] as const;

const locations = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá',
  'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
  'Cundinamarca', 'Córdoba', 'Guainía', 'Guaviare', 'Huila', 'La Guajira',
  'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío',
  'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
  'Valle del Cauca', 'Vaupés', 'Vichada',
  'Bogotá D.C.',
];

export function PersonalInfoStep() {
  const { setPersonalInfo, setStep, personalInfo } = useOnboardingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateStatus, setDuplicateStatus] = useState<string>('');

  const defaultValues: PersonalInfoFormData = {
    firstName: personalInfo?.firstName ?? '',
    lastName: personalInfo?.lastName ?? '',
    idNumber: personalInfo?.idNumber ?? '',
    email: personalInfo?.email ?? '',
    phone: personalInfo?.phone ?? '',
    location: personalInfo?.location ?? '',
    serviceType: (personalInfo?.serviceType ?? []) as PersonalInfoFormData['serviceType'],
    experience: personalInfo?.experience ?? '',
    message: personalInfo?.message ?? '',
  };

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<PersonalInfoFormData>({
    defaultValues,
    resolver: zodResolver(personalInfoSchema),
    mode: 'onChange',
  });

  const idNumber = watch('idNumber');
  const selectedServices = watch('serviceType');

  const stripNonDigits = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    e.target.value = cleaned;
  };

  const stripNonPhoneChars = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^\d\s+\-()]/g, '');
    e.target.value = cleaned;
  };

  const toggleService = (service: PersonalInfoFormData['serviceType'][number]) => {
    const current = selectedServices || [];
    if (current.includes(service)) {
      setValue('serviceType', current.filter((s) => s !== service), { shouldValidate: true });
    } else {
      setValue('serviceType', [...current, service], { shouldValidate: true });
    }
  };

  const checkDuplicateId = async (idNumber: string) => {
    try {
      const res = await fetch(`/api/requests/check-id/${idNumber}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error checking ID:', error);
      return { exists: false };
    }
  };

  const onSubmit = async (data: PersonalInfoFormData) => {
    setIsSubmitting(true);

    // Check if this ID already exists
    const checkResult = await checkDuplicateId(data.idNumber);

    if (checkResult.exists) {
      setDuplicateStatus(checkResult.status);
      setShowDuplicateModal(true);
      setIsSubmitting(false);
      return;
    }

    setPersonalInfo(data);
    setStep('evaluation', 1);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-secondary">Información Personal</h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2">Completa tus datos para enviar la solicitud</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              id="firstName"
              {...register('firstName')}
              placeholder="Juan"
              className="mt-1"
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
          </div>

          <div>
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              {...register('lastName')}
              placeholder="Pérez"
              className="mt-1"
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="idNumber">Cédula de Ciudadanía</Label>
          <Input
              id="idNumber"
              inputMode="numeric"
              {...register('idNumber', { onChange: stripNonDigits })}
              placeholder="1234567890"
              className="mt-1"
            />
          {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="juan.perez@email.com"
              className="mt-1"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              inputMode="numeric"
              {...register('phone', { onChange: stripNonPhoneChars })}
              placeholder="+57 300 123 4567"
              className="mt-1"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="location">Ubicación (Departamento)</Label>
          <select
            id="location"
            {...register('location')}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="">Seleccionar departamento...</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
        </div>

        <div>
          <Label>Tipo de Servicio</Label>
          <p className="text-xs text-slate-500 mt-1 mb-2">Puedes seleccionar más de uno</p>
          <div className="space-y-2">
            {serviceTypes.map((type) => (
              <label
                key={type.value}
                className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                  (selectedServices || []).includes(type.value)
                    ? 'border-secondary bg-secondary/5 ring-1 ring-secondary'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  value={type.value}
                  checked={(selectedServices || []).includes(type.value as typeof serviceTypes[number]['value'])}
                  onChange={() => toggleService(type.value as typeof serviceTypes[number]['value'])}
                  className="w-4 h-4 text-secondary border-slate-300 rounded focus:ring-secondary"
                />
                <span className="text-sm font-medium text-slate-700">{type.label}</span>
              </label>
            ))}
          </div>
          {errors.serviceType && <p className="text-red-500 text-xs mt-1">{errors.serviceType.message}</p>}
        </div>

        <div>
          <Label htmlFor="experience">Experiencia</Label>
            <textarea
              id="experience"
              {...register('experience')}
              placeholder="Describe tu experiencia previa..."
              className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary min-h-[80px]"
            />
            {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>}
        </div>

        <div>
          <Label htmlFor="message">Mensaje adicional</Label>
            <textarea
              id="message"
              {...register('message')}
              placeholder="Cuéntanos por qué quieres trabajar con Contigo..."
              className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary min-h-[80px]"
            />
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
        </div>

        <div className="flex gap-2 sm:gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 text-sm sm:text-base py-2 sm:py-3"
          >
            {isSubmitting ? 'Guardando...' : 'Continuar'}
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
          </Button>
        </div>
      </form>

      {showDuplicateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">Ya realizaste la evaluación</h3>
              <p className="text-slate-600 mt-2">
                Esta persona ya realizó una evaluación y no puede repetirla.
              </p>
              <p className="text-sm text-slate-500 mt-4">
                Estado actual: <span className="font-semibold capitalize">{duplicateStatus}</span>
              </p>
            </div>
            <Button
              onClick={() => setShowDuplicateModal(false)}
              className="w-full"
            >
              Entendido
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
