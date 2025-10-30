import React from "react";
import Link from "next/link";
import { getPlans, getPlanLinks } from "@/data/actions/strapi";
import type { Plan, PlanLink } from "@/lib/interface";
import PlanCard from "./PlanCard";

// ISR: Revalidar cada 60 segundos
export const revalidate = 60;

const getEstiloBoton = (popular: boolean | null): string => {
  return popular
    ? "bg-red-500 text-white hover:bg-red-600"
    : "bg-gray-900 text-white hover:bg-gray-800";
};

const getEstiloBorde = (popular: boolean | null): string => {
  return popular ? "border-red-500" : "border-gray-200";
};

const getPeriodoTexto = (periodo: string): string => {
  const periodos: Record<string, string> = {
    mensual: "/mensual",
    trimestral: "/trimestral",
    anual: "/anual",
  };
  return periodos[periodo] || `/${periodo}`;
};


const PlanesPage = async () => {
  const response = await getPlans();
  const plans: Plan[] = response?.data || [];

  // Obtener plan links desde Strapi
  const planLinksResponse = await getPlanLinks();
  const planLinks: PlanLink[] = planLinksResponse?.data || [];

  // URLs de fallback mientras se configura Strapi
  // IMPORTANTE: Usar plan_id para relacionar correctamente, NO nombres
  const fallbackUrls: Record<string, string> = {
    'basico': 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2ef09b3443484eab87075b62849caf40',
    'pro': 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2ef09b3443484eab87075b62849caf40', // TODO: Verificar si este ID es correcto
    'elite': 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=8012421304cb44fca48df579301f2188',
  };

  // Crear un mapa de plan links por plan_id (más confiable que nombres)
  const planLinkMap = new Map<string, string>();

  // Primero agregar URLs de Strapi usando plan_id
  planLinks.forEach((link) => {
    planLinkMap.set(link.plan_id, link.url);
  });

  // Si no hay datos de Strapi, usar fallback URLs
  if (planLinks.length === 0) {
    Object.entries(fallbackUrls).forEach(([planId, url]) => {
      planLinkMap.set(planId, url);
    });
  }

  // Reorganizar: [Básico, Pro (popular), Elite]
  const orderedPlans: Plan[] = [];
  const popularPlan = plans.find((p) => p.popular);
  const nonPopularPlans = plans.filter((p) => !p.popular);

  // Básico (izquierda)
  const basicoPlan = nonPopularPlans.find((p) => p.nombre === "Plan Básico");
  if (basicoPlan) orderedPlans.push(basicoPlan);

  // Pro en el medio (popular)
  if (popularPlan) orderedPlans.push(popularPlan);

  // Elite (derecha)
  const elitePlan = nonPopularPlans.find((p) => p.nombre === "Plan Elite");
  if (elitePlan) orderedPlans.push(elitePlan);

  return (
    <div className="w-full bg-gray-50 min-h-screen py-28 md:py-30 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-8">
            <span className="px-4 py-2 bg-red-100 text-red-500 rounded-full text-md font-medium uppercase tracking-wide">
              PLANES DE SUSCRIPCIÓN
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
            Elegí El Plan Perfecto
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            Acceso completo a nuestras instalaciones, clases grupales y
            asesoramiento profesional
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 lg:gap-8 mb-16">
          {orderedPlans.map((plan) => {
            const borderStyle = getEstiloBorde(plan.popular);
            const buttonStyle = getEstiloBoton(plan.popular);
            const periodoTexto = getPeriodoTexto(plan.periodo);

            // Buscar la URL correspondiente al plan usando plan_id (más confiable)
            const planUrl = planLinkMap.get(plan.plan_id);

            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                borderStyle={borderStyle}
                buttonStyle={buttonStyle}
                periodoTexto={periodoTexto}
                planUrl={planUrl}
              />
            );
          })}
        </div>

        {/* Help Section */}
        <div className="bg-gray-900 rounded-3xl px-8 py-12 md:my-32 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Necesitás Ayuda Para Elegir?
          </h2>
          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Nuestro equipo está listo para asesorarte y encontrar el plan
            perfecto para tus objetivos
          </p>
          <Link href="https://wa.link/v0fsei" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
          <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 text-lg cursor-pointer">
            Contactar Asesor
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlanesPage;
