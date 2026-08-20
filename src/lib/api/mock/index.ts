/**
 * Data dummy fase 1. Bentuknya wajib menyerupai response asli, termasuk field
 * opsional yang sengaja dikosongkan — supaya penukaran ke API nyata tidak
 * memunculkan kejutan (RULES §7).
 *
 * Isi teks & angka diambil dari desain Figma agar hasil slicing langsung cocok.
 */

import type {
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
  { id: "baic", name: "BAIC", logoUrl: "/assets/global/partners/logo-baic.svg" },
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
  { id: "lxvr", name: "LXVR", logoUrl: "/assets/global/partners/logo-lxvr.svg" },
]

/** Carousel S8 berisi 5 item — satu thumbnail memang tidak terpakai di desain. */
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
]

export const MOCK_RESOURCES: ResourceDocument[] = [
  {
    id: "r1",
    title: "DWF Statutes",
    description:
      "The constitutional document governing the federation and its members.",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "2.4 MB",
  },
  {
    id: "r2",
    title: "Official Rulebook",
    description:
      "Complete competition rules, scoring, and equipment specifications.",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "5.1 MB",
  },
  {
    id: "r3",
    title: "Governance Framework",
    description:
      "Ethics code, disciplinary procedures, and organisational structure.",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "1.8 MB",
  },
  {
    id: "r4",
    title: "Tournament Regulations",
    description:
      "Sanctioning requirements and operational standards for organisers.",
    fileUrl: "#",
    fileType: "pdf",
    fileSize: "3.2 MB",
  },
]

/**
 * Tanggal target countdown (S3) masih karangan — desain tidak mencantumkannya.
 * Ganti begitu jadwal resmi tersedia.
 */
export const MOCK_FEATURED_EVENT: FeaturedEvent = {
  id: "wc-2026",
  name: "World Championship 2026",
  startsAt: "2026-11-14T09:00:00Z",
  location: "Jakarta, Indonesia",
}

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
