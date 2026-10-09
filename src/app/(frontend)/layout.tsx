import type { Metadata } from 'next'
import { Archivo, JetBrains_Mono } from 'next/font/google'
import type { ReactNode } from 'react'

import { IntroLoader, IntroScript } from '@/components/layout/intro-loader'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { MotionProvider } from '@/components/motion/motion-provider'
import { cn } from '@/lib/utils'

import './globals.css'

// Archivo's width axis gives headlines the wide, engineered feel of the VTEGI wordmark.
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export const metadata: Metadata = {
  title: {
    default: 'Virtual Technology Enterprise Group Inc. (VTEGI)',
    template: '%s | VTEGI',
  },
  description: 'Technology solutions built around your mission.',
  // NOINDEX=true on preview/test deployments keeps them out of search engines.
  robots: process.env.NOINDEX === 'true' ? { index: false, follow: false } : undefined,
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: next-themes adds the "dark" class before React loads.
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        archivo.variable,
        mono.variable,
        'scroll-pt-18 scroll-smooth motion-reduce:scroll-auto',
      )}
    >
      <head>
        <IntroScript />
      </head>
      <body className="bg-white font-sans text-ink-900 antialiased dark:bg-ink-950 dark:text-ink-100">
        <IntroLoader />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-ink-900 focus:shadow-lg"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <MotionProvider>
            <SiteHeader />
            <main id="main">{children}</main>
            <SiteFooter />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
