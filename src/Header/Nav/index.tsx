'use client'

import React, { useState } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink, isValidLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon, ChevronDown } from 'lucide-react'

// Render a single link with optional submenu
const NavItem = ({ item }: { item: NonNullable<HeaderType['navItems']>[0] }) => {
  const [isOpen, setIsOpen] = useState(false)

  // Filter out sub-links and sub-sub-links with broken/deleted references
  const validSubLinks = item.subLinks?.filter((sub) => isValidLink(sub.link)) || []
  const hasSubLinks = validSubLinks.length > 0

  // Skip this nav item entirely if its own link is broken
  if (!isValidLink(item.link)) return null

  return (
    <div
      className="relative text-sm font-medium transition-colors"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex items-center gap-1 hover:text-primary py-2">
        <CMSLink {...item.link} appearance="link" />
        {hasSubLinks && <ChevronDown className="w-4 h-4 opacity-50" />}
      </div>

      {hasSubLinks && isOpen && (
        <div className="absolute top-full left-0 w-64 bg-background border border-border rounded-md shadow-lg p-2 z-50 flex flex-col gap-1">
          {validSubLinks.map((subItem, i) => {
            const validSubSubLinks = subItem.subSubLinks?.filter((ss) => isValidLink(ss.link)) || []
            const hasSubSubLinks = validSubSubLinks.length > 0

            return (
              <div key={i} className="relative group/sub">
                <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted transition-colors">
                  <CMSLink {...subItem.link} appearance="link" className="w-full h-full block" />
                  {hasSubSubLinks && <ChevronDown className="w-4 h-4 opacity-50 -rotate-90" />}
                </div>

                {hasSubSubLinks && (
                  <div className="hidden group-hover/sub:flex flex-col gap-1 absolute top-0 left-full w-48 bg-background border border-border rounded-md shadow-lg p-2 z-50 -ml-1">
                    {validSubSubLinks.map((subSubItem, j) => (
                      <div
                        key={j}
                        className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <CMSLink
                          {...subSubItem.link}
                          appearance="link"
                          className="w-full h-full block text-sm"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-6 items-center flex-wrap md:flex-nowrap">
      {navItems.map((item, i) => (
        <NavItem key={i} item={item} />
      ))}
      <Link href="/search" className="ml-4 p-2 rounded-full hover:bg-muted transition-colors">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 h-5 text-foreground" />
      </Link>
    </nav>
  )
}
