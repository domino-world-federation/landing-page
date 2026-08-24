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
  /**
   * The small grey line above the title on the card (`56:4550`) — what area of
   * the federation's business the document belongs to, not a file category.
   */
  category: string
  /**
   * Not shown on the S10 card, which carries only the category and the title.
   * Kept for the eventual detail/listing page and left optional so a response
   * without it is still valid.
   */
  description?: string
  /**
   * When the document was published. Optional because most cards do not show
   * one: S10 prints the category in that slot, and only the Development page's
   * library (`192:14833`) prints a date. Making it required would invalidate
   * every document the federation has already filed without one.
   *
   * Stored ISO rather than formatted, unlike `fileSize` — a size has no units
   * to choose between once the API has picked one, but a date does, and the
   * two pages that show one would then be stuck with whichever the backend
   * happened to write.
   */
  publishedAt?: IsoDateString
  fileUrl: string
  /**
   * `"zip"` is here because the Development library ships a tournament toolkit
   * as an archive (`192:14833`) — a bundle of templates rather than one
   * document. The union stays closed rather than becoming `string`: the pill
   * prints this value directly, so an unexpected member would put an unstyled
   * word on the card instead of failing at the type level.
   */
  fileType: "pdf" | "doc" | "zip"
  /** Already formatted for display, e.g. "2.4 MB" — the API owns the units. */
  fileSize?: string
}

/**
 * A tournament as S6 presents it — the same event a `Tournament` describes,
 * plus the things only the showcase needs: the prose, the artwork, and the two
 * buttons. Kept separate from `Tournament` because that type is the portal's
 * (phase 2) list shape, where a card has no room for a paragraph.
 */
export type ShowcaseEvent = {
  id: string
  slug: string
  name: string
  /** Already formatted as a span, e.g. "Oct 12 - Oct 15, 2026". The API owns
   *  the range; the page has no second date to reason about. */
  dateLabel: string
  location: string
  summary: string
  /** The portrait behind the card's watermark. */
  imageUrl: string
  imageAlt: string
  detailsUrl?: string
  registerUrl?: string
}

/**
 * One dated step on the About page's heritage timeline (`88:1163`).
 *
 * Data rather than copy, and the distinction matters for where it lives: the
 * federation will keep adding milestones, each is an entity with its own
 * photograph, and the timeline draws however many it is handed. That is the
 * same shape `NewsArticle` and `ResourceDocument` have, so it goes through the
 * client like they do (RULES §8) instead of sitting in `content/`.
 */
export type HeritageMilestone = {
  id: string
  /** The marker on the axis, e.g. "1974". A string because it is a label, not
   *  something the page ever does arithmetic on. */
  year: string
  title: string
  summary: string
  imageUrl: string
  imageAlt: string
}

/**
 * A member of the federation's executive board (`112:3590`).
 *
 * Data, not copy, for the same reason `HeritageMilestone` is: these are people
 * who take office and leave it, each with a portrait of their own, and the
 * carousel draws however many it is handed. `role` is the line above the name —
 * the office rather than a job title, which is why it is stored uppercase-free
 * and cased by CSS.
 */
export type BoardMember = {
  id: string
  /** Rendered as two lines when it contains a newline — see `BoardCard`. */
  name: string
  role: string
  portraitUrl: string
  portraitAlt: string
}

/**
 * One of the federation's specialised committees (`114:3667`).
 *
 * A name and a destination, and that is deliberately all: the design's card is
 * a label and an arrow. `href` is optional because the pages it will point at
 * do not exist yet (blocker B2), so the mock leaves it unset rather than
 * inventing a URL — the same choice `ShowcaseEvent` makes for its two buttons.
 */
export type SubCommittee = {
  id: string
  name: string
  href?: string
}

/** The S3 countdown points at one specific event. */
export type FeaturedEvent = {
  id: string
  name: string
  startsAt: IsoDateString
  location: string
  country?: CountryCode
  /** Flag shown beside the location. Absent means the card renders without
   *  one, so a country the API has no artwork for still works. */
  flagUrl?: string
  ctaUrl?: string
}
