import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getStrapiData } from "@/data/actions/strapi";
import { ProductosResponse } from "@/lib/interface";
import ProductCard from "@/components/product/ProductCard";

const PremiumProducts = async () => {
  // Fetch only featured and active products from Strapi
  const dataProductos: ProductosResponse = await getStrapiData(
    "/api/productos?populate=*&filters[destacado][$eq]=true&filters[activo][$eq]=true"
  );

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  // Handle empty or missing data
  if (!dataProductos?.data || dataProductos.data.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium uppercase tracking-wide">
              TIENDA FITPRO
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Productos Premium
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Equipamiento y suplementos de la más alta calidad
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 mb-12">
          {dataProductos.data.map((producto) => (
            <ProductCard
              key={producto.documentId || producto.id}
              producto={producto}
              baseUrl={baseUrl}
            />
          ))}
        </div>

        {/* Ver Toda La Tienda Button */}
        <div className="text-center">
          <Link href="/categorias/todos">
            <button className="px-8 py-4 cursor-pointer bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 text-lg md:text-xl inline-flex items-center gap-2 group">
              Ver Toda La Tienda
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PremiumProducts;
