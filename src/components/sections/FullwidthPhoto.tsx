import Image from "next/image"

interface FullwidthPhotoProps {
  src: string
  alt: string
  height?: string
  position?: string
}

export default function FullwidthPhoto({
  src,
  alt,
  height = "55vh",
  position = "center center",
}: FullwidthPhotoProps) {
  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  )
}
