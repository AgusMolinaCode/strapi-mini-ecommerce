"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { motion } from "motion/react";
import { GymActivity, GymActivityIcon } from "@/lib/interface";
import {
  Dumbbell,
  Heart,
  Zap,
  Bike,
  Activity,
  Flame,
  Target,
  Trophy,
  Footprints,
  Timer,
  Swords,
  Shield,
  Medal,
  Sparkles,
  Star,
  LucideIcon
} from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// Icon mapping
const iconMap: Record<GymActivityIcon, LucideIcon> = {
  Dumbbell,
  Heart,
  Zap,
  Bike,
  Activity,
  Flame,
  Target,
  Trophy,
  Footprints,
  Timer,
  Swords,
  Shield,
  Medal,
  Sparkles,
  Star,
};

interface Props {
  activities: GymActivity[];
}

export function GymActivitiesCarousel({ activities }: Props) {
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
          {activities.map((activity) => {
            const imageUrl = activity.image?.url
              ? activity.image.url.startsWith('http')
                ? activity.image.url
                : baseUrl + activity.image.url
              : "";
            const IconComponent = iconMap[activity.icon];

            return (
              <div
                key={activity.id}
                className="flex-[0_0_100%] min-w-0"
              >
                <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden group shadow-2xl">
                  {/* Image */}
                  <Image
                    src={imageUrl}
                    alt={activity.alt || activity.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="100vw"
                    priority={activity.id === 1}
                  />

                  {/* Gradient Overlay with Title, Icon and Subtitle (z-10) */}
                  <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-32 pb-8 px-8">
                    <div className="flex items-center gap-4 mb-3">
                      {IconComponent && (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                        </div>
                      )}
                      <motion.h3
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl drop-shadow-2xl"
                      >
                        {activity.title}
                      </motion.h3>
                    </div>
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
            );
          })}
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
