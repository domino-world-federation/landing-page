/**
 * Satu-satunya pintu akses data (RULES §7).
 *
 * Komponen memanggil fungsi di file ini, tidak pernah `fetch` langsung. Saat
 * API nyata siap, hanya isi file ini yang berubah — komponen tidak tersentuh.
 *
 * Status: seluruh fungsi masih mengembalikan mock (blocker B2).
 */

import {
  MOCK_FEATURED_EVENT,
  MOCK_NEWS,
  MOCK_PARTNERS,
  MOCK_RESOURCES,
  MOCK_STATS,
} from "./mock"
import type {
  FeaturedEvent,
  FederationStat,
  NewsArticle,
  Partner,
  ResourceDocument,
} from "./types"

const USE_MOCK = !process.env.NEXT_PUBLIC_API_BASE_URL

/**
 * Wrapper fetch untuk dipakai begitu base URL tersedia.
 *
 * Sengaja belum dipanggil dari mana pun — ditulis lebih dulu supaya bentuk
 * penanganan error sudah disepakati sebelum API datang.
 */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL belum diset — masih memakai mock data.",
    )
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    throw new ApiError(
      `Permintaan ke ${path} gagal: ${response.status} ${response.statusText}`,
      response.status,
    )
  }

  return (await response.json()) as T
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export async function getFederationStats(): Promise<FederationStat[]> {
  if (USE_MOCK) return MOCK_STATS
  return request<FederationStat[]>("/stats")
}

export async function getPartners(): Promise<Partner[]> {
  if (USE_MOCK) return MOCK_PARTNERS
  return request<Partner[]>("/partners")
}

export async function getLatestNews(limit = 5): Promise<NewsArticle[]> {
  if (USE_MOCK) return MOCK_NEWS.slice(0, limit)
  return request<NewsArticle[]>(`/news?limit=${limit}`)
}

export async function getResources(): Promise<ResourceDocument[]> {
  if (USE_MOCK) return MOCK_RESOURCES
  return request<ResourceDocument[]>("/resources")
}

export async function getFeaturedEvent(): Promise<FeaturedEvent> {
  if (USE_MOCK) return MOCK_FEATURED_EVENT
  return request<FeaturedEvent>("/events/featured")
}
