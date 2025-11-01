"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { motion } from "motion/react";

interface GymActivity {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  image: string;
  alt: string;
}

const activities: GymActivity[] = [
  {
    id: 1,
    title: "Entrenamiento Funcional",
    subtitle: "💪 Mejorá tu fuerza y movilidad",
    icon: "⚡",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&h=900&fit=crop&q=80",
    alt: "Personas realizando entrenamiento funcional"
  },
  {
    id: 2,
    title: "Musculación",
    subtitle: "🏋️ Desarrollá masa muscular",
    icon: "💪",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1600&h=900&fit=crop&q=80",
    alt: "Entrenamiento con pesas"
  },
  {
    id: 3,
    title: "Cardio Intensivo",
    subtitle: "❤️ Quemá calorías y energizate",
    icon: "🔥",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&h=900&fit=crop&q=80",
    alt: "Clase de cardio en grupo"
  },
  {
    id: 4,
    title: "Yoga y Estiramiento",
    subtitle: "🧘 Equilibrio mente y cuerpo",
    icon: "☮️",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&h=900&fit=crop&q=80",
    alt: "Sesión de yoga en grupo"
  },
  {
    id: 5,
    title: "Spinning",
    subtitle: "🚴 Pedalea hacia tus metas",
    icon: "🎯",
    image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=1600&h=900&fit=crop&q=80",
    alt: "Clase de spinning indoor"
  },
  {
    id: 6,
    title: "CrossFit",
    subtitle: "⚡ Superá tus límites",
    icon: "🏆",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&h=900&fit=crop&q=80",
    alt: "Entrenamiento de CrossFit"
  }
];

export function GymActivitiesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      breakpoints: {
        "(min-width: 640px)": { slidesToScroll: 1 },
        "(min-width: 1024px)": { slidesToScroll: 1 }
      }
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="overflow-hidden"
        ref={emblaRef}
      >
        <div className="flex">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex-[0_0_100%] min-w-0"
            >
              <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden group shadow-2xl">
                {/* Image */}
                <Image
                  src={activity.image}
                  alt={activity.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="100vw"
                  priority={activity.id === 1}
                />

                {/* Gradient Overlay with Title and Subtitle (z-10) */}
                <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-32 pb-8 px-8">
                  <motion.h3
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl drop-shadow-2xl mb-2"
                  >
                    {activity.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-white/90 text-base sm:text-lg lg:text-xl font-medium drop-shadow-lg"
                  >
                    {activity.subtitle}
                  </motion.p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Navigation Dots */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex justify-center gap-2 mt-8"
      >
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "w-8 bg-red-600"
                : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </motion.div>
    </div>
  );
}
