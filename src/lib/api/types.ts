/**
 * Kontrak data sementara — backend belum tersedia (PRD §8, blocker B2).
 *
 * Bentuk di sini adalah tebakan terdidik, bukan hasil kesepakatan dengan tim
 * backend. Saat response asli tiba, perbaiki file ini lebih dulu; TypeScript
 * akan menunjuk seluruh lokasi yang perlu menyesuaikan.
 */

/** ISO 8601, mis. "2026-11-14T09:00:00Z". Disimpan sebagai string supaya
 *  aman melewati batas Server/Client Component. */
export type IsoDateString = string

export type NewsArticle = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: IsoDateString
  thumbnailUrl: string
  /** Belum tentu ada di response daftar; baru terisi di halaman detail. */
  body?: string
}

export type Partner = {
  id: string
  name: string
  logoUrl: string
  websiteUrl?: string
}

export type Player = {
  id: string
  slug: string
  fullName: string
  country: CountryCode
  rank?: number
  points?: number
  avatarUrl?: string
}

/** ISO 3166-1 alpha-3, mis. "IDN". */
export type CountryCode = string

export type TournamentStatus = "upcoming" | "live" | "completed"

export type Tournament = {
  id: string
  slug: string
  name: string
  status: TournamentStatus
  startsAt: IsoDateString
  endsAt?: IsoDateString
  venue?: string
  country?: CountryCode
}

export type RankingEntry = {
  position: number
  player: Player
  points: number
  /** Selisih posisi dari periode sebelumnya; negatif = turun. */
  movement?: number
}

export type FederationStat = {
  id: string
  label: string
  value: string
}

export type ResourceDocument = {
  id: string
  title: string
  description: string
  fileUrl: string
  fileType: "pdf" | "doc"
  fileSize?: string
}

/** Countdown pada S3 menunjuk satu event tertentu. */
export type FeaturedEvent = {
  id: string
  name: string
  startsAt: IsoDateString
  location: string
  ctaUrl?: string
}
