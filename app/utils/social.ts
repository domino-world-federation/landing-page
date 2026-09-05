import { FOOTER_SOCIALS, type SocialLink } from "~/content/footer"
import type { SiteSettings } from "~/lib/api/types"

/**
 * Where a username lives on each network.
 *
 * This mapping belongs in the repo rather than in the CMS, and the split is
 * deliberate: which account the federation owns is the federation's fact, but
 * how Instagram spells a profile URL is a fact about Instagram. Asking a member
 * of staff to paste a full URL would be asking them to get `@` right on the two
 * networks that need it and wrong on the three that do not — the backoffice
 * asks for `{instagram_username}`, and this is the other half of that promise.
 */
const PROFILE_URL: Record<string, (handle: string) => string> = {
  instagram: (h) => `https://instagram.com/${h}`,
  tiktok: (h) => `https://tiktok.com/@${h}`,
  x: (h) => `https://x.com/${h}`,
  youtube: (h) => `https://youtube.com/@${h}`,
  facebook: (h) => `https://facebook.com/${h}`,
}

/** Which settings key carries which network's handle. */
const SETTING_KEY: Record<string, keyof SiteSettings> = {
  instagram: "socialInstagram",
  tiktok: "socialTiktok",
  x: "socialX",
  youtube: "socialYoutube",
  facebook: "socialFacebook",
}

/**
 * Turns whatever was typed in the backoffice into a profile URL.
 *
 * A full URL is passed through untouched. Someone WILL paste one — the field
 * says "username or profile reference", and half the world thinks of their
 * account as its link — and building `instagram.com/https://instagram.com/dwf`
 * out of it would be a broken link produced by a rule that was only ever a
 * guess about what people type.
 *
 * A leading `@` is dropped for the same reason: it is how people write handles
 * out loud, and it is never part of the path segment.
 */
function profileUrl(id: string, raw: string): string | null {
  const handle = raw.trim().replace(/^@/, "")

  if (handle === "") return null
  if (/^https?:\/\//i.test(handle)) return handle

  return PROFILE_URL[id]?.(handle) ?? null
}

/**
 * The social marks to render, with real destinations where the federation has
 * given one.
 *
 * The icons and their names stay in `content/footer.ts` — they are artwork and
 * the words a screen reader says, not data the federation edits — so this only
 * ever replaces the `href`.
 *
 * **Two behaviours, and the second is what keeps the design intact.** Networks
 * with a handle are returned as links. If NOT ONE of the five has a handle —
 * which is every render with no API behind it — the design's full row comes
 * back inert, exactly as it has always been drawn. Returning nothing there
 * would leave a "Social Media" heading over empty space on every page of the
 * site, which is worse than five icons that do not go anywhere yet.
 */
export function socialLinks(settings: SiteSettings): readonly SocialLink[] {
  const linked = FOOTER_SOCIALS.map((social) => {
    const key = SETTING_KEY[social.id]
    const href = key ? profileUrl(social.id, settings[key] ?? "") : null

    return href === null ? null : { ...social, href }
  }).filter((social): social is SocialLink => social !== null)

  return linked.length > 0 ? linked : FOOTER_SOCIALS
}
