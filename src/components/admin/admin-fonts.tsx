import { Archivo, JetBrains_Mono } from 'next/font/google'
import type { ReactNode } from 'react'

// The website's typefaces (same settings as the site, so the font files are shared).
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'] })
const mono = JetBrains_Mono({ subsets: ['latin'] })

export function AdminFonts({ children }: { children?: ReactNode }) {
  return (
    <>
      <style>{`:root{--font-body:${archivo.style.fontFamily},system-ui,sans-serif;--font-mono:${mono.style.fontFamily},ui-monospace,monospace}`}</style>
      {children}
    </>
  )
}
