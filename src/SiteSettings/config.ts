import type { GlobalConfig } from 'payload'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteTitle',
      type: 'text',
      required: true,
      defaultValue: 'Assistophere',
    },
    {
      name: 'siteLogoLight',
      label: 'Site Logo (Light Mode)',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'siteLogoDark',
      label: 'Site Logo (Dark Mode)',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'siteIcon',
      label: 'Site Icon (Favicon)',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'cmsIcon',
      label: 'CMS Icon',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
