'use client'
import React from 'react'

export default function FullTitleCell({ rowData }: { rowData?: any }) {
  const doc = rowData || {}
  let title = doc?.title || doc?.slug || ''

  if (doc?.breadcrumbs && Array.isArray(doc.breadcrumbs) && doc.breadcrumbs.length > 0) {
    title = doc.breadcrumbs.map((b: any) => b?.label).join(' > ')
  }

  return <span>{title}</span>
}
