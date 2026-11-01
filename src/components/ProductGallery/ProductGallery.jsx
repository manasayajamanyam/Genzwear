import { useEffect, useState } from 'react'

export default function ProductGallery({ product, selectedColour }) {
  const images = product.images?.length
    ? product.images
    : [{ url: product.primaryImage, alt: product.name }]
  const [activeIndex, setActiveIndex] = useState(0)
  const active = images[activeIndex] || images[0]

  useEffect(() => {
    if (!selectedColour) return
    const matchingIndex = images.findIndex(
      (image) => image.colour?.toLowerCase() === selectedColour.toLowerCase()
    )
    if (matchingIndex >= 0) setActiveIndex(matchingIndex)
  }, [images, selectedColour])

  return (
    <div className="grid gap-4">
      <div className="overflow-hidden bg-ink-soft">
        <img
          src={active.url}
          alt={active.alt || product.name}
          className="aspect-[4/5] w-full object-cover"
        />
      </div>
      {images.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.publicId || image.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-20 w-16 shrink-0 overflow-hidden border ${
                index === activeIndex ? 'border-gold' : 'border-transparent'
              }`}
            >
              <img src={image.url} alt={image.alt || `View ${index + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
