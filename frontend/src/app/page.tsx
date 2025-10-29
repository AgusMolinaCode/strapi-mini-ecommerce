import HeroSection from "@/components/hero/HeroSection";
import PlanHeroSection from "@/components/planHeroSection/PlanHeroSection";
import CTASection from "@/components/ctaSection/CTASection";
import { getStrapiData } from "@/data/actions/strapi";

// ISR: Revalidar cada 60 segundos
export const revalidate = 60;

export default async function Home() {
  const strapiData = await getStrapiData("/api/home-page?populate=*");

  return (
    <div>
      <HeroSection data={strapiData.data} />
      <PlanHeroSection />
      <CTASection />
    </div>
  );
}
