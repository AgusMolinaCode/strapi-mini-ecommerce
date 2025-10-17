'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getStrapiData } from '@/data/actions/strapi';
import { Producto, ProductosResponse } from '@/lib/interface';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import RelatedProducts from '@/components/product/RelatedProducts';
import { Mail, Phone, MessageCircle } from 'lucide-react';

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
        // Validate slug exists
        if (!slug || typeof slug !== 'string') {
          setError(true);
          setLoading(false);
          return;
        }

        // Fetch product data from Strapi using slug
        const data: ProductosResponse = await getStrapiData(
          `/api/productos?populate=*&filters[slug][$eq]=${slug}`
        );

        if (!data?.data || data.data.length === 0) {
          setError(true);
          setLoading(false);
          return;
        }

        setProduct(data.data[0]);
        setLoading(false);
      } catch (err) {
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
  };

  // Check if product is inactive or out of stock
  const isInactive = product.activo !== true;
  const isOutOfStock = product.stock === 0;
  const showUnavailableMessage = isInactive || isOutOfStock;


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
            {/* Category Badges */}
            {product.categorias && product.categorias.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.categorias.map((categoria) => (
                  <span
                    key={categoria.id}
                    className="inline-block bg-black text-white text-base md:text-lg px-5 py-2 rounded-full"
                  >
                    {categoria.nombre}
                  </span>
                ))}
              </div>
            )}

            {/* Product Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {product.titulo}
            </h1>

            {/* Price */}
            <div className="mb-8">
              {product.en_oferta === true && product.precio_anterior && product.precio_anterior > product.precio && (
                <p className="text-2xl md:text-3xl text-gray-400 line-through mb-2">
                  ${product.precio_anterior.toLocaleString()}
                </p>
              )}
              <p className="text-5xl md:text-6xl lg:text-7xl font-bold text-red-500">
                ${product.precio.toLocaleString()}
              </p>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              {product.descripcion}
            </p>

            {/* Unavailable Message (Inactive or Out of Stock) */}
            {showUnavailableMessage ? (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 md:p-8 mb-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-amber-500 text-white p-3 rounded-full">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                      {isInactive ? 'Producto No Disponible' : 'Producto Agotado'}
                    </h3>
                    <p className="text-base md:text-lg text-gray-700 mb-4">
                      {isInactive
                        ? 'Este producto actualmente no está disponible para la venta.'
                        : 'Lo sentimos, este producto está temporalmente agotado.'}
                    </p>
                    <p className="text-base text-gray-600 mb-4">
                      ¿Interesado en este producto? Contáctanos y te ayudaremos:
                    </p>
                  </div>
                </div>

                {/* Contact Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a
                    href="mailto:contacto@fitpro.com"
                    className="flex items-center gap-3 bg-white hover:bg-gray-50 border-2 border-amber-300 rounded-xl p-4 transition-all duration-200 hover:shadow-md group"
                  >
                    <div className="bg-amber-100 text-amber-600 p-2 rounded-lg group-hover:bg-amber-200 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-sm font-semibold text-gray-900">Enviar mensaje</p>
                    </div>
                  </a>

                  <a
                    href="tel:+1234567890"
                    className="flex items-center gap-3 bg-white hover:bg-gray-50 border-2 border-amber-300 rounded-xl p-4 transition-all duration-200 hover:shadow-md group"
                  >
                    <div className="bg-amber-100 text-amber-600 p-2 rounded-lg group-hover:bg-amber-200 transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <p className="text-sm font-semibold text-gray-900">Llamar ahora</p>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white hover:bg-gray-50 border-2 border-amber-300 rounded-xl p-4 transition-all duration-200 hover:shadow-md group"
                  >
                    <div className="bg-amber-100 text-amber-600 p-2 rounded-lg group-hover:bg-amber-200 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">WhatsApp</p>
                      <p className="text-sm font-semibold text-gray-900">Chat directo</p>
                    </div>
                  </a>
                </div>
              </div>
            ) : (
              <>
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
                  className="w-full bg-red-500 hover:bg-red-600 text-white text-xl md:text-2xl lg:text-3xl py-2 md:py-3 px-8 rounded-xl flex items-center justify-center gap-4 mb-10 transition-colors shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <span>
                    Agregar al Carrito - ${(product.precio * quantity).toLocaleString()}
                  </span>
                </button>
              </>
            )}

            
          </div>
        </div>

        {/* Related Products Carousel */}
        {product.categorias && product.categorias.length > 0 && (
          <RelatedProducts
            categorias={product.categorias}
            currentProductId={product.id}
          />
        )}
      </div>
    </div>
  );
};

export default ProductPage;
