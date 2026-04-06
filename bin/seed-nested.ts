import { getPayload } from 'payload'
import config from '../src/payload.config'

async function run() {
  const payload = await getPayload({ config })

  console.log('Fetching existing pages...')
  const pages = await payload.find({
    collection: 'pages',
    limit: 1000,
  })

  const pagesMap: Record<string, any> = {}

  // Helper to create or get a page
  const createOrGetPage = async (
    title: string,
    customSlug?: string,
    parentId?: string,
    template?: string,
  ) => {
    // Add small delay to help MongoDB transactions settle
    await new Promise((res) => setTimeout(res, 500))

    const defaultSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const slug = customSlug || defaultSlug

    // Try finding existing by title
    const existing = pages.docs.find((p: any) => p.title === title)

    // If found, update its parent and template to match new structure
    if (existing) {
      console.log(`Page already exists: ${title} (slug: ${existing.slug})`)
      const updates: any = {}
      if (parentId && existing.parent !== parentId) updates.parent = parentId
      if (template && existing.template !== template) updates.template = template
      if (Object.keys(updates).length > 0) {
        console.log(`Updating ${title}: ${JSON.stringify(updates)}`)
        await payload.update({
          collection: 'pages',
          id: existing.id,
          context: { disableRevalidate: true },
          data: updates,
        })
      }
      pagesMap[title] = existing
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
    pagesMap[title] = page
    return page
  }

  // CREATE TOP LEVEL PAGES
  const home = await createOrGetPage('Home', 'home', undefined, 'home')
  const services = await createOrGetPage('Services', undefined, undefined, 'services')
  const pricing = await createOrGetPage(
    'Airbnb Growth Packages & Pricing',
    'airbnb-growth-packages-pricing',
    undefined,
    'pricing',
  )
  const locations = await createOrGetPage('Locations', undefined, undefined, 'locations')
  const contact = await createOrGetPage('Contact', undefined, undefined, 'contact')

  // CREATE SERVICE CATEGORIES (Parent: Services)
  const otaManagement = await createOrGetPage(
    'OTA Management',
    'ota-management',
    services.id,
    'ota-management',
  )
  const otaVirtualAssistant = await createOrGetPage(
    'OTA Virtual Assistant',
    'ota-virtual-assistant',
    services.id,
    'ota-virtual-assistant',
  )
  const multiPlatform = await createOrGetPage(
    'Multi Platform Listing And maintainance',
    'multi-platform-listing-maintainance',
    services.id,
    'multi-platform-listing',
  )
  const strGrowthConsultancy = await createOrGetPage(
    'STR Growth Consultancy',
    'str-growth-consultancy',
    services.id,
    'str-growth-consultancy',
  )
  const directBookingSEO = await createOrGetPage(
    'Direct Booing Website SEO',
    'direct-booking-website-seo',
    services.id,
    'direct-booking-seo',
  )
  const guestCommunication = await createOrGetPage(
    '24/7 Guest Communication',
    '24-7-guest-communication',
    services.id,
    'guest-communication',
  )
  const airbnbTraining = await createOrGetPage(
    'Air bnb trainning',
    'airbnb-training',
    services.id,
    'airbnb-training',
  )
  const strGrowthSystems = await createOrGetPage(
    'STR growth systems',
    'str-growth-systems',
    services.id,
    'str-growth-systems',
  )

  // CREATE OTA MANAGEMENT SUBPAGES (Parent: OTA Management)
  const airbnbMgt = await createOrGetPage(
    'Airbnb Mgt',
    'airbnb-mgt',
    otaManagement.id,
    'airbnb-management',
  )
  const vrboMgt = await createOrGetPage('Vrbo Mgt', 'vrbo-mgt', otaManagement.id, 'vrbo-management')
  const bookingMgt = await createOrGetPage(
    'Booking.com Mgt',
    'booking-com-mgt',
    otaManagement.id,
    'booking-com-management',
  )

  // CREATE OTA VIRTUAL ASSISTANT SUBPAGES (Parent: OTA Virtual Assistant)
  const airbnbVA = await createOrGetPage(
    'Airbnb VA',
    'airbnb-va',
    otaVirtualAssistant.id,
    'airbnb-va',
  )
  const vrboVA = await createOrGetPage('Vrbo VA', 'vrbo-va', otaVirtualAssistant.id, 'vrbo-va')
  const bookingVA = await createOrGetPage(
    'Booking.com VA',
    'booking-com-va',
    otaVirtualAssistant.id,
    'booking-com-va',
  )

  console.log('Updating Globals...')

  // Build the Header Navigation with nested structure
  const makeRef = (page: any, label: string) => ({
    link: { type: 'reference', reference: { relationTo: 'pages', value: page.id }, label },
  })

  await payload.updateGlobal({
    slug: 'header',
    context: { disableRevalidate: true },
    data: {
      navItems: [
        makeRef(home, 'Home'),
        {
          ...makeRef(services, 'Services'),
          subLinks: [
            {
              ...makeRef(otaManagement, 'OTA Management'),
              subSubLinks: [
                makeRef(airbnbMgt, 'Airbnb Mgt'),
                makeRef(vrboMgt, 'Vrbo Mgt'),
                makeRef(bookingMgt, 'Booking.com Mgt'),
              ],
            },
            {
              ...makeRef(otaVirtualAssistant, 'OTA Virtual Assistant'),
              subSubLinks: [
                makeRef(airbnbVA, 'Airbnb VA'),
                makeRef(vrboVA, 'Vrbo VA'),
                makeRef(bookingVA, 'Booking.com VA'),
              ],
            },
            makeRef(multiPlatform, 'Multi Platform Listing And maintainance'),
            makeRef(strGrowthConsultancy, 'STR Growth Consultancy'),
            makeRef(directBookingSEO, 'Direct Booing Website SEO'),
            makeRef(guestCommunication, '24/7 Guest Communication'),
            makeRef(airbnbTraining, 'Air bnb trainning'),
            makeRef(strGrowthSystems, 'STR growth systems'),
          ],
        },
        makeRef(pricing, 'Airbnb Growth Packages & Pricing'),
        makeRef(locations, 'Locations'),
        makeRef(contact, 'Contact'),
      ],
    } as any,
  })

  console.log('Database generated and updated successfully.')
  process.exit(0)
}

run().catch(console.error)
