'use client';

import React, { useState, useEffect } from 'react';
import { IconShoppingCart } from '@tabler/icons-react';
import { useCartStore } from '@/store/cartStore';

interface CartButtonProps {
  variant?: 'desktop' | 'mobile';
}

const CartButton: React.FC<CartButtonProps> = ({ variant = 'desktop' }) => {
  const { openCart, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  if (variant === 'mobile') {
    return (
      <button
        onClick={openCart}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label={`Carrito de compras (${totalItems} items)`}
      >
        <IconShoppingCart className="h-6 w-6 text-black" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-sm font-semibold rounded-full min-h-6 min-w-6 px-1.5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
      aria-label={`Carrito de compras (${totalItems} items)`}
    >
      <IconShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-white text-red-500 text-lg rounded-full min-h-6 min-w-6 px-1.5 flex items-center justify-center border-2 border-red-500">
          {totalItems}
        </span>
      )}
    </button>
  );
};

export default CartButton;
