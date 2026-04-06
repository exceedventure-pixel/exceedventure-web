'use client'
import React from 'react'

export default function FullPathCell({ rowData }: { rowData?: any }) {
  const doc = rowData || {}
  let fullPath = `/${doc?.slug || ''}`

  if (doc?.breadcrumbs && Array.isArray(doc.breadcrumbs) && doc.breadcrumbs.length > 0) {
    fullPath = doc.breadcrumbs[doc.breadcrumbs.length - 1]?.url || fullPath
  }

  return <span>{fullPath}</span>
}
