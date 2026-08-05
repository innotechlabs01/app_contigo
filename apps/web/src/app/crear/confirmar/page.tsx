'use client';

import { useRouter } from 'next/navigation';
import { useWizard } from '@/context/wizard-context';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { useState, useEffect } from 'react';

export default function ConfirmStep() {
  const router = useRouter();
  const { occasion, selectedMessage, orderData, setOrderData, setStep } = useWizard();
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!occasion || !selectedMessage) {
      router.push('/crear/ocasion');
    }
  }, [occasion, selectedMessage, router]);

  if (!occasion || !selectedMessage) {
    return null;
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!orderData.recipientName.trim()) errs.recipientName = 'Requerido';
    if (!orderData.recipientPhone.trim()) errs.recipientPhone = 'Requerido';
    else if (!/^3\d{9}$/.test(orderData.recipientPhone.replace(/\s/g, '')))
      errs.recipientPhone = 'Celular inválido (ej. 3000000000)';
    if (!orderData.senderName.trim()) errs.senderName = 'Requerido';
    if (!orderData.scheduledDate) errs.scheduledDate = 'Requerida';
    else {
      const d = new Date(orderData.scheduledDate + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d <= today) errs.scheduledDate = 'Debe ser una fecha futura';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      router.push('/crear/pago');
    }
  };

  const inputClass =
    'w-full h-12 px-4 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent';

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Ocasión', href: '/crear/ocasion' },
          { label: 'Mensajes', href: '/crear/mensajes' },
          { label: 'Paso 3 / 4' },
        ]}
      />

      <h1 className="text-3xl font-bold text-text-primary mb-2">Confirma los detalles</h1>
      <p className="text-text-secondary mb-10">Revisa el mensaje y completa los datos del envío.</p>

      <div className="bg-white border border-border-card rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-semibold text-brand-blue">Mensaje 1</span>
          <span className="text-xs bg-blue-50 text-brand-blue px-2 py-0.5 rounded-full">
            {occasion.name}
          </span>
        </div>
        <p className="text-text-secondary leading-relaxed mb-4">{selectedMessage.text}</p>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/crear/mensajes')}
            className="text-sm text-brand-blue hover:underline font-medium"
          >
            Editar
          </button>
          <button
            onClick={() => {
              setStep(1);
              router.push('/crear/ocasion');
            }}
            className="text-sm text-red-500 hover:underline font-medium"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="bg-white border border-border-card rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-text-primary mb-6">Datos de envío</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Para</label>
            <input
              type="text"
              placeholder="Para quien es?"
              value={orderData.recipientName}
              onChange={(e) => setOrderData({ recipientName: e.target.value })}
              className={inputClass}
            />
            {errors.recipientName && <p className="text-red-500 text-xs mt-1">{errors.recipientName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Celular destinatario</label>
            <input
              type="tel"
              placeholder="300 000 00 00"
              value={orderData.recipientPhone}
              onChange={(e) => setOrderData({ recipientPhone: e.target.value })}
              className={inputClass}
            />
            {errors.recipientPhone && <p className="text-red-500 text-xs mt-1">{errors.recipientPhone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">De</label>
            <input
              type="text"
              placeholder="Tu nombre"
              value={orderData.senderName}
              onChange={(e) => setOrderData({ senderName: e.target.value })}
              className={inputClass}
            />
            {errors.senderName && <p className="text-red-500 text-xs mt-1">{errors.senderName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Fecha de envío</label>
            <input
              type="date"
              value={orderData.scheduledDate}
              onChange={(e) => setOrderData({ scheduledDate: e.target.value })}
              className={inputClass}
            />
            {errors.scheduledDate && <p className="text-red-500 text-xs mt-1">{errors.scheduledDate}</p>}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={handleContinue} className="btn-primary px-8 py-3 text-base">
          Continuar con el pago
        </button>
      </div>
    </div>
  );
}
