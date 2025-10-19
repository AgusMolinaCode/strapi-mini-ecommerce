'use client';

import React from 'react';
import { ShoppingBag, Package } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import type { Plan } from '@/lib/interface';

interface OrderSummaryProps {
  type: 'product' | 'plan';
  plan?: Plan;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ type, plan }) => {
  const { items, getTotalPrice } = useCartStore();

  if (type === 'plan' && plan) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Package className="w-6 h-6 text-red-500" />
          Resumen de Suscripción
        </h2>

        <div className="space-y-4 mb-6">
          <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
            <h3 className="font-semibold text-xl text-gray-900 mb-2">
              {plan.nombre}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Período: {plan.periodo.charAt(0).toUpperCase() + plan.periodo.slice(1)}
            </p>

            {/* Features */}
            <ul className="space-y-2 mb-4">
              {plan.feature?.map((feature) => (
                <li key={feature.id} className="flex items-start text-sm">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-2 mt-1.5 flex-shrink-0"></span>
                  <span className="text-gray-700">{feature.text}</span>
                </li>
              ))}
              {plan.feature_full?.map((featureFull) => (
                <li key={featureFull.id} className="flex items-start text-sm">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-2 mt-1.5 flex-shrink-0"></span>
                  <span className="text-gray-700">{featureFull.text}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-red-300 pt-4 flex items-center justify-between">
              <span className="text-gray-700 font-medium">Total:</span>
              <span className="text-3xl font-bold text-red-500">
                ${plan.precio}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            💡 <strong>Suscripción recurrente:</strong> El pago se renovará automáticamente cada {plan.periodo}.
          </p>
        </div>
      </div>
    );
  }

  // Order summary for products
  const totalPrice = getTotalPrice();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <ShoppingBag className="w-6 h-6 text-red-500" />
        Resumen del Pedido
      </h2>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-200">
            <img
              src={item.imagen}
              alt={item.titulo}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{item.titulo}</h3>
              <p className="text-gray-600 text-sm">Cantidad: {item.quantity}</p>
            </div>
            <span className="font-semibold text-gray-900">
              ${(item.precio * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-gray-600">
          <span>Subtotal:</span>
          <span className="font-medium">${totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span>Envío:</span>
          <span className="font-medium text-green-600">Gratis</span>
        </div>
        <div className="border-t border-gray-300 pt-3 flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-3xl font-bold text-red-500">
            ${totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-6 bg-green-50 rounded-lg p-4">
        <p className="text-sm text-green-800">
          ✓ Envío gratis en todas las compras
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
