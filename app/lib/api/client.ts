/**
 * The single gateway for data access (RULES §8).
 *
 * Components call the functions in this file and never `fetch` directly. When
 * the real API lands, only this file changes — components stay untouched.
 *
 * Status: every function still returns mock data (blocker B2).
 */

import { ofetch, type FetchOptions } from "ofetch"

import {
  MOCK_BOARD_MEMBERS,
  MOCK_CHAMPIONS,
  MOCK_SHOWCASE_EVENTS,
  MOCK_FEATURED_EVENT,
  MOCK_GALLERY,
  MOCK_GALLERY_ALBUMS,
  MOCK_HERITAGE_MILESTONES,
  MOCK_HIGHLIGHTED_TOURNAMENT,
  MOCK_MEMBERSHIP_STATS,
  MOCK_MEMBER_FEDERATIONS,
  MOCK_NEWS,
  MOCK_OLYMPIC_RESULTS,
  MOCK_PARTNERS,
  MOCK_RESOURCES,
  MOCK_STATS,
  MOCK_STANDING_COMMITTEES,
  MOCK_SUB_COMMITTEES,
  MOCK_TOURNAMENTS,
  MOCK_TOURNAMENT_DETAILS,
} from "./mock"
import type {
  BoardMember,
  Champion,
  ShowcaseEvent,
  FeaturedEvent,
  FederationStat,
  GalleryAlbum,
  GalleryItem,
  HeritageMilestone,
  MemberFederation,
  NewsArticle,
  OlympicResult,
  Partner,
  ResourceDocument,
  StandingCommittee,
  SubCommittee,
  Tournament,
  TournamentDetail,
  TournamentRegistration,
  SiteSeo,
} from "./types"

/**
 * The API's base URL, or `undefined` while there is not one.
 *
 * The Next build read `process.env.NEXT_PUBLIC_API_BASE_URL` at module scope,
 * which worked because that value is inlined at build time. Nuxt keeps public
 * settings in runtime config instead, so it is read per call — and the `try`
 * is not defensive padding: `useRuntimeConfig()` needs a Nuxt context, and a
 * unit test or a plain script has none. Mock data is the right answer there
 * too, so the catch returns the same thing an unset URL does.
 */
function apiBaseUrl(): string | undefined {
  try {
    return useRuntimeConfig().public.apiBaseUrl || undefined
  } catch {
    return undefined
  }
}

/** Whether this call should be served from `mock/` rather than from the API. */
function useMock(): boolean {
  return !apiBaseUrl()
}

/**
 * Fetch wrapper, ready for the moment a base URL exists.
 *
 * Deliberately unreachable for now — written up front so the shape of error
 * handling is agreed on before the API arrives.
 */
async function request<T>(path: string, init?: FetchOptions<"json">): Promise<T> {
  const baseUrl = apiBaseUrl()

  if (!baseUrl) {
    throw new Error(
      "runtimeConfig.public.apiBaseUrl is not set — still serving mock data.",
    )
  }

  // `ofetch` rather than the global `fetch`: it parses the body and throws on a
  // non-2xx of its own accord. It is what Nuxt's `$fetch` is built from, and it
  // is used directly here because this call goes to an EXTERNAL host — `$fetch`
  // types its first argument against Nitro's own route table, which is both
  // wrong for an absolute URL and expensive enough to blow the type checker's
  // recursion limit on it.
  //
  // The Next version asked for `next: { revalidate: 300 }` here. Nuxt has no
  // per-request equivalent, and it should not: caching is Nitro's, declared
  // once for a route rather than repeated at every call. When the API lands,
  // the five minutes go in `nuxt.config` as
  // `routeRules: { "/api/**": { swr: 300 } }`, or the getter below is wrapped
  // in `defineCachedFunction`. Both outlive a component render, which
  // `revalidate` never did.
  try {
    return await ofetch<T>(`${baseUrl}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    })
  } catch (error) {
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? Number((error as { status: unknown }).status) || 0
        : 0

    throw new ApiError(`Request to ${path} failed: ${status}`, status)
  }
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
  if (useMock()) return MOCK_STATS
  return request<FederationStat[]>("/stats")
}

/**
 * The partner logo strip — **STATIC, and deliberately not fetched.**
 *
 * The backend has a `partners` table, a CMS screen and a live `/partners`
 * endpoint, and this function used to read it. It no longer does, by the repo
 * owner's decision (2026-09-03): the strip is eight logos that change once a
 * season, and the federation would rather ship them with the code than keep a
 * screen for them. The CMS menu is hidden to match, so there is nowhere to type
 * a partner that this would pick up.
 *
 * Kept as a function rather than importing `MOCK_PARTNERS` at the call site,
 * for two reasons: the components stay unchanged either way, and turning it
 * back on is one line here instead of an edit in every page that draws the
 * strip. `/api/v1/partners` is still live and still tested for that day.
 */
export async function getPartners(): Promise<Partner[]> {
  return MOCK_PARTNERS
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
  if (useMock()) {
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
  if (useMock()) {
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
  if (useMock()) return MOCK_SHOWCASE_EVENTS
  return request<ShowcaseEvent[]>("/tournaments/showcase")
}

/**
 * The About page's timeline, oldest first — the order it is read in, and the
 * order the axis draws. Sorting is the API's job rather than the component's:
 * the page has no reason to know that a timeline runs forwards.
 */
export async function getHeritageMilestones(): Promise<HeritageMilestone[]> {
  if (useMock()) return MOCK_HERITAGE_MILESTONES
  return request<HeritageMilestone[]>("/heritage-milestones")
}

/**
 * The executive board, in the federation's own order of precedence — president
 * first. Like the timeline, the ordering is the API's business rather than the
 * carousel's: the page has no way to know which office outranks which.
 */
export async function getBoardMembers(): Promise<BoardMember[]> {
  if (useMock()) return MOCK_BOARD_MEMBERS
  return request<BoardMember[]>("/board-members")
}

export async function getSubCommittees(): Promise<SubCommittee[]> {
  if (useMock()) return MOCK_SUB_COMMITTEES
  return request<SubCommittee[]>("/sub-committees")
}

export async function getFeaturedEvent(): Promise<FeaturedEvent> {
  if (useMock()) return MOCK_FEATURED_EVENT
  return request<FeaturedEvent>("/tournaments/featured")
}

/**
 * The stories the news page's featured band steps through (`156:7584`).
 *
 * Its own call rather than `getLatestNews` with a flag read at the call site,
 * for the reason RULES §8 gives everywhere else: the real endpoint filters
 * server-side, and a component sifting the feed itself would download every
 * article the federation has ever filed to show the six it leads with.
 *
 * `isFeatured` rather than "the newest few" — see the field's own note. The
 * band's counter reads its total from what comes back, so the shelf can hold
 * however many the federation has flagged without the page being edited.
 */
export async function getFeaturedNews(limit = 6): Promise<NewsArticle[]> {
  if (useMock()) return MOCK_NEWS.filter((a) => a.isFeatured).slice(0, limit)
  return request<NewsArticle[]>(`/news?featured=true&limit=${limit}`)
}

/**
 * The media collage (`168:8688`), in the picture desk's own order.
 *
 * Ordering is the API's business rather than the collage's, exactly as it is
 * for the timeline and the board: the page alternates tall video columns with
 * pairs of photographs, and it can only do that by trusting the sequence it is
 * handed — sorting here would mean the page deciding which pictures are worth
 * the tall slot, which is an editorial call it has no basis for.
 */
export async function getGalleryItems(limit?: number): Promise<GalleryItem[]> {
  if (useMock()) {
    return limit === undefined ? MOCK_GALLERY : MOCK_GALLERY.slice(0, limit)
  }
  const query = limit === undefined ? "" : `?limit=${limit}`
  return request<GalleryItem[]>(`/gallery${query}`)
}

/**
 * The categories the news archive can filter by, in the order the tabs print
 * them.
 *
 * Derived from the feed rather than written into the page. Figma names five
 * tabs — All, DWF, Tournaments, Members, Development (`166:8377`) — and the
 * feed's categories are a different vocabulary, so hard-coding the design's
 * list would print tabs that filter to nothing and hide categories that have
 * articles in them. A tab that leads to an empty grid is worse than a tab the
 * designer did not draw.
 *
 * Order is first-seen in the feed, which is newest-first: the categories being
 * written about now sort to the front on their own, without the page ranking
 * them.
 */
/**
 * One story, by slug — what `/news/[slug]` reads.
 *
 * `undefined` for a slug naming nothing, so the page can raise a real 404 rather
 * than render a header over an empty record. Same shape as `getTournament`,
 * which answers the same question for the other detail route.
 *
 * The mock has no `body` on any article: the field exists on `NewsArticle` and
 * is documented as list-responses-omit-it, and no mock copy has ever been
 * written for it (B2). The page renders what is there.
 */
export async function getNewsArticle(
  slug: string,
): Promise<NewsArticle | undefined> {
  if (useMock()) return MOCK_NEWS.find((a) => a.slug === slug)
  return request<NewsArticle>(`/news/${encodeURIComponent(slug)}`)
}

export async function getNewsCategories(): Promise<string[]> {
  if (useMock()) return [...new Set(MOCK_NEWS.map((a) => a.category))]
  return request<string[]>("/news/categories")
}

/**
 * The gallery archive grouped by event, newest first (`156:7234`).
 *
 * Separate from `getGalleryItems`, which the news page's strip reads, because
 * they are different questions rather than two views of one answer: the strip
 * asks "what has the picture desk published lately" and gets a flat run in the
 * order the collage alternates, while this asks "what did we photograph, and
 * at which event".
 *
 * `slug` filters to one album, and the filtering happens here for the reason
 * RULES §8 gives everywhere else: the real endpoint takes `?event=`, whereas a
 * page sifting the archive itself would download every photograph the
 * federation has ever filed in order to show one tournament's. Matched on the
 * slug rather than the title — the title is display copy and carries an em
 * dash, which is not something to put through a query string.
 */
export async function getGalleryAlbums(slug?: string): Promise<GalleryAlbum[]> {
  if (useMock()) {
    if (!slug) return MOCK_GALLERY_ALBUMS
    return MOCK_GALLERY_ALBUMS.filter((album) => album.slug === slug)
  }
  const query = slug ? `?event=${encodeURIComponent(slug)}` : ""
  return request<GalleryAlbum[]>(`/gallery/albums${query}`)
}


/**
 * The tournament rail (`373:17423`), in the federation's own order.
 *
 * Ordering is the API's business rather than the rail's, like the board and the
 * timeline: the page has no way to know whether the federation leads with the
 * nearest date, the biggest event, or the one it is selling tickets to.
 */
/**
 * The federation's standing committees (`613:24908`), in the federation's own
 * order — which body it leads with is its call, not the page's.
 */
export async function getStandingCommittees(): Promise<StandingCommittee[]> {
  if (useMock()) return MOCK_STANDING_COMMITTEES
  return request<StandingCommittee[]>("/standing-committees")
}

export async function getTournaments(
  registration?: TournamentRegistration,
): Promise<Tournament[]> {
  if (useMock()) {
    return registration
      ? MOCK_TOURNAMENTS.filter((t) => t.registration === registration)
      : MOCK_TOURNAMENTS
  }

  // Filtered by the server rather than by the page, for the reason the news
  // archive's category filter is (D50): `/tournaments/all` renders during SSR
  // and a filtered list has to be a URL somebody can send, which means the
  // filter has to survive a cold request with no client state.
  return request<Tournament[]>(
    registration ? `/tournaments?registration=${registration}` : "/tournaments",
  )
}

/**
 * One tournament with everything its own page prints — Figma screen `517:1895`.
 *
 * `undefined` rather than a throw for a slug that names nothing: a bad URL is a
 * 404 the page renders, not an error the request layer decides how to report.
 * The page turns it into one with `createError`.
 */
export async function getTournament(
  slug: string,
): Promise<TournamentDetail | undefined> {
  if (useMock()) {
    return MOCK_TOURNAMENT_DETAILS.find((t) => t.slug === slug)
  }
  return request<TournamentDetail>(`/tournaments/${encodeURIComponent(slug)}`)
}

/**
 * The one tournament the page opens with (`372:17314`).
 *
 * A `ShowcaseEvent` rather than a `Tournament`, because that is what the block
 * needs and already exists: the prose, the artwork and the two buttons are what
 * separate the showcase shape from the rail's card, and the design draws the
 * landing page's S6 band again here with a different eyebrow over it.
 *
 * Its own call rather than `getShowcaseEvents()[0]` at the call site: the order
 * of an array is not a contract, and the page would break silently the first
 * time the showcase is reordered. The mock answers with the first because
 * "highlighted" is what the federation puts at the front of that list today.
 */
export async function getHighlightedTournament(): Promise<
  ShowcaseEvent | undefined
> {
  if (useMock()) return MOCK_HIGHLIGHTED_TOURNAMENT
  return request<ShowcaseEvent>("/tournaments/highlighted")
}

/**
 * Champions Hall (`381:17639`), most recent first.
 *
 * Every record currently comes back without a portrait — see `Champion` and
 * R16. The card is built to render either way, so the day real photographs are
 * filed nothing here changes.
 */
export async function getChampions(): Promise<Champion[]> {
  if (useMock()) return MOCK_CHAMPIONS
  return request<Champion[]>("/champions")
}

/** The Olympic results table (`385:17838`). */
export async function getOlympicResults(): Promise<OlympicResult[]> {
  if (useMock()) return MOCK_OLYMPIC_RESULTS
  return request<OlympicResult[]>("/olympic-results")
}

/** The four figures across the members hero (`404:19188`). */
export async function getMembershipStats(): Promise<FederationStat[]> {
  if (useMock()) return MOCK_MEMBERSHIP_STATS
  return request<FederationStat[]>("/stats?scope=members")
}

/**
 * The members directory (`405:28396`).
 *
 * `limit` because the page's table is a fixed composition — two columns of
 * three — rather than a shelf that grows, and "View all" leads somewhere else
 * entirely. The same reason `getResources` carries one (D45): the real endpoint
 * takes `?limit=`, and a component slicing the full list would download every
 * member federation to show six of them.
 *
 * Order is the federation's own — neither alphabetical nor by country in the
 * design — so it is not re-sorted here.
 */
export async function getMemberFederations(
  limit?: number,
): Promise<MemberFederation[]> {
  if (useMock()) {
    return limit === undefined
      ? MOCK_MEMBER_FEDERATIONS
      : MOCK_MEMBER_FEDERATIONS.slice(0, limit)
  }
  const query = limit === undefined ? "" : `?limit=${limit}`
  return request<MemberFederation[]>(`/members${query}`)
}

/**
 * Register an email address for reminders about one tournament — the "Notify me"
 * dialog on `/tournaments` (`587:16433` and its three sibling states).
 *
 * **The first write in this file, and the first place a mock could be a lie.**
 * Everything above returns invented data, which is honest enough: the page shows
 * numbers nobody promised are real. A submit is different — the dialog answers
 * "Email submitted, thanks to keep in touch", and if that came back from a
 * component that had spoken to nothing, the page would be telling the reader it
 * had their address when it had thrown it away.
 *
 * So the mock does NOT resolve. It rejects with a message the dialog is willing
 * to show, which keeps the design's success state real code — reached the moment
 * a base URL exists — while never claiming a subscription that did not happen.
 * That is D28's rule (a control with nothing behind it refuses in the open)
 * applied to a form rather than to a button.
 *
 * `runtimeConfig.public.apiBaseUrl` is what flips it. Blocker B2.
 */
export async function subscribeToTournament(
  tournamentId: string,
  email: string,
): Promise<void> {
  if (useMock()) {
    throw new Error("no-backend")
  }
  // `unknown`, not `void`: `request` puts its parameter through `ofetch`, whose
  // response type has to be an actual type. The endpoint's body is discarded
  // either way, which is what this function's own `Promise<void>` says.
  await request<unknown>(`/tournaments/${tournamentId}/subscribe`, {
    method: "POST",
    body: { email },
  })
}

/**
 * The site's SEO and social meta, keyed by route.
 *
 * **No mock.** Every other getter falls back to `mock/` so the site renders
 * before the API exists; this one returns an EMPTY shape instead, because the
 * pages already carry their own `useSeoMeta` as the floor. Inventing mock
 * titles here would mean the tags differ between mock and live for no reason a
 * reader could see — and meta is exactly the thing nobody notices is wrong.
 */
export async function getSiteSeo(): Promise<SiteSeo> {
  if (useMock()) return { default: {}, pages: {} }
  return request<SiteSeo>("/seo")
}
