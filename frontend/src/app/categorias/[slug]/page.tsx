import React from 'react';
import { getStrapiData } from '@/data/actions/strapi';
import { Producto, ProductosResponse, Categoria, CategoriasResponse } from '@/lib/interface';
import ProductCard from '@/components/product/ProductCard';
import CategoryFilter from '@/components/category/CategoryFilter';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  // Fetch all categories for the filter
  const categoriesData: CategoriasResponse = await getStrapiData(
    '/api/categorias?populate=imagen'
  );

  const categories = categoriesData?.data || [];

  // Fetch products based on category slug
  let productsQuery = '';
  let currentCategory: Categoria | null = null;

  if (slug === 'todos') {
    // Show all active products
    productsQuery = '/api/productos?populate=*&filters[activo][$eq]=true';
  } else {
    // Filter by specific category
    productsQuery = `/api/productos?populate=*&filters[categorias][slug][$eq]=${slug}&filters[activo][$eq]=true`;

    // Get current category info
    currentCategory = categories.find(cat => cat.slug === slug) || null;
  }

  const productsData: ProductosResponse = await getStrapiData(productsQuery);
  const products = productsData?.data || [];

  const categoryTitle = slug === 'todos'
    ? 'Todos los Productos'
    : currentCategory?.nombre || 'Categoría';

  return (
    <div className="min-h-screen bg-white py-28 md:py-30">
      {/* Category Filter */}
      <CategoryFilter
        categorias={categories}
        activeSlug={slug}
        baseUrl={baseUrl}
      />

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 lg:py-16">
        {/* Page Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {categoryTitle}
          </h1>
          {currentCategory?.descripcion && (
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl">
              {currentCategory.descripcion}
            </p>
          )}
          <p className="text-sm md:text-base text-gray-500 mt-4">
            {products.length} {products.length === 1 ? 'producto' : 'productos'} disponibles
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                baseUrl={baseUrl}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No hay productos disponibles
            </h2>
            <p className="text-gray-600">
              {slug === 'todos'
                ? 'No se encontraron productos activos.'
                : `No hay productos en la categoría "${categoryTitle}".`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
