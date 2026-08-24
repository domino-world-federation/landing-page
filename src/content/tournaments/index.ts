/**
 * `/tournaments` copy — Figma screen `366:17181` (RULES §9).
 *
 * The tournaments, champions, results and documents are data (`client.ts`);
 * what lives here is the page's own furniture — headings, labels, and the
 * strings the controls say.
 */

export const TOURNAMENTS_COPY = {
  /** Screen-reader name for the page; the hero prints the event, not a title. */
  pageTitle: "Tournaments",

  hero: {
    /** The wordmark laid across the hero (`372:17399`). Decorative — the event
     *  beneath it is what names the block — so it is `aria-hidden`. */
    watermark: "DWF2026",
    /** Separates place from dates in the hero's meta line (`370:17249`). */
    separator: "•",
    watchLive: "Watch Live stream",
    /** No stream exists (B2), so the button says so rather than opening
     *  nothing — D28, the call the newsletter field already made. */
    watchLiveUnavailable: "The live stream opens when the tournament does.",
    portraitAlt:
      "A raised gold trophy topped with two domino tiles, held aloft by the winner",
  },

  highlighted: {
    /** The rotated eyebrow beside the band (`372:17315`). */
    eyebrow: "Highlighted Tournaments",
    dateLabel: "Date",
    locationLabel: "Location",
    details: "Details",
    /** `372:17355`. Unlike S6's "Register", this one asks to be told when
     *  entries open. */
    notify: "Notify me",
    /** There is no subscription endpoint (B2). Same treatment as the footer's
     *  newsletter: the control refuses in the open (D28). */
    notifyUnavailable: "Reminders are not open yet — check back soon.",
  },

  rail: {
    /** `373:17422`. Figma types "ALL TOURNAMENT"; the plural is a typo of the
     *  kind D40 fixes — the rail lists several. */
    heading: "All Tournaments",
    viewAll: "View all",
    /** No archive page is drawn for this rail, so the button goes nowhere
     *  yet (B2). */
    viewAllHref: "#",
    /** Names the rail for assistive tech. */
    label: "All tournaments",
    /** The bookmark button on each card (`381:17449`). `%s` is the tournament.
     *  Nothing stores bookmarks yet (B2). */
    bookmark: "Save %s",
    bookmarkUnavailable: "Saving tournaments needs an account — coming soon.",
    registration: {
      open: "Open",
      closed: "Closed",
      ongoing: "Ongoing",
    },
  },

  regulations: {
    /** `381:17631`. Figma types "Tournament REgulations" — the capitals are the
     *  row's, not the string's (D40). */
    heading: "Tournament Regulations",
    /** `%1` is the document title, `%2` its printed file description. */
    downloadLabel: "Download %1, %2",
  },

  champions: {
    heading: "Champions Hall",
    label: "Champions hall",
  },

  gallery: {
    /** `381:17698`. The block is the news page's media desk under this page's
     *  own gold heading. */
    heading: "Media gallery",
  },

  results: {
    heading: "Olympic Results",
    columns: {
      year: "Year",
      event: "Event",
      category: "Category",
      winners: "Winner(s)",
      federation: "Country / Federation",
    },
    more: "More Olympic Results",
    /** No results archive is drawn (B2). */
    moreHref: "#",
  },

  faq: {
    /** `385:17866`. Figma types "FREQUENT ASKED QUESTIONS", which is the same
     *  typo S11 carries and gets the same correction (D40). */
    heading: "Frequently Asked Questions",
    viewMore: "View more",
    /** The FAQ page, which now exists — see `/faq`. */
    viewMoreHref: "/faq",
  },

  /** Shared arrow labels for both rails. */
  previous: "Previous",
  next: "Next",
} as const
