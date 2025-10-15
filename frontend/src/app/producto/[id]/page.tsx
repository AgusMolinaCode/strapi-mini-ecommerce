'use client';

import React, { useState } from 'react';

const ProductPage = () => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button className="flex items-center gap-2 mb-6 text-gray-700 hover:text-gray-900">
          <span>←</span>
          <span>Volver a la tienda</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img
              src="/placeholder-product.jpg"
              alt="Remera Dry-Fit Premium"
              className="w-full h-auto"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            {/* Category Badge */}
            <span className="inline-block bg-black text-white text-sm px-4 py-1 rounded-full w-fit mb-4">
              ropa
            </span>

            {/* Product Title */}
            <h1 className="text-4xl font-bold mb-4">
              Remera Dry-Fit Premium
            </h1>

            {/* Price */}
            <p className="text-5xl font-bold text-red-500 mb-6">
              $2800
            </p>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              Remera deportiva de alto rendimiento con tecnología Dry-Fit. Tela respirable y secado rápido. Disponible en varios colores.
            </p>

            {/* Stock Info */}
            <p className="text-sm text-gray-700 mb-4">
              Stock disponible: 35 unidades
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  −
                </button>
                <span className="px-6 py-2 border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 mb-8 transition-colors">
              <span>🛒</span>
              <span>Agregar al Carrito - $2800.00</span>
            </button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex flex-col items-center text-center">
                <span className="text-2xl mb-2">✓</span>
                <span className="text-sm text-gray-700">Envío Gratis</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-2xl mb-2">✓</span>
                <span className="text-sm text-gray-700">Garantía</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-2xl mb-2">✓</span>
                <span className="text-sm text-gray-700">Calidad Premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
