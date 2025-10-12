import React from "react";
import { ArrowRight, Flame } from "lucide-react";

const PlanHeroSection = () => {
  const plans = [
    {
      id: 1,
      nombre: "Plan Elite",
      precio: 42000,
      periodo: "anual" as const,
      caracteristicas: [
        { id: 1, texto: "Todo del Plan Pro" },
        { id: 2, texto: "4 sesiones de entrenamiento personal/mes" },
        { id: 3, texto: "Plan nutricional personalizado" },
        { id: 4, texto: "Acceso 24/7 al gimnasio" },
      ],
      es_popular: false,
      estilo_boton: "primary" as const,
      estilo_borde: "gray" as const,
    },
    {
      id: 2,
      nombre: "Plan Pro",
      precio: 11900,
      periodo: "trimestral" as const,
      caracteristicas: [
        { id: 5, texto: "Todo del Plan Básico" },
        { id: 6, texto: "Clases grupales ilimitadas" },
        { id: 7, texto: "1 sesión de entrenamiento personal" },
        { id: 8, texto: "Asesoramiento nutricional básico" },
      ],
      es_popular: true,
      estilo_boton: "accent" as const,
      estilo_borde: "red" as const,
    },
    {
      id: 3,
      nombre: "Plan Básico",
      precio: 4500,
      periodo: "mensual" as const,
      caracteristicas: [
        { id: 9, texto: "Acceso ilimitado al gimnasio" },
        { id: 10, texto: "Vestuarios y duchas" },
        { id: 11, texto: "Área de cardio y pesas" },
        { id: 12, texto: "App de seguimiento fitness" },
      ],
      es_popular: false,
      estilo_boton: "primary" as const,
      estilo_borde: "gray" as const,
    },
  ];

  // Funciones helper para mapear estilos
  const getEstiloBoton = (estilo: string): string => {
    const estilos = {
      primary: "bg-gray-900 text-white hover:bg-gray-800",
      secondary: "bg-white text-gray-900 border-2 border-gray-300 hover:bg-gray-50",
      accent: "bg-red-500 text-white hover:bg-red-600",
    };
    return estilos[estilo as keyof typeof estilos] || estilos.primary;
  };

  const getEstiloBorde = (estilo: string): string => {
    const estilos = {
      gray: "border-gray-200",
      red: "border-red-500",
    };
    return estilos[estilo as keyof typeof estilos] || estilos.gray;
  };

  const getPeriodoTexto = (periodo: string): string => {
    const periodos = {
      mensual: "/mensual",
      trimestral: "/trimestral",
      anual: "/anual",
    };
    return periodos[periodo as keyof typeof periodos] || "";
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-8">
            <span className="px-4 py-2 bg-red-100 text-red-500 rounded-full text-md font-medium uppercase tracking-wide">
              PLANES DE ENTRENAMIENTO
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4">
            Elegí Tu Plan
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            Opciones flexibles para cada objetivo y estilo de vida
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 lg:gap-8 mb-12">
          {plans.map((plan) => {
            const borderStyle = getEstiloBorde(plan.estilo_borde);
            const buttonStyle = getEstiloBoton(plan.estilo_boton);
            const periodoTexto = getPeriodoTexto(plan.periodo);

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 ${borderStyle} shadow-sm hover:shadow-lg transition-all duration-300 w-full ${
                  plan.es_popular
                    ? "md:w-[360px] lg:w-[460px] lg:scale-110 lg:-translate-y-4 z-10 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50"
                    : "md:w-[300px] lg:w-[380px] bg-white"
                } ${plan.es_popular ? "p-10" : "p-8"}`}
              >
                {/* Fire Icon - Solo para popular */}
                {plan.es_popular && (
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Flame className="w-8 h-8 text-white" fill="currentColor" />
                  </div>
                )}

                {/* Popular Badge */}
                {plan.es_popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-red-500 text-white rounded-full text-xs font-semibold uppercase tracking-wide shadow-md">
                      MÁS POPULAR
                    </span>
                  </div>
                )}

                {/* Plan Name */}
                <h3
                  className={`font-bold text-gray-900 mb-4 ${
                    plan.es_popular ? "text-3xl" : "text-2xl"
                  }`}
                >
                  {plan.nombre}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  <span
                    className={`font-bold text-gray-900 ${
                      plan.es_popular ? "text-6xl" : "text-5xl"
                    }`}
                  >
                    ${plan.precio}
                  </span>
                  <span
                    className={`text-gray-600 ml-1 ${
                      plan.es_popular ? "text-xl" : "text-lg"
                    }`}
                  >
                    {periodoTexto}
                  </span>
                </div>

                {/* Features */}
                <ul
                  className={`mb-8 ${
                    plan.es_popular ? "space-y-5" : "space-y-4"
                  }`}
                >
                  {plan.caracteristicas.map((caracteristica) => (
                    <li key={caracteristica.id} className="flex items-start">
                      <span
                        className={`inline-block rounded-full border-2 border-red-500 mr-3 mt-0.5 flex-shrink-0 ${
                          plan.es_popular ? "w-6 h-6" : "w-5 h-5"
                        }`}
                      ></span>
                      <span
                        className={`text-gray-700 ${
                          plan.es_popular ? "text-lg" : ""
                        }`}
                      >
                        {caracteristica.texto}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  className={`w-full rounded-xl font-semibold ${buttonStyle} transition-all duration-200 flex items-center justify-center gap-2 group ${
                    plan.es_popular
                      ? "py-5 px-8 text-lg shadow-md"
                      : "py-4 px-6"
                  }`}
                >
                  Seleccionar Plan
                  <ArrowRight
                    className={`group-hover:translate-x-1 transition-transform ${
                      plan.es_popular ? "w-6 h-6" : "w-5 h-5"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* See All Plans Button */}
        <div className="text-center">
          <button className="px-8 py-3 cursor-pointer bg-white text-gray-900 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 text-2xl transition-all duration-200 inline-flex items-center gap-2 group">
            Ver Todos Los Planes
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanHeroSection;
