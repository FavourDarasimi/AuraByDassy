"use client";

import { type ReactNode, type ElementType } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type Direction = "up" | "down" | "left" | "right" | "fade" | "scale";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  direction?: Direction;
  duration?: number;
  once?: boolean;
  threshold?: number;
}

const directionClasses: Record<Direction, string> = {
  up: "motion-safe:animate-slide-up",
  down: "motion-safe:animate-slide-down",
  left: "motion-safe:animate-slide-left",
  right: "motion-safe:animate-slide-right",
  fade: "motion-safe:animate-fade-in",
  scale: "motion-safe:animate-scale-reveal",
};

export default function ScrollReveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  direction = "up",
  duration = 700,
  once = true,
  threshold = 0.15,
}: ScrollRevealProps) {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ threshold, once });

  const baseClass = directionClasses[direction];

  return (
    <Tag
      ref={ref}
      className={`${className} ${baseClass}`}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        animationFillMode: "backwards",
        opacity: isVisible ? undefined : 0,
      }}
    >
      {children}
    </Tag>
  );
}
