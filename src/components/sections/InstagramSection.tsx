import SectionLabel from "@/components/ui/SectionLabel"
import RevealText from "@/components/ui/RevealText"
import InstagramGrid from "@/components/sections/InstagramGrid"
import OrganicLink from "@/components/ui/OrganicLink"
import { fetchRecentPosts } from "@/lib/instagram"

// Foto reali del sito usate come placeholder finché Instagram non è collegato
const PLACEHOLDER_POSTS = [
  { url: "https://www.instagram.com/calazingaro/", thumb: "/Cucina/Cala-Zingaro-Cucina-1.webp" },
  { url: "https://www.instagram.com/calazingaro/", thumb: "/Ambiente/Cala-Zingaro-Ambiente-1.webp" },
  { url: "https://www.instagram.com/calazingaro/", thumb: "/Cucina/Cala-Zingaro-Cucina-2.webp" },
  { url: "https://www.instagram.com/calazingaro/", thumb: "/Ambiente/Cala-Zingaro-Ambiente-2.webp" },
  { url: "https://www.instagram.com/calazingaro/", thumb: "/Cucina/Cala-Zingaro-Cucina-3.webp" },
  { url: "https://www.instagram.com/calazingaro/", thumb: "/Ambiente/Cala-Zingaro-Ambiente-3.webp" },
]

export default async function InstagramSection() {
  const rawPosts = await fetchRecentPosts()

  // I VIDEO usano thumbnail_url come anteprima, le IMAGE usano media_url
  const apiPosts = rawPosts
    .filter((p) => p.media_url || p.thumbnail_url)
    .map((p) => ({
      url: p.permalink,
      thumb: p.media_type === "VIDEO" ? (p.thumbnail_url ?? p.media_url) : p.media_url,
    }))

  const posts = apiPosts.length > 0 ? apiPosts : PLACEHOLDER_POSTS

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
            <OrganicLink
              href="https://www.instagram.com/calazingaro/"
              color="var(--color-text)"
              className="text-[0.7rem] tracking-[0.18em] uppercase transition-opacity hover:opacity-60"
              external
            >
              @calazingaro →
            </OrganicLink>
          </div>
        </RevealText>

        <InstagramGrid posts={posts} />

      </div>
    </section>
  )
}
