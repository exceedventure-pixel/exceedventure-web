import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config })

  console.log('Fetching existing pages...')
  const pages = await payload.find({
    collection: 'pages',
    limit: 1000,
  })

  // for (const page of pages.docs) {
  //   await payload.delete({
  //     collection: 'pages',
  //     id: page.id,
  //     context: { disableRevalidate: true },
  //   })
  // }

  const pageNames = [
    'Home', // for Header
    'Services', // for Header
    'Growth packages', // for Header
    'Locations', // for Header
    'Contact', // for Header
    'Company', // for Footer
    'ROI', // for Footer
    'Performance', // for Footer
  ]

  const createdPages: Record<string, any> = {}

  for (const name of pageNames) {
    const slug = name.toLowerCase().replace(/ /g, '-')
    const finalSlug = name === 'Home' ? 'home' : slug

    // Check if it exists
    const existing = pages.docs.find((p: any) => p.slug === finalSlug)
    if (existing) {
      console.log(`Page already exists: ${name} (slug: ${finalSlug})`)
      createdPages[name] = existing
      continue
    }

    console.log(`Creating page: ${name} (slug: ${finalSlug})`)
    const page = await payload.create({
      collection: 'pages',
      context: { disableRevalidate: true },
      data: {
        title: name,
        slug: finalSlug,
        _status: 'published',
        hero: {
          type: 'lowImpact',
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading',
                  tag: 'h1',
                  children: [
                    {
                      type: 'text',
                      text: name,
                      version: 1,
                    },
                  ],
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: 'left',
              indent: 0,
              version: 1,
            },
          },
        },
        layout: [
          {
            blockType: 'content',
            columns: [
              {
                size: 'full',
                richText: {
                  root: {
                    type: 'root',
                    children: [
                      {
                        type: 'paragraph',
                        children: [
                          {
                            type: 'text',
                            text: `Content for ${name}`,
                            version: 1,
                          },
                        ],
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: 'left',
                    indent: 0,
                    version: 1,
                  },
                },
                enableLink: false,
              },
            ],
          },
        ],
      } as any, // bypassing full types for seed script
    })
    createdPages[name] = page
  }

  console.log('Updating Globals...')

  // Update Header
  await payload.updateGlobal({
    slug: 'header',
    context: { disableRevalidate: true },
    data: {
      navItems: [
        {
          link: {
            type: 'reference',
            reference: { relationTo: 'pages', value: createdPages['Home'].id },
            label: 'Home',
          },
        },
        {
          link: {
            type: 'reference',
            reference: { relationTo: 'pages', value: createdPages['Services'].id },
            label: 'Services',
          },
        },
        {
          link: {
            type: 'reference',
            reference: { relationTo: 'pages', value: createdPages['Growth packages'].id },
            label: 'Growth packages',
          },
        },
        {
          link: {
            type: 'reference',
            reference: { relationTo: 'pages', value: createdPages['Locations'].id },
            label: 'Locations',
          },
        },
        {
          link: {
            type: 'reference',
            reference: { relationTo: 'pages', value: createdPages['Contact'].id },
            label: 'Contact',
          },
        },
      ],
    },
  })

  // Update Footer
  await payload.updateGlobal({
    slug: 'footer',
    context: { disableRevalidate: true },
    data: {
      columns: [
        {
          title: 'Company',
          navItems: [
            {
              link: {
                type: 'reference',
                reference: { relationTo: 'pages', value: createdPages['Company'].id },
                label: 'Company',
              },
            },
          ],
        },
        {
          title: 'ROI & Performance',
          navItems: [
            {
              link: {
                type: 'reference',
                reference: { relationTo: 'pages', value: createdPages['ROI'].id },
                label: 'ROI',
              },
            },
            {
              link: {
                type: 'reference',
                reference: { relationTo: 'pages', value: createdPages['Performance'].id },
                label: 'Performance',
              },
            },
          ],
        },
      ],
    },
  })

  console.log('Database generated and updated successfully.')
  process.exit(0)
}

run().catch(console.error)
