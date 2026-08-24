import Image from "next/image"

import { ParallaxLayer } from "@/components/motion/ParallaxLayer"
import { Reveal } from "@/components/motion/Reveal"
import { HQ_ALT, HQ_CONTACT, HQ_COPY } from "@/content/about/headquarters"
import { DURATION, STAGGER } from "@/lib/utils/motion"
import type { ContactLine } from "@/content/about/headquarters"

/**
 * Seconds. The building settles more slowly than the copy on it — the same
 * reasoning S4 records: it is the larger, further object, and an equal duration
 * would have it moving at a visibly higher speed than the words in front.
 */
const SETTLE = DURATION * 1.5

/**
 * Headquarters — Figma node `117:3846`. The page's closing section.
 *
 * The same building S4 shows, from the same file: About's photograph carries
 * `imageRef 1008bddc…`, which is the composite the landing page already loads.
 * It has moved to `global/` rather than being downloaded a second time under
 * another name.
 *
 * That shared file is also why this section paints NO washes of its own. Figma
 * draws three here — a blurred darkening across the middle (`117:3848`), a fade
 * to page background at the foot (`117:3849`), and a radial vignette over the
 * top (`117:3855`) — and every one of them is already baked into the export
 * (D22). Reproducing them in CSS would darken the picture twice, which is the
 * exact trap S4 hit and NewsIntro records.
 *
 * The text column is `x:525 w:870` — the same column S4's is, to the pixel. The
 * two sections are the same composition with different copy, so they are laid
 * out the same way rather than each finding its own numbers.
 *
 * Server Component; only the animated wrappers reach for the client.
 */
export function Headquarters() {
  return (
    // 900/1920 from `lg` up, with a floor for the same reason S4 has one: the
    // text column does not shrink with the window, so pure ratio would squeeze
    // three contact rows and a button against the section's edges on a narrow
    // desktop. Below `lg` the height follows the copy and the picture becomes a
    // backdrop behind it.
    <section className="relative isolate flex min-h-[620px] flex-col justify-center overflow-hidden lg:h-[max(620px,46.88vw)] lg:min-h-0">
      {/* Slower than anything in front of it — this is the backdrop, so it
          trails the page rather than racing it. `-z-10` keeps the layer behind
          the copy; `isolate` on the section stops that negative index escaping
          into the page's root stacking context and sliding behind the page
          background itself.

          `foot` rather than the default anchor: this is the last section before
          the footer, and a `cross` range needs the section to exit upwards to
          finish — which the end of a document never lets it do. Measured on S7
          while it was last, the layer stalled halfway (D16). */}
      <ParallaxLayer
        speed={8}
        anchor="foot"
        decorative
        className="absolute inset-0 -z-10"
      >
        {/* Pushed in past its resting frame, then settling back. It never goes
            below `1`, so no edge of the baked-in fade is ever pulled inside the
            frame mid-animation. */}
        <Reveal scale={[1.12, 1]} duration={SETTLE} className="size-full">
          <Image
            src="/assets/global/feature-hq-composite.png"
            alt={HQ_ALT.building}
            fill
            sizes="100vw"
            quality={90}
            className="object-cover"
          />
        </Reveal>
      </ParallaxLayer>

      {/* Figma's 44px gap between the three blocks; 2.3vw is 44/1920. Below
          `lg` the column starts at the section gutter, where there is no room
          to indent it. */}
      <div className="relative mx-auto flex w-full max-w-[870px] flex-col gap-8 px-5 py-16 md:px-10 lg:mx-0 lg:ml-[27.3%] lg:gap-[2.3vw] lg:px-0 lg:py-0">
        <Reveal y={48} blurFrom="12px">
          <h2 className="font-display bg-[image:var(--gradient-gold-text)] bg-clip-text text-[length:var(--text-display-feature)] leading-none text-transparent uppercase">
            {HQ_COPY.headline}
          </h2>
        </Reveal>

        {/* A `<ul>` because the three are a set of ways to reach one office, and
            a screen reader saying "list, 3 items" is that shape said out loud.
            28px between them; 1.46vw is 28/1920. */}
        <Reveal y={40} delay={STAGGER} blurFrom="8px">
          <ul className="flex list-none flex-col gap-4 lg:gap-[1.46vw]">
            {HQ_CONTACT.map((line) => (
              <ContactRow key={line.id} line={line} />
            ))}
          </ul>
        </Reveal>

        {/* Not a link and not a button: the design draws a panel, and the hours
            are the information — there is nowhere for a press to lead. Width is
            left to the content so a longer translation cannot clip the label. */}
        <Reveal y={32} delay={STAGGER * 2} blurFrom="6px" className="w-fit">
          <p className="rounded-btn font-display flex h-16 w-fit items-center justify-center bg-white/20 px-5 text-[length:var(--text-display-btn)] leading-10 text-white uppercase">
            {HQ_COPY.hours}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/**
 * One way to reach the office — Figma `117:4277` and its two siblings.
 *
 * The address is plain text and the other two are links, which is what the data
 * says rather than a styling choice: an email and a number can be acted on, a
 * building cannot. They look identical because the design draws them identically
 * — the underline appears on hover, so the row does not read as three links when
 * only two are.
 */
function ContactRow({ line }: { line: ContactLine }) {
  const body = (
    <>
      {/* 36 × 36 in Figma. `alt=""` — the icon repeats what the line beside it
          already says, and naming it would have a reader announce each row
          twice. */}
      <Image
        src={line.icon}
        alt=""
        width={36}
        height={36}
        className="size-7 shrink-0 lg:size-[min(1.875vw,36px)]"
      />
      <span>{line.label}</span>
    </>
  )

  return (
    <li className="font-sans flex items-center gap-3 text-[length:var(--text-eyebrow)] leading-7 text-white">
      {line.href ? (
        <a
          href={line.href}
          className="focus-visible:ring-gold flex items-center gap-3 rounded-[4px] hover:underline focus-visible:ring-2 focus-visible:outline-none"
        >
          {body}
        </a>
      ) : (
        body
      )}
    </li>
  )
}
