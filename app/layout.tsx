import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layouts/Header";
import QueryProvider from "@/components/provider/QueryProvider";
import ToasterProvider from "@/components/provider/ToasterProvider";
import AuthProvider from "@/components/provider/AuthProvider";
import BottomNavigation from "@/components/layouts/BottomNavigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} touch-manipulation h-screen`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ToasterProvider>
            <QueryProvider>
              <Header />
              {children}
              <BottomNavigation />
            </QueryProvider>
          </ToasterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
