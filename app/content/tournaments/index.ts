/**
 * `/tournaments` copy — Figma screen `366:17181` (RULES §9).
 *
 * The tournaments, board members, results and documents are data (`client.ts`);
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


  /**
   * The reminder dialog the "Notify me" button opens — `587:16433` and its three
   * sibling states (filled, submitted, rejected).
   *
   * It replaces the notice the button used to print in place. That was D28's
   * rule applied with nothing else to offer: no dialog was drawn, so a control
   * with no backend could only refuse. The redraw draws one, so the shape of the
   * interaction is now the design's — and the refusal moves to where it belongs,
   * the moment of submitting, where `subscribeToTournament` still has nothing to
   * submit to (B2).
   */
  notifyDialog: {
    /** `587:16436`. The curly apostrophe is Figma's. */
    heading: "We’ll notify you to this event",
    placeholder: "Input your email address",
    /** `587:16493`, in `#54CE83` beside a tick. */
    success: "Email submitted, thanks to keep in touch",
    /** `587:16521`, in `#FF1558` beside a cross. Shown for an address the field
     *  itself can tell is malformed. */
    invalid: "Hmm… that email doesn’t look valid",
    /**
     * Shown when the address is fine but there is nothing to send it to.
     *
     * Not in the design, which has no state for it — the design assumes a
     * backend. Without one the dialog would otherwise have to either claim a
     * subscription it did not make or fail silently, and both are worse than
     * saying so.
     */
    unavailable: "Reminders are not open yet — check back soon.",
    /** Names the controls for assistive tech; neither carries a visible label. */
    closeLabel: "Close",
    submitLabel: "Submit email address",
  },

  rail: {
    /** `373:17422`. Figma types "ALL TOURNAMENT"; the plural is a typo of the
     *  kind D40 fixes — the rail lists several. */
    /**
     * "Featured Tournaments" in the redraw (`581:14650`), where it read "All
     * Tournaments" before. Not a typo fix this time — the rail shows three of
     * five and has a "View all" button beside it, so "All" was the claim that
     * was wrong.
     */
    heading: "Featured Tournaments",
    viewAll: "View all",
    /** `/tournaments/all` (`517:2487`) — the archive the rail is three of five
     *  of. It went nowhere until that screen was drawn. */
    viewAllHref: "/tournaments/all",
    /** Names the rail for assistive tech. */
    label: "All tournaments",
    /**
     * The gold button across the foot of each card (`592:16895`), which the
     * redraw puts where the bookmark used to be.
     *
     * `%s` is the tournament, for the accessible name: five buttons all reading
     * "Register" tell a screen-reader user nothing about which one they are on.
     */
    register: "Register",
    registerLabel: "Register for %s",
    /**
     * The card's foot changes with the tournament's registration state, which is
     * what the redraw's three cards show side by side: one open and taking
     * entries, one under way, one not yet accepting them.
     *
     * `%s` is the tournament in every accessible name — five cards whose buttons
     * all read "Register" tell a screen-reader user nothing about which one they
     * are on.
     */
    watchLive: "Watch live",
    watchLiveLabel: "Watch %s live",
    viewDetail: "View detail",
    viewDetailLabel: "View details of %s",
    notify: "Notify me",
    notifyLabel: "Get reminders about %s",
    /** There is no entry form and no portal to host one (B2, phase 2), so the
     *  button refuses in the open rather than navigating nowhere (D28). */
    registerUnavailable: "Entries open through the portal — coming soon.",
    /**
     * The pill's word, and it has to be the state's own — `upcoming` reading
     * "Closed" over a tab that says "Registration opens Nov 1" is the card
     * disagreeing with itself.
     */
    registration: {
      open: "Open",
      upcoming: "Upcoming",
      ongoing: "Ongoing",
      closed: "Closed",
    },
  },

  regulations: {
    /** `381:17631`. Figma types "Tournament REgulations" — the capitals are the
     *  row's, not the string's (D40). */
    heading: "Tournament Regulations",
    /**
     * `%s` is the document title — the shelf now draws `ui/ResourceCard`, whose
     * whole card is one stretched link, so the accessible name is the title
     * alone. The old `%1, %2` form belonged to `DocumentCard`, where the file
     * pill was the link and had to say what it was handing over.
     */
    downloadLabel: "Download %s",
  },

  champions: {
    /**
     * `381:17635`. The block came back after being replaced by Executive
     * Boards — see `ChampionsHall` for what changed in the data that made it
     * safe to.
     */
    heading: "Champions Hall",
    /** Names the rail for assistive tech, which cannot see the strip. */
    label: "Champions hall",
    /**
     * The per-card button. `%s` is the champion's name — a rail of tiles
     * labelled "photograph" is several identical controls with nothing to
     * choose between.
     */
    open: "View portrait of %s",
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
    /** The FAQ page, which now exists — see `/page/faq`. */
    viewMoreHref: "/page/faq",
  },

  /** Shared arrow labels for both rails. */
  previous: "Previous",
  next: "Next",
} as const
