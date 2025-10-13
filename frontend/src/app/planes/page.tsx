import React from "react";
import { ShoppingCart, Flame } from "lucide-react";
import Link from "next/link";

// Interfaz para los planes
interface PlanFeature {
  id: number;
  text: string;
}

interface Plan {
  id: number;
  nombre: string;
  precio: number;
  periodo: string;
  popular: boolean;
  features: string[];
  features_full?: string[];
  paymentNote?: string;
}

const plans: Plan[] = [
  {
    id: 1,
    nombre: "Plan Elite",
    precio: 42000,
    periodo: "anual",
    popular: false,
    paymentNote: "Pago anual",
    features: [
      "Todo del Plan Pro",
      "4 sesiones de entrenamiento personal/mes",
      "Plan nutricional personalizado",
      "Acceso 24/7 al gimnasio",
      "Clases premium exclusivas",
      "Evaluaciones físicas mensuales",
      "Invitación para 1 acompañante",
      "25% descuento en tienda",
    ],
  },
  {
    id: 2,
    nombre: "Plan Pro",
    precio: 11900,
    periodo: "trimestral",
    popular: true,
    paymentNote: "Pago cada 3 meses",
    features: [
      "Todo del Plan Básico",
      "Clases grupales ilimitadas",
      "1 sesión de entrenamiento personal",
      "Asesoramiento nutricional básico",
      "Acceso a zona funcional",
      "15% descuento en tienda",
    ],
  },
  {
    id: 3,
    nombre: "Plan Básico",
    precio: 4500,
    periodo: "mensual",
    popular: false,
    paymentNote: "Pago mes a mes",
    features: [
      "Acceso ilimitado al gimnasio",
      "Vestuarios y duchas",
      "Área de cardio y pesas",
      "App de seguimiento fitness",
    ],
  },
];

const getEstiloBoton = (popular: boolean): string => {
  return popular
    ? "bg-red-500 text-white hover:bg-red-600"
    : "bg-gray-900 text-white hover:bg-gray-800";
};

const getEstiloBorde = (popular: boolean): string => {
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

const PlanesPage = () => {
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
    <div className="w-full bg-gray-50 min-h-screen py-10 md:py-24 px-4">
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

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 ${borderStyle} shadow-sm hover:shadow-lg transition-all duration-300 w-full flex flex-col ${
                  plan.popular
                    ? "lg:w-[460px] lg:scale-105 z-10 bg-gradient-to-br from-red-100 via-pink-100 to-orange-100"
                    : "lg:w-[380px] bg-white"
                } ${plan.popular ? "p-10" : "p-8"}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-red-500 text-white rounded-full text-lg font-bold uppercase tracking-wide shadow-md flex items-center gap-1">
                      <Flame className="w-8 h-8" fill="currentColor" />
                      MÁS POPULAR
                    </span>
                  </div>
                )}

                {/* Plan Name */}
                <h3
                  className={`font-bold text-gray-900 mb-4 ${
                    plan.popular ? "text-3xl" : "text-2xl"
                  }`}
                >
                  {plan.nombre}
                </h3>

                {/* Price */}
                <div className="mb-2">
                  <span
                    className={`font-bold text-gray-900 ${
                      plan.popular ? "text-6xl" : "text-5xl"
                    }`}
                  >
                    ${plan.precio}
                  </span>
                  <span
                    className={`text-gray-600 ml-1 ${
                      plan.popular ? "text-xl" : "text-lg"
                    }`}
                  >
                    {periodoTexto}
                  </span>
                </div>

                {/* Payment Note */}
                {plan.paymentNote && (
                  <p className="text-gray-500 text-sm mb-6">
                    {plan.paymentNote}
                  </p>
                )}

                {/* Features */}
                <ul
                  className={`mb-8 flex-grow ${plan.popular ? "space-y-4" : "space-y-3.5"}`}
                >
                  {/* Feature items */}
                  {plan.features.map((feature, index) => (
                    <li key={`feature-${index}`} className="flex items-start">
                      <span
                        className={`inline-block rounded-full border-2 border-red-500 mr-3 mt-0.5 flex-shrink-0 ${
                          plan.popular ? "w-6 h-6" : "w-5 h-5"
                        }`}
                      ></span>
                      <span
                        className={`text-gray-700 ${
                          plan.popular ? "text-xl" : "text-lg"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}

                  {/* Feature_full items */}
                  {plan.features_full && plan.features_full.map((featureFull, index) => (
                    <li key={`feature-full-${index}`} className="flex items-start">
                      <span
                        className={`inline-block rounded-full border-2 border-red-500 mr-3 mt-0.5 flex-shrink-0 ${
                          plan.popular ? "w-6 h-6" : "w-5 h-5"
                        }`}
                      ></span>
                      <span
                        className={`text-gray-700 ${
                          plan.popular ? "text-xl" : "text-lg"
                        }`}
                      >
                        {featureFull}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  className={`w-full rounded-xl cursor-pointer font-semibold ${buttonStyle} transition-all duration-200 flex items-center justify-center gap-2 group mt-auto ${
                    plan.popular
                      ? "py-5 px-8 text-lg shadow-md"
                      : "py-4 px-6 text-base"
                  }`}
                >
                  <ShoppingCart
                    className={`${plan.popular ? "w-5 h-5" : "w-4 h-4"}`}
                  />
                  Agregar al Carrito
                </button>
              </div>
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
