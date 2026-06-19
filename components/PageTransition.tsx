"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <main
      key={pathname}
      className="flex-grow motion-safe:animate-fade-in"
      style={{ animationDuration: "0.5s" }}
    >
      {children}
    </main>
  );
}
