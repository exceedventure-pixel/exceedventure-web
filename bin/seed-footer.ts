import payloadConfig from '../src/payload.config'
import { getPayload } from 'payload'

async function run() {
  const payload = await getPayload({ config: payloadConfig })

  // First check what's in the DB
  const footer = await payload.findGlobal({ slug: 'footer' })
  console.log('Current footer data:', JSON.stringify(footer, null, 2))

  // Now update footer with new columns structure
  await payload.updateGlobal({
    slug: 'footer',
    context: { disableRevalidate: true },
    data: {
      columns: [
        {
          title: 'COMPANY',
          navItems: [
            {
              link: {
                type: 'custom' as const,
                label: 'About Us',
                url: '/about-us',
              },
              subLinks: [
                { link: { type: 'custom' as const, label: 'Our Team', url: '/about-us/our-team' } },
                {
                  link: {
                    type: 'custom' as const,
                    label: 'Our Clients',
                    url: '/about-us/our-clients',
                  },
                },
                {
                  link: {
                    type: 'custom' as const,
                    label: 'Client Reviews',
                    url: '/about-us/client-reviews',
                  },
                },
                {
                  link: {
                    type: 'custom' as const,
                    label: 'Case Studies',
                    url: '/about-us/case-studies',
                  },
                },
              ],
            },
            {
              link: { type: 'custom' as const, label: 'FAQ', url: '/faq' },
            },
            {
              link: { type: 'custom' as const, label: 'Blogs & Topics', url: '/posts' },
            },
            {
              link: {
                type: 'custom' as const,
                label: 'Terms & Conditions',
                url: '/terms-and-conditions',
              },
            },
            {
              link: { type: 'custom' as const, label: 'Privacy Policy', url: '/privacy-policy' },
            },
          ],
        },
        {
          title: 'ROI & PERFORMANCE',
          navItems: [
            {
              link: {
                type: 'custom' as const,
                label: 'ROI Calculator UK',
                url: '/roi-calculator-uk',
              },
            },
            {
              link: {
                type: 'custom' as const,
                label: 'Enter Airbnb Market',
                url: '/enter-airbnb-market',
              },
            },
            {
              link: {
                type: 'custom' as const,
                label: 'Airbnb Consultancy & Training',
                url: '/airbnb-consultancy-training',
              },
            },
            {
              link: { type: 'custom' as const, label: 'Boost Airbnb', url: '/boost-airbnb' },
            },
            {
              link: {
                type: 'custom' as const,
                label: 'Airbnb Performance Optimization',
                url: '/airbnb-performance-optimization',
              },
            },
          ],
        },
      ],
    },
  })

  console.log('Footer updated successfully!')
  process.exit(0)
}

run().catch(console.error)
