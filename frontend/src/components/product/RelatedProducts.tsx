'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { getStrapiData } from '@/data/actions/strapi';
import { ProductosResponse, Producto } from '@/lib/interface';
import { generateProductSlug } from '@/utils/slugify';

interface RelatedProductsProps {
  categoryId: number;
  currentProductId: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  categoryId,
  currentProductId,
}) => {
  const [relatedProducts, setRelatedProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 },
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  // Fetch related products by category
  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        const data: ProductosResponse = await getStrapiData(
          `/api/productos?populate=*&filters[categoria][id][$eq]=${categoryId}&filters[id][$ne]=${currentProductId}`
        );

        if (data?.data && data.data.length > 0) {
          setRelatedProducts(data.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching related products:', error);
        setLoading(false);
      }
    }

    if (categoryId) {
      fetchRelatedProducts();
    }
  }, [categoryId, currentProductId]);

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Track button state
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Handle loading state
  if (loading) {
    return (
      <div className="w-full py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 md:mb-12">
            Productos relacionados
          </h2>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if no related products
  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 md:mb-12">
          Productos relacionados
        </h2>

        {/* Carousel Container */}
        <div className="relative">
          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6">
              {relatedProducts.map((producto) => {
                const productSlug = generateProductSlug(producto.titulo, producto.id);

                return (
                  <div
                    key={producto.id}
                    className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] xl:flex-[0_0_23%] min-w-0"
                  >
                    <Link
                      href={`/producto/${productSlug}`}
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                    >
                      {/* Image */}
                      <div className="relative h-48 md:h-64 lg:h-72 bg-gray-100 overflow-hidden">
                        {producto.imagenes && producto.imagenes.length > 0 ? (
                          <Image
                            src={`${baseUrl}${producto.imagenes[0].url}`}
                            alt={producto.imagenes[0].alternativeText || producto.titulo}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 30vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Sin imagen
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 md:p-6 flex flex-col flex-grow">
                        {/* Category */}
                        <span className="text-xs md:text-sm uppercase tracking-wide text-gray-500 mb-2">
                          {producto.categoria?.nombre || 'Sin categoría'}
                        </span>

                        {/* Product Name */}
                        <h3 className="text-base md:text-lg lg:text-xl text-gray-900 mb-4 flex-grow line-clamp-2">
                          {producto.titulo}
                        </h3>

                        {/* Price and Button */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            {producto.precio_anterior &&
                              producto.precio_anterior > producto.precio && (
                                <span className="text-sm md:text-base text-gray-400 line-through">
                                  ${producto.precio_anterior.toLocaleString()}
                                </span>
                              )}
                            <span className="text-2xl md:text-3xl text-red-500 font-bold">
                              ${producto.precio.toLocaleString()}
                            </span>
                          </div>
                          <button className="bg-red-500 text-white p-2.5 md:p-3 rounded-full hover:bg-red-600 transition-colors duration-200">
                            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          {relatedProducts.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                disabled={prevBtnDisabled}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-50 text-gray-800 p-3 md:p-4 rounded-full shadow-lg transition-all duration-200 z-10 ${
                  prevBtnDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
                }`}
                aria-label="Producto anterior"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                onClick={scrollNext}
                disabled={nextBtnDisabled}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-50 text-gray-800 p-3 md:p-4 rounded-full shadow-lg transition-all duration-200 z-10 ${
                  nextBtnDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
                }`}
                aria-label="Producto siguiente"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
