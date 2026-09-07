import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dimas Fiebry | Fullstack Developer & Performance Systems Engineer",
  description:
    "Portfolio of Dimas Fiebry Prayhoga Putra. Fullstack Developer specializing in scalable sports analytics platforms, Go Gin & Laravel backends, and modern Next.js React interfaces.",
  keywords: [
    "Dimas Fiebry",
    "Fullstack Developer",
    "Sports Analytics",
    "ISMS Persebaya",
    "Laravel",
    "Golang",
    "Gin",
    "React",
    "Next.js",
    "Inertia.js",
    "TypeScript",
    "Tailwind CSS",
    "Portfolio",
  ],
  authors: [{ name: "Dimas Fiebry Prayhoga Putra", url: "https://fiebryhoga.my.id/" }],
  openGraph: {
    title: "Dimas Fiebry | Fullstack Developer & Performance Systems Engineer",
    description: "Architecting scalable web applications & elite athletic performance analytics platforms.",
    type: "website",
    url: "https://fiebryhoga.my.id/",
  },
};

import { DesktopProvider } from "@/context/DesktopContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans overflow-hidden">
        <DesktopProvider>
          {children}
        </DesktopProvider>
      </body>
    </html>
  );
}
