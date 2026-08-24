"use client"

import { useState, type FormEvent } from "react"

import { NEWS_HEADER_COPY } from "@/content/news/header"

/**
 * The search box in the news header — Figma node `176:11861`.
 *
 * A 12%-white glass box, a placeholder at one end and a magnifier at the other.
 * Built as a real form for the reason D28 settled at the footer's subscribe
 * field: a box that looks like search and cannot be typed into is worse than no
 * box, and disabling it loses the shape the design drew.
 *
 * **It does not search.** There is no endpoint (blocker B2) and no client-side
 * index either — the archive below renders whatever page of the feed the URL
 * asks for, so there is nothing loaded to match against. Submitting says so
 * through `role="status"` instead of appearing to look and finding nothing,
 * which is the failure that reads as "your query matched no articles". When a
 * `?q=` exists, only `handleSubmit` changes.
 *
 * Client because of the state and the handler, and it is a component of its own
 * for exactly that reason: the header around it stays a Server Component
 * (RULES §5).
 */
export function NewsSearch() {
  const [query, setQuery] = useState("")
  const [notice, setNotice] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice(NEWS_HEADER_COPY.searchUnavailable)
  }

  return (
    <div className="flex w-full flex-col gap-2 lg:max-w-[402px]">
      <form
        onSubmit={handleSubmit}
        role="search"
        // `min-w-0` on the form as well as the input: the form is a flex item
        // in the header row and carries the same implicit `auto` minimum the
        // input has just given up, so without it the box re-imposes the
        // intrinsic width and pushes the heading beside it (D29).
        className="flex w-full min-w-0 items-center gap-4 rounded-[var(--radius-glass)] bg-white/12 px-4 py-3.5 focus-within:ring-2 focus-within:ring-white/40"
      >
        {/* A placeholder is not a label — it vanishes the moment there is text
            in the field, leaving a reader who arrives mid-entry with nothing
            announced. Rendered and hidden, so Figma's shape is kept without
            dropping the name. */}
        <label htmlFor="news-search" className="sr-only">
          {NEWS_HEADER_COPY.searchLabel}
        </label>
        <input
          id="news-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={NEWS_HEADER_COPY.searchPlaceholder}
          // `w-0 flex-1`, not `min-w-0`: a text input's default `size` is a
          // preferred WIDTH of about 20 characters, not a minimum, so lowering
          // the floor alone leaves it still asking for ~187px whenever anything
          // measures the box intrinsically (D29).
          //
          // Placeholder at 60% white per `176:11862`; the typed value is full
          // white, or the reader cannot tell what they wrote from what they
          // have not.
          className="font-sans w-0 flex-1 bg-transparent text-[length:var(--text-eyebrow)] leading-8 text-white placeholder:text-white/60 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
        />
        <button
          type="submit"
          aria-label={NEWS_HEADER_COPY.searchLabel}
          className="focus-visible:ring-gold flex size-9 shrink-0 items-center justify-center rounded-[4px] transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:outline-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- a 36px
              inline SVG sized in CSS; next/image would add a layout wrapper
              for no gain. Drawn in white already, so no `invert`. */}
          <img
            src="/assets/global/icon-search.svg"
            alt=""
            width={36}
            height={36}
            className="size-9"
          />
        </button>
      </form>

      {/* Always in the DOM, empty until there is something to say: a live
          region inserted at the same moment as its text is routinely missed by
          screen readers, which need it present in order to watch it. */}
      <p
        role="status"
        className="font-sans text-sm leading-5 text-white/60 empty:hidden"
      >
        {notice}
      </p>
    </div>
  )
}
