"use client";

import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

const CTASection = () => {
  return (
    <div className="w-full py-20 md:py-32 px-4 relative overflow-hidden">
      {/* Top decorative wave */}
      <div className="absolute top-0 left-0 right-0 transform rotate-180">
        <svg
          className="w-full h-16 md:h-24 fill-current text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>

      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-800 to-blue-950 opacity-95"></div>

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

      {/* Content */}
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full text-sm font-medium uppercase tracking-wide">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Oferta Limitada</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white text-center mb-6 leading-tight"
        >
          TU MEJOR VERSIÓN
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
            TE ESTÁ ESPERANDO
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl text-blue-100 text-center mb-10 max-w-2xl mx-auto"
        >
          No esperes más. Únete a la comunidad FitPro y comenzá tu
          transformación hoy mismo.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mb-16"
        >
          <Link href="/planes">
            <button className="group px-8 py-4 bg-white text-blue-900 rounded-full hover:bg-blue-50 transition-all duration-300 text-lg md:text-xl font-bold inline-flex items-center gap-3 shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transform">
              Únete Ahora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-row items-center justify-center gap-6 sm:gap-8 md:gap-16 lg:gap-20"
        >
          {/* Stat 1 */}
          <div className="text-center group flex-1">
            <div className="mb-1 md:mb-3 transform transition-transform group-hover:scale-110 duration-300">
              <p className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-white">
                500+
              </p>
            </div>
            <p className="text-xs sm:text-sm md:text-lg lg:text-xl text-blue-200 font-medium">
              Miembros Activos
            </p>
          </div>

          {/* Divider */}
          <div className="w-px h-12 sm:h-16 md:h-20 bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>

          {/* Stat 2 */}
          <div className="text-center group flex-1">
            <div className="mb-1 md:mb-3 transform transition-transform group-hover:scale-110 duration-300">
              <p className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-white">
                15+
              </p>
            </div>
            <p className="text-xs sm:text-sm md:text-lg lg:text-xl text-blue-200 font-medium">
              Años de Experiencia
            </p>
          </div>

          {/* Divider */}
          <div className="w-px h-12 sm:h-16 md:h-20 bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>

          {/* Stat 3 */}
          <div className="text-center group flex-1">
            <div className="mb-1 md:mb-3 transform transition-transform group-hover:scale-110 duration-300">
              <p className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-white">
                98%
              </p>
            </div>
            <p className="text-xs sm:text-sm md:text-lg lg:text-xl text-blue-200 font-medium">
              Satisfacción
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CTASection;
