'use client'

import Image from 'next/image'
import { useState, type ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import { ProductImage } from './product-image'

const frame = 'relative overflow-hidden rounded-xl border border-ink-200 bg-white on-dark:border-white/10'

/** Main photo with thumbnails to switch between up to 5 photos. */
export function ProductGallery({
  images,
  alt,
  icon,
}: {
  images: string[]
  alt: string
  icon: ComponentProps<typeof ProductImage>['icon']
}) {
  const [active, setActive] = useState(0)
  return (
    <div>
      <div className={cn(frame, 'flex aspect-square items-center justify-center')}>
        <ProductImage key={images[active]} src={images[active]} alt={alt} icon={icon} />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={index === active}
              className={cn(
                frame,
                'aspect-square transition-colors',
                index === active ? 'border-brand-600 on-dark:border-brand-400' : 'hover:border-ink-400',
              )}
            >
              <Image src={src} alt="" fill unoptimized sizes="64px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
