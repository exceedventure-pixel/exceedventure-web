import { cn } from '@/utilities/ui'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  lightLogoUrl?: string | null
  darkLogoUrl?: string | null
}

export const Logo = (props: Props) => {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
    lightLogoUrl,
    darkLogoUrl,
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  const finalLightLogoUrl = lightLogoUrl || '/exceed-venture-logo.svg'
  const finalDarkLogoUrl = darkLogoUrl || '/exceed-venture-logo-dark.svg'

  return (
    <div className={cn('relative flex items-center', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="Exceed Venture Logo"
        width={193}
        height={34}
        loading={loading}
        fetchPriority={priority}
        decoding="async"
        className="w-auto h-full dark:hidden object-contain"
        src={finalLightLogoUrl}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="Exceed Venture Logo Dark"
        width={193}
        height={34}
        loading={loading}
        fetchPriority={priority}
        decoding="async"
        className="w-auto h-full hidden dark:block object-contain"
        src={finalDarkLogoUrl}
      />
    </div>
  )
}
