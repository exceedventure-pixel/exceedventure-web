'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import { useTheme } from '@/providers/Theme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState, useRef, Suspense } from 'react'

import { Home, Briefcase, FolderGit2, Layers, Mail, LogIn, Menu } from 'lucide-react'
import Image from 'next/image'

import type { Header, SiteSetting, Page } from '@/payload-types'
import DesktopNav from './Nav/DesktopNav'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cx(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

const APP_PORTAL_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.exceedventure.com'

interface HeaderClientProps {
  data: Header
  siteSettings: SiteSetting
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, siteSettings }) => {
  const [headerThemeState, setHeaderThemeState] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null)
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)
  const headerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(true)
  const [isDesktop, setIsDesktop] = useState(false)
  const [activeTabName, setActiveTabName] = useState('HOME')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    let lastScrollY = window.scrollY
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsScrollingDown(true)
      } else if (currentScrollY < lastScrollY) {
        setIsScrollingDown(false)
      }
      lastScrollY = currentScrollY
    }
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      setIsDesktop(!mobile)
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    setHeaderTheme(null)
    setActiveMobileDropdown(null)
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== headerThemeState) setHeaderThemeState(headerTheme)
  }, [headerTheme])

  const lightLogoUrl =
    typeof siteSettings?.siteLogoLight === 'object' ? siteSettings.siteLogoLight?.url : null
  const darkLogoUrl =
    typeof siteSettings?.siteLogoDark === 'object' ? siteSettings.siteLogoDark?.url : null

  const formatUrl = (linkObj: any) => {
    if (!linkObj) return '/'
    if (linkObj.type === 'reference' && linkObj.reference?.value) {
      const page = linkObj.reference.value as Page
      return typeof page === 'string' ? '/' + page : '/' + (page.slug || '')
    }
    return linkObj.url || '/'
  }

  const navItems = data?.navItems || []

  const items = navItems.map((item) => ({
    name: item.link.label,
    url: formatUrl(item.link),
    icon: guessIcon(item.link.label),
    subItems:
      item.subLinks?.map((sub) => ({
        name: sub.link.label,
        url: formatUrl(sub.link),
      })) || [],
  })) as any[]

  if (data?.enableVentures) {
    const vUrl =
      typeof data.venturesPage === 'object' && data.venturesPage !== null
        ? '/' + (data.venturesPage as Page).slug || ''
        : '/ventures'

    items.splice(3, 0, {
      name: data.venturesLabel || 'VENTURES',
      url: vUrl,
      icon: Layers,
      subItems:
        data.ventureItems?.map((v) => ({
          name: v.name,
          url:
            typeof v.page === 'object' && v.page !== null ? '/' + (v.page as Page).slug || '' : '/',
          logo: typeof v.lightLogo === 'object' ? v.lightLogo?.url : undefined,
          darkLogo: typeof v.darkLogo === 'object' ? v.darkLogo?.url : undefined,
          isVenture: true,
        })) || [],
    } as any)
  }

  function guessIcon(name: string) {
    const n = name.toLowerCase()
    if (n.includes('home')) return Home
    if (n.includes('service')) return Briefcase
    if (n.includes('work') || n.includes('portfolio')) return FolderGit2
    if (n.includes('venture')) return Layers
    if (n.includes('contact')) return Mail
    return Menu
  }

  const safeTheme = theme === 'dark' || headerThemeState === 'dark' ? 'dark' : 'light'

  // Prevent generic Next.js hydration SSR errors when waiting on dynamic theme
  if (!mounted) return null

  return (
    <header className="sticky top-0 w-full z-50 font-medium text-base-content lg:pt-4">
      <div className="container mx-auto relative px-[2%] xl:px-0">
        <div
          className="flex flex-col w-full transition-transform duration-300 ease-in-out"
          style={{
            transform:
              isMobile && isScrollingDown ? 'translateY(-' + headerHeight + 'px)' : 'translateY(0)',
          }}
        >
          <div
            ref={headerRef}
            className={cx(
              'relative z-50 flex justify-between items-center py-2 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none w-full',
              safeTheme === 'dark' ? 'bg-black/90' : 'bg-white/90',
            )}
          >
            <Link href="/" className="z-10">
              <Image
                src={
                  safeTheme === 'dark'
                    ? darkLogoUrl || '/exceed-venture-logo-dark.svg'
                    : lightLogoUrl || '/exceed-venture-logo.svg'
                }
                alt="Exceed Venture"
                width={128}
                height={40}
                className="w-24 sm:w-28 md:w-32 lg:w-36 h-auto object-contain"
                priority
              />
            </Link>

            <div className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
              {isDesktop && (
                <Suspense fallback={<div />}>
                  <DesktopNav
                    theme={safeTheme}
                    activeTabName={activeTabName}
                    setActiveTabName={setActiveTabName}
                    data={data}
                  />
                </Suspense>
              )}
            </div>

            <div className="flex items-center gap-4 z-10">
              {/* Theme Toggle SVG omitted for brevity, you use next-themes */}
              <label className="swap swap-rotate text-base-content">
                <input
                  type="checkbox"
                  className="theme-controller"
                  value="dark"
                  onChange={() => setTheme(safeTheme === 'light' ? 'dark' : 'light')}
                  checked={safeTheme === 'dark'}
                />
                <svg
                  className="swap-off h-8 w-8 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="4"></circle>
                    <path d="M12 2v2"></path>
                    <path d="M12 20v2"></path>
                    <path d="m4.93 4.93 1.41 1.41"></path>
                    <path d="m17.66 17.66 1.41 1.41"></path>
                    <path d="M2 12h2"></path>
                    <path d="M20 12h2"></path>
                    <path d="m6.34 17.66-1.41 1.41"></path>
                    <path d="m19.07 4.93-1.41 1.41"></path>
                  </g>
                </svg>
                <svg
                  className="swap-on h-8 w-8 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                  </g>
                </svg>
              </label>
              <a
                href={APP_PORTAL_URL + '/login'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-primary-content font-bold py-2 px-4 rounded-full transition-colors"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">Login / Sign Up</span>
                <span className="sm:hidden">Login</span>
              </a>
            </div>
          </div>

          {/* Mobile Grid Component */}
          <div
            className={cx(
              'z-40 lg:hidden w-full transition-colors border-t border-base-content/10',
              safeTheme === 'dark' ? 'bg-black' : 'bg-white',
            )}
          >
            <div
              className="grid gap-1 px-2 py-2"
              style={{ gridTemplateColumns: 'repeat(' + items.length + ', minmax(0, 1fr))' }}
            >
              {items.map((item, idxx) => {
                const isActive = activeTabName === item.name
                const hasSubItems = item.subItems && item.subItems.length > 0
                const isDropdownOpen = activeMobileDropdown === item.name
                const Icon = item.icon || Menu

                if (hasSubItems) {
                  return (
                    <button
                      key={idxx}
                      onClick={() => setActiveMobileDropdown(isDropdownOpen ? null : item.name)}
                      className={cx(
                        'flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors min-h-15 touch-manipulation cursor-pointer',
                        isActive || isDropdownOpen
                          ? 'text-primary bg-primary/10'
                          : safeTheme === 'dark'
                            ? 'text-white/60 hover:text-white hover:bg-white/10'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
                      )}
                    >
                      <Icon size={20} strokeWidth={isActive || isDropdownOpen ? 2.5 : 2} />
                      <span className="text-[10px] font-medium text-center leading-tight truncate w-full">
                        {item.name}
                      </span>
                    </button>
                  )
                }
                return (
                  <Link
                    key={idxx}
                    href={item.url}
                    onClick={() => {
                      setActiveMobileDropdown(null)
                      setActiveTabName(item.name)
                    }}
                    className={cx(
                      'flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors min-h-15 touch-manipulation',
                      isActive
                        ? 'text-primary bg-primary/10'
                        : safeTheme === 'dark'
                          ? 'text-white/60 hover:text-white hover:bg-white/10'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
                    )}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] font-medium text-center leading-tight truncate w-full">
                      {item.name}
                    </span>
                  </Link>
                )
              })}
            </div>

            <div
              className={cx(
                'w-full overflow-hidden grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                activeMobileDropdown ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div
                  className={cx(
                    'mx-2 mb-2 rounded-xl overflow-hidden p-2 shadow-lg border border-base-content/10',
                    safeTheme === 'dark' ? 'bg-base-200' : 'bg-white',
                  )}
                >
                  <div className="flex flex-col gap-1">
                    {items
                      .find((i) => i.name === activeMobileDropdown)
                      ?.subItems?.map((subItem: any, sdix: number) => (
                        <Link
                          key={sdix}
                          href={subItem.url}
                          onClick={() => setActiveMobileDropdown(null)}
                          className={cx(
                            'block rounded-lg text-sm font-medium transition-colors',
                            subItem.logo ? 'px-2 py-4' : 'px-4 py-3',
                            safeTheme === 'dark'
                              ? 'hover:bg-base-300 text-base-content'
                              : 'hover:bg-gray-100 text-gray-800',
                            subItem.logo && 'flex justify-center items-center',
                          )}
                        >
                          {subItem.logo ? (
                            <Image
                              src={
                                safeTheme === 'dark' && subItem.darkLogo
                                  ? subItem.darkLogo
                                  : subItem.logo
                              }
                              alt={subItem.name}
                              className="h-12 w-auto object-contain"
                              width={120}
                              height={48}
                            />
                          ) : (
                            <span className="font-bold text-sm">{subItem.name}</span>
                          )}
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
