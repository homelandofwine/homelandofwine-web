'use client'

import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'

type GalleryPhoto = {
  src: string
  width?: number
  height?: number
  alt: string
  thumb: string
}

export function EventsGallery({ photos, heading }: { photos: GalleryPhoto[]; heading: string }) {
  const [index, setIndex] = useState(-1)
  if (photos.length === 0) return null

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:py-20">
        <h2 className="text-3xl tracking-tight text-ink">{heading}</h2>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className="group overflow-hidden rounded-md"
              aria-label={photo.alt}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.thumb}
                alt={photo.alt}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={photos.map((p) => ({ src: p.src, width: p.width, height: p.height, alt: p.alt }))}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 3 }}
      />
    </section>
  )
}
