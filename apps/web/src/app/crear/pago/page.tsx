'use client';

import { useRouter } from 'next/navigation';
import { useWizard } from '@/context/wizard-context';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function PaymentStep() {
  const router = useRouter();
  const { occasion, selectedMessage, orderData, reset } = useWizard();
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!occasion || !selectedMessage) {
      router.push('/crear/ocasion');
    }
  }, [occasion, selectedMessage, router]);

  if (!occasion || !selectedMessage) {
    return null;
  }

  const handlePay = async () => {
    setSubmitting(true);
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion: occasion.name,
          messageText: selectedMessage.text,
          recipientName: orderData.recipientName,
          recipientPhone: orderData.recipientPhone,
          senderName: orderData.senderName,
          scheduledDate: orderData.scheduledDate,
        }),
      });
      setShowModal(true);
    } catch (e) {
      console.error('Order creation failed', e);
    }
    setSubmitting(false);
  };

  const handleCloseAndReset = () => {
    setShowModal(false);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      reset();
      router.push('/');
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <Breadcrumb
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Paso 4 / 4' },
        ]}
      />

      <h1 className="text-3xl font-bold text-text-primary mb-2">Checkout</h1>
      <p className="text-text-secondary mb-10">
        Completa tus datos básicos. Te llevaremos a la pasarela segura para finalizar.
      </p>

      <div className="grid grid-cols-2 gap-8">
        {/* Summary */}
        <div className="bg-white border border-border-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Resumen</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Ocasión</span>
              <span className="font-medium text-text-secondary">{occasion.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Para</span>
              <span className="font-medium text-text-secondary">{orderData.recipientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">De</span>
              <span className="font-medium text-text-secondary">{orderData.senderName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Fecha</span>
              <span className="font-medium text-text-secondary">{orderData.scheduledDate}</span>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <p className="text-text-muted text-xs mb-2 line-clamp-2">{selectedMessage.text}</p>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-100">
              <span className="font-semibold text-text-primary">Total</span>
              <span className="font-bold text-brand-blue text-lg">$4,990 COP</span>
            </div>
          </div>
        </div>

        {/* Payment info */}
        <div className="bg-white border border-border-card rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm text-green-600 mb-6">
            <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-green-500" />
            </span>
            Conexión cifrada. Procesado por pasarela externa.
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Para</label>
              <input
                type="text"
                value={orderData.recipientName}
                readOnly
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Celular destinatario</label>
              <input
                type="tel"
                value={orderData.recipientPhone}
                readOnly
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handlePay}
          disabled={submitting}
          className="btn-primary px-8 py-3 text-base disabled:opacity-50"
        >
          {submitting ? 'Procesando...' : 'Continuar con el pago'}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-[32px] p-8 max-w-[466px] w-full mx-4 text-center relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-secondary"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-3">Casi listo!</h2>
            <p className="text-text-secondary mb-8">
              Aqui te redirigiremos a la plataforma de pagos para finalizar la programación y envío
              de tu mensaje a {orderData.recipientName}.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCloseAndReset}
                className="btn-secondary px-6 py-2.5 text-sm"
              >
                Volver al inicio
              </button>
              <button
                onClick={handleCloseAndReset}
                className="btn-primary px-6 py-2.5 text-sm"
              >
                Crear otro mensaje
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg z-50 animate-bounce">
          Te dirigiremos a la pasarela de pagos
        </div>
      )}
    </div>
  );
}
