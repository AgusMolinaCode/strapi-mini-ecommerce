"use client";

import React from "react";
import { WobbleCard } from "../ui/wobble-card";
import { Dumbbell, Heart, Zap } from "lucide-react";
import { motion } from "motion/react";

export function WobbleCardDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
      {/* Card 1: Fuerza y Musculación */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <WobbleCard
          containerClassName="col-span-1 bg-red-800 min-h-[320px]"
          className=""
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Dumbbell className="w-8 h-8 text-white" />
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full">
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  Potencia
                </span>
              </div>
            </div>
            <h2 className="text-left text-balance text-xl md:text-2xl font-bold tracking-tight text-white mb-3">
              Fuerza y Musculación
            </h2>
            <p className="text-left text-base text-neutral-200">
              Desarrollá masa muscular y fuerza con rutinas personalizadas
            </p>
          </div>
        </WobbleCard>
      </motion.div>

      {/* Card 2: Funcional y Cardio */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <WobbleCard
          containerClassName="col-span-1 bg-blue-800 min-h-[320px]"
          className=""
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full">
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  Energía
                </span>
              </div>
            </div>
            <h2 className="text-left text-balance text-xl md:text-2xl font-bold tracking-tight text-white mb-3">
              Funcional y Cardio
            </h2>
            <p className="text-left text-base text-neutral-200">
              Mejorá resistencia y movilidad con ejercicios dinámicos
            </p>
          </div>
        </WobbleCard>
      </motion.div>

      {/* Card 3: Yoga y Flexibilidad */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <WobbleCard
          containerClassName="col-span-1 bg-green-800 min-h-[320px]"
          className=""
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full">
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  Bienestar
                </span>
              </div>
            </div>
            <h2 className="text-left text-balance text-xl md:text-2xl font-bold tracking-tight text-white mb-3">
              Yoga y Flexibilidad
            </h2>
            <p className="text-left text-base text-neutral-200">
              Equilibrio mental y físico con técnicas especializadas
            </p>
          </div>
        </WobbleCard>
      </motion.div>
    </div>
  );
}
