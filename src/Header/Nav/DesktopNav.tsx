'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import * as Icons from 'lucide-react'

import type { Header as HeaderType, Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs))
}

interface DesktopNavProps {
  theme: 'light' | 'dark' | null
  activeTabName: string
  setActiveTabName: (name: string) => void
  data: HeaderType
}

export default function DesktopNav({
  theme,
  activeTabName,
  setActiveTabName,
  data,
}: DesktopNavProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  const formatUrl = (linkObj: any) => {
    if (!linkObj) return '/'
    if (linkObj.type === 'reference' && linkObj.reference?.value) {
      const page = linkObj.reference.value as Page
      return typeof page === 'string' ? `/${page}` : `/${page.slug || ''}`
    }
    return linkObj.url || '/'
  }

  const navItems = data?.navItems || []

  const items = navItems.map((item) => {
    return {
      name: item.link.label,
      url: formatUrl(item.link),
      link: item.link,
      subItems:
        item.subLinks?.map((sub: any) => ({
          name: sub.link.label,
          url: formatUrl(sub.link),
          link: sub.link,
          icon: sub.icon,
          description: sub.description,
          iconColor: sub.iconColor,
        })) || [],
    }
  })

  if (data?.enableVentures) {
    const vUrl =
      typeof data.venturesPage === 'object' && data.venturesPage !== null
        ? `/${(data.venturesPage as Page).slug || ''}`
        : '/ventures'

    items.splice(3, 0, {
      name: data.venturesLabel || 'VENTURES',
      url: vUrl,
      link: null,
      subItems:
        data.ventureItems?.map((v) => ({
          name: v.name,
          url:
            typeof v.page === 'object' && v.page !== null ? `/${(v.page as Page).slug || ''}` : '/',
          link: null,
          logo: typeof v.lightLogo === 'object' ? v.lightLogo?.url : undefined,
          darkLogo: typeof v.darkLogo === 'object' ? v.darkLogo?.url : undefined,
          isVenture: true,
        })) || [],
    } as any)
  }

  return (
    <motion.div
      className="flex items-center gap-1 sm:gap-3 bg-base-200/50 border border-base-content/10 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg relative transition-colors duration-300"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {items.map((item) => {
        const isActive = activeTabName === item.name
        const isHovered = hoveredTab === item.name

        return (
          <div
            key={item.name}
            className="relative z-50"
            onMouseEnter={() => setHoveredTab(item.name)}
            onMouseLeave={() => setHoveredTab(null)}
          >
            {item.link ? (
              <CMSLink
                {...(item.link as any)}
                label={null as any}
                appearance="inline"
                className={cn(
                  'relative cursor-pointer text-sm font-semibold px-3 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 flex items-center gap-2 no-underline hover:no-underline hover:scale-105 active:scale-95',
                  'text-base-content/70 hover:text-base-content hover:-translate-y-0.5 hover:drop-shadow-sm',
                  isActive && 'text-primary-content font-bold',
                )}
                onClick={() => setActiveTabName(item.name)}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full -z-10 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.03, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="absolute inset-0 bg-primary rounded-full blur-md" />
                    <div className="absolute -inset-1 bg-primary/80 rounded-full blur-xl" />
                    <div className="absolute -inset-2 bg-primary/60 rounded-full blur-2xl" />
                    <div className="absolute -inset-3 bg-primary/40 rounded-full blur-3xl" />
                  </motion.div>
                )}
                <motion.span
                  className="relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {item.name}
                </motion.span>
                {isActive && <ActiveIndicator hoveredTab={isHovered} />}
              </CMSLink>
            ) : (
              <Link
                href={item.url}
                onClick={() => setActiveTabName(item.name)}
                className={cn(
                  'relative cursor-pointer text-sm font-semibold px-3 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 flex items-center gap-2 no-underline hover:no-underline hover:scale-105 active:scale-95',
                  'text-base-content/70 hover:text-base-content hover:-translate-y-0.5 hover:drop-shadow-sm',
                  isActive && 'text-primary-content font-bold',
                )}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full -z-10 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.03, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="absolute inset-0 bg-primary rounded-full blur-md" />
                    <div className="absolute -inset-1 bg-primary/80 rounded-full blur-xl" />
                    <div className="absolute -inset-2 bg-primary/60 rounded-full blur-2xl" />
                    <div className="absolute -inset-3 bg-primary/40 rounded-full blur-3xl" />
                  </motion.div>
                )}
                <motion.span
                  className="relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {item.name}
                </motion.span>
                {isActive && <ActiveIndicator hoveredTab={isHovered} />}
              </Link>
            )}

            <AnimatePresence>
              {isHovered && item.subItems && item.subItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-64"
                >
                  <div
                    className={cn(
                      'rounded-xl shadow-xl overflow-hidden p-2',
                      theme === 'dark' ? 'bg-base-200' : 'bg-white',
                    )}
                  >
                    <div className="flex flex-col gap-1">
                      {item.subItems.map((subItem: any, idx: number) => {
                        if (subItem.isVenture) {
                          return (
                            <Link
                              key={idx}
                              href={subItem.url}
                              className={cn(
                                'block rounded-lg text-sm font-medium transition-all duration-300 px-2 py-4 flex justify-center items-center hover:scale-105 active:scale-95 no-underline hover:no-underline',
                                theme === 'dark'
                                  ? 'hover:bg-base-300 text-base-content hover:drop-shadow-sm'
                                  : 'hover:bg-gray-100 text-gray-800 hover:drop-shadow-sm',
                              )}
                            >
                              {subItem.logo ? (
                                <Image
                                  src={
                                    theme === 'dark' && subItem.darkLogo
                                      ? subItem.darkLogo
                                      : subItem.logo
                                  }
                                  alt={subItem.name}
                                  className="h-12 w-auto object-contain"
                                  width={120}
                                  height={48}
                                />
                              ) : (
                                <span>{subItem.name}</span>
                              )}
                            </Link>
                          )
                        }

                        const isLinkWithIcon = !!(subItem.icon || subItem.description)
                        const linkClassName = cn(
                          'block rounded-lg text-sm font-medium transition-all duration-300 px-4 py-3 no-underline hover:no-underline group hover:scale-[1.02]',
                          theme === 'dark'
                            ? 'hover:bg-base-300 text-base-content hover:text-white hover:font-bold hover:drop-shadow-sm'
                            : 'hover:bg-gray-100 text-gray-800 hover:text-black hover:font-bold hover:drop-shadow-sm',
                          isLinkWithIcon && 'flex items-center gap-3',
                        )

                        const Icon = subItem.icon ? (Icons as any)[subItem.icon] : null

                        const content = (
                          <>
                            {Icon && <Icon className={cn('w-6 h-6', subItem.iconColor)} />}
                            {subItem.description || subItem.icon ? (
                              <div className="flex flex-col text-left leading-tight">
                                <span
                                  className={cn(subItem.description ? 'font-bold text-sm' : '')}
                                >
                                  {subItem.name}
                                </span>
                                {subItem.description && (
                                  <span className="font-light text-xs opacity-80">
                                    {subItem.description}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span>{subItem.name}</span>
                            )}
                          </>
                        )

                        return subItem.link ? (
                          <CMSLink
                            key={idx}
                            {...(subItem.link as any)}
                            label={null as any}
                            className={linkClassName}
                          >
                            {content}
                          </CMSLink>
                        ) : (
                          <Link key={idx} href={subItem.url} className={linkClassName}>
                            {content}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </motion.div>
  )
}

function ActiveIndicator({ hoveredTab }: { hoveredTab: boolean }) {
  return (
    <motion.div
      layoutId="anime-mascot"
      className="relative z-20 pointer-events-none"
      initial={false}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="relative w-8 h-8 hidden sm:block">
        <motion.div
          className="absolute inset-0 bg-white rounded-full shadow-lg overflow-hidden"
          animate={
            hoveredTab
              ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.5, ease: 'easeInOut' },
                }
              : { y: [0, -2, 0], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }
          }
        >
          <motion.div
            className="absolute w-1.5 h-1.5 bg-black rounded-full"
            animate={
              hoveredTab
                ? { scaleY: [1, 0.2, 1], transition: { duration: 0.2, times: [0, 0.5, 1] } }
                : {}
            }
            style={{ left: '25%', top: '40%' }}
          />
          <motion.div
            className="absolute w-1.5 h-1.5 bg-black rounded-full"
            animate={
              hoveredTab
                ? { scaleY: [1, 0.2, 1], transition: { duration: 0.2, times: [0, 0.5, 1] } }
                : {}
            }
            style={{ right: '25%', top: '40%' }}
          />
          <motion.div
            className="absolute w-1.5 h-1 bg-pink-300 rounded-full"
            animate={{ opacity: hoveredTab ? 0.8 : 0.6 }}
            style={{ left: '15%', top: '55%' }}
          />
          <motion.div
            className="absolute w-1.5 h-1 bg-pink-300 rounded-full"
            animate={{ opacity: hoveredTab ? 0.8 : 0.6 }}
            style={{ right: '15%', top: '55%' }}
          />
          <motion.div
            className="absolute w-3 h-1.5 border-b-2 border-black rounded-full"
            animate={hoveredTab ? { scaleY: 1.5, y: -0.5 } : { scaleY: 1, y: 0 }}
            style={{ left: '30%', top: '55%' }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
