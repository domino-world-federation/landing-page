"use client"

import { useState, type FormEvent } from "react"

import { GALLERY_COPY } from "@/content/gallery"

/**
 * The search box in the gallery header — Figma node `156:7159`.
 *
 * The news header's field with this page's words in it; see `NewsSearch` for
 * the full reasoning. **It does not search** — there is no endpoint (B2) and
 * nothing loaded to match against — so submitting says so through
 * `role="status"` rather than appearing to look and finding nothing (D28).
 *
 * Client because of the state and the handler, and its own component so the
 * header around it stays a Server Component (RULES §5).
 */
export function GallerySearch() {
  const [query, setQuery] = useState("")
  const [notice, setNotice] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice(GALLERY_COPY.searchUnavailable)
  }

  return (
    <div className="flex w-full flex-col gap-2 lg:max-w-[402px]">
      <form
        onSubmit={handleSubmit}
        role="search"
        // `min-w-0` on the form as well as the input: the form is a flex item
        // in the header row and carries the implicit `auto` minimum the input
        // has just given up (D29).
        className="flex w-full min-w-0 items-center gap-4 rounded-[var(--radius-glass)] bg-white/12 px-4 py-3.5 focus-within:ring-2 focus-within:ring-white/40"
      >
        <label htmlFor="gallery-search" className="sr-only">
          {GALLERY_COPY.searchLabel}
        </label>
        <input
          id="gallery-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={GALLERY_COPY.searchPlaceholder}
          // `w-0 flex-1`: a text input's default `size` is a preferred WIDTH of
          // ~20 characters, not a minimum, so lowering the floor alone leaves
          // it asking for ~187px whenever anything measures the box (D29).
          className="font-sans w-0 flex-1 bg-transparent text-[length:var(--text-eyebrow)] leading-8 text-white placeholder:text-white/60 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
        />
        <button
          type="submit"
          aria-label={GALLERY_COPY.searchLabel}
          className="focus-visible:ring-gold flex size-9 shrink-0 items-center justify-center rounded-[4px] transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:outline-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- a 36px
              inline SVG sized in CSS. Drawn in white already, so no `invert`.
              Moved from `news/` to `global/` when the FAQ header became its
              third user, which is what its old note said would move it
              (D32/D43). */}
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
