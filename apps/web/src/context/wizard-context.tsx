'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Occasion, Message, OrderDraft } from '@/lib/types';

interface WizardState {
  step: number;
  occasion: Occasion | null;
  messages: Message[];
  selectedMessage: Message | null;
  orderData: OrderDraft;
}

interface WizardContextType extends WizardState {
  setStep: (step: number) => void;
  setOccasion: (occasion: Occasion) => void;
  setMessages: (messages: Message[]) => void;
  setSelectedMessage: (message: Message) => void;
  setOrderData: (data: Partial<OrderDraft>) => void;
  reset: () => void;
}

const defaultOrderData: OrderDraft = {
  recipientName: '',
  recipientPhone: '',
  senderName: '',
  scheduledDate: '',
};

const defaultState: WizardState = {
  step: 1,
  occasion: null,
  messages: [],
  selectedMessage: null,
  orderData: defaultOrderData,
};

const WizardContext = createContext<WizardContextType | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WizardState>(defaultState);

  const setStep = (step: number) => setState((s) => ({ ...s, step }));
  const setOccasion = (occasion: Occasion) => setState((s) => ({ ...s, occasion, step: 2 }));
  const setMessages = (messages: Message[]) => setState((s) => ({ ...s, messages }));
  const setSelectedMessage = (selectedMessage: Message) =>
    setState((s) => ({ ...s, selectedMessage, step: 3 }));
  const setOrderData = (data: Partial<OrderDraft>) =>
    setState((s) => ({ ...s, orderData: { ...s.orderData, ...data } }));
  const reset = () => setState(defaultState);

  return (
    <WizardContext.Provider
      value={{ ...state, setStep, setOccasion, setMessages, setSelectedMessage, setOrderData, reset }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}
