import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import localFont from "next/font/local"
import { Suspense } from "react"
import "./globals.css"

const customFont = localFont({
  src: "../public/fonts/custom-font.woff2",
  variable: "--font-custom",
  display: "swap",
})

const headlineFont = localFont({
  src: "../public/fonts/headline-font.woff2",
  variable: "--font-headline",
  display: "swap",
})

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${customFont.variable} ${headlineFont.variable} antialiased`}>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
