"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Producto } from "@/lib/interface";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  producto: Producto;
  baseUrl?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  producto,
  baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337",
}) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (producto.stock > 0) {
      const imageUrl = producto.imagenes?.[0]?.url
        ? producto.imagenes[0].url.startsWith('http')
          ? producto.imagenes[0].url
          : `${baseUrl}${producto.imagenes[0].url}`
        : "";

      addItem(
        {
          id: producto.id,
          documentId: producto.documentId,
          titulo: producto.titulo,
          precio: producto.precio,
          stock: producto.stock,
          imagen: imageUrl,
          slug: producto.slug,
        },
        1
      );
    }
  };

  return (
    <Link
      href={`/producto/${producto.slug}`}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative h-48 md:h-64 lg:h-72 bg-gray-100 overflow-hidden">
        {producto.imagenes && producto.imagenes.length > 0 ? (
          <Image
            src={producto.imagenes[0].url.startsWith('http') ? producto.imagenes[0].url : `${baseUrl}${producto.imagenes[0].url}`}
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
      <div className="p-4 md:p-6 lg:p-8 flex flex-col flex-grow">
        {/* Category */}
        <span className="text-xs md:text-sm uppercase tracking-wide text-gray-500 mb-2 md:mb-3">
          {producto.categorias?.[0]?.nombre.substring(0, 20) || "Sin categoría"}
        </span>

        {/* Product Name */}
        <h3 className="text-base md:text-lg lg:text-xl text-gray-900 mb-4 md:mb-6 flex-grow">
          {producto.titulo.length > 40
            ? `${producto.titulo.substring(0, 40)}...`
            : producto.titulo}
        </h3>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            {producto.en_oferta === true &&
              producto.precio_anterior &&
              producto.precio_anterior > producto.precio && (
                <span className="text-xl md:text-2xl text-gray-400 line-through">
                  ${producto.precio_anterior.toLocaleString()}
                </span>
              )}
            <span className="text-3xl lg:text-4xl text-red-500 font-bold">
              ${producto.precio.toLocaleString()}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={producto.stock === 0}
            className="bg-red-500 text-white p-2.5 md:p-3 lg:p-4 rounded-full hover:bg-red-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            aria-label="Agregar al carrito"
          >
            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
