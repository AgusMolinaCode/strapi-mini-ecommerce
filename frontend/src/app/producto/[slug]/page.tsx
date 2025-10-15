'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getStrapiData } from '@/data/actions/strapi';
import { Producto, ProductosResponse } from '@/lib/interface';
import { extractProductId, isValidSlug } from '@/utils/slugify';

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Producto | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  useEffect(() => {
    async function fetchProduct() {
      try {
        // Validate slug format
        if (!isValidSlug(slug)) {
          setError(true);
          setLoading(false);
          return;
        }

        // Extract ID from slug
        const productId = extractProductId(slug);

        // Fetch product data from Strapi using numeric ID
        const data: ProductosResponse = await getStrapiData(
          `/api/productos?populate=*&filters[id][$eq]=${productId}`
        );

        if (!data?.data || data.data.length === 0) {
          setError(true);
          setLoading(false);
          return;
        }

        setProduct(data.data[0]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(true);
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <p className="text-gray-600 mb-6">El producto que buscas no existe o ha sido eliminado.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  const mainImage = product.imagenes && product.imagenes.length > 0
    ? `${baseUrl}${product.imagenes[0].url}`
    : '/placeholder-product.jpg';

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log(`Adding ${quantity} of ${product.titulo} to cart`);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <span>←</span>
          <span>Volver a la tienda</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-lg overflow-hidden relative h-96 md:h-[600px]">
            <Image
              src={mainImage}
              alt={product.imagenes?.[0]?.alternativeText || product.titulo}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            {/* Category Badge */}
            {product.categoria && (
              <span className="inline-block bg-black text-white text-sm px-4 py-1 rounded-full w-fit mb-4">
                {product.categoria.nombre}
              </span>
            )}

            {/* Product Title */}
            <h1 className="text-4xl font-bold mb-4">
              {product.titulo}
            </h1>

            {/* Price */}
            <div className="mb-6">
              {product.precio_anterior && product.precio_anterior > product.precio && (
                <p className="text-2xl text-gray-400 line-through">
                  ${product.precio_anterior}
                </p>
              )}
              <p className="text-5xl font-bold text-red-500">
                ${product.precio}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              {product.descripcion}
            </p>

            {/* Stock Info */}
            <p className="text-sm text-gray-700 mb-4">
              Stock disponible: {product.stock} unidades
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="px-6 py-2 border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 mb-8 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <span>🛒</span>
              <span>
                {product.stock === 0
                  ? 'Sin stock'
                  : `Agregar al Carrito - $${(product.precio * quantity).toFixed(2)}`
                }
              </span>
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
