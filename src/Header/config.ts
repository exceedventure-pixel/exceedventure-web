import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Navigation Menus',
          fields: [
            {
              name: 'navItems',
              type: 'array',
              fields: [
                link({ appearances: false }),
                {
                  name: 'subLinks',
                  type: 'array',
                  fields: [
                    link({ appearances: false }),
                    {
                      name: 'icon',
                      type: 'text',
                      label: 'Icon (lucide-react name, e.g. Globe, Bot)',
                      required: false,
                    },
                    {
                      name: 'description',
                      type: 'text',
                      label: 'Subtitle / Description (e.g. & WEB SYSTEMS)',
                      required: false,
                    },
                    {
                      name: 'iconColor',
                      type: 'text',
                      label: 'Icon Color Tailwind Class (e.g. text-teal-500)',
                      required: false,
                    },
                    {
                      name: 'subSubLinks',
                      type: 'array',
                      fields: [link({ appearances: false })],
                      admin: {
                        initCollapsed: true,
                        components: {
                          RowLabel: '@/Header/RowLabel#RowLabel',
                        },
                      },
                    },
                  ],
                  admin: {
                    initCollapsed: true,
                    components: {
                      RowLabel: '@/Header/RowLabel#RowLabel',
                    },
                  },
                },
              ],
              maxRows: 6,
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: '@/Header/RowLabel#RowLabel',
                },
              },
            },
          ],
        },
        {
          label: 'Ventures Settings',
          fields: [
            {
              name: 'enableVentures',
              type: 'checkbox',
              label: 'Enable Ventures Menu',
              defaultValue: true,
            },
            {
              name: 'venturesLabel',
              type: 'text',
              label: 'Menu Label (e.g. "VENTURES")',
              defaultValue: 'VENTURES',
              admin: {
                condition: (data, siblingData) => Boolean(siblingData?.enableVentures),
              },
            },
            {
              name: 'venturesPage',
              type: 'relationship',
              relationTo: 'pages',
              label: 'Ventures Main Page',
              admin: {
                condition: (data, siblingData) => Boolean(siblingData?.enableVentures),
              },
            },
            {
              name: 'ventureItems',
              type: 'array',
              label: 'Venture Items',
              admin: {
                components: { RowLabel: '@/Header/RowLabel#RowLabel' },
                condition: (data, siblingData) => Boolean(siblingData?.enableVentures),
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Venture Name',
                },
                {
                  name: 'page',
                  type: 'relationship',
                  relationTo: 'pages',
                  required: true,
                  label: 'Venture Page',
                },
                {
                  name: 'lightLogo',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                  label: 'Light Mode Logo (SVG/PNG)',
                },
                {
                  name: 'darkLogo',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                  label: 'Dark Mode Logo (SVG/PNG)',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
