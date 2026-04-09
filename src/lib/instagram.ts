import { Redis } from "ioredis"

const REDIS_KEY_TOKEN = "instagram:access_token"
const REDIS_KEY_EXPIRY = "instagram:token_expiry" // timestamp UNIX (secondi)
const GRAPH_API_BASE = "https://graph.instagram.com"
const POSTS_LIMIT = 6

export interface InstagramPost {
  id: string
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
  media_url: string
  thumbnail_url?: string // solo per VIDEO
  permalink: string
  timestamp: string
}

function getRedis(): Redis {
  const url = process.env.REDIS_URL
  if (!url) throw new Error("REDIS_URL non configurata")
  return new Redis(url)
}

/**
 * Rinnova il token tramite Graph API e aggiorna Redis.
 */
async function refreshToken(redis: Redis, token: string): Promise<string> {
  const res = await fetch(
    `${GRAPH_API_BASE}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
  )
  if (!res.ok) {
    throw new Error(`Rinnovo token fallito: ${res.status}`)
  }
  const data = (await res.json()) as { access_token: string; expires_in: number }
  const newToken = data.access_token
  const newExpiry = Math.floor(Date.now() / 1000) + data.expires_in
  await redis.set(REDIS_KEY_TOKEN, newToken)
  await redis.set(REDIS_KEY_EXPIRY, String(newExpiry))
  return newToken
}

/**
 * Restituisce il token attivo.
 * Priorità: Redis → env var.
 * Se mancano < 10 giorni alla scadenza, rinnova silenziosamente.
 */
async function getActiveToken(redis: Redis): Promise<string> {
  const TEN_DAYS_IN_SECONDS = 10 * 24 * 60 * 60

  const [redisToken, redisExpiry] = await Promise.all([
    redis.get(REDIS_KEY_TOKEN),
    redis.get(REDIS_KEY_EXPIRY),
  ])

  const token = redisToken ?? process.env.INSTAGRAM_ACCESS_TOKEN
  if (!token) throw new Error("INSTAGRAM_ACCESS_TOKEN non configurato")

  const expiryTs = redisExpiry ? parseInt(redisExpiry) : null
  const nowTs = Math.floor(Date.now() / 1000)
  const needsRefresh = expiryTs === null || expiryTs - nowTs < TEN_DAYS_IN_SECONDS

  if (needsRefresh) {
    try {
      return await refreshToken(redis, token)
    } catch (err) {
      // Se il rinnovo fallisce non interrompiamo — usiamo il token esistente
      console.error("[instagram] rinnovo token fallito, uso token esistente:", err)
      return token
    }
  }

  return token
}

/**
 * Fetcha gli ultimi POSTS_LIMIT post dell'account Instagram collegato.
 * Restituisce array vuoto in caso di errore — la sezione rimane visibile ma vuota.
 */
export async function fetchRecentPosts(): Promise<InstagramPost[]> {
  let redis: Redis | null = null
  try {
    redis = getRedis()
    const token = await getActiveToken(redis)
    const fields = "id,media_type,media_url,thumbnail_url,permalink,timestamp"
    const res = await fetch(
      `${GRAPH_API_BASE}/me/media?fields=${fields}&limit=${POSTS_LIMIT}&access_token=${token}`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) {
      console.error("[instagram] fetch fallita:", res.status, await res.text())
      return []
    }

    const data = (await res.json()) as { data: InstagramPost[] }
    return data.data ?? []
  } catch (err) {
    console.error("[instagram] errore:", err)
    return []
  } finally {
    redis?.disconnect()
  }
}
