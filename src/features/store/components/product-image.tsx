'use client'

import Image from 'next/image'
import { useState, type ComponentProps } from 'react'

import { Icon } from '@/components/ui/icon'

type IconName = ComponentProps<typeof Icon>['name']

/** Product photo or brand logo; the category icon when there is neither (the image URL 404s). */
export function ProductImage({ src, alt, icon }: { src: string; alt: string; icon: IconName }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return <Icon name={icon} aria-hidden className="size-12 text-ink-300 on-dark:text-ink-400" />
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      sizes="(min-width: 1024px) 25vw, 50vw"
      className="object-contain p-4"
      onError={() => setFailed(true)}
    />
  )
}
