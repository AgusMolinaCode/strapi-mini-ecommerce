'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { Imagen } from '@/lib/interface';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  images: Imagen[];
  productTitle: string;
  baseUrl: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productTitle,
  baseUrl,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Main carousel without autoplay
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
  });

  // Thumbnail carousel
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
    align: 'start',
  });

  // Sync main carousel selection with state
  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    const index = emblaMainApi.selectedScrollSnap();
    setSelectedIndex(index);
    emblaThumbsApi.scrollTo(index);
  }, [emblaMainApi, emblaThumbsApi]);

  // Thumbnail click handler
  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (emblaMainApi) emblaMainApi.scrollPrev();
  }, [emblaMainApi]);

  const scrollNext = useCallback(() => {
    if (emblaMainApi) emblaMainApi.scrollNext();
  }, [emblaMainApi]);

  // Setup carousel listeners
  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on('select', onSelect);
    emblaMainApi.on('reInit', onSelect);

    return () => {
      emblaMainApi.off('select', onSelect);
      emblaMainApi.off('reInit', onSelect);
    };
  }, [emblaMainApi, onSelect]);

  // Handle no images case
  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 rounded-xl overflow-hidden relative h-96 md:h-[500px] lg:h-[700px] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-xl md:text-2xl">Sin imagen disponible</p>
        </div>
      </div>
    );
  }

  // Handle single image case - no carousel needed
  if (images.length === 1) {
    const imageUrl = images[0].url.startsWith('http') ? images[0].url : `${baseUrl}${images[0].url}`;
    return (
      <div className="bg-gray-100 rounded-xl overflow-hidden relative h-96 md:h-[500px] lg:h-[700px]">
        <Image
          src={imageUrl}
          alt={images[0].alternativeText || productTitle}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 700px"
        />
      </div>
    );
  }

  // Multiple images - render carousel with thumbnails
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Main Carousel */}
      <div className="relative">
        <div className="overflow-hidden rounded-xl" ref={emblaMainRef}>
          <div className="flex">
            {images.map((image, index) => {
              const imageUrl = image.url.startsWith('http') ? image.url : `${baseUrl}${image.url}`;
              return (
                <div
                  key={image.id}
                  className="flex-[0_0_100%] min-w-0 relative h-96 md:h-[500px] lg:h-[700px]"
                >
                  <Image
                    src={imageUrl}
                    alt={image.alternativeText || `${productTitle} - Imagen ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    loading={index === 0 ? undefined : 'lazy'}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 700px"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={scrollPrev}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 z-10 hover:scale-110"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 z-10 hover:scale-110"
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm md:text-base font-semibold">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Carousel */}
      <div className="overflow-hidden px-1" ref={emblaThumbsRef}>
        <div className="flex gap-4 md:gap-6 lg:gap-8">
          {images.map((image, index) => {
            const imageUrl = image.url.startsWith('http') ? image.url : `${baseUrl}${image.url}`;
            return (
              <button
                key={image.id}
                onClick={() => onThumbClick(index)}
                className={`flex-[0_0_auto] relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-4 ${
                  index === selectedIndex
                    ? 'border-red-500 opacity-100 shadow-lg'
                    : 'border-gray-300 opacity-70 hover:opacity-100 hover:border-red-300 '
                }`}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <Image
                  src={imageUrl}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;
