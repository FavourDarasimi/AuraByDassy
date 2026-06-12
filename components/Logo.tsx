"use client";

import Link from "next/link";

interface LogoProps {
  href?: string;
  collapsed?: boolean;
  className?: string;
}

export default function Logo({
  href = "/",
  collapsed = false,
  className = "",
}: LogoProps) {
  const icon = (
    <span className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 shrink-0">
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
        <path
          d="M20 2L38 20L20 38L2 20Z"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-gray-900"
        />
        <path
          d="M20 8L32 20L20 32L8 20Z"
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.3"
        />
        <path
          d="M20 14L26 20L20 26L14 20Z"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.15"
        />
      </svg>
    </span>
  );

  const wordmark = collapsed ? null : (
    <span className="tracking-widest  text-lg sm:text-xl font-semibold tracking-tight text-gray-900 leading-none">
      AuraByDassy
    </span>
  );

  const content = (
    <span className={`flex items-center gap-1.5 sm:gap-2 ${className}`}>
      {icon}
      {wordmark}
    </span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
