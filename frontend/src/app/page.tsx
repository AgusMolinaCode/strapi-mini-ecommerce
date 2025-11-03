import HeroSection from "@/components/hero/HeroSection";
import PlanHeroSection from "@/components/planHeroSection/PlanHeroSection";
import CTASection from "@/components/ctaSection/CTASection";
import { WobbleCardDemo } from "@/components/ui/WobbleCardDemo";
import { GymActivitiesCarousel } from "@/components/carousel/GymActivitiesCarousel";
import { getStrapiData, getActivities, getBeneficios } from "@/data/actions/strapi";

// ISR: Revalidar cada 60 segundos
export const revalidate = 60;

export default async function Home() {
  const strapiData = await getStrapiData("/api/home-page?populate=*");
  const activitiesData = await getActivities();
  const beneficiosData = await getBeneficios();

  return (
    <div>
      <HeroSection data={strapiData.data} />
      <PlanHeroSection />

      {/* Sección de Información con WobbleCards */}
      <section className="w-full bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ¿Por Qué Elegirnos?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubrí los beneficios que hacen de nuestro gimnasio el mejor lugar para alcanzar tus objetivos
            </p>
          </div>
          <WobbleCardDemo beneficios={beneficiosData?.data || []} />
        </div>
      </section>

      {/* Sección de Actividades del Gimnasio con Carousel */}
      <section className="w-full bg-white py-16 px-4 ">
        <div className="max-w-7xl mx-auto ">
          <div className="text-center mb-12 ">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nuestras Actividades
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explorá la variedad de entrenamientos disponibles en nuestro gimnasio
            </p>
          </div>
          <GymActivitiesCarousel activities={activitiesData?.data || []} />
        </div>
      </section>

      <CTASection />
    </div>
  );
}
