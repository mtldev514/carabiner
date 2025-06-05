'use client'

import React, { useState } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

type Props = {
  imageUrls: string[]
}

export default function ImageCarousel({ imageUrls }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: 'free-snap',
    slides: {
      perView: 1,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
  })

  const handlePrev = () => instanceRef.current?.prev()
  const handleNext = () => instanceRef.current?.next()

  const isSingleImage = imageUrls.length <= 1

  return (
    <div className="relative">
      <div ref={sliderRef} className="keen-slider rounded-xl overflow-hidden">
        {imageUrls.map((url, index) => (
          <div
            key={index}
            className="keen-slider__slide flex justify-center items-center"
          >
            <img
              src={url}
              alt={`Événement image ${index + 1}`}
              className="w-full max-w-[400px] aspect-square object-cover"
            />
          </div>
        ))}
      </div>

      {/* Arrows hidden as navigation relies on swiping or pagination dots */}

      {/* Pagination points */}
      <div className="flex justify-center mt-2 space-x-1">
        {imageUrls.map((_, idx) => (
          <button
            key={idx}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            className={`w-2 h-2 rounded-full ${
              currentSlide === idx
                ? 'bg-pink-600 dark:bg-pink-400'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}