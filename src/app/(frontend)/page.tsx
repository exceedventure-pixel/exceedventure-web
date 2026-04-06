import type { Metadata } from 'next';
import type { Page as PageType } from '@/payload-types';

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './[...slug]/page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { HomeView } from '@/views/Pages/HomeView'
import { DefaultView } from '@/views/Pages/DefaultView'

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()
  const slug = 'home'
  const url = '/'

  let page: PageType | null = await queryPageBySlug({
    slug,
  })

  // Fallback for seed script context
  if (!page) {
    page = homeStatic as unknown as PageType
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  // Template Routing Logic
  let ViewComponent: React.ReactNode

  switch (page.template) {
    case 'home':
      ViewComponent = <HomeView page={page} />
      break
    case 'default':
    default:
      ViewComponent = <DefaultView page={page} />
      break
  }

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {ViewComponent}
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryPageBySlug({
    slug: 'home',
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
