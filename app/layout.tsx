import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tripmor — Book Tourist Transport Across Morocco",
  description:
    "Browse and book private transfers, day trips, multi-day tours, and car rentals with trusted Moroccan transport providers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
