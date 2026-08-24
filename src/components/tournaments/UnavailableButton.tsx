"use client"

import { useState, type ReactNode } from "react"

/**
 * A button whose backend does not exist yet, which says so when pressed.
 *
 * D28's rule with the page's two prominent controls in mind — the hero's
 * "Watch Live stream" (`372:17392`) and the highlighted tournament's "Notify
 * me" (`372:17354`). Neither has anything behind it (blocker B2): there is no
 * stream and no reminder list. The three options were a link to nowhere, a
 * disabled button, and this; the first is a lie and the second removes the
 * design's shape from the page, so the button stays a button and refuses in
 * the open.
 *
 * The notice is a sibling `role="status"` that is always in the DOM and empty
 * until there is something to say — a live region inserted at the same moment
 * as its text is routinely missed by screen readers, which need it present in
 * order to watch it.
 *
 * Client for the one piece of state. Its own component so the sections around
 * it stay on the server (RULES §5).
 */
export function UnavailableButton({
  children,
  notice,
  className,
  noticeClassName = "text-white/60",
}: {
  children: ReactNode
  /** What the button says when it cannot do the thing. */
  notice: string
  className?: string
  /** The notice sits on a dark band in the hero and on the white one below it,
   *  so its colour is the caller's. */
  noticeClassName?: string
}) {
  const [pressed, setPressed] = useState(false)

  return (
    <div className="flex w-full flex-col gap-2 lg:w-fit">
      <button type="button" onClick={() => setPressed(true)} className={className}>
        {children}
      </button>

      <p
        role="status"
        className={`font-sans text-sm leading-5 empty:hidden ${noticeClassName}`}
      >
        {pressed ? notice : ""}
      </p>
    </div>
  )
}
