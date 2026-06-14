import type { Metadata } from "next";
import { SITE_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your selected items and place your order on WhatsApp. Your cart at AuraByDassy.",
  keywords: [...SITE_KEYWORDS, "shopping cart Nigeria", "checkout fashion", "order clothes online Nigeria"],
};

export default function CartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
