import HeroSection from "@/components/hero/HeroSection";
import PlanHeroSection from "@/components/planHeroSection/PlanHeroSection";
import PremiumProducts from "@/components/premiumProducts/PremiumProducts";
import CTASection from "@/components/ctaSection/CTASection";
import CategoryFilter from "@/components/category/CategoryFilter";
import { getStrapiData } from "@/data/actions/strapi";
import { ProductosResponse, CategoriasResponse } from "@/lib/interface";
import Image from "next/image";

// ISR: Revalidar cada 60 segundos
export const revalidate = 60;

export default async function Home() {
  const strapiData = await getStrapiData("/api/home-page?populate=*");
  const dataProductos: ProductosResponse = await getStrapiData(
    "/api/productos?populate=*"
  );
  const dataCategorias: CategoriasResponse = await getStrapiData(
    "/api/categorias?populate=imagen"
  );


  return (
    <div>
      <HeroSection data={strapiData.data} />
      <PlanHeroSection />
      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Categorias
        </h2>
      </div>
      <CategoryFilter categorias={dataCategorias.data} activeSlug="todos" />
      <PremiumProducts />
      <CTASection />
    </div>
  );
}
