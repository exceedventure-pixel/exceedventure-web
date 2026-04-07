import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config })

  console.log('Fetching existing pages...')
  const pages = await payload.find({
    collection: 'pages',
    limit: 1000,
  })

  // Helper to create or get a page
  const createOrGetPage = async (
    title: string,
    customSlug?: string,
    parentId?: string | number,
    template?: string,
  ) => {
    // Add small delay to help MongoDB transactions settle
    await new Promise((res) => setTimeout(res, 300))

    const defaultSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const slug = customSlug || defaultSlug

    // Try finding existing by title
    const existing = pages.docs.find((p: any) => p.title === title)

    // If found, update its parent and template to match new structure
    if (existing) {
      console.log(`Page already exists: ${title} (slug: ${existing.slug})`)
      return existing
    }

    console.log(`Creating page: ${title} (slug: ${slug}, template: ${template || 'default'})`)
    const page = await payload.create({
      collection: 'pages',
      context: { disableRevalidate: true },
      data: {
        title: title,
        slug: slug,
        template: template || 'default',
        _status: 'published',
        parent: parentId,
      } as any,
    })
    return page
  }

  // CREATE TOP LEVEL PAGES
  const home = await createOrGetPage('Home', 'home', undefined, 'home')
  const services = await createOrGetPage('Services', 'services', undefined, 'default')
  const works = await createOrGetPage('Our Works', 'our-works', undefined, 'default')
  const contact = await createOrGetPage('Contact us', 'contact-us', undefined, 'default')
  const ventures = await createOrGetPage('Ventures', 'ventures', undefined, 'default')

  // CREATE SERVICE CATEGORIES
  const websites = await createOrGetPage('Websites & Web Systems', 'websites-web-systems', services.id, 'default')
  const automation = await createOrGetPage('Automation & AI Integration', 'automation-ai', services.id, 'default')
  const mediaBuying = await createOrGetPage('Media Buying & SEO', 'media-buying-seo', services.id, 'default')
  const creative = await createOrGetPage('Creative Assets & Branding', 'creative-assets-branding', services.id, 'default')

  // CREATE VENTURE PAGES
  const cc = await createOrGetPage('Corporate Crafts', 'corporate-crafts', ventures.id, 'default')
  const crc = await createOrGetPage('Creata Content', 'creata-content', ventures.id, 'default')
  const sc = await createOrGetPage('Softal Core', 'softal-core', ventures.id, 'default')

  console.log('Updating Globals...')

  const makeRef = (page: any, label: string) => ({
    link: { type: 'reference', reference: { relationTo: 'pages', value: page.id }, label },
  })

  await payload.updateGlobal({
    slug: 'header',
    context: { disableRevalidate: true },
    data: {
      enableVentures: true,
      venturesLabel: 'VENTURES',
      venturesPage: ventures.id,
      ventureItems: [
        { name: 'Corporate Crafts', page: cc.id },
        { name: 'Creata Content', page: crc.id },
        { name: 'Softal Core', page: sc.id },
      ],
      navItems: [
        makeRef(home, 'HOME'),
        {
          ...makeRef(services, 'SERVICES'),
          subLinks: [
            makeRef(websites, 'WEBSITES & WEB SYSTEMS'),
            makeRef(automation, 'AUTOMATION & AI INTEGRATION'),
            makeRef(mediaBuying, 'MEDIA BUYING & SEO'),
            makeRef(creative, 'CREATIVE ASSETS & BRANDING')
          ],
        },
        makeRef(works, 'WORKS'),
        makeRef(contact, 'CONTACT'),
      ],
    } as any,
  })
  console.log('Database generated and updated successfully.')
  process.exit(0)
}

run().catch(console.error)