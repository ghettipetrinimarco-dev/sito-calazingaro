import SectionLabel from "@/components/ui/SectionLabel"
import RevealText from "@/components/ui/RevealText"
import InstagramGrid from "@/components/sections/InstagramGrid"

const POSTS = [
  "https://www.instagram.com/p/DW3g0PKDUUT/",
  "https://www.instagram.com/p/DWTTiIIjfoJ/",
  "https://www.instagram.com/p/DWRx6jvDekG/",
  "https://www.instagram.com/p/DWYquh2jQn1/",
  "https://www.instagram.com/p/DWRDD17iOE3/",
  "https://www.instagram.com/p/DWGiTdglMwM/",
  "https://www.instagram.com/p/DV0nwPtiYv8/",
]

async function getThumb(postUrl: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.instagram.com/oembed?url=${encodeURIComponent(postUrl)}&maxwidth=640`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.thumbnail_url ?? null
  } catch {
    return null
  }
}

export default async function InstagramSection() {
  const thumbs = await Promise.all(POSTS.map(getThumb))

  const posts = POSTS.map((url, i) => ({ url, thumb: thumbs[i] })).filter(
    (p): p is { url: string; thumb: string } => p.thumb !== null
  )

  return (
    <section
      className="px-6 md:px-10 py-20 md:py-28"
      style={{ backgroundColor: "var(--color-sand)" }}
    >
      <div className="max-w-6xl mx-auto">

        <RevealText>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <SectionLabel>Instagram</SectionLabel>
              <h2
                className="font-light uppercase tracking-wide leading-none"
                style={{
                  fontFamily: "var(--font-yanone)",
                  fontSize: "clamp(2rem, 5.5vw, 3.2rem)",
                  color: "var(--color-text)",
                }}
              >
                Seguici<br />su Instagram.
              </h2>
            </div>
            <a
              href="https://www.instagram.com/calazingaro/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.6rem] tracking-[0.18em] uppercase border-b pb-0.5 w-fit transition-opacity hover:opacity-60"
              style={{ borderColor: "var(--color-text)", color: "var(--color-text)" }}
            >
              @calazingaro →
            </a>
          </div>
        </RevealText>

        <InstagramGrid posts={posts} />

      </div>
    </section>
  )
}
