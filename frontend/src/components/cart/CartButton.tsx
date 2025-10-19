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
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        aria-label={`Carrito de compras (${totalItems} items)`}
      >
        <IconShoppingCart className="h-6 w-6 text-black" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-md font-semibold rounded-full min-h-6 min-w-6 px-1.5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center px-4 py-2 rounded-lg transition-colors cursor-pointer"
      aria-label={`Carrito de compras (${totalItems} items)`}
    >
      <IconShoppingCart className="h-8 w-8" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-lg rounded-full min-h-6 min-w-6 px-1.5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </button>
  );
};

export default CartButton;
