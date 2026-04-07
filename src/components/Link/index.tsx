import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Post } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

/** Returns true if a CMSLink-style link object points to a valid destination */
export function isValidLink(
  link?: {
    type?: 'custom' | 'reference' | null
    url?: string | null
    reference?: { value: unknown } | null
  } | null,
): boolean {
  if (!link) return false
  if (link.type === 'custom') return Boolean(link.url)
  if (link.type === 'reference')
    return typeof link.reference?.value === 'object' && link.reference.value !== null
  return false
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
    onClick,
  } = props

  let href = url

  if (type === 'reference' && typeof reference?.value === 'object' && reference.value.slug) {
    if (reference.relationTo === 'pages') {
      const pageValue = reference.value as Page
      if (pageValue.slug === 'home') {
        href = '/'
      } else if (pageValue.breadcrumbs && pageValue.breadcrumbs.length > 0) {
        href = pageValue.breadcrumbs[pageValue.breadcrumbs.length - 1]?.url || `/${pageValue.slug}`
      } else {
        href = `/${pageValue.slug}`
      }
    } else {
      href = `/${reference.relationTo}/${reference.value.slug}`
    }
  }

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href || url || ''} onClick={onClick} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance} onClick={onClick as any}>
      <Link className={cn(className)} href={href || url || ''} onClick={onClick} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  )
}
