'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getStrapiData } from '@/data/actions/strapi';
import { Producto, ProductosResponse } from '@/lib/interface';
import { extractProductId, isValidSlug } from '@/utils/slugify';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import RelatedProducts from '@/components/product/RelatedProducts';

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

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log(`Adding ${quantity} of ${product.titulo} to cart`);
  };

  return (
    <div className=" bg-white px-4 py-28 md:py-30 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Gallery */}
          <ProductImageGallery
            images={product.imagenes || []}
            productTitle={product.titulo}
            baseUrl={baseUrl}
          />

          {/* Product Details */}
          <div className="flex flex-col">
            {/* Category Badge */}
            {product.categoria && (
              <span className="inline-block bg-black text-white text-base md:text-lg px-5 py-2 rounded-full w-fit mb-6">
                {product.categoria.nombre}
              </span>
            )}

            {/* Product Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {product.titulo}
            </h1>

            {/* Price */}
            <div className="mb-8">
              {product.precio_anterior && product.precio_anterior > product.precio && (
                <p className="text-2xl md:text-3xl text-gray-400 line-through mb-2">
                  ${product.precio_anterior}
                </p>
              )}
              <p className="text-5xl md:text-6xl lg:text-7xl font-bold text-red-500">
                ${product.precio}
              </p>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              {product.descripcion}
            </p>

            {/* Stock Info */}
            <p className="text-base md:text-lg text-gray-700 mb-6">
              Stock disponible: <span className="font-semibold">{product.stock}</span> unidades
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 py-3 md:px-6 md:py-4 text-xl md:text-2xl hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="px-8 py-3 md:px-10 md:py-4 text-xl md:text-2xl font-semibold border-x-2 border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-5 py-3 md:px-6 md:py-4 text-xl md:text-2xl hover:bg-gray-100 transition-colors"
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
              className="w-full bg-red-500 hover:bg-red-600 text-white text-xl md:text-2xl lg:text-3xl py-2 md:py-3 px-8 rounded-xl flex items-center justify-center gap-4 mb-10 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
            >
              {/* <span className="text-3xl md:text-4xl">🛒</span> */}
              <span>
                {product.stock === 0
                  ? 'Sin stock'
                  : `Agregar al Carrito - $${(product.precio * quantity).toFixed(2)}`
                }
              </span>
            </button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t-2 border-gray-200">
              <div className="flex flex-col items-center text-center">
                <span className="text-3xl md:text-4xl mb-3">✓</span>
                <span className="text-sm md:text-base lg:text-lg font-medium text-gray-700">Envío Gratis</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-3xl md:text-4xl mb-3">✓</span>
                <span className="text-sm md:text-base lg:text-lg font-medium text-gray-700">Garantía</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-3xl md:text-4xl mb-3">✓</span>
                <span className="text-sm md:text-base lg:text-lg font-medium text-gray-700">Calidad Premium</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Carousel */}
        {product.categoria && (
          <RelatedProducts
            categoryId={product.categoria.id}
            currentProductId={product.id}
          />
        )}
      </div>
    </div>
  );
};

export default ProductPage;
