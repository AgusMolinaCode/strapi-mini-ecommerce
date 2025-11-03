"use client";

import React from "react";
import { WobbleCard } from "../ui/wobble-card";
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
import { motion } from "motion/react";
import { Beneficio, GymActivityIcon } from "@/lib/interface";

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

// Color mapping for cards
const colorClasses = [
  "bg-red-800",
  "bg-blue-800",
  "bg-green-800",
  "bg-purple-800",
  "bg-orange-800",
  "bg-indigo-800",
];

interface Props {
  beneficios: Beneficio[];
}

export function WobbleCardDemo({ beneficios }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
      {beneficios.map((beneficio, index) => {
        const IconComponent = iconMap[beneficio.icon];
        const colorClass = colorClasses[index % colorClasses.length];
        const delay = 0.2 + index * 0.1;

        return (
          <motion.div
            key={beneficio.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay }}
          >
            <WobbleCard
              containerClassName={`col-span-1 ${colorClass} min-h-[320px]`}
              className=""
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    {IconComponent && <IconComponent className="w-8 h-8 text-white" />}
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-full">
                    <span className="text-xs font-bold text-white uppercase tracking-wide">
                      {beneficio.tag}
                    </span>
                  </div>
                </div>
                <h2 className="text-left text-balance text-xl md:text-2xl font-bold tracking-tight text-white mb-3">
                  {beneficio.title}
                </h2>
                <p className="text-left text-base text-neutral-200">
                  {beneficio.sutitle}
                </p>
              </div>
            </WobbleCard>
          </motion.div>
        );
      })}
    </div>
  );
}
