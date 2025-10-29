import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Plan } from '@/lib/interface';

interface CheckoutStore {
  // Plan seleccionado para suscripción
  selectedPlan: Plan | null;
  setSelectedPlan: (plan: Plan | null) => void;

  // Estado del proceso de pago
  paymentStatus: 'idle' | 'processing' | 'success' | 'error';
  setPaymentStatus: (status: 'idle' | 'processing' | 'success' | 'error') => void;

  // Datos del suscriptor (solo para planes)
  subscriberData: {
    nombre?: string;
    apellido?: string;
    email?: string;
    telefono?: string;
    dni?: string;
  } | null;
  setSubscriberData: (data: CheckoutStore['subscriberData']) => void;

  // Preferencia de MercadoPago
  preferenceId: string | null;
  setPreferenceId: (id: string | null) => void;

  // Reset store
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      selectedPlan: null,
      setSelectedPlan: (plan) => set({ selectedPlan: plan }),

      paymentStatus: 'idle',
      setPaymentStatus: (status) => set({ paymentStatus: status }),

      subscriberData: null,
      setSubscriberData: (data) => set({ subscriberData: data }),

      preferenceId: null,
      setPreferenceId: (id) => set({ preferenceId: id }),

      resetCheckout: () =>
        set({
          selectedPlan: null,
          paymentStatus: 'idle',
          subscriberData: null,
          preferenceId: null,
        }),
    }),
    {
      name: 'fitpro-checkout',
      partialize: (state) => ({
        selectedPlan: state.selectedPlan,
        subscriberData: state.subscriberData,
      }),
    }
  )
);
