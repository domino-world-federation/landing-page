import Image from "next/image"

import { CountdownTimer } from "@/components/home/CountdownTimer"
import { SilverCta } from "@/components/ui/SilverCta"
import { COUNTDOWN_COPY } from "@/content/home/countdown"
import { getFeaturedEvent } from "@/lib/api/client"
import { formatEventDate } from "@/lib/utils/date"

/**
 * S3 — Figma node `24:1025`. The upcoming-match card.
 *
 * Figma puts it at `x:711, y:785` inside a 1920 × 1040 hero, so it overlaps
 * the hero rather than occupying a band of its own — the same relationship the
 * navbar has (S1). It is therefore positioned by the page, not by itself; this
 * file renders only the card.
 *
 * The 3px stroke is two stacked gradients in Figma, which no CSS border can
 * express. It is drawn by `.countdown-stroke` in globals.css, masked down to
 * the edge — painting it behind the card instead would show through the
 * translucent fill and streak the whole surface.
 *
 * Server Component — only the ticking digits need the client (RULES §5).
 */
export async function Countdown() {
  const event = await getFeaturedEvent()

  return (
    <section
      aria-labelledby="countdown-heading"
      className="countdown-stroke rounded-countdown relative w-full max-w-[498px] bg-[image:var(--gradient-countdown-fill)] p-6 backdrop-blur-[4px]"
    >
      <div className="flex flex-col items-center gap-3">
        {/* Decorative: it sits right beside the place name it stands for,
            so describing it would only repeat the text (RULES §7). */}
        {event.flagUrl && (
          <Image
            src={event.flagUrl}
            alt=""
            width={48}
            height={48}
            className="size-12 rounded-full object-cover"
          />
        )}

        <h2
          id="countdown-heading"
          className="font-sans text-center text-xl leading-6 font-semibold tracking-[0.12em] text-white uppercase"
        >
          {COUNTDOWN_COPY.label}
        </h2>

        <p className="font-sans flex flex-wrap items-center justify-center gap-3 text-base leading-6 text-white/60">
          <span>{event.location}</span>
          <span aria-hidden="true">•</span>
          {/* `dateTime` gives assistive tech and crawlers the machine value,
              while the visible text stays the design's short form. */}
          <time dateTime={event.startsAt}>
            {formatEventDate(event.startsAt)}
          </time>
        </p>
      </div>

      <div className="mt-6">
        <CountdownTimer startsAt={event.startsAt} />
      </div>

      <div
        aria-hidden="true"
        className="mt-6 h-0.5 bg-[image:var(--gradient-divider)] opacity-20"
      />

      {/* The same silver pill S13 ends the page on — extracted to `SilverCta`
          when the second one appeared. Here it fills the card's width; there
          it hugs its label. */}
      <SilverCta href={event.ctaUrl ?? "#"} className="mt-6">
        {COUNTDOWN_COPY.cta}
      </SilverCta>
    </section>
  )
}
