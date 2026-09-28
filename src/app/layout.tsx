import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { MotionProvider } from "@/components/motion/MotionProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], axes: ["opsz"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Bower Tech Labs — Product Design That Ships in Days, Not Months.",
  description:
    "SaaS dashboards, marketing sites, and digital products — designed, built, and ready to test while agencies are still scheduling their third discovery call.",
  icons: { icon: "/brand/logo-mark.png" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-page font-sans text-ink antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
