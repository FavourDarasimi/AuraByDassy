import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { ShoppingBag } from "lucide-react";

export default function Hero() {
  const whatsappLink = "https://wa.me/2349027458696?text=Hello%20AuraByDassy!";
  const heroImageUrl =
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000";

  return (
    <section className="relative w-full h-[92vh] min-h-[620px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-gray-950">
        <Image
          src={heroImageUrl}
          alt="AuraByDassy Luxury Fashion"
          fill
          priority
          className="object-cover opacity-70"
        />
        {/* Multi-stop gradient for depth + text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex flex-col items-center">
        {/* Eyebrow pill */}
        <span className="inline-flex items-center gap-2 py-1.5 px-4 bg-white/10 backdrop-blur-md border border-white/15 text-white text-[10px] font-bold tracking-[0.22em] uppercase mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 bg-white rounded-full" />
          New Arrivals · AuraByDassy
        </span>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight mb-5 leading-[1.03]">
          Dress the
          
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
            Bold.
          </span>
        </h1>

        {/* Sub-copy */}
        <p className="text-base md:text-lg text-gray-300 mb-10 max-w-lg mx-auto leading-relaxed font-light tracking-wide">
          Premium clothing &amp; accessories. Curated in Nigeria, delivered to your door.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center w-full sm:w-auto">
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-white text-gray-900 text-sm font-bold tracking-wide uppercase hover:bg-gray-100 active:scale-95 transition-all duration-200 shadow-[0_0_24px_rgba(255,255,255,0.18)] whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4" />
            Shop the Collection
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#25D366] text-white text-sm font-bold tracking-wide uppercase hover:bg-[#1ebd5a] active:scale-95 transition-all duration-200 shadow-[0_0_24px_rgba(37,211,102,0.3)] whitespace-nowrap"
          >
            <FaWhatsapp className="w-4 h-4" />
            Order on WhatsApp
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce opacity-60">
        <span className="text-white text-[9px] tracking-[0.3em] uppercase">Scroll</span>
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
