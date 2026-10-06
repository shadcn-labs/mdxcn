import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import { SiteFooter } from "@/components/site/footer"
import { SiteHeader } from "@/components/site/header"
import { DesktopHint } from "@/components/site/desktop-hint"
import { SiteToaster } from "@/components/site/toast"
import { ThemeProvider } from "@/components/theme-provider"
import { accentBlockingScript, DEFAULT_ACCENT_ID } from "@/lib/accent"
import { getGithubStars } from "@/lib/github"
import {
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_NAME_SHORT,
  SITE_OG_IMAGE,
  SITE_TITLE,
  SITE_TWITTER,
  SITE_URL,
} from "@/lib/site"
import { cn } from "@/lib/utils"

import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_NAME_SHORT}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [...SITE_KEYWORDS],
  publisher: SITE_AUTHOR.name,
  alternates: {
    canonical: "/",
  },
  authors: [{ name: SITE_AUTHOR.name, url: SITE_AUTHOR.url }],
  creator: SITE_AUTHOR.name,
  openGraph: {
    title: SITE_TITLE,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME_SHORT,
    images: [SITE_OG_IMAGE],
  },
  twitter: {
    title: SITE_TITLE,
    card: "summary_large_image",
    site: SITE_TWITTER,
    creator: SITE_TWITTER,
    images: [SITE_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const stars = await getGithubStars()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-accent={DEFAULT_ACCENT_ID}
      data-accent-kind="gradient"
      className={cn(
        "dark antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans"
      )}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: accentBlockingScript() }} />
      </head>
      <body>
        <ThemeProvider>
          <a
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-background focus:px-3 focus:py-2 focus:text-foreground"
            href="#main"
          >
            Skip to content
          </a>
          <div className="isolate flex min-h-dvh min-w-0 flex-col overflow-x-clip">
            <SiteHeader stars={stars} />
            <DesktopHint />
            <div className="min-w-0 flex-1">{children}</div>
            <SiteFooter />
          </div>
          <SiteToaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
