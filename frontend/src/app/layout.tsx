// ─────────────────────────────────────────────────────────────────────────────
// Root Layout — wraps every route in the application
// Providers are injected here so they are available globally.
// ─────────────────────────────────────────────────────────────────────────────
import { QueryProvider } from "@/providers/query-provider";
import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import type { ReactNode } from "react";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ASCENT",
    template: "%s | ASCENT",
  },
  description:
    "Discover opportunities, apply to programs, and track your journey with ASCENT.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
