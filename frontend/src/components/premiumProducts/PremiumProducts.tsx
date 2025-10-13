import React from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  categoria: string;
  nombre: string;
  precio: number;
  imagen: string;
}

const products: Product[] = [
  {
    id: 1,
    categoria: "suplementos",
    nombre: "Creatina Monohidrato 300g",
    precio: 3500,
    imagen:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    categoria: "accesorios",
    nombre: "Botella Térmica 750ml",
    precio: 1800,
    imagen:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    categoria: "suplementos",
    nombre: "Proteína Whey Premium 2kg",
    precio: 8900,
    imagen:
      "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    categoria: "ropa",
    nombre: "Remera Dry-Fit Premium",
    precio: 2800,
    imagen:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
  },
];

const PremiumProducts = () => {
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-48 md:h-72 lg:h-80 bg-gray-100 overflow-hidden">
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4 md:p-6 lg:p-8 flex flex-col flex-grow">
                {/* Category */}
                <span className="text-xs md:text-sm uppercase tracking-wide text-gray-500 mb-2 md:mb-3">
                  {product.categoria}
                </span>

                {/* Product Name */}
                <h3 className="text-base md:text-xl lg:text-2xl text-gray-900 mb-4 md:mb-6 flex-grow">
                  {product.nombre}
                </h3>

                {/* Price and Button */}
                <div className="flex items-center justify-between">
                  <span className="text-xl md:text-3xl lg:text-4xl text-red-500">
                    ${product.precio}
                  </span>
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
