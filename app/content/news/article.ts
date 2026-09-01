/**
 * `/news/[slug]` chrome, kept out of the page for i18n (RULES §9).
 *
 * The story itself — headline, category, date, picture, excerpt — is data and
 * arrives from `getNewsArticle`. Only the words the page puts around it live
 * here, and there are three because that is all the page has: the way back, the
 * label on the date line, and what a slug naming nothing says.
 */
export const NEWS_ARTICLE_COPY = {
  back: "Back to news",
  backHref: "/news",
  /**
   * Read by the 404 the page throws. A statement rather than an apology: the
   * reader followed a link to a story that is not there, and the error page
   * prints this as its reason.
   */
  notFound: "Article not found",
} as const
