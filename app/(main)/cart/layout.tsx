import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your selected items and place your order on WhatsApp. Your cart at AuraByDassy.",
};

export default function CartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
