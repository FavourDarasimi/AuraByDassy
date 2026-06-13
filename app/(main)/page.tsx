import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import WhatsAppCTA from "@/components/home/WhatsAppCTA";

export const revalidate = 30;

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
