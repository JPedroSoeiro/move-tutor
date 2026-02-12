import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Move Tutor",
  description: "Master the move, dominate the battle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased bg-zinc-950 text-white`}>
        <div className="flex min-h-screen">
          <Sidebar />
          
          <main 
            className="flex-1 min-h-screen overflow-x-hidden" 
            style={{ marginLeft: '240px' }} 
          >
            <div className="p-4 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}