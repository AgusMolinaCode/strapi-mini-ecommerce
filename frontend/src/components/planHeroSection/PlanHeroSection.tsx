import React from "react";
import { ArrowRight, Flame } from "lucide-react";
import { getPlans } from "@/data/actions/strapi";
import type { Plan } from "@/lib/interface";
import Link from "next/link";

// Funciones helper para mapear estilos
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

const PlanHeroSection = async () => {
  const response = await getPlans();

  const plans: Plan[] = response?.data || [];

  // Ordenar los planes: popular en el centro
  const sortedPlans = [...plans].sort((a, b) => {
    // Si 'a' es popular, va al centro (índice 1 en un array de 3)
    if (a.popular) return 0;
    if (b.popular) return 0;
    return 0;
  });

  // Reorganizar: [no-popular, popular, no-popular]
  const orderedPlans: Plan[] = [];
  const popularPlan = sortedPlans.find((p) => p.popular);
  const nonPopularPlans = sortedPlans.filter((p) => !p.popular);

  if (nonPopularPlans.length > 0) orderedPlans.push(nonPopularPlans[0]);
  if (popularPlan) orderedPlans.push(popularPlan);
  if (nonPopularPlans.length > 1) orderedPlans.push(nonPopularPlans[1]);

  return (
    <div className="w-full bg-gray-50 py-10 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-8">
            <span className="px-4 py-2 bg-red-100 text-red-500 rounded-full text-sm font-medium uppercase tracking-wide">
              PLANES DE ENTRENAMIENTO
            </span>
          </div>
          <h1 className=" text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Elegí Tu Plan
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Opciones flexibles para cada objetivo y estilo de vida
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 lg:gap-8 mb-12">
          {orderedPlans.map((plan) => {
            const borderStyle = getEstiloBorde(plan.popular);
            const buttonStyle = getEstiloBoton(plan.popular);
            const periodoTexto = getPeriodoTexto(plan.periodo);

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 ${borderStyle} shadow-sm hover:shadow-lg transition-all duration-300 w-full ${
                  plan.popular
                    ? "lg:w-[460px] lg:scale-110 lg:-translate-y-4 z-10 bg-gradient-to-br from-red-100 via-pink-100 to-orange-100"
                    : "lg:w-[380px] bg-white"
                } ${plan.popular ? "p-10" : "p-8"}`}
              >
                {/* Fire Icon - Solo para popular */}
                {plan.popular && (
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Flame className="w-8 h-8 text-white" fill="currentColor" />
                  </div>
                )}

                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-red-500 text-white rounded-full text-xs font-semibold uppercase tracking-wide shadow-md">
                      MÁS POPULAR
                    </span>
                  </div>
                )}

                {/* Plan Name */}
                <h3
                  className={`font-bold text-gray-900 mb-4 ${
                    plan.popular ? "text-2xl" : "text-xl"
                  }`}
                >
                  {plan.nombre}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  <span
                    className={`font-bold text-gray-900 ${
                      plan.popular ? "text-5xl" : "text-4xl"
                    }`}
                  >
                    ${plan.precio}
                  </span>
                  <span
                    className={`text-gray-600 ml-1 ${
                      plan.popular ? "text-lg" : "text-md"
                    }`}
                  >
                    {periodoTexto}
                  </span>
                </div>

                {/* Features */}
                <ul
                  className={`mb-8 ${plan.popular ? "space-y-5" : "space-y-4"}`}
                >
                  {plan.feature?.map((feature) => (
                    <li key={feature.id} className="flex items-start">
                      <span
                        className={`inline-block rounded-full border-2 border-red-500 mr-3 mt-0.5 flex-shrink-0 ${
                          plan.popular ? "w-6 h-6" : "w-5 h-5"
                        }`}
                      ></span>
                      <span
                        className={`text-gray-700 ${
                          plan.popular ? "text-lg" : "text-md"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Link href="/planes">
                  <button
                    className={`w-full rounded-xl cursor-pointer font-semibold ${buttonStyle} transition-all duration-200 flex items-center justify-center gap-2 group ${
                      plan.popular ? "py-5 px-8 text-lg shadow-md" : "py-4 px-6"
                    }`}
                  >
                    Seleccionar Plan
                    <ArrowRight
                      className={`group-hover:translate-x-1 transition-transform ${
                        plan.popular ? "w-6 h-6" : "w-5 h-5"
                      }`}
                    />
                  </button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* See All Plans Button */}
        <div className="text-center">
          <Link href="/planes">
            <button className="px-8 py-3 cursor-pointer bg-white text-gray-900 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 text-xl md:text-2xl transition-all duration-200 inline-flex items-center gap-2 group">
              Ver Todos Los Planes
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlanHeroSection;
