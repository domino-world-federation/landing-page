import { FormatPanel } from "@/components/domino/FormatPanel"
import { SofteningImage } from "@/components/motion/SofteningImage"
import { FORMATS, FORMATS_ALT } from "@/content/domino/formats"
import { cn } from "@/lib/utils/cn"
import { DURATION } from "@/lib/utils/motion"

/** Seconds. Slower than the copy beside it — it is the larger object. */
const SETTLE = DURATION * 1.4

/**
 * Singles versus doubles — Figma node `207:15563`.
 *
 * Two panels butted together into one rounded rectangle: silver on the left
 * (white grading to `--color-surface-silver`), gold on the right, radii only on
 * the outer corners so the pair reads as a single object cut down the middle.
 * That cut is the section's whole argument — one game, two formats.
 *
 * **The figures used to be one picture and are now two.** The old file laid a
 * single globe-engraved tile across the seam, each panel clipping its half, and
 * this component went to some trouble to keep those halves from tearing apart:
 * one shared parallax speed, offsets stated as percentages of a panel so they
 * stayed exactly one panel apart at every width. None of that is needed any
 * more. The updated file (`272:15631` and `272:15635`) puts a different
 * photograph in each panel — a lone silhouette against the singles copy, a pair
 * back to back against the doubles copy — so there is no seam to keep shut, and
 * the pictures now make the section's point instead of merely decorating it.
 *
 * **They no longer move at all.** The old tile rode a `ParallaxLayer`, and that
 * carried over to the silhouettes by inertia — wrongly. These figures stand ON
 * the panel's floor: Figma pins each one's bottom edge to the bottom of its
 * panel, and a parallax offset lifts it off, opening a gap under the feet that
 * grows as the page scrolls. A figure cannot both be standing on something and
 * be floating over it, so the parallax went.
 *
 * Below `lg` the panels stack and both figures are dropped. They are 40%-opacity
 * backdrops behind the copy; at phone widths that copy needs the whole panel.
 *
 * Server Component; the layers and entrances are the only client parts.
 */
export function FormatSplit() {
  const [singles, doubles] = FORMATS

  return (
    <section
      aria-labelledby="format-singles-heading"
      className="px-5 py-10 md:px-10 lg:px-20 lg:py-[3.13vw]"
    >
      {/* 800 tall in Figma minus its 60px of vertical padding; 35.42vw is
          680/1920. The floor keeps the panels from crushing their three
          statistics rows together on a narrow desktop — the same reason S4 and
          the About HQ band carry one. Below `lg` the height follows the copy. */}
      <div className="flex flex-col lg:h-[max(560px,35.42vw)] lg:flex-row">
        <FormatPanel
          format={singles}
          align="start"
          headingId="format-singles-heading"
          className="rounded-t-[var(--radius-card)] bg-[linear-gradient(180deg,var(--color-surface-light)_0%,var(--color-surface-silver)_100%)] lg:flex-1 lg:rounded-tr-none lg:rounded-bl-[var(--radius-card)]"
          figure={
            <Figure
              src="/assets/domino/format-singles-silhouette.png"
              alt={FORMATS_ALT.singles}
              // 514/880 across, 376/880 wide, 600/680 tall. No `top`: the
              // figure hangs from `bottom-0`, which is where Figma puts it
              // (80 + 600 = 680, the panel's full inner height).
              className="left-[58.41%] h-[88.24%] w-[42.73%]"
            />
          }
        />
        <FormatPanel
          format={doubles}
          align="end"
          className="rounded-b-[var(--radius-card)] bg-[var(--color-gold)] lg:flex-1 lg:rounded-tr-[var(--radius-card)] lg:rounded-bl-none"
          figure={
            <Figure
              src="/assets/domino/format-doubles-silhouette.png"
              alt={FORMATS_ALT.doubles}
              // −25/880 across — it hangs off its panel's left edge, so the
              // pair leans into the join from the far side. 405/880 wide,
              // 600/680 tall, hung from the floor like its counterpart.
              className="left-[-2.84%] h-[88.24%] w-[46.02%]"
            />
          }
        />
      </div>
    </section>
  )
}

/**
 * One panel's figure — `272:15631` on the silver side, `272:15635` on the gold.
 *
 * **The numbers are fractions of a panel.** The section is 1920 padded 80 each
 * side, so each panel is 880 × 680. Figma puts the singles silhouette at
 * x514 y80 sized 376 × 600, and the doubles pair at x−25 y80 sized 405 × 600 —
 * the second hanging off its panel's left edge so the two lean toward the join
 * from either side. Stated as percentages they hold that relationship as the
 * panels shrink; in pixels they would drift the moment the window left 1920.
 *
 * Figma stretches both to their boxes (`objectFit: fill`) rather than covering,
 * and the exports match those aspect ratios to three decimals, so `object-fill`
 * distorts nothing.
 *
 * The 40% opacity is Figma's. It is what keeps a full-height photograph behind
 * a paragraph readable, so it belongs on the layer rather than being something
 * the image was baked with — the asset is a clean silhouette and stays reusable.
 *
 * `max-lg:hidden` rather than a conditional render — the markup is identical on
 * both sides of the breakpoint, so nothing here can disagree between server and
 * client (RULES §12).
 */
function Figure({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className: string
}) {
  return (
    <div className={cn("absolute bottom-0 opacity-40 max-lg:hidden", className)}>
      {/* `SofteningImage` renders two stacked copies of its image, so an `alt`
          on it would be announced twice. The line below says the thing once —
          the same fix `Vision` uses. It cross-fades two static blurs rather than
          animating `filter` (RULES §12), and it moves nothing, which is why it
          can stay on a figure that has to keep its feet on the floor. */}
      <span className="sr-only">{alt}</span>
      <SofteningImage
        src={src}
        alt=""
        from="10px"
        to="0px"
        duration={SETTLE}
        fill
        sizes="(min-width: 1024px) 24vw, 0px"
        imageClassName="object-fill"
      />
    </div>
  )
}
