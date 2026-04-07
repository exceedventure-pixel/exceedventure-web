import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { SiteSetting } from '@/payload-types'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = (await getCachedGlobal('site-settings', 1)().catch(
    () => null,
  )) as SiteSetting | null
  const title = siteSettings?.siteTitle || 'Exceed Venture'
  const siteIconUrl =
    typeof siteSettings?.siteIcon === 'object' ? siteSettings?.siteIcon?.url : '/fabicon-site.svg'

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    icons: siteIconUrl
      ? [{ rel: 'icon', url: siteIconUrl }]
      : [{ rel: 'icon', url: '/fabicon-site.svg' }],
    metadataBase: new URL(getServerSideURL()),
    openGraph: mergeOpenGraph(),
    twitter: {
      card: 'summary_large_image',
      creator: '@exceedventure',
    },
  }
}
