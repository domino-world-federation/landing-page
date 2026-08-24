import { Reveal } from "@/components/motion/Reveal"
import { YOUTH_COPY, YOUTH_STATS } from "@/content/development/youth"
import { STAGGER } from "@/lib/utils/motion"

/**
 * Youth Development — Figma node `190:13662`.
 *
 * The page's only white band, and that is its job: everything above it is the
 * dark header and its photograph, everything below is dark again from the
 * certifications down. This is where the page opens up. Nothing shared is
 * inverted for it — the type colours and the button's outline belong to this
 * section, the same way S6 owns its own light palette.
 *
 * Three columns of Figma's own numbers: a 362px title column, then a 1259px
 * block holding the paragraph and, beside it, the two figures over the
 * curriculum button. Written as `grow`/`basis-0` fractions rather than widths
 * (D14) — the ratio is the design's intent and the pixels are not, so the
 * columns divide whatever row they are given instead of demanding 1760px of it.
 *
 * Server Component; only the entrances are client.
 */
export function YouthProgram() {
  return (
    <section
      aria-labelledby="youth-heading"
      className="bg-white px-5 py-16 text-black md:px-10 lg:px-20 lg:py-[4.17vw]"
    >
      {/* 1760 − 362 − 1259 leaves 139px between the columns at design width
          (7.24vw), which is what `space-between` resolves to there. */}
      <div className="flex flex-col gap-10 menu:flex-row menu:items-center menu:gap-[7.24vw]">
        <div className="flex flex-col gap-6 menu:shrink-0 menu:grow-[362] menu:basis-0 menu:gap-9">
          <Reveal y={32}>
            <p className="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-black uppercase">
              {YOUTH_COPY.eyebrow}
            </p>
          </Reveal>

          {/* Bebas 76/72 in black, not the gold gradient the dark sections
              use: gold on white measures 1.9:1 against the 4.5 RULES §10 asks
              for, which is the same call S11's FAQ card made. */}
          <Reveal y={40} delay={STAGGER}>
            <h2
              id="youth-heading"
              className="font-display text-[length:var(--text-display-sm)] leading-[0.95] text-black uppercase"
            >
              {YOUTH_COPY.heading}
            </h2>
          </Reveal>
        </div>

        <div className="flex flex-col gap-10 menu:grow-[1259] menu:basis-0 menu:flex-row menu:items-center menu:gap-[3.13vw]">
          {/* Inter Regular 36/44 in `--color-ink-body`, the grey this site
              sets body copy in on a white ground. */}
          <Reveal y={32} delay={STAGGER} className="menu:flex-1">
            <p className="font-sans text-[length:var(--text-body-lg)] leading-[1.22] text-[var(--color-ink-body)]">
              {YOUTH_COPY.intro}
            </p>
          </Reveal>

          {/* Figma stacks the figures and the button with `space-between`
              across the column's full height. `justify-between` says the same
              thing without the fixed height, so the button stays at the foot
              however the paragraph beside it wraps. */}
          <div className="flex flex-col items-start justify-between gap-8 menu:min-h-[14.58vw] menu:shrink-0">
            <Reveal y={32} delay={STAGGER * 2}>
              {/* A description list, not two divs: each figure is the value of
                  the label under it, and `<dl>` is the one element that says
                  so. `flex-row` on each pair is undone — the design sets the
                  figure above its label, so the pair is a column. */}
              <dl className="flex flex-wrap gap-8 lg:gap-[3.13vw]">
                {YOUTH_STATS.map((stat) => (
                  <div key={stat.id} className="flex flex-col gap-3 lg:gap-6">
                    <dt className="font-sans text-[length:var(--text-body-2xl)] leading-[1.13] font-bold text-black">
                      {stat.figure}
                    </dt>
                    <dd className="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-black">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* Node `190:14528`: a white pill with a 1px `border-light`
                outline, the label at one end and a 16px glyph at the other.
                Unlike the resource cards' pill this one IS the control — there
                is no card behind it to stretch an anchor over — so it is a real
                link with a real focus ring. */}
            <Reveal y={24} delay={STAGGER * 3}>
              <a
                href={YOUTH_COPY.downloadHref}
                aria-label={YOUTH_COPY.downloadLabel}
                className="group rounded-btn flex w-fit items-center gap-3 border border-[var(--color-border-light)] bg-white px-6 py-4 transition-colors hover:border-[var(--color-silver-mid)] focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
              >
                <span className="font-sans text-sm leading-6 font-medium text-[var(--color-ink-pill)] uppercase lg:text-base">
                  {YOUTH_COPY.downloadCta}
                </span>
                <span className="flex size-6 shrink-0 items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element -- a
                      16px inline SVG sized in CSS; next/image would add a
                      layout wrapper for no gain. Drawn in `#1A1C1D` for light
                      grounds, which is exactly where this one sits, so no
                      `invert`. */}
                  <img
                    src="/assets/global/icon-download.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="size-4 transition-transform duration-200 group-hover:translate-y-0.5"
                  />
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
