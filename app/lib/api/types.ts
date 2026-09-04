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
 * **`upcoming` is a fourth member, and it had to be.** The union was three, and
 * the two facts "entries have not opened yet" and "entries are over" were both
 * being carried by `closed`. That is not a modelling nicety: the card prints the
 * state as a word AND prints the label under the picture, so a tournament whose
 * entries open on 1 November was showing a pill that read CLOSED above a tab
 * that read "Registration opens Nov 1" — the card contradicting itself in two
 * places a reader sees at once. They are also different offers. Entries that
 * open later are worth a reminder; entries that are over are not.
 *
 * A closed union rather than a string: the card colours the pill from this
 * value, so an unexpected member would print an unstyled word instead of
 * failing at the type level.
 */
export type TournamentRegistration = "open" | "upcoming" | "ongoing" | "closed"

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
  /**
   * The four fields the card redraw added (`592:16867`).
   *
   * All four are pre-formatted for the same reason `dateLabel` on `ShowcaseEvent`
   * is: the API owns how a date range reads and how a deadline is phrased, and a
   * page deriving "in 3 days" from a timestamp would re-decide it wrongly the
   * moment the response was cached.
   */
  /** The tab across the picture's top edge, e.g. "Mar 18 - 21, 2027". */
  dateLabel: string
  /**
   * The tab across the picture's bottom edge, and it says what the registration
   * state is doing: "Registration ends in 3 days" while it is `open`,
   * "Registration opens Nov 1" while it is `upcoming`, "Registration closed"
   * once it is `closed`. It must AGREE with `registration` — the pill prints the
   * state and this prints the detail, and the two sit an inch apart.
   *
   * OPTIONAL, because a tournament being played has neither. `ongoing` leaves it
   * unset and the card drops the tab rather than printing a deadline for
   * entries that are no longer being taken — which is what it did, and what read
   * as a card contradicting its own badge.
   */
  registrationLabel?: string
  /** Whether the tournament is played in person or online — the pill beside the
   *  category (`592:16886`). */
  attendance: "Offline" | "Online"
  /** The formats and scoring, as one line: "Single 101, Double 101, 3 Round,
   *  Best of 3" (`592:16893`). */
  formatLabel: string
  startsAt: IsoDateString
  endsAt?: IsoDateString
  venue?: string
  country?: CountryCode
  /** The tournament's own page. Unset until the portal exists (B2). */
  href?: string
}

/**
 * One labelled fact on the detail page — "Registration period / Jun 01–Aug 14,
 * 2026", "Participants / 64 Teams".
 *
 * Two blocks on that page are built from these and they are drawn as two
 * different cards: Eligibility & Registration puts a gold-tiled glyph beside the
 * pair (`517:2052`), Tournament Format prints the pair alone (`517:2137`). Same
 * shape of fact either way, so it is one type and one card — the presence of
 * `iconUrl` is what separates them.
 */
export type TournamentFact = {
  id: string
  /** The small grey line above, printed in caps by the card (D40). */
  label: string
  value: string
  /**
   * The glyph in the gold tile beside the pair, where the block has one.
   * Eligibility & Registration draws four (`517:2055` and siblings); Tournament
   * Format draws none, and a fact without an icon simply has no tile.
   */
  iconUrl?: string
}

/** One entry on the detail page's schedule timeline (`517:2105`). */
export type TournamentScheduleEntry = {
  id: string
  /** Pre-formatted, e.g. "Aug 28. 09:00" — the API owns how a time reads. */
  time: string
  title: string
  /**
   * Where it happens, as separate parts: the design prints them on one line
   * divided by a bullet ("Madrid Arena • Main Hall"), and an entry with one
   * place prints one. Joined by the component rather than stored joined, so the
   * bullet is a layout decision and not a character inside the data.
   */
  places: string[]
}

/** A referee or official working the tournament (`517:2025`). */
export type TournamentOfficial = {
  id: string
  name: string
  /** e.g. "Chief Referee". */
  role: string
  country: string
  portraitUrl?: string
  portraitAlt?: string
}

/**
 * A winning player or pair on the detail page's Results & Winners row
 * (`517:2180`).
 *
 * `names` is the printed line — a doubles title is won by two people and the
 * design prints them as "Luis Ortega & Mateo Ruiz", one string. `portraitUrls`
 * is a list because the card draws one circle per winner.
 *
 * The same R16 caution the champions rail carried applies: these are placeholder
 * names, and a real name under a real face asserts that a particular living
 * person won a title that does not exist yet.
 */
export type TournamentWinner = {
  id: string
  /** "CHAMPION", "RUNNER-UP", "THIRD PLACE" — the ribbon at the card's head. */
  rankLabel: string
  names: string
  country: string
  portraitUrls: string[]
}

/**
 * The venue block on the detail page (`517:1986`) — a photograph, the hall's
 * name, and the street line under it.
 *
 * This is what `Tournament.venue` becomes on a detail record. The list carries
 * the hall as a bare string because a card prints one line; the page prints a
 * photograph, an address and a country beside it, so the field WIDENS rather
 * than being duplicated under a second name — a record carrying both `venue: "Madrid
 * Arena"` and `venueDetail: { name: "Madrid Arena", … }` is two places to
 * correct the same fact.
 */
export type TournamentVenue = {
  name: string
  /** The street line under the name (`517:2002`). */
  address: string
  country: string
  /**
   * Where the hall is, for the map.
   *
   * Figma's venue block is a MAP with a pin card over it (`517:1988` is a map
   * screenshot, `517:1990` the pin's stem), not a photograph of the building —
   * so the page embeds a real one, and this is what it needs. A venue without
   * coordinates falls back to `imageUrl`, which is why that field stays.
   */
  coordinates?: { lat: number; lng: number }
  /** Shown where there are no coordinates to map. */
  imageUrl: string
  imageAlt: string
  /** The small square in the pin card over the map (`517:1992`). */
  thumbUrl?: string
}

/** What a detail record adds to a list record — see `TournamentDetail`. */
export type TournamentDetailExtras = {
  /** The prose under "Tournament Overview" (`517:2047`). Paragraphs split on
   *  blank lines by the component, so the copy stays one field. */
  summary: string
  /** The full-bleed band under the header (`517:1911`). */
  heroImageUrl: string
  heroImageAlt: string
  /** The gold headline in the hero's info bar — "OCT 12-16, 2026". Separate from
   *  `dateLabel`, which is the card's tab and is written for a 360px tab. */
  dateHeading: string
  venue?: TournamentVenue
  prize?: {
    /** "USD 50.000 Prize pool" (`517:2008`). */
    headline: string
    note: string
    imageUrl: string
    imageAlt: string
  }
  eligibility?: TournamentFact[]
  schedule?: TournamentScheduleEntry[]
  format?: TournamentFact[]
  /** The shelf under "Regulations & Rule" (`517:2153`) — the same documents the
   *  page's own regulations block files. */
  regulations?: ResourceDocument[]
  officials?: TournamentOfficial[]
  contact?: { email: string; phone: string }
  /** Present only once the tournament has been played (`517:2179`). */
  winners?: TournamentWinner[]
}

/**
 * A tournament as its own page prints it — Figma screen `517:1895`.
 *
 * An extension of `Tournament` rather than a separate record, because the header
 * of this page IS the card's data: the same name, category, registration state,
 * attendance and format line. What the detail adds is everything a card has no
 * room for, and all of it is optional except the overview — a tournament that
 * has only just been announced has no schedule, no officials and no winners, and
 * the page draws the blocks it has rather than printing empty headings.
 *
 * `venue` is omitted from the base and redeclared: see `TournamentVenue`.
 */
export type TournamentDetail = Omit<Tournament, "venue"> &
  TournamentDetailExtras

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

/**
 * A national body in the members directory (`405:28396`).
 *
 * Its own entity rather than a `Partner`: a partner is a sponsor with a logo
 * and a website, while this is a member of the federation with a country and a
 * membership tier behind it. They would diverge the moment the directory needs
 * a joined-on date or a tier, and both are already foreseeable.
 */
export type MemberFederation = {
  id: string
  /** The body's own name, in its own language — Figma prints "Confederação
   *  Brasileira de Dominó" and "Federacion Mexicana de Domino" as written. */
  name: string
  /** Printed beside the name, in English. */
  country: string
  /**
   * The flag beside the row. Optional because the federation has supplied one
   * flag so far: Figma draws all six rows with the same grey placeholder
   * square, so a row without a flag is the design's own normal case rather
   * than an error, and the square is what it falls back to.
   */
  flagUrl?: string
  /**
   * The fields the directory's detail card prints (`405:28394` redraw).
   *
   * All optional, and that is the contract rather than laziness: the list is the
   * federation's own register and a body can be recognised long before it has
   * filed a president's name or a phone number. The card prints the rows it has
   * and drops the ones it does not, so a half-filled record renders a shorter
   * card instead of a card full of blanks.
   */
  /** Which membership tier, matching `MEMBERSHIP_TIERS`. */
  tierId?: string
  /** "Joined since 2025" — the year alone; the card writes the sentence. */
  joinedYear?: number
  president?: string
  /** One line, already formatted: "Miami, FL, United States". */
  headquarters?: string
  email?: string
  phone?: string
  /** The federation's own site. Opens in a new tab from the card's corner. */
  websiteUrl?: string
}

/**
 * A standing committee of the federation — `/governance`'s `613:24909`.
 *
 * Distinct from `SubCommittee`, which is About's flat list of names: this one
 * carries what the committee is FOR. `remit` is the three chips under the name,
 * and it is a list rather than a sentence because the design sets them as
 * separate pills and a joined string would have to be split again to draw them.
 *
 * Data rather than copy: a federation reorganises, and the page draws however
 * many bodies it is handed.
 */
export type StandingCommittee = {
  id: string
  name: string
  /** What the committee answers for — three chips in the design. */
  remit: string[]
  /** The glyph in its gold tile. */
  iconUrl?: string
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
  /** The event's picture — the landscape card the redraw (`561:13301`) puts in
   *  the middle column, in place of the portrait panel that stood there. */
  imageUrl: string
  imageAlt: string
  /**
   * The tab across the picture's bottom edge, e.g. "Registration ends in 3 days"
   * (`601:18956`).
   *
   * Already formatted, like `dateLabel` and `location` beside it, and for the
   * same reason: the deadline is the API's to hold and the countdown is the
   * API's to phrase. A page rendering "in 3 days" off a raw timestamp would be
   * re-deciding the wording, and re-deciding it wrongly the moment the value is
   * cached — a page served from an edge cache would keep saying "3 days" into
   * the following week.
   */
  registrationLabel: string
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

/**
 * The title, description and share image a page sends to search engines and to
 * the messaging apps that unfurl links — Figma has no screen for this; it is
 * the CMS's "SEO & Social" module made visible.
 *
 * Every field is optional. A page inherits whatever it does not set from
 * `SiteSeo.default`, and a page with no row at all inherits all of it — which
 * is why the fallback row exists and why it cannot be deleted.
 */
export type PageSeo = {
  title?: string
  description?: string
  /** Absolute. Printed as `og:image`; 1200x630 is what the CMS asks for. */
  ogImageUrl?: string
}

/**
 * `GET /seo` — the whole site's meta in one response.
 *
 * One request rather than one per page: it is a handful of short strings, it is
 * needed on every route, and fetching it per navigation would put a round trip
 * in front of every link.
 *
 * `pages` is keyed by ROUTE PATH exactly as the router writes it (`/about`,
 * `/federation-members`). Dynamic routes are absent by design — their meta is
 * born from the record, not from a row somebody has to remember to add.
 */
export type SiteSeo = {
  default: PageSeo
  pages: Record<string, PageSeo>
}

/** The three pages a question can be pinned to — `Faq::PAGES` on the server. */
export type FaqPlacement = "home" | "domino" | "tournament"

/**
 * One question as `GET /faqs` sends it.
 *
 * `answer` is sanitised HTML, not the `FaqSegment[]` the copy files use: the
 * federation writes these in a rich-text editor whose toolbar includes lists
 * and links, and a flat run of segments cannot represent either. `FaqAccordion`
 * takes both — see `FaqItem.answer` in `~/types/faq`.
 *
 * `category` is present so the FAQ page can build its drawers from the
 * questions that exist rather than from a hardcoded list — a drawer with
 * nothing in it is never drawn.
 */
export type Faq = {
  id: string
  question: string
  answer: string | readonly { text: string; strong?: boolean; em?: boolean }[]
  category?: { slug: string; name: string }
}

/**
 * One clause of a legal document, as `GET /legal/{key}` sends it.
 *
 * `description` is sanitised HTML, not plain text: the clause is written in the
 * backoffice's basic rich-text editor, whose toolbar offers bold, italic,
 * lists and links. A flat string cannot carry a bulleted list, and an email
 * address in the middle of a sentence is a link there rather than a separate
 * field the way `content/legal.ts` had to model it.
 */
export type LegalSectionFromApi = {
  id: string
  title: string
  description: string
}

/** A whole legal document. `key` is the segment in `/page/{key}`. */
export type LegalPage = {
  key: string
  title: string
  slug: string
  /** When the federation last revised it — its choice, not the row's mtime. */
  lastUpdatedAt?: IsoDateString
  sections: LegalSectionFromApi[]
}
