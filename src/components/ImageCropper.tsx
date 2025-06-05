'use client'
import Cropper, { Area } from 'react-easy-crop'
import { useState, useCallback } from 'react'

interface Props {
  imageSrc: string
  onCancel: () => void
  onComplete: (file: File) => void
}

export default function ImageCropper({ imageSrc, onCancel, onComplete }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)

  const handleCropComplete = useCallback((_area: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels)
  }, [])

  const handleDone = async () => {
    if (!croppedArea) return
    const file = await getCroppedFile(imageSrc, croppedArea)
    onComplete(file)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-80">
      <div className="relative w-80 h-80 bg-white">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
          aspect={1}
        />
      </div>
      <div className="mt-4 space-x-2">
        <button onClick={onCancel} className="px-3 py-1 rounded bg-gray-300">Cancel</button>
        <button onClick={handleDone} className="px-3 py-1 rounded bg-pink-600 text-white">Done</button>
      </div>
    </div>
  )
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (err) => reject(err))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })
}

async function getCroppedFile(imageSrc: string, crop: Area): Promise<File> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = crop.width
  canvas.height = crop.height

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  )

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], 'cropped.jpg', { type: blob.type }))
      } else {
        reject(new Error('Canvas is empty'))
      }
    }, 'image/jpeg')
  })
}
