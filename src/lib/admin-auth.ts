import crypto from "crypto"

// Token rotante giornaliero con tolleranza ±24h per evitare problemi a mezzanotte UTC
function generaToken(data: Date): string {
  const chiave = process.env.ADMIN_SECRET!
  const giornoStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
  }).format(data)
  return crypto
    .createHmac("sha256", chiave)
    .update(`${process.env.ADMIN_PASSWORD}:${giornoStr}`)
    .digest("hex")
    .slice(0, 32)
}

export function verificaAdminToken(token: string): boolean {
  const oggi = new Date()
  const ieri = new Date(oggi.getTime() - 24 * 60 * 60 * 1000)
  const tokenOggi = generaToken(oggi)
  const tokenIeri = generaToken(ieri)
  return token === tokenOggi || token === tokenIeri
}

export function generaTokenOggi(): string {
  return generaToken(new Date())
}
