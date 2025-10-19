'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Flame } from 'lucide-react';
import { useCheckoutStore } from '@/store/checkoutStore';
import type { Plan } from '@/lib/interface';

interface PlanCardProps {
  plan: Plan;
  borderStyle: string;
  buttonStyle: string;
  periodoTexto: string;
}

const getPaymentNote = (periodo: string): string => {
  const notes: Record<string, string> = {
    mensual: 'Pago mes a mes',
    trimestral: 'Pago cada 3 meses',
    anual: 'Pago anual',
  };
  return notes[periodo] || '';
};

const PlanCard: React.FC<PlanCardProps> = ({ plan, borderStyle, buttonStyle, periodoTexto }) => {
  const router = useRouter();
  const { setSelectedPlan } = useCheckoutStore();

  const handleSelectPlan = () => {
    setSelectedPlan(plan);
    router.push('/checkout/plan');
  };

  return (
    <div
      className={`relative rounded-2xl border-2 ${borderStyle} shadow-sm hover:shadow-lg transition-all duration-300 w-full flex flex-col ${
        plan.popular
          ? 'lg:w-[460px] lg:scale-105 z-10 bg-gradient-to-br from-red-100 via-pink-100 to-orange-100'
          : 'lg:w-[380px] bg-white'
      } ${plan.popular ? 'p-10' : 'p-8'}`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="px-4 py-1.5 bg-red-500 text-white rounded-full text-lg font-bold uppercase tracking-wide shadow-md flex items-center gap-1">
            <Flame className="w-8 h-8" fill="currentColor" />
            MÁS POPULAR
          </span>
        </div>
      )}

      {/* Plan Name */}
      <h3
        className={`font-bold text-gray-900 mb-4 ${
          plan.popular ? 'text-3xl' : 'text-2xl'
        }`}
      >
        {plan.nombre}
      </h3>

      {/* Price */}
      <div className="mb-2">
        <span
          className={`font-bold text-gray-900 ${
            plan.popular ? 'text-6xl' : 'text-5xl'
          }`}
        >
          ${plan.precio}
        </span>
        <span
          className={`text-gray-600 ml-1 ${
            plan.popular ? 'text-xl' : 'text-lg'
          }`}
        >
          {periodoTexto}
        </span>
      </div>

      {/* Payment Note */}
      {getPaymentNote(plan.periodo) && (
        <p className="text-gray-500 text-sm mb-6">
          {getPaymentNote(plan.periodo)}
        </p>
      )}

      {/* Features */}
      <ul
        className={`mb-8 flex-grow ${plan.popular ? 'space-y-4' : 'space-y-3.5'}`}
      >
        {/* Feature items */}
        {plan.feature?.map((feature) => (
          <li key={feature.id} className="flex items-start">
            <span
              className={`inline-block rounded-full border-2 border-red-500 mr-3 mt-0.5 flex-shrink-0 ${
                plan.popular ? 'w-6 h-6' : 'w-5 h-5'
              }`}
            ></span>
            <span
              className={`text-gray-700 ${
                plan.popular ? 'text-xl' : 'text-lg'
              }`}
            >
              {feature.text}
            </span>
          </li>
        ))}

        {/* Feature_full items */}
        {plan.feature_full?.map((featureFull) => (
          <li key={featureFull.id} className="flex items-start">
            <span
              className={`inline-block rounded-full border-2 border-red-500 mr-3 mt-0.5 flex-shrink-0 ${
                plan.popular ? 'w-6 h-6' : 'w-5 h-5'
              }`}
            ></span>
            <span
              className={`text-gray-700 ${
                plan.popular ? 'text-xl' : 'text-lg'
              }`}
            >
              {featureFull.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <button
        onClick={handleSelectPlan}
        className={`w-full rounded-xl cursor-pointer font-semibold ${buttonStyle} transition-all duration-200 flex items-center justify-center gap-2 group mt-auto ${
          plan.popular
            ? 'py-5 px-8 text-lg shadow-md'
            : 'py-4 px-6 text-base'
        }`}
      >
        <ShoppingCart
          className={`${plan.popular ? 'w-5 h-5' : 'w-4 h-4'}`}
        />
        Seleccionar Plan
      </button>
    </div>
  );
};

export default PlanCard;
