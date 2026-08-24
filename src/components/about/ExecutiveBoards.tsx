import { BoardCarousel } from "@/components/about/BoardCarousel"
import { Reveal } from "@/components/motion/Reveal"
import { BOARDS_COPY } from "@/content/about/boards"
import { getBoardMembers } from "@/lib/api/client"

/**
 * Executive Boards — Figma node `112:3590`.
 *
 * The band Structural Frameworks' wash ends on: `--color-surface-dark` at the
 * top, back to the page background at the foot.
 *
 * That fade is a deliberate departure from the design, and it is worth saying
 * why. Figma ends the grey panel exactly on the section boundary and starts this
 * one on plain `#0e0e0e`, which draws a hard horizontal line across the full
 * width of the page. The panel's corners are rounded at the TOP only and it
 * carries no bottom edge — the design's own way of saying it continues past the
 * frame — so the line is where the artboard was cut, not something meant to be
 * seen. Fading the same colour out over this section is what "continues" looks
 * like once there is a page below it.
 *
 * The members come from the API rather than `content/` (RULES §8) — they take
 * office and leave it, and the strip draws however many it is handed. Only the
 * section's framing is copy.
 *
 * Server Component; the strip below is the one client island, and it is handed
 * the heading so the arrows can share its row without the state climbing up
 * here.
 */
export async function ExecutiveBoards() {
  const members = await getBoardMembers()

  return (
    <section className="bg-[linear-gradient(180deg,var(--color-surface-dark)_0%,var(--color-bg)_100%)] px-5 py-16 md:px-10 lg:px-20 lg:py-[4.17vw]">
      <BoardCarousel
        members={members}
        heading={
          <Reveal y={40}>
            <h2 className="font-sans text-[length:var(--text-heading-section)] leading-[1.1] text-white">
              {BOARDS_COPY.heading}
            </h2>
          </Reveal>
        }
      />
    </section>
  )
}
