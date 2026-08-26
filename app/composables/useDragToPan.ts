import type { ShallowRef } from "vue"

/**
 * Press-and-drag panning for a native scroller, mouse pointers only.
 *
 * Touch and pen are deliberately left alone: the browser already pans them, and
 * capturing those pointers here would replace momentum scrolling — which a phone
 * reader expects and which no handler is going to reproduce — with a worse copy
 * of itself. `pointerType === "mouse"` is the whole guard.
 *
 * It drives the scroll position rather than a transform on purpose. A motion
 * drag would move the track independently of the scroll offset, and the two
 * would immediately disagree with the keyboard, the trackpad and whatever else
 * moves the strip. One source of truth is what keeps them all describing the
 * same scroller.
 *
 * The React build shipped this as a wrapper component around the track. A
 * composable is the same thing without the extra element: the caller spreads the
 * handlers onto the wrapper it already has.
 *
 * Both carousels on the site use it — About's board strip and its heritage
 * timeline — which is why it lives here rather than beside either of them.
 */
export function useDragToPan(
  scroller: Readonly<ShallowRef<HTMLElement | null>>,
) {
  // A plain variable rather than reactive state: this changes on every pointer
  // move, and re-rendering the cards sixty times a second to store a number
  // nothing renders would be the one expensive thing in an otherwise free
  // interaction.
  let drag: { pointerX: number; scrollLeft: number } | null = null

  function onPointerdown(event: PointerEvent) {
    if (event.pointerType !== "mouse") return
    const el = scroller.value
    if (!el) return

    drag = { pointerX: event.clientX, scrollLeft: el.scrollLeft }
    // Capture so a drag that leaves the strip — or the window — still ends
    // properly instead of leaving the page stuck in a dragging state.
    ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  }

  function onPointermove(event: PointerEvent) {
    const el = scroller.value
    if (!drag || !el) return

    // Inverted: the content follows the hand, so dragging left reveals what lies
    // to the right. `auto` keeps it frame-accurate — smooth behaviour here would
    // animate towards a target the next pointer move has already replaced.
    el.scrollTo({
      left: drag.scrollLeft - (event.clientX - drag.pointerX),
      behavior: "auto",
    })
  }

  function end() {
    drag = null
  }

  /** Spread onto the element wrapping the track. */
  return {
    onPointerdown,
    onPointermove,
    onPointerup: end,
    onPointercancel: end,
  }
}
