import type { Metadata } from 'next';
import type { Page as PageType } from '@/payload-types';

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { redirect } from 'next/navigation'
import { HomeView } from '@/views/Pages/HomeView'
import { DefaultView } from '@/views/Pages/DefaultView'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map((doc: any) => {
      // If we have breadcrumbs, split the URL to get the full slug array
      if (doc?.breadcrumbs && doc.breadcrumbs.length > 0) {
        const url = doc.breadcrumbs[doc.breadcrumbs.length - 1].url
        if (url) {
          const split = url.split('/').filter(Boolean)
          if (split.length > 0) return { slug: split }
        }
      }
      return { slug: [doc.slug || ''] }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string | string[]
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const resolvedParams = await paramsPromise
  const slugArray = resolvedParams.slug || ['home']
  const slug = Array.isArray(slugArray) ? slugArray[slugArray.length - 1] : slugArray

  if (slug === 'home') {
    redirect('/')
  }

  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + (Array.isArray(slugArray) ? slugArray.join('/') : slugArray)
  let page: PageType | null

  page = await queryPageBySlug({
    slug: decodedSlug,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
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
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {ViewComponent}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const resolvedParams = await paramsPromise
  const slugArray = resolvedParams.slug || ['home']
  const slug = Array.isArray(slugArray) ? slugArray[slugArray.length - 1] : slugArray

  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
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
