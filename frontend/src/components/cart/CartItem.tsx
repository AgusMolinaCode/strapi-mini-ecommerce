import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X } from 'lucide-react';
import { CartItem as CartItemType } from '@/lib/interface';
import { useCartStore } from '@/store/cartStore';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();

  const handleIncrease = () => {
    if (item.quantity < item.stock) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const subtotal = item.precio * item.quantity;

  return (
    <div className="flex gap-4 py-5 border-b border-gray-200">
      {/* Product Image */}
      <Link
        href={`/producto/${item.slug}`}
        className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden"
      >
        <Image
          src={item.imagen}
          alt={item.titulo}
          fill
          className="object-cover"
          sizes="96px"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <Link
            href={`/producto/${item.slug}`}
            className="text-lg font-medium text-gray-900 hover:text-red-500 transition-colors line-clamp-2"
          >
            {item.titulo}
          </Link>
          <p className="text-xl font-semibold text-red-500 mt-1">
            ${item.precio.toLocaleString()}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="p-2.5 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="px-5 py-2 text-lg font-medium border-x border-gray-300 min-w-[56px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              disabled={item.quantity >= item.stock}
              className="p-2.5 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <p className="text-lg font-medium text-gray-900">
            ${subtotal.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeItem(item.id)}
        className="flex-shrink-0 h-8 w-8 flex items-center justify-center hover:bg-red-50 rounded-full transition-colors"
        aria-label="Eliminar producto"
      >
        <X className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
      </button>
    </div>
  );
};

export default CartItem;
