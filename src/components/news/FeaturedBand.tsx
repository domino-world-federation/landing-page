import { FeaturedStories } from "@/components/news/FeaturedStories"
import { getFeaturedNews } from "@/lib/api/client"

/**
 * Fetches the featured stories and hands them to the band.
 *
 * A server shell around a Client Component, so the call to `getFeaturedNews`
 * stays on the server and the client bundle carries the carousel's behaviour
 * rather than the API client (RULES §5/§8). The same split `Stats` uses for the
 * wheel.
 */
export async function FeaturedBand() {
  const stories = await getFeaturedNews()

  return <FeaturedStories stories={stories} />
}
