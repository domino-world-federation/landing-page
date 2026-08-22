/**
 * Phase 1 dummy data. The shape must mirror the real response, including
 * optional fields left deliberately empty — so swapping in the real API holds
 * no surprises (RULES §8).
 *
 * Text and numbers come from the Figma design so the slice matches on sight.
 */

import type {
  ShowcaseEvent,
  FeaturedEvent,
  FederationStat,
  NewsArticle,
  Partner,
  ResourceDocument,
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
  },
]

/**
 * The four documents S10 lists (`56:4598`), verbatim from the design — titles,
 * categories and sizes all come from Figma rather than being invented, so the
 * slice matches on sight.
 *
 * `fileUrl` is `#` throughout: there are no actual PDFs yet, and pointing at
 * files that do not exist would give four links that 404 rather than four that
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
    id: "e1",
    slug: "caribbean-domino-open-2024",
    name: "Caribbean Domino Open 2024",
    dateLabel: "Oct 12 - Oct 15, 2026",
    location: "Montego Bay, Jamaica",
    summary:
      "The premier regional tournament returns to Montego Bay, bringing together elite domino pairings from across the Caribbean for several days of high-level competition.",
    imageUrl: "/assets/home/hero-trophy-hand.png",
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
    imageUrl: "/assets/home/hero-trophy-hand.png",
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
    imageUrl: "/assets/home/hero-trophy-hand.png",
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
    imageUrl: "/assets/home/hero-trophy-hand.png",
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
    imageUrl: "/assets/home/hero-trophy-hand.png",
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
    imageUrl: "/assets/home/hero-trophy-hand.png",
    imageAlt:
      "A raised gold trophy topped with two domino tiles, held aloft by the winner",
  },
]

export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: "t1",
    slug: "world-championship-2026",
    name: "World Championship 2026",
    status: "upcoming",
    startsAt: "2026-11-14T09:00:00Z",
    endsAt: "2026-11-22T18:00:00Z",
    venue: "Jakarta Convention Center",
    country: "IDN",
  },
]
