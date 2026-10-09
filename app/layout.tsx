import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Cliffesto | Thoughtful goods for everyday life",
  description: "A modern local-first storefront.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body><Header />{children}<Footer /></body></html>;
}
