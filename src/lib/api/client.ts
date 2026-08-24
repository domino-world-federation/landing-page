/**
 * The single gateway for data access (RULES §8).
 *
 * Components call the functions in this file and never `fetch` directly. When
 * the real API lands, only this file changes — components stay untouched.
 *
 * Status: every function still returns mock data (blocker B2).
 */

import {
  MOCK_BOARD_MEMBERS,
  MOCK_SHOWCASE_EVENTS,
  MOCK_FEATURED_EVENT,
  MOCK_HERITAGE_MILESTONES,
  MOCK_NEWS,
  MOCK_PARTNERS,
  MOCK_RESOURCES,
  MOCK_STATS,
  MOCK_SUB_COMMITTEES,
} from "./mock"
import type {
  BoardMember,
  ShowcaseEvent,
  FeaturedEvent,
  FederationStat,
  HeritageMilestone,
  NewsArticle,
  Partner,
  ResourceDocument,
  SubCommittee,
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

/**
 * The default is 7 because that is what S8's mosaic draws (`54:3157`): five
 * full-height cards, one half-height, and two squares. A smaller default would
 * leave the composition short a tile without erroring — the slot simply would
 * not render — so the number lives here rather than at the call site.
 *
 * `category` narrows the feed to one desk, which is what the Development page's
 * update strip asks for. Filtered here rather than at the call site for the
 * reason `getResources` records: the real API filters server-side, and a
 * component slicing the full feed itself would keep downloading every article
 * to show four of them. The limit applies AFTER the filter, so asking for four
 * development stories returns four — not however many of the newest seven
 * happen to be development stories.
 */
export async function getLatestNews(
  limit = 7,
  category?: string,
): Promise<NewsArticle[]> {
  if (USE_MOCK) {
    if (!category) return MOCK_NEWS.slice(0, limit)
    const wanted = category.toLowerCase()
    return MOCK_NEWS.filter((a) => a.category.toLowerCase() === wanted).slice(
      0,
      limit,
    )
  }
  const filter = category ? `&category=${encodeURIComponent(category)}` : ""
  return request<NewsArticle[]>(`/news?limit=${limit}${filter}`)
}

/**
 * The document library. Without a category it returns everything; the Domino
 * and Development pages each ask for one shelf at a time.
 *
 * Filtering here rather than at the call site so the two sides behave the same:
 * once the real API exists it filters server-side, and a component slicing the
 * full list itself would keep downloading the whole library to show two rows of
 * it. Matched case-insensitively — `category` is display copy on the card, and
 * nothing guarantees the backend's casing matches ours.
 *
 * `limit` is for the caller whose composition is a fixed shape rather than a
 * shelf. S10 draws a 2×2 grid of four and its four documents each carry a
 * different category, so there is no shelf to name and nothing else would bound
 * it — the grid silently grew to seven cards when the Domino documents were
 * filed and would have reached eleven with the Development ones. The same
 * reason `getLatestNews` carries one, and stated at the API for the same
 * reason: the real endpoint takes `?limit=`, and a component slicing what it
 * was sent would download the whole library to show four of it.
 */
export async function getResources(
  category?: string,
  limit?: number,
): Promise<ResourceDocument[]> {
  if (USE_MOCK) {
    const wanted = category?.toLowerCase()
    const shelf = wanted
      ? MOCK_RESOURCES.filter((d) => d.category.toLowerCase() === wanted)
      : MOCK_RESOURCES
    return limit === undefined ? shelf : shelf.slice(0, limit)
  }
  const params = new URLSearchParams()
  if (category) params.set("category", category)
  if (limit !== undefined) params.set("limit", String(limit))
  const query = params.size > 0 ? `?${params}` : ""
  return request<ResourceDocument[]>(`/resources${query}`)
}

/** The S6 showcase — the set the card's pager steps through. */
export async function getShowcaseEvents(): Promise<ShowcaseEvent[]> {
  if (USE_MOCK) return MOCK_SHOWCASE_EVENTS
  return request<ShowcaseEvent[]>("/events/showcase")
}

/**
 * The About page's timeline, oldest first — the order it is read in, and the
 * order the axis draws. Sorting is the API's job rather than the component's:
 * the page has no reason to know that a timeline runs forwards.
 */
export async function getHeritageMilestones(): Promise<HeritageMilestone[]> {
  if (USE_MOCK) return MOCK_HERITAGE_MILESTONES
  return request<HeritageMilestone[]>("/heritage-milestones")
}

/**
 * The executive board, in the federation's own order of precedence — president
 * first. Like the timeline, the ordering is the API's business rather than the
 * carousel's: the page has no way to know which office outranks which.
 */
export async function getBoardMembers(): Promise<BoardMember[]> {
  if (USE_MOCK) return MOCK_BOARD_MEMBERS
  return request<BoardMember[]>("/board-members")
}

export async function getSubCommittees(): Promise<SubCommittee[]> {
  if (USE_MOCK) return MOCK_SUB_COMMITTEES
  return request<SubCommittee[]>("/sub-committees")
}

export async function getFeaturedEvent(): Promise<FeaturedEvent> {
  if (USE_MOCK) return MOCK_FEATURED_EVENT
  return request<FeaturedEvent>("/events/featured")
}
