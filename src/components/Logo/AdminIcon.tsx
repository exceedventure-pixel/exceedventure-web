import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Icon } from '@/components/Logo/Icon'

export async function AdminIcon() {
  const payload = await getPayload({ config: configPromise })
  const siteSettings = await payload
    .findGlobal({
      slug: 'site-settings',
      depth: 1,
    })
    .catch(() => null)

  const cmsIconUrl = typeof siteSettings?.cmsIcon === 'object' ? siteSettings?.cmsIcon?.url : null

  if (cmsIconUrl) {
    return <img src={cmsIconUrl} alt="CMS Icon" className="max-w-[2rem] w-full h-auto" />
  }

  return <Icon />
}
