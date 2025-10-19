'use client';

import React, { useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import CartItem from './CartItem';

const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, getTotalItems, getTotalPrice } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 bg-opacity-20 z-40 transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-3xl font-semibold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8" />
            Carrito ({totalItems})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="bg-gray-100 p-8 rounded-full mb-6">
                <ShoppingBag className="w-20 h-20 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Tu carrito está vacío
              </h3>
              <p className="text-xl text-gray-600 mb-8">
                Agrega productos para comenzar tu compra
              </p>
              <button
                onClick={closeCart}
                className="bg-red-500 hover:bg-red-600 text-white text-xl font-medium py-3 px-8 rounded-lg transition-colors"
              >
                Ir a la tienda
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer with Total and Checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-2xl font-medium text-gray-900">Total</span>
              <span className="text-4xl font-semibold text-red-500">
                ${totalPrice.toLocaleString()}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              className="w-full bg-red-500 hover:bg-red-600 text-white text-xl font-medium py-4 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
              onClick={() => {
                // TODO: Implement checkout functionality
                alert('Funcionalidad de checkout próximamente');
              }}
            >
              Proceder al Pago
            </button>

            {/* Continue Shopping */}
            <button
              onClick={closeCart}
              className="w-full mt-4 bg-white hover:bg-gray-100 text-gray-900 text-xl font-medium py-4 px-6 rounded-lg transition-colors border border-gray-300"
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
