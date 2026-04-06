import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type HomeArgs = {
  heroImage: Media
  metaImage: Media
}

export const home: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  metaImage,
}) => {
  return {
    slug: 'home',
    _status: 'published',
    template: 'home',
    meta: {
      description: 'An open-source website built with Payload.',
      image: metaImage.id,
      title: 'Home Template',
    },
    title: 'Home',
  }
}