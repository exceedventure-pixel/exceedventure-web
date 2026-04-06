import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Logo } from '@/components/Logo/Logo'

export async function AdminLogo() {
  const payload = await getPayload({ config: configPromise })
  const siteSettings = await payload
    .findGlobal({
      slug: 'site-settings',
      depth: 1,
    })
    .catch(() => null)

  const lightLogoUrl =
    typeof siteSettings?.siteLogoLight === 'object' ? siteSettings?.siteLogoLight?.url : null
  const darkLogoUrl =
    typeof siteSettings?.siteLogoDark === 'object' ? siteSettings?.siteLogoDark?.url : null

  return (
    <Logo
      loading="lazy"
      priority="low"
      lightLogoUrl={lightLogoUrl ?? undefined}
      darkLogoUrl={darkLogoUrl ?? undefined}
      className="max-h-[2.5rem] w-auto"
    />
  )
}
