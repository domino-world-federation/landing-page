/**
 * Phase 1 dummy data. The shape must mirror the real response, including
 * optional fields left deliberately empty — so swapping in the real API holds
 * no surprises (RULES §8).
 *
 * Text and numbers come from the Figma design so the slice matches on sight.
 */

import type {
  BoardMember,
  Champion,
  ShowcaseEvent,
  FeaturedEvent,
  FederationStat,
  GalleryAlbum,
  MemberFederation,
  GalleryItem,
  HeritageMilestone,
  NewsArticle,
  OlympicResult,
  Partner,
  ResourceDocument,
  SubCommittee,
  Tournament,
} from "../types"

export const MOCK_STATS: FederationStat[] = [
  { id: "members", label: "Member Federation", value: "84+" },
  { id: "players", label: "Registered Players", value: "563K" },
  { id: "referees", label: "Certified Referees", value: "1.5K" },
]

export const MOCK_PARTNERS: Partner[] = [
  {
    id: "pertamina-fastron",
    name: "Pertamina Fastron",
    logoUrl: "/assets/global/partners/logo-pertamina-fastron.svg",
  },
  { id: "drx", name: "DRX", logoUrl: "/assets/global/partners/logo-drx.svg" },
  {
    id: "baic",
    name: "BAIC",
    logoUrl: "/assets/global/partners/logo-baic.svg",
  },
  {
    id: "jhl-collection",
    name: "JHL Collection",
    logoUrl: "/assets/global/partners/logo-jhl-collection.svg",
  },
  {
    id: "kart-inc",
    name: "kart.inc",
    logoUrl: "/assets/global/partners/logo-kart-inc.svg",
  },
  {
    id: "adamare",
    name: "adamare The Villa",
    logoUrl: "/assets/global/partners/logo-adamare.svg",
  },
  {
    id: "bahn-hoft",
    name: "Bahn Hoft",
    logoUrl: "/assets/global/partners/logo-bahn-hoft.svg",
  },
  {
    id: "lxvr",
    name: "LXVR",
    logoUrl: "/assets/global/partners/logo-lxvr.svg",
  },
]

/**
 * The S8 marquee.
 *
 * Figma draws SEVEN slots (`54:3157`) but fills them from only five unique
 * `imageRef`s — `dcac3d08` and `7085883c` each appear twice — while
 * `news-thumb-06` is left unused entirely. That reads as a designer placing
 * artwork twice to fill a composition rather than as an intended repeat, so
 * each slot gets its own article here and the sixth thumbnail is put to work.
 *
 * Seven also matters to the marquee: the strip is duplicated to loop
 * seamlessly, so a repeated image would land twice within one screen width and
 * make the seam obvious.
 *
 * **Eleven entries now, and the order is the feed's, not the page's.** The
 * Development page's update strip (`207:15528`) draws four stories of its own,
 * and they are articles like any other — so they live here rather than in a
 * second list, and they sit where their dates put them. One of them (the
 * learning-portal milestone, 6 August 2026) is newer than five of the original
 * seven, so it now appears in S8's mosaic and pushes the oldest article off the
 * end. That is the feed working: `getLatestNews()` asks for the newest seven,
 * and suppressing a genuinely recent story to keep an older screenshot intact
 * would make the mock lie about what it is.
 *
 * Titles are stored in natural title case, including the four whose Figma text
 * is typed in capitals. The design sets `textCase: TITLE` on that style, which
 * means the capitals are an entry slip the file was already papering over —
 * and CSS `capitalize` cannot undo them, since it raises first letters without
 * lowering the rest. Same call D40 makes about the committee names.
 *
 * One consequence to expect when comparing against Figma: `n4` ("Youth
 * Development Programme Launches") already sat on the Development desk before
 * this page existed, and it genuinely belongs there — a youth pathway across
 * twelve federations is development news by any reading. So the desk holds
 * FIVE stories while the design's grid draws four, and the newest four are
 * `n8`, `n4`, `n10`, `n9` — the referee seminar of February 2025 falls off the
 * end. Re-categorising a real development story, or asking for five and leaving
 * the two-column grid ragged, would both be worse than the strip simply showing
 * its four most recent items.
 */
export const MOCK_NEWS: NewsArticle[] = [
  {
    id: "n1",
    slug: "world-championship-qualifiers-conclude",
    title: "World Championship Qualifiers Conclude in Jakarta",
    excerpt:
      "Sixty-four players advance to the main draw after three days of continental qualifying.",
    category: "Tournament",
    publishedAt: "2026-08-12T10:00:00Z",
    thumbnailUrl: "/assets/home/news-thumb-01.png",
    isFeatured: true,
    heroImageUrl: "/assets/news/featured-giant-tiles.png",
    heroImageAlt:
      "A player crouches between six oversized black domino tiles, their pips picked out in gold.",
  },
  {
    id: "n2",
    slug: "new-refereeing-standard-published",
    title: "New Refereeing Standard Published for 2027",
    excerpt:
      "The updated rulebook clarifies scoring disputes and introduces a revised timing protocol.",
    category: "Governance",
    publishedAt: "2026-08-08T09:30:00Z",
    thumbnailUrl: "/assets/home/news-thumb-02.png",
  },
  {
    id: "n8",
    slug: "digital-learning-portal-100k-users",
    title: "Digital Learning Portal Reaches 100K Users Milestone",
    excerpt:
      "The free tuition platform passes a hundred thousand registered learners in its first full year.",
    category: "Development",
    publishedAt: "2026-08-06T09:00:00Z",
    thumbnailUrl: "/assets/development/news-learning-portal.png",
  },
  {
    id: "n3",
    slug: "three-federations-join-dwf",
    title: "Three National Federations Join DWF",
    excerpt:
      "Membership passes eighty-four as domino continues its expansion across three continents.",
    category: "Federation",
    publishedAt: "2026-07-29T14:15:00Z",
    thumbnailUrl: "/assets/home/news-thumb-03.png",
  },
  {
    id: "n4",
    slug: "youth-development-programme-launch",
    title: "Youth Development Programme Launches",
    excerpt:
      "A structured pathway for players under eighteen begins in twelve member nations.",
    category: "Development",
    publishedAt: "2026-07-21T08:00:00Z",
    thumbnailUrl: "/assets/home/news-thumb-04.png",
    isFeatured: true,
    heroImageUrl: "/assets/news/news-tile-run-player.png",
    heroImageAlt:
      "A young player lies level with a table, setting the last tile into a standing run of dominoes.",
  },
  {
    id: "n5",
    slug: "annual-congress-summary",
    title: "Annual Congress Summary and Resolutions",
    excerpt:
      "Delegates approved the revised statutes and confirmed the 2027 competition calendar.",
    category: "Federation",
    publishedAt: "2026-07-10T11:45:00Z",
    thumbnailUrl: "/assets/home/news-thumb-05.png",
    isFeatured: true,
    heroImageUrl: "/assets/news/news-panel-discussion.png",
    heroImageAlt:
      "Three delegates on a panel, one speaking into a handheld microphone.",
  },
  {
    id: "n6",
    slug: "world-ranking-system-revised",
    title: "World Ranking System Revised for Next Season",
    excerpt:
      "Points now decay over twelve months, so a title defended counts for more than a title held.",
    category: "Ranking",
    publishedAt: "2026-06-28T13:20:00Z",
    thumbnailUrl: "/assets/home/news-thumb-06.png",
    isFeatured: true,
    heroImageUrl: "/assets/news/news-podium-ceremony.png",
    heroImageAlt:
      "Teams lined up on a tiered podium, holding national flags for the closing ceremony.",
  },
  {
    id: "n7",
    slug: "referee-certification-intake-opens",
    title: "Referee Certification Intake Opens Worldwide",
    excerpt:
      "Applications are open in every member federation, with the first assessments held in October.",
    category: "Officiating",
    publishedAt: "2026-06-15T07:00:00Z",
    thumbnailUrl: "/assets/home/news-thumb-01.png",
    isFeatured: true,
    heroImageUrl: "/assets/news/news-match-handshake.png",
    heroImageAlt:
      "Two competitors shake hands across the table before the start of a match.",
  },
  {
    id: "n10",
    slug: "oceania-school-participation-up-40-percent",
    title: "Oceania Region Sees 40% Increase in School Participation",
    excerpt:
      "Partner schools across the region report their strongest intake since the youth pathway opened.",
    category: "Development",
    publishedAt: "2026-03-06T08:00:00Z",
    thumbnailUrl: "/assets/development/news-oceania-schools.png",
    isFeatured: true,
    heroImageUrl: "/assets/news/news-medal-flag-bearer.png",
    heroImageAlt:
      "A national team member stands draped in their flag with a medal at their chest.",
  },
  {
    id: "n9",
    slug: "new-equipment-standards-2025-championships",
    title: "New Equipment Standards Released for 2025 Championships",
    excerpt:
      "Tile dimensions, weight tolerance and table surfaces are specified for every sanctioned event.",
    category: "Development",
    publishedAt: "2025-03-14T10:30:00Z",
    thumbnailUrl: "/assets/development/news-equipment-standards.png",
    // Photographed for the band but not flagged for it: the shelf is an
    // editorial choice and the band shows six. Left with a hero so the
    // federation can promote it without going looking for a picture.
    heroImageUrl: "/assets/news/news-player-at-table.png",
    heroImageAlt:
      "A competitor sits back from the table mid-match, looking across the playing hall.",
  },
  {
    id: "n11",
    slug: "grade-a-referee-seminar-registration",
    title: "Registration Opens for Grade A Referee Seminar",
    excerpt:
      "Continental referees may apply for the elite assessment, held over four days with a written exam.",
    category: "Development",
    publishedAt: "2025-02-22T09:00:00Z",
    thumbnailUrl: "/assets/development/news-referee-seminar.png",
  },
]

/**
 * The document library. The first four are what S10 lists (`56:4598`), verbatim
 * from the design — titles, categories and sizes all come from Figma rather
 * than being invented, so the slice matches on sight.
 *
 * The rest belong to other pages — three to Domino (`119:4583`, `119:4624`,
 * `119:4629`) and four to the Development page's library (`192:14833`) — and
 * they are the reason `getResources` takes a category: each page draws its own
 * shelf, so the shelf has to be askable-for rather than sliced by position.
 *
 * S10 is the exception, and it is the reason `getResources` also takes a
 * `limit`. Its four documents have four DIFFERENT categories (the card prints
 * them), so there is no shelf to name — it is the landing page's selection from
 * the whole library, and what bounds it is the 2×2 grid it draws. Without that
 * bound the grid quietly grew to seven cards the moment the Domino documents
 * landed, and would have reached eleven with these.
 *
 * `fileUrl` is `#` throughout: there are no actual PDFs yet, and pointing at
 * files that do not exist would give links that 404 rather than links that
 * visibly do nothing. Replace alongside the real API (blocker B2).
 */
export const MOCK_RESOURCES: ResourceDocument[] = [
  {
    id: "r1",
    category: "The law of domino",
    title: "Standard International Rulebook v1.0",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "2.4 MB",
  },
  {
    id: "r2",
    category: "Legal",
    title: "Federation Statutes & Governance",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "3.1 MB",
  },
  {
    id: "r3",
    category: "Competition",
    title: "Anti-Doping Policy",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "1.6 MB",
  },
  {
    id: "r4",
    category: "Members",
    title: "Membership Application Guidelines",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "800 KB",
  },
  {
    id: "r5",
    category: "Rulebook",
    title: "Official Rulebook v4.0",
    description:
      "Download the comprehensive international guidelines for dominoes officiating and tournament conduct.",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "4.2 MB",
  },
  // The two competition regulations the Domino page lists as rows rather than
  // cards. They carry no `description` because the design gives them none — the
  // row is the title and a chevron, and inventing a summary for a document
  // nobody has written would put words in the federation's mouth.
  {
    id: "r6",
    category: "Regulations",
    title: "Code of Conduct & Ethics",
    fileUrl: "#",
    fileType: "pdf",
  },
  {
    id: "r7",
    category: "Regulations",
    title: "Equipment Standardization (DWF-ES1)",
    fileUrl: "#",
    fileType: "pdf",
  },
  // The Development page's library (`192:14833`). Its cards print a DATE where
  // S10's print a category, which is why `publishedAt` exists on the type at
  // all — the category below is the shelf these four are asked for by, not
  // something the card shows.
  //
  // Kept in the design's own order rather than sorted: Figma runs May 2025,
  // March 2025, December 2025, August 2026, which is not chronological in
  // either direction, so it is a curator's order and the page has no business
  // second-guessing it.
  {
    id: "r8",
    category: "Development",
    title: "Technical Manual v4.0",
    publishedAt: "2025-05-12T09:00:00Z",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "5.2 MB",
  },
  {
    id: "r9",
    category: "Development",
    title: "Opening Gambits Video Series",
    publishedAt: "2025-03-22T09:00:00Z",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "2.2 MB",
  },
  {
    // "Tournament ORG. toolkit" in Figma (`192:14861`). The abbreviation is
    // left as the design writes it — expanding it to "Organiser" would be
    // guessing at a word nobody typed — but the sentence case is normalised the
    // way every other title here is, since the card sets its own capitals.
    id: "r10",
    category: "Development",
    title: "Tournament Org. Toolkit",
    publishedAt: "2025-12-25T09:00:00Z",
    fileUrl: "#",
    fileType: "zip",
    fileSize: "45.5 MB",
  },
  {
    id: "r11",
    category: "Development",
    title: "2026 Rulebook (Simplified)",
    publishedAt: "2026-08-23T09:00:00Z",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "2.1 MB",
  },
  // The news page's press shelf (`168:8479`). Filed here rather than in a list
  // of their own: a press release IS a document with a date, a type and a size,
  // which is exactly what `getResources` already serves — a second endpoint
  // would differ only in the word on its category.
  //
  // Figma prints "May 12, 2023" on all four cards. That is the unreplaced
  // template rather than four documents published the same day, and unlike a
  // duplicated *title* (D44) it cannot be shipped as drawn: four rows sharing
  // one date read as a listing that failed to load. Dates are data here as they
  // are everywhere else in this file, so they are spread across the site's own
  // present instead.
  {
    id: "r12",
    category: "Press Release",
    title: "DWF Announces Partnership with Global Sports",
    publishedAt: "2026-07-30T09:00:00Z",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "5.2 MB",
  },
  {
    id: "r13",
    category: "Press Release",
    title: "Annual Integrity Report 2023 Published",
    publishedAt: "2026-06-18T09:00:00Z",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "2.2 MB",
  },
  {
    // Figma writes "026 world cup" (`168:8567`). A year missing its leading
    // digit is a certain typo, not a fact in dispute, so it is corrected the
    // way "Sub-Commitees" was (D40).
    id: "r14",
    category: "Press Release",
    title: "Candidate Cities for 2026 World Cup Shortlisted",
    publishedAt: "2026-05-12T09:00:00Z",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "3.5 MB",
  },
  {
    id: "r15",
    category: "Press Release",
    title: "New Statutes Regarding Player Eligibility Approved",
    publishedAt: "2026-04-09T09:00:00Z",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "3.1 MB",
  },
  // The publications shelf (`168:8590`) — the same entity with a cover.
  {
    // "Dqf quarter 1 review" in Figma (`168:8594`). `Dqf` is the brand
    // mistyped, and the brand is a word that is spelled the same everywhere
    // else in the file; corrected under D40.
    id: "r16",
    category: "Publication",
    title: "DWF Quarter 1 Review",
    publishedAt: "2026-04-21T09:00:00Z",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "5.2 MB",
    coverImageUrl: "/assets/news/publication-cover-quarter-review.png",
  },
  {
    // TODO(design): Figma draws two publication cards with byte-identical
    // contents (`168:8591` and `183:12333`) — the second is a paste that was
    // never filled in. A shelf that prints the same document twice is worse
    // than one that prints a sequel, so the quarter is stepped on; the words
    // are the design's own, only the number moves. The cover is shared because
    // the design shares it: both cards carry the same `imageRef`.
    id: "r17",
    category: "Publication",
    title: "DWF Quarter 2 Review",
    publishedAt: "2026-07-21T09:00:00Z",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "4.8 MB",
    coverImageUrl: "/assets/news/publication-cover-quarter-review.png",
  },
  // The tournament page's regulations shelf (`381:17593`) — three documents,
  // verbatim from the design, dates and sizes included. Their own category
  // rather than "Regulations", which the Domino page asks for by name: these
  // three are what a competitor needs before travelling, not the rules the
  // game is played under.
  {
    id: "r18",
    category: "Tournament Regulations",
    title: "Ethics & Fair Play Code",
    publishedAt: "2025-05-12T09:00:00Z",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "5.2 MB",
  },
  {
    id: "r19",
    category: "Tournament Regulations",
    title: "Official Scrutineering Guide",
    publishedAt: "2025-03-22T09:00:00Z",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "2.2 MB",
  },
  {
    id: "r20",
    category: "Tournament Regulations",
    title: "Visa Support Document",
    publishedAt: "2026-08-23T09:00:00Z",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "2.1 MB",
  },
]

/**
 * The news page's media collage (`168:8688`).
 *
 * Order is the design's, and it is load-bearing: the collage alternates a tall
 * video column with a pair of stacked photographs, so a `photo` arriving where
 * a `video` is expected changes the shape of the row rather than just its
 * contents. The page pairs them off in source order.
 */
export const MOCK_GALLERY: GalleryItem[] = [
  {
    id: "g1",
    title: "Inside the playing hall",
    imageUrl: "/assets/global/gallery-playing-hall.png",
    imageAlt:
      "Competitors seated at rows of tables in a playing hall, a red tournament backdrop behind them.",
    kind: "video",
  },
  {
    id: "g2",
    title: "Round nine, board one",
    imageUrl: "/assets/global/gallery-match-broadcast.png",
    imageAlt:
      "Two players face each other across a table while a camera operator films from behind.",
    kind: "photo",
  },
  {
    id: "g3",
    title: "Trophy presentation",
    imageUrl: "/assets/global/gallery-trophy-presentation.png",
    imageAlt:
      "An official shakes hands with a competitor on stage beside a trophy on a plinth.",
    kind: "photo",
  },
  {
    id: "g4",
    title: "Team delegation arrives",
    imageUrl: "/assets/global/gallery-team-delegation.png",
    imageAlt:
      "A national team in matching tracksuits gathers at the edge of the playing area.",
    kind: "video",
  },
  {
    id: "g5",
    title: "Homecoming",
    imageUrl: "/assets/global/gallery-airport-welcome.png",
    imageAlt:
      "A medallist in traditional dress is welcomed at an airport with a bouquet of white flowers.",
    kind: "photo",
  },
  {
    id: "g6",
    title: "Team portrait",
    imageUrl: "/assets/global/gallery-team-portrait.png",
    imageAlt:
      "Three team members in blue blazers stand together in the venue between rounds.",
    kind: "photo",
  },
  {
    id: "g7",
    title: "Exhibition match",
    imageUrl: "/assets/global/gallery-exhibition-match.png",
    imageAlt:
      "Officials and spectators crowd around a table during an exhibition match.",
    kind: "video",
  },
]

/**
 * The countdown target (S3). The design shows "Mexico City · Sun, Aug 17,
 * 2026", but that date is both in the past and not actually a Sunday — so the
 * place is kept and the date is not. November keeps the card counting down
 * instead of showing zeroes. Replace once the official schedule exists.
 */
export const MOCK_FEATURED_EVENT: FeaturedEvent = {
  id: "wc-2026",
  name: "World Championship 2026",
  startsAt: "2026-11-14T09:00:00Z",
  location: "Mexico City",
  country: "MEX",
  flagUrl: "/assets/global/flags/flag-mex.png",
}

/**
 * S6's showcase. Figma draws one card and labels the pager "1 of 6", so the
 * design is a set the reader steps through — but it only writes the first one
 * out. The other five are invented here so the pager has something to page,
 * and they follow the same shape rather than repeating the same event.
 */
export const MOCK_SHOWCASE_EVENTS: ShowcaseEvent[] = [
  {
    // Figma calls this event "CARIBBEAN DOMINO OPEN 2024" in S6 (`52:3030`)
    // and "Caribbean Domino Open 2026" in the tournament hero (`370:17251`),
    // with October 2026 dates under both. An event named for 2024 and held in
    // 2026 contradicts itself on the page, and the dates carry the deciding
    // vote — so the year follows them. Same class of fix as the Tokyo album's
    // pasted heading and the four identically-dated press releases.
    id: "e1",
    slug: "caribbean-domino-open-2026",
    name: "Caribbean Domino Open 2026",
    dateLabel: "Oct 12 - Oct 15, 2026",
    location: "Montego Bay, Jamaica",
    summary:
      "The premier regional tournament returns to Montego Bay, bringing together elite domino pairings from across the Caribbean for several days of high-level competition.",
    imageUrl: "/assets/home/event-trophy-hand.png",
    imageAlt:
      "A raised gold trophy topped with two domino tiles, held aloft by the winner",
  },
  {
    id: "e2",
    slug: "pan-american-championship-2026",
    name: "Pan American Championship 2026",
    dateLabel: "Nov 3 - Nov 7, 2026",
    location: "Mexico City, Mexico",
    summary:
      "Continental qualifying reaches its final stage, with the twelve highest-placed pairs earning direct entry to next season's world championship draw.",
    imageUrl: "/assets/home/event-trophy-hand.png",
    imageAlt:
      "A raised gold trophy topped with two domino tiles, held aloft by the winner",
  },
  {
    id: "e3",
    slug: "european-masters-2026",
    name: "European Masters 2026",
    dateLabel: "Dec 1 - Dec 4, 2026",
    location: "Valencia, Spain",
    summary:
      "Sixteen national champions meet in a round-robin format, played under the revised timing protocol introduced in this year's rulebook.",
    imageUrl: "/assets/home/event-trophy-hand.png",
    imageAlt:
      "A raised gold trophy topped with two domino tiles, held aloft by the winner",
  },
  {
    id: "e4",
    slug: "asia-pacific-open-2027",
    name: "Asia Pacific Open 2027",
    dateLabel: "Feb 9 - Feb 13, 2027",
    location: "Jakarta, Indonesia",
    summary:
      "The region's largest open draw, with more than four hundred pairs expected across the main and amateur brackets.",
    imageUrl: "/assets/home/event-trophy-hand.png",
    imageAlt:
      "A raised gold trophy topped with two domino tiles, held aloft by the winner",
  },
  {
    id: "e5",
    slug: "african-cup-of-dominoes-2027",
    name: "African Cup of Dominoes 2027",
    dateLabel: "Apr 6 - Apr 10, 2027",
    location: "Accra, Ghana",
    summary:
      "A first continental title on the calendar, staged jointly by six member federations and open to every affiliated national association.",
    imageUrl: "/assets/home/event-trophy-hand.png",
    imageAlt:
      "A raised gold trophy topped with two domino tiles, held aloft by the winner",
  },
  {
    id: "e6",
    slug: "world-championship-2027",
    name: "World Championship 2027",
    dateLabel: "Jul 19 - Jul 25, 2027",
    location: "Santo Domingo, Dominican Republic",
    summary:
      "The federation's flagship event, where the season's qualified pairs play for the world title over seven days of competition.",
    imageUrl: "/assets/home/event-trophy-hand.png",
    imageAlt:
      "A raised gold trophy topped with two domino tiles, held aloft by the winner",
  },
]

/**
 * The About page's heritage timeline (`88:1163`).
 *
 * The years come from the axis markers (`88:1172`, `88:1181`, `88:1190`,
 * `88:1199`) and the titles and photographs from the four cards, in the order
 * Figma places them along it.
 *
 * TODO(design): the first three cards carry the SAME body text in Figma
 * (`88:1205`, `88:1210`, `88:1215` are one shared text layer) — the Geneva
 * founding paragraph, which reads as card 1's and cannot be true of the 1990
 * World Cup or the 2001 accession. It is reproduced verbatim rather than
 * invented around, because inventing federation history is a worse error than
 * showing the design's own placeholder. Replace once the copy lands (B2).
 */
export const MOCK_HERITAGE_MILESTONES: HeritageMilestone[] = [
  {
    id: "h1",
    year: "1974",
    title: "The Foundation",
    summary:
      "Representatives from 12 nations gathered in Geneva to formalize the first set of international rules and establish the DWF.",
    imageUrl: "/assets/about/heritage-card-01.png",
    imageAlt:
      "Two men in early twentieth-century suits conferring across a roll-top desk in a wood-panelled office",
  },
  {
    id: "h2",
    year: "1990",
    title: "Inaugural World Cup",
    summary:
      "Representatives from 12 nations gathered in Geneva to formalize the first set of international rules and establish the DWF.",
    imageUrl: "/assets/about/heritage-card-02.png",
    imageAlt:
      "A packed arena of competitors at long tables beneath World Domino Championship banners",
  },
  {
    id: "h3",
    year: "2001",
    title: "75 Countries Joined",
    summary:
      "Representatives from 12 nations gathered in Geneva to formalize the first set of international rules and establish the DWF.",
    imageUrl: "/assets/about/heritage-card-03.png",
    imageAlt:
      "Delegates seated along both sides of a conference table before a row of national flags and press cameras",
  },
  {
    id: "h4",
    year: "2003",
    title: "DWF Championship World Tour",
    summary: "The First DWF Championship World Tour with 80 countries joined.",
    imageUrl: "/assets/about/heritage-card-04.png",
    imageAlt:
      "Supporters in team colours with their arms raised, cheering in a crowd",
  },
]

/**
 * The executive board carousel (`112:3590`).
 *
 * Two defects carried over from the design, both left visible rather than
 * quietly repaired:
 *
 * 1. Figma gives cards THREE and FOUR the same office — "SECRETARY GENERAL"
 *    (`112:3580` and `112:3585` share one text template). The fourth is almost
 *    certainly meant to be a different post; inventing one would be worse than
 *    showing the design's own duplication and marking it, which is the same
 *    call the Pillars copy got.
 *
 * 2. TODO(design): `board-portrait-02.png` is a stock photograph of a REAL,
 *    widely recognisable public figure, used here as a fictional vice-president.
 *    That is a licensing and misrepresentation problem, not a styling one — a
 *    federation naming a real person to an office they do not hold. It needs a
 *    replacement before this page is published; the `alt` below therefore
 *    describes only what is visible and names nobody.
 *
 * The names are the design's own placeholders and are fictional.
 */
export const MOCK_BOARD_MEMBERS: BoardMember[] = [
  {
    id: "b1",
    // The break is Figma's (`111:3566`) and is kept because the card is 540px
    // wide with a 48px face: the two-line shape is what the design lays out.
    name: "Dr. Salva\nLopez",
    role: "President",
    portraitUrl: "/assets/about/board-portrait-01.png",
    portraitAlt:
      "A man in a dark suit seated in a low armchair, turning towards the camera in a dimly lit room",
  },
  {
    id: "b2",
    name: "James\nHenderson",
    role: "Vice President",
    portraitUrl: "/assets/about/board-portrait-02.png",
    portraitAlt:
      "An older man with grey hair, a beard and round glasses in a leather jacket, resting his hand near his chin against a warm brown backdrop",
  },
  {
    id: "b3",
    name: "Elizabeth\nLi Tze",
    role: "Secretary General",
    portraitUrl: "/assets/about/board-portrait-03.png",
    portraitAlt:
      "A woman with short grey hair and heavy black glasses in a navy blazer, seated at a wooden table in low sunlight",
  },
  {
    id: "b4",
    // TODO(design): duplicate office — `112:3585` repeats "SECRETARY GENERAL".
    role: "Secretary General",
    name: "Jennifer\nBachdzer",
    portraitUrl: "/assets/about/board-portrait-04.png",
    portraitAlt:
      "A woman with long dark hair in a navy blazer over a cream top, looking past the camera against a wood-panelled wall",
  },
]

/**
 * The six committees of `114:3667`.
 *
 * Figma sets two of the six in lower case ("marketing & media", "athletes
 * commission") where the other four are capitals. That is a text-entry slip
 * rather than a style — the card's own `text-transform` is what makes them
 * uniform, so the strings are stored in their natural case and the CSS does
 * the shouting (RULES §9).
 *
 * No `href` on any of them: the committee pages do not exist (blocker B2), and
 * the card renders as a non-link until one does.
 */
export const MOCK_SUB_COMMITTEES: SubCommittee[] = [
  { id: "c1", name: "Rules & Technical" },
  { id: "c2", name: "Global Development" },
  { id: "c3", name: "Ethics & Disciplinary" },
  { id: "c4", name: "Medical & Anti-Doping" },
  { id: "c5", name: "Marketing & Media" },
  { id: "c6", name: "Athletes Commission" },
]

/**
 * The rail on `/tournaments` (`373:17423`).
 *
 * Three names, three categories and three registration states are the design's.
 * Two things are not, and both are the kind of mock artefact that reads as a
 * broken page rather than as art awaiting replacement:
 *
 *  - **The cities were shuffled.** Figma files "London Open" under Stockholm and
 *    "Dubai Masters" under Mexico City (`373:17428`, `381:17470`). Where the
 *    name states a city, the name wins; Mexico City goes to the one tournament
 *    whose name states none.
 *  - **The fourth card was a copy of the third**, down to its title and pill.
 *    A rail whose last two cards are identical looks like a render bug, the same
 *    call the four identically-dated press releases got. It becomes the
 *    tournament that inherits Stockholm.
 *
 * `world-championship-2026` predates the page — it was the contract sketch for
 * phase 2 — and is kept, now carrying the fields the card needs.
 */
export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: "t1",
    slug: "london-open-2026",
    name: "London Open",
    category: "Inter-continental",
    status: "upcoming",
    registration: "open",
    location: "London, United Kingdom",
    imageUrl: "/assets/tournaments/poster-card-slate.png",
    imageAlt:
      "Tournament poster: a gold trophy topped with two domino tiles against a slate ground, lettered DWF2026.",
    startsAt: "2026-09-18T09:00:00Z",
    endsAt: "2026-09-21T18:00:00Z",
    country: "GBR",
  },
  {
    id: "t2",
    slug: "dubai-masters-2026",
    name: "Dubai Masters",
    category: "Championship",
    status: "upcoming",
    registration: "closed",
    location: "Dubai, UAE",
    imageUrl: "/assets/tournaments/poster-card-gold.png",
    imageAlt:
      "Tournament poster: a gold trophy topped with two domino tiles against a warm gold ground, lettered DWF2026.",
    startsAt: "2026-10-02T09:00:00Z",
    endsAt: "2026-10-06T18:00:00Z",
    country: "ARE",
  },
  {
    id: "t3",
    slug: "winter-finals-championship-2026",
    name: "Winter Finals Championship",
    category: "Regional qualifier",
    status: "live",
    registration: "ongoing",
    location: "Mexico City, MX",
    imageUrl: "/assets/tournaments/poster-card-magenta.png",
    imageAlt:
      "Tournament poster: a gold trophy topped with two domino tiles against a magenta ground, lettered DWF2026.",
    startsAt: "2026-08-20T09:00:00Z",
    endsAt: "2026-08-26T18:00:00Z",
    country: "MEX",
  },
  {
    id: "t4",
    slug: "stockholm-invitational-2026",
    name: "Stockholm Invitational",
    category: "Regional qualifier",
    status: "upcoming",
    registration: "open",
    location: "Stockholm, SE",
    imageUrl: "/assets/tournaments/poster-card-slate.png",
    imageAlt:
      "Tournament poster: a gold trophy topped with two domino tiles against a slate ground, lettered DWF2026.",
    startsAt: "2026-11-05T09:00:00Z",
    endsAt: "2026-11-08T18:00:00Z",
    country: "SWE",
  },
  {
    id: "t5",
    slug: "world-championship-2026",
    name: "World Championship 2026",
    category: "Championship",
    status: "upcoming",
    registration: "open",
    location: "Jakarta, Indonesia",
    imageUrl: "/assets/tournaments/poster-card-gold.png",
    imageAlt:
      "Tournament poster: a gold trophy topped with two domino tiles against a warm gold ground, lettered DWF2026.",
    startsAt: "2026-11-14T09:00:00Z",
    endsAt: "2026-11-22T18:00:00Z",
    venue: "Jakarta Convention Center",
    country: "IDN",
  },
]

/**
 * Champions Hall (`381:17639`).
 *
 * **The design's photographs, with placeholder names over them.** Figma fills
 * all four cards with pictures of real, identifiable public figures — a chess
 * world champion and a retired footballer among them — and types their real
 * names underneath as champions of this federation (`381:17649`, `381:17644`).
 *
 * The pictures go in **on the repo owner's decision, 2026-08-24**, taken after
 * the risk was put to them: this is a prototype, and the design's assets go in
 * as drawn. The names do **not**: every card here is an identity claim, and a
 * real name under a real face states that a particular living person won a
 * title that does not exist. Placeholder names keep the block honest about the
 * one thing it would otherwise assert. Recorded as R16, to be resolved before
 * publication.
 *
 * The `portraitAlt` strings describe what is visible **without naming a person,
 * a country or an event** — the same practice R13 established for the news
 * photographs. The files were downscaled to 1400px on their long edge on the
 * way in; the originals run to 14MB for a card that renders at 540.
 *
 * The names below are the register the design's own results table uses — two
 * of them, Marcus Johnson and Alicia Brown, are the design's (`381:17806`,
 * `385:17853`), and the other two are written to match. The events are the
 * design's, verbatim.
 *
 * The cards carry the federation's own commemorative poster artwork instead of
 * a face. An empty portrait slot fell back to a bare gradient panel, which read
 * as an image that failed to load rather than as one awaiting art — reported by
 * the repo owner. A poster is the one picture the federation can put on a
 * champion's card while owing nobody a likeness. TODO(design): real champions,
 * with portraits the federation has the right to publish.
 */
export const MOCK_CHAMPIONS: Champion[] = [
  {
    id: "ch1",
    event: "2024 World Championship",
    name: "Marcus\nJohnson",
    portraitUrl: "/assets/tournaments/champion-portrait-01.png",
    portraitAlt:
      "A player in a pale shirt sits at the board, one hand resting against their forehead mid-game.",
  },
  {
    id: "ch2",
    event: "2023 World Championship",
    name: "Alicia\nBrown",
    portraitUrl: "/assets/tournaments/champion-portrait-02.png",
    portraitAlt:
      "A person in a dark suit and headset microphone, smiling under stage lighting.",
  },
  {
    id: "ch3",
    event: "2024 European",
    name: "Devon\nClarke",
    portraitUrl: "/assets/tournaments/champion-portrait-03.png",
    portraitAlt:
      "A player in a checked jacket sits behind the board with their hands clasped in front of them.",
  },
  {
    id: "ch4",
    event: "2024 Asian",
    name: "Priya\nRaman",
    portraitUrl: "/assets/tournaments/champion-portrait-04.png",
    portraitAlt:
      "A player in a blue patterned shirt sits at the board with their palms pressed together.",
  },
]

/**
 * The results table (`385:17838`), verbatim from the design bar one correction.
 *
 * Figma files the doubles pair under "Espanyol", which is a football club and
 * not a federation (`385:17836`). Read as a country column it can only mean
 * Spain, so it says Spain — the same call D40 made on "Sub-Commitees": fix the
 * spelling of a thing that is unambiguous, invent nothing that is not.
 */
export const MOCK_OLYMPIC_RESULTS: OlympicResult[] = [
  {
    id: "or1",
    year: "2025",
    event: "Men\u2019s Single Domino",
    category: "Singles",
    winners: "Marcus Johnson",
    federation: "Jamaica",
  },
  {
    id: "or2",
    year: "2025",
    event: "Doubles Domino",
    category: "Doubles",
    winners: "Daniel Rodr\u00edguez & Carlos Mart\u00ednez",
    federation: "Spain",
  },
  {
    id: "or3",
    year: "2025",
    event: "Women\u2019s Singles Domino",
    category: "Singles",
    winners: "Alicia Brown",
    federation: "United Kingdom",
  },
]

/**
 * The gallery archive, newest event first (`156:7234`).
 *
 * **The three tournament albums carry byte-identical picture sets.** That is
 * the design's (`156:7243`, `156:7276` and `156:7303` reference the same six
 * `imageRef`s), and it is reproduced rather than papered over: the file has six
 * photographs and four albums, so there is nothing else to hand them. Same call
 * the news page's imagery got — the design's assets go in as drawn, and the
 * substitution is the designer's to make. TODO(design).
 *
 * Two things are NOT reproduced, because unlike a repeated picture they read as
 * a page that failed rather than a page awaiting art:
 *
 *  - The Tokyo album's heading. Figma's section title says "world championship
 *    - tokyo 2026" while its own sidebar tab says "asian masters - tokyo 2026"
 *    (`156:7272` against `156:7226`). One string feeds both here, so one has to
 *    win: the tab does. The section heading is a paste from London — its date
 *    is London's too, to the day — and three of four albums called "World
 *    Championship" would make the index useless.
 *  - That duplicated date. Tokyo is given its own, earlier than London so the
 *    descending order the design lays out still holds. Same reasoning as the
 *    four press releases stamped "May 12, 2023".
 */
export const MOCK_GALLERY_ALBUMS: GalleryAlbum[] = [
  {
    id: "ga1",
    slug: "world-championship-london-2026",
    title: "World Championship — London 2026",
    heldOn: "2026-06-26T00:00:00Z",
    items: [
      {
        id: "gl-1",
        title: "Inside the playing hall",
        imageUrl: "/assets/global/gallery-playing-hall.png",
        imageAlt:
          "Competitors seated at rows of tables in a playing hall, a red tournament backdrop behind them.",
        kind: "video",
      },
      {
        id: "gl-2",
        title: "Round nine, board one",
        imageUrl: "/assets/global/gallery-match-broadcast.png",
        imageAlt:
          "Two players face each other across a table while a camera operator films from behind.",
        kind: "photo",
      },
      {
        id: "gl-3",
        title: "Team delegation arrives",
        imageUrl: "/assets/global/gallery-team-delegation.png",
        imageAlt:
          "A national team in matching tracksuits gathers at the edge of the playing area.",
        kind: "video",
      },
      {
        id: "gl-4",
        title: "Homecoming",
        imageUrl: "/assets/global/gallery-airport-welcome.png",
        imageAlt:
          "A medallist in traditional dress is welcomed at an airport with a bouquet of white flowers.",
        kind: "photo",
      },
      {
        id: "gl-5",
        title: "Trophy presentation",
        imageUrl: "/assets/global/gallery-trophy-presentation.png",
        imageAlt:
          "An official shakes hands with a competitor on stage beside a trophy on a plinth.",
        kind: "photo",
      },
      {
        id: "gl-6",
        title: "Team portrait",
        imageUrl: "/assets/global/gallery-team-portrait.png",
        imageAlt:
          "Three team members in blue blazers stand together in the venue between rounds.",
        kind: "photo",
      },
    ],
  },
  {
    // TODO(design): heading taken from the sidebar tab, date moved off
    // London's — see the note above.
    id: "ga2",
    slug: "asian-masters-tokyo-2026",
    title: "Asian Masters — Tokyo 2026",
    heldOn: "2026-04-18T00:00:00Z",
    items: [
      {
        id: "gt-1",
        title: "Inside the playing hall",
        imageUrl: "/assets/global/gallery-playing-hall.png",
        imageAlt:
          "Competitors seated at rows of tables in a playing hall, a red tournament backdrop behind them.",
        kind: "video",
      },
      {
        id: "gt-2",
        title: "Round nine, board one",
        imageUrl: "/assets/global/gallery-match-broadcast.png",
        imageAlt:
          "Two players face each other across a table while a camera operator films from behind.",
        kind: "photo",
      },
      {
        id: "gt-3",
        title: "Team delegation arrives",
        imageUrl: "/assets/global/gallery-team-delegation.png",
        imageAlt:
          "A national team in matching tracksuits gathers at the edge of the playing area.",
        kind: "video",
      },
      {
        id: "gt-4",
        title: "Homecoming",
        imageUrl: "/assets/global/gallery-airport-welcome.png",
        imageAlt:
          "A medallist in traditional dress is welcomed at an airport with a bouquet of white flowers.",
        kind: "photo",
      },
      {
        id: "gt-5",
        title: "Trophy presentation",
        imageUrl: "/assets/global/gallery-trophy-presentation.png",
        imageAlt:
          "An official shakes hands with a competitor on stage beside a trophy on a plinth.",
        kind: "photo",
      },
      {
        id: "gt-6",
        title: "Team portrait",
        imageUrl: "/assets/global/gallery-team-portrait.png",
        imageAlt:
          "Three team members in blue blazers stand together in the venue between rounds.",
        kind: "photo",
      },
    ],
  },
  {
    id: "ga3",
    slug: "world-championship-havana-2025",
    title: "World Championship — Havana 2025",
    heldOn: "2025-10-28T00:00:00Z",
    items: [
      {
        id: "gh-1",
        title: "Inside the playing hall",
        imageUrl: "/assets/global/gallery-playing-hall.png",
        imageAlt:
          "Competitors seated at rows of tables in a playing hall, a red tournament backdrop behind them.",
        kind: "video",
      },
      {
        id: "gh-2",
        title: "Round nine, board one",
        imageUrl: "/assets/global/gallery-match-broadcast.png",
        imageAlt:
          "Two players face each other across a table while a camera operator films from behind.",
        kind: "photo",
      },
      {
        id: "gh-3",
        title: "Team delegation arrives",
        imageUrl: "/assets/global/gallery-team-delegation.png",
        imageAlt:
          "A national team in matching tracksuits gathers at the edge of the playing area.",
        kind: "video",
      },
      {
        id: "gh-4",
        title: "Homecoming",
        imageUrl: "/assets/global/gallery-airport-welcome.png",
        imageAlt:
          "A medallist in traditional dress is welcomed at an airport with a bouquet of white flowers.",
        kind: "photo",
      },
      {
        id: "gh-5",
        title: "Trophy presentation",
        imageUrl: "/assets/global/gallery-trophy-presentation.png",
        imageAlt:
          "An official shakes hands with a competitor on stage beside a trophy on a plinth.",
        kind: "photo",
      },
      {
        id: "gh-6",
        title: "Team portrait",
        imageUrl: "/assets/global/gallery-team-portrait.png",
        imageAlt:
          "Three team members in blue blazers stand together in the venue between rounds.",
        kind: "photo",
      },
    ],
  },
  {
    // One picture, so the page draws it full width instead of as a collage
    // (`156:7330`) — the shape follows from the count, not from a field.
    id: "ga4",
    slug: "the-silent-war",
    title: "The Silent War: Inside the Mind of a Grandmaster 2025",
    heldOn: "2025-09-10T00:00:00Z",
    items: [
      {
        id: "gs-1",
        title: "The Silent War",
        imageUrl: "/assets/gallery/film-global-final-arena.png",
        imageAlt:
          "A packed arena in black and white, players at a lit table in the round, the boards reading Domino Global Final.",
        kind: "video",
      },
    ],
  },
]

/**
 * The hero figures on the members page (`404:19188`).
 *
 * Kept apart from `MOCK_STATS`, which the landing page's wheel reads: these are
 * a different four about a different subject, and one list serving both would
 * mean whichever page was edited last decided what the other showed.
 *
 * TODO(design): three of the four are odd as drawn. The intro two lines above
 * says "140+ national federations" while the figure says 142; "1.420" uses a
 * decimal point where every other number on the site uses none; and "Regional"
 * and "National Federation" are labels missing their nouns. Reproduced as
 * written — they are the designer's numbers to reconcile (D44) — except the
 * separator, which is printed as the design has it rather than reformatted,
 * since changing a figure is a different act from fixing a spelling.
 */
export const MOCK_MEMBERSHIP_STATS: FederationStat[] = [
  { id: "ms1", label: "Continents", value: "6" },
  { id: "ms2", label: "National Federation", value: "142" },
  { id: "ms3", label: "Regional", value: "1.420" },
  { id: "ms4", label: "Annual Events", value: "850+" },
]

/**
 * The members directory (`405:28396`), in the order Figma lists it — which is
 * neither alphabetical nor by country, so it is the federation's own and the
 * page does not re-sort it.
 *
 * Only Mexico carries a flag: `flag-mex.png` is the one flag asset in the repo,
 * and Figma draws every row with the same grey placeholder anyway. The rest
 * fall back to that square until the federation supplies the artwork.
 */
export const MOCK_MEMBER_FEDERATIONS: MemberFederation[] = [
  {
    id: "mf1",
    name: "ORADO - Olahraga Domino Indonesia",
    country: "Indonesia",
  },
  { id: "mf2", name: "USA Domino Federation", country: "United States" },
  { id: "mf3", name: "Jamaica Domino Board", country: "Jamaica" },
  { id: "mf4", name: "China Domino Association", country: "China" },
  {
    id: "mf5",
    name: "Federacion Mexicana de Domino",
    country: "Mexico",
    flagUrl: "/assets/global/flags/flag-mex.png",
  },
  {
    id: "mf6",
    name: "Confederação Brasileira de Dominó",
    country: "Brazil",
  },
]
