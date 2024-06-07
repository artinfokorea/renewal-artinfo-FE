import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layouts/Header";
import BottomNavigation from "@/components/layouts/BottomNavigation";
import ClientProvider from "@/components/provider/ClientProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} touch-manipulation`}
        style={{ height: "calc(100vh - 156px)" }}
        suppressHydrationWarning
      >
        <ClientProvider>
          <Header />
          {children}
          <BottomNavigation />
        </ClientProvider>
      </body>
    </html>
  );
}
