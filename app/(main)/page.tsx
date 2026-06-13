import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import WhatsAppCTA from "@/components/home/WhatsAppCTA";
import { SITE_NAME } from "@/lib/seo";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover premium fashion at AuraByDassy. Shop the latest in clothing, accessories, shoes, and perfumes. Curated in Nigeria, delivered to your door.",
  openGraph: {
    title: `${SITE_NAME} – Premium Fashion`,
    description:
      "Discover premium fashion at AuraByDassy. Shop the latest in clothing, accessories, shoes, and perfumes.",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <FeaturedProducts />
      <HowItWorks />
      <WhyChooseUs />
      <WhatsAppCTA />
    </div>
  );
}
