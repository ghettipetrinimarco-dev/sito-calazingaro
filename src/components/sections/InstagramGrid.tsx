"use client"

import Image from "next/image"
import { SpotlightCard } from "@/components/ui/spotlight-card"

interface Post {
  url: string
  thumb: string
}

export default function InstagramGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
      {posts.map(({ url, thumb }) => (
        <SpotlightCard key={thumb}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative aspect-square overflow-hidden group"
          >
            <Image
              src={thumb}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </a>
        </SpotlightCard>
      ))}
    </div>
  )
}
