import React from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getStrapiData } from "@/data/actions/strapi";
import { ProductosResponse } from "@/lib/interface";
import Image from "next/image";

const PremiumProducts = async () => {
  // Fetch only featured products from Strapi
  const dataProductos: ProductosResponse = await getStrapiData(
    "/api/productos?populate=*&filters[destacado][$eq]=true"
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
            <span className="px-4 py-2 bg-gray-900 text-white rounded-full text-md font-medium uppercase tracking-wide">
              TIENDA FITPRO
            </span>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-4">
            Productos Premium
          </h2>
          <p className="text-xl md:text-2xl text-gray-600">
            Equipamiento y suplementos de la más alta calidad
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 mb-12">
          {dataProductos.data.map((producto) => (
            <div
              key={producto.documentId || producto.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-48 md:h-72 lg:h-80 bg-gray-100 overflow-hidden">
                {producto.imagenes && producto.imagenes.length > 0 ? (
                  <Image
                    src={`${baseUrl}${producto.imagenes[0].url}`}
                    alt={producto.imagenes[0].alternativeText || producto.titulo}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sin imagen
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 md:p-6 lg:p-8 flex flex-col flex-grow">
                {/* Category */}
                <span className="text-xs md:text-sm uppercase tracking-wide text-gray-500 mb-2 md:mb-3">
                  {producto.categoria?.nombre || "Sin categoría"}
                </span>

                {/* Product Name */}
                <h3 className="text-base md:text-xl lg:text-2xl text-gray-900 mb-4 md:mb-6 flex-grow">
                  {producto.titulo.length > 40
                    ? `${producto.titulo.substring(0, 40)}...`
                    : producto.titulo}
                </h3>

                {/* Price and Button */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    {producto.precio_anterior && producto.precio_anterior > producto.precio && (
                      <span className="text-xl md:text-2xl text-gray-400 line-through">
                        ${producto.precio_anterior}
                      </span>
                    )}
                    <span className="text-3xl lg:text-4xl text-red-500 font-bold">
                      ${producto.precio}
                    </span>
                  </div>
                  <button className="bg-red-500 text-white p-2.5 md:p-3 lg:p-4 rounded-full hover:bg-red-600 transition-colors duration-200">
                    <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ver Toda La Tienda Button */}
        <div className="text-center">
          <Link href="#tienda">
            <button className="px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 text-xl md:text-2xl inline-flex items-center gap-2 group">
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
