import clsx from 'clsx'
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

  const defaultLogo = '/ASSISTOPHERE%20SITE%20LOGO.svg'

  if (lightLogoUrl && darkLogoUrl) {
    return (
      <div className={clsx('relative flex', className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Site Logo Light"
          width={193}
          height={34}
          loading={loading}
          fetchPriority={priority}
          decoding="async"
          className="w-auto h-full dark:hidden object-contain"
          src={lightLogoUrl}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Site Logo Dark"
          width={193}
          height={34}
          loading={loading}
          fetchPriority={priority}
          decoding="async"
          className="w-auto h-full hidden dark:block object-contain"
          src={darkLogoUrl}
        />
      </div>
    )
  }

  const srcUrl = lightLogoUrl || darkLogoUrl || defaultLogo

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      alt="Assistophere Logo"
      width={193}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx(
        'max-w-[12rem] w-full h-auto',
        !lightLogoUrl && !darkLogoUrl && 'invert dark:invert-0',
        className,
      )}
      src={srcUrl}
    />
  )
}
