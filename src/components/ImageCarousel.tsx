'use client'

import React from 'react'
import { useKeenSlider } from 'keen-slider/react'

type Props = {
  imageUrls: string[]
}

export default function ImageCarousel({ imageUrls }: Props) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: 'free-snap',
    slides: {
      perView: 1,
    },
  })

  return (
    <div ref={sliderRef} className="keen-slider rounded-xl overflow-hidden">
      {imageUrls.map((url, index) => (
        <div key={index} className="keen-slider__slide">
          <img
            src={url}
            alt={`Événement image ${index + 1}`}
            className="w-full h-72 object-cover"
          />
        </div>
      ))}
    </div>
  )
}
