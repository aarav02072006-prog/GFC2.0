import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const themeBootstrap = `(()=>{const root=document.documentElement;let p="system";try{const t=localStorage.getItem("cliffesto-theme");if(t==="light"||t==="dark"||t==="system")p=t}catch(e){console.error("Unable to initialize the saved theme preference.",e)}const d=p==="dark"||(p==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);root.classList.toggle("dark",d);root.dataset.theme=p})();`;

export const metadata: Metadata = {
  title: "Cliffesto | Thoughtful goods for everyday life",
  description: "A modern local-first storefront.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
