/**
 * Provisional data contract — no backend yet (PRD §8, blocker B2).
 *
 * These shapes are educated guesses, not something agreed with a backend team.
 * When the real responses arrive, fix this file first; TypeScript will then
 * point at every place that has to follow.
 */

/** ISO 8601, e.g. "2026-11-14T09:00:00Z". Kept as a string so it crosses the
 *  Server/Client Component boundary safely. */
export type IsoDateString = string

export type NewsArticle = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: IsoDateString
  thumbnailUrl: string
  /** Not guaranteed in list responses; only filled in on the detail page. */
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

/** ISO 3166-1 alpha-3, e.g. "IDN". */
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
  /** Change in position since the previous period; negative means a drop. */
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

/** The S3 countdown points at one specific event. */
export type FeaturedEvent = {
  id: string
  name: string
  startsAt: IsoDateString
  location: string
  ctaUrl?: string
}
