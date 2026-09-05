/**
 * Contact page copy (RULES §9).
 *
 * **This page has no Figma screen.** The design draws ten: home, about, domino,
 * gallery, news, all-news, FAQ, privacy policy, terms and development. There is
 * no contact screen anywhere in the file — but there is a button pointing at
 * one, and a sentence saying what it is for. Both are on the terms sidebar's
 * "Need Support?" card (`174:11252`), and this page is built from them.
 *
 * What is therefore the designer's and not invented:
 *   - `intro` — verbatim from `174:11254`.
 *   - `TOPICS` — the five kinds of enquiry that sentence names, in its order.
 *   - `email` — `174:11543`, the terms' own closing address.
 *   - the postal address, from `content/federation.ts`.
 *
 * What is extrapolated, and marked `TODO(design)`: the page's arrangement, the
 * section headings, and the form's fields and labels. The precedent is D48 —
 * the support card's missing submit button — applied at a larger scale and
 * recorded as R14 rather than smuggled in: this is a whole page standing on one
 * sentence, and the designer should see it before it is published.
 */

import { FEDERATION_ADDRESS } from "@/content/federation"

export const CONTACT_COPY = {
  title: ["Contact Us"],

  /** Verbatim from the terms sidebar (`174:11254`) — the only sentence in the
   *  design that says what this page is for. */
  intro:
    "Have a question or need assistance? Get in touch with our team for general enquiries, membership information, tournament support, partnerships, or media requests.",

  /* TODO(design): every heading below is extrapolated — no contact screen
     exists to take them from. See R14. */
  detailsHeading: "Where to find us",
  addressLabel: "Head office",
  emailLabel: "Email",
  socialHeading: "Social media",

  /** The address the terms close on (`174:11543`). Well formed, unlike the
   *  footer's, so it is a `mailto:` — see `content/federation.ts`. */
  email: "contact@dwf-domino.org",
  address: FEDERATION_ADDRESS,

  formHeading: "Send a message",
  formIntro:
    "Tell us what you need and which part of the federation it concerns. We will route your message to the right desk.",

  nameLabel: "Your name",
  namePlaceholder: "Full name",
  emailFieldLabel: "Email address",
  emailPlaceholder: "you@example.com",
  topicLabel: "What is your enquiry about?",
  messageLabel: "Message",
  messagePlaceholder: "How can we help?",
  submit: "Send message",
  /** Replaces the button's label while the request is in flight. */
  sending: "Sending…",

  /**
   * The four things that can be true after a submit.
   *
   * They are four rather than two because "it did not work" is not one event.
   * The throttle is the reader having done nothing wrong and waiting fixing it;
   * a failed request is the message not having arrived and needing another
   * route; no endpoint at all is the channel not being live yet. Collapsing
   * them into one "something went wrong" would leave someone retrying a form
   * that will refuse them for the next fifty seconds, or worse, walking away
   * believing the federation has a message it never received.
   */
  success:
    "Thank you — your message has reached us. We reply to the address you gave.",
  throttled:
    "That is several messages in quick succession. Give it a minute, then send again.",
  failed: "Your message did not go through. Try again in a moment, or email us at",

  /**
   * Said out loud on submit while there is no `NUXT_PUBLIC_API_BASE_URL` — the
   * state the site runs in with no backend behind it. The form refuses in the
   * open rather than swallowing the message: D28, and the same wording pattern
   * the grant form and the newsletter field use.
   */
  unavailable:
    "Messages are not being received yet. In the meantime, email us directly at",
} as const

/**
 * The five kinds of enquiry the terms sidebar names, in the order it names
 * them. Not invented and not extended: the sentence lists exactly these, and
 * adding a sixth would be deciding what else the federation handles.
 */
export const CONTACT_TOPICS = [
  "General enquiries",
  "Membership information",
  "Tournament support",
  "Partnerships",
  "Media requests",
] as const
