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
  /**
   * The landscape photograph the news page's featured band prints a story over
   * (`163:7627` — 1920 × 850, full bleed).
   *
   * Separate from `thumbnailUrl` rather than replacing it, because they are
   * different pictures at different sizes: a 572 × 322 card thumbnail blown up
   * to a full-bleed band is visibly soft, and the crop that reads as a square
   * beside a headline is rarely the crop that reads under one.
   *
   * Optional, and the band falls back to `thumbnailUrl` when it is missing —
   * Figma draws one featured photograph for a carousel that steps through
   * several, so a feed where only some stories have been given one is the
   * normal case rather than an error.
   */
  heroImageUrl?: string
  /**
   * Alt text for `heroImageUrl`. Written by whoever files the story, not
   * derived from the headline: the band prints the headline beside the picture
   * already, so repeating it would tell a screen reader the same thing twice
   * and describe nothing.
   */
  heroImageAlt?: string
  /**
   * Whether the story belongs in the news page's featured band.
   *
   * A flag rather than "the newest few". The band is an editorial choice — the
   * federation decides what leads — and tying it to recency would mean the
   * lead story changes by itself every time anything at all is filed.
   */
  isFeatured?: boolean
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

/**
 * Whether entries are being taken — the coloured pill on the tournament card
 * (`373:17445`), which is a different question from `status`. A tournament can
 * be `upcoming` with registration already `closed`, and `live` while its
 * registration reads `ongoing`.
 *
 * A closed union rather than a string: the card colours the pill from this
 * value, so an unexpected member would print an unstyled word instead of
 * failing at the type level.
 */
export type TournamentRegistration = "open" | "closed" | "ongoing"

/**
 * A tournament as the `/tournaments` rail lists it — Figma card `373:17424`.
 *
 * `location` is a display string like `ShowcaseEvent`'s, not `venue` +
 * `country`: the card prints one line and the API owns how it reads. The
 * structured pair stays alongside it for the portal (phase 2), which will sort
 * and filter on them.
 */
export type Tournament = {
  id: string
  slug: string
  name: string
  /** The grey line above the name, e.g. "Inter-continental" (`373:17426`). */
  category: string
  status: TournamentStatus
  registration: TournamentRegistration
  /** Already formatted for display, e.g. "London, United Kingdom". */
  location: string
  imageUrl: string
  imageAlt: string
  startsAt: IsoDateString
  endsAt?: IsoDateString
  venue?: string
  country?: CountryCode
  /** The tournament's own page. Unset until the portal exists (B2). */
  href?: string
}

/**
 * A past winner on the Champions Hall rail (`381:17645`).
 *
 * `portraitUrl` is **optional and currently unset everywhere**, which is the
 * point: the design fills these cards with photographs of real, identifiable
 * public figures and labels them champions of this federation (R16). A card
 * without a portrait falls back to the design's own gradient panel, so the
 * block is complete without asserting that a particular person won anything.
 */
export type Champion = {
  id: string
  /** The small line above the name, e.g. "2024 World Championship". */
  event: string
  /** Rendered as two lines when it contains a newline, like `BoardMember`. */
  name: string
  portraitUrl?: string
  portraitAlt?: string
}

/**
 * One row of the Olympic results table (`381:17802`).
 *
 * `winners` is a single string rather than an array of players: a doubles row
 * names a pair as a pair ("Daniel Rodríguez & Carlos Martínez"), and splitting
 * it would invent a decision about how the two are joined that the table then
 * has to reverse. When the portal has real player records this becomes a
 * relation; today it is what the table prints.
 */
export type OlympicResult = {
  id: string
  /** A label, not something the table does arithmetic on. */
  year: string
  event: string
  category: string
  winners: string
  /** The right-hand column — a country or a national federation. */
  federation: string
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
  /**
   * The document's cover, printed behind the news page's publication card
   * (`168:8636`). Only that shelf draws one: every other list in the site shows
   * documents as a title and a download pill, so requiring a cover would
   * invalidate every document already filed without one.
   */
  coverImageUrl?: string
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

/**
 * One tile in the news page's media collage (`168:8688`).
 *
 * Its own entity rather than a field on `NewsArticle`: the collage is a
 * picture desk, not a headline list — a tile carries no date, no category and
 * no body, and the same photograph can illustrate several stories or none.
 *
 * `kind` drives the tile's shape as well as its badge, which is why it is a
 * closed union rather than a boolean. Figma draws videos as a full 400 × 600
 * column with a play button over the middle, and photographs at 400 × 292
 * stacked in pairs to fill the same height — one field decides both, so a tile
 * cannot end up tall without its badge or badged without the room for one.
 */
export type GalleryItem = {
  id: string
  /** Describes the tile in the accessible listing; not printed on the collage,
   *  which is pictures only. */
  title: string
  imageUrl: string
  imageAlt: string
  kind: "photo" | "video"
}

/**
 * A gallery album — one event's pictures, as `/gallery` groups them
 * (`156:7235` and its three siblings).
 *
 * The page draws two different shapes from this one type and neither is a
 * field: an album with several pictures is a collage, and an album with exactly
 * one is that picture at full width. Derived from `items.length` rather than
 * stored, because a layout name in the data would be the API deciding how a
 * page looks — and the same album has to render differently on a phone anyway.
 */
export type GalleryAlbum = {
  id: string
  /** Addresses the album in `?event=`. */
  slug: string
  title: string
  /** When the event took place — not when the pictures were filed. */
  heldOn: IsoDateString
  items: GalleryItem[]
}
