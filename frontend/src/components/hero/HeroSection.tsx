import Image from "next/image";
import { HomePage } from "@/lib/interface";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
  data: HomePage;
}

export default function HeroSection({ data }: HeroSectionProps) {
  const imageUrl = data.imagen?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${
        data.imagen.url
      }`
    : null;

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={data.imagen?.alternativeText || data.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        {/* Gradient overlay from left (dark) to right (transparent) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      </div>

      {/* Content - Left Aligned */}
      <div className="relative z-10 h-full max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center h-full max-w-4xl">
          {/* Title */}
          <h1 className="text-6xl md:text-8xl xl:text-[9rem] 3xl:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-sky-300 to-sky-400 uppercase leading-[0.85em]">
            {data.title}
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-3xl text-gray-200 mb-8 leading-relaxed max-w-xl">
            {data.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex  gap-4">
            <Link href="/planes">
            <button className="px-2 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-md md:text-lg rounded-xl flex items-center gap-2 group">
              Unite Ahora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            </Link>
            <button className="px-2 md:px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 cursor-pointer text-md md:text-lg rounded-xl transition-all duration-300">
              Más Información
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
