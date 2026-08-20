/**
 * The single gateway for data access (RULES §8).
 *
 * Components call the functions in this file and never `fetch` directly. When
 * the real API lands, only this file changes — components stay untouched.
 *
 * Status: every function still returns mock data (blocker B2).
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
 * Fetch wrapper, ready for the moment a base URL exists.
 *
 * Deliberately unreachable for now — written up front so the shape of error
 * handling is agreed on before the API arrives.
 */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not set — still serving mock data.",
    )
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    throw new ApiError(
      `Request to ${path} failed: ${response.status} ${response.statusText}`,
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
