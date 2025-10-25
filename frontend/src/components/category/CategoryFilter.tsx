import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Categoria } from '@/lib/interface';

interface CategoryFilterProps {
  categorias: Categoria[];
  activeSlug?: string;
  baseUrl?: string;
}

const CategoryFilter = ({
  categorias,
  activeSlug,
  baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
}: CategoryFilterProps) => {
  // Find the "Todos" category from Strapi or create a default one
  const todosFromStrapi = categorias.find(cat => cat.slug.toLowerCase() === 'todos');

  const todosCategory = todosFromStrapi || {
    id: 0,
    nombre: 'Todos',
    slug: 'todos',
    imagen: null,
    documentId: '',
    descripcion: '',
    productos: [],
    createdAt: '',
    updatedAt: '',
    publishedAt: '',
  };

  // Filter out "Todos" from the rest and sort: "Todos" first, then the rest
  const otherCategories = categorias.filter(cat => cat.slug.toLowerCase() !== 'todos');
  const sortedCategories = [todosCategory, ...otherCategories];

  return (
    <div className="w-full bg-white py-8 md:py-10 px-4 ">
      <div className="max-w-7xl mx-auto">
        {/* Scrollable container */}
        <div className="flex gap-4 md:gap-6 lg:gap-8">
          {sortedCategories.map((categoria) => {
            const isActive = activeSlug === categoria.slug;

            return (
              <Link
                key={categoria.id}
                href={`/categorias/${categoria.slug}`}
                className="flex flex-col items-center gap-2 md:gap-3 flex-shrink-0 group"
              >
                {/* Category Image Circle */}
                <div
                  className={`
                    relative w-24 h-24 md:w-36 md:h-36 lg:w-40 lg:h-40
                    rounded-full overflow-hidden border-2
                    transition-all duration-300
                    ${isActive
                      ? 'border-red-500 shadow-lg scale-105'
                      : 'border-gray-200 group-hover:border-red-300 group-hover:shadow-md'
                    }
                  `}
                >
                  {categoria.imagen ? (
                    <Image
                      src={categoria.imagen.url.startsWith('http') ? categoria.imagen.url : `${baseUrl}${categoria.imagen.url}`}
                      alt={categoria.imagen.alternativeText || categoria.nombre}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 96px, (max-width: 1024px) 144px, 160px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                      <span className="text-white text-3xl md:text-4xl lg:text-5xl font-bold">
                        {categoria.nombre.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Category Name */}
                <span
                  className={`
                    text-sm md:text-base lg:text-lg font-medium text-center
                    max-w-[96px] md:max-w-[144px] lg:max-w-[160px] truncate
                    transition-colors duration-300
                    ${isActive
                      ? 'text-red-500 font-semibold'
                      : 'text-gray-700 group-hover:text-red-500'
                    }
                  `}
                >
                  {categoria.nombre}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <div className="w-8 h-1 bg-red-500 rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
