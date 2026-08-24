import { EntranceGroup } from "@/components/motion/EntranceGroup"
import { ParallaxLayer } from "@/components/motion/ParallaxLayer"
import { Reveal } from "@/components/motion/Reveal"
import { SofteningImage } from "@/components/motion/SofteningImage"
import { VISION_ALT, VISION_COPY } from "@/content/about/vision"
import { DURATION, STAGGER } from "@/lib/utils/motion"

/**
 * Vision — Figma node `102:2793`.
 *
 * Six stacked layers, of which exactly one is a file. The two gold rectangles
 * behind the tile (`102:2785`, `102:2791`) are a radial gradient under a blur,
 * and the wash and the vignette are linear and radial gradients — all four are
 * CSS, so nothing is downloaded for them. Only the tile is a photograph.
 *
 * The whole composition is one `EntranceGroup`: the glow, the tile and the two
 * columns of copy are one idea arriving, and letting each arm itself would have
 * the left column play while the tile is still below the fold.
 *
 * Server Component; the motion wrappers are the client parts.
 */
export function Vision() {
  return (
    <EntranceGroup
      // A third rather than the default half: the section is 1106px tall — most
      // of a viewport at 1920 — and waiting for half of it on screen would hold
      // the entrance until the reader has already read the eyebrow.
      amount={0.3}
      className="relative overflow-hidden"
    >
      {/* 57.6vw is 1106/1920. Below `lg` the blocks stack and the height comes
          from the copy instead, with the tile behind it as a backdrop. */}
      <div className="relative min-h-[560px] lg:h-[57.6vw]">
        {/* 1. The wash the section opens with — `--color-surface-dark` to
            nothing over the top 317px (16.5vw). It is the same colour Heritage
            ends on, so the two bands meet with no visible join. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[16.5vw] min-h-[100px] bg-[linear-gradient(180deg,var(--color-surface-dark)_0%,transparent_100%)]"
        />

        {/* The tile carries the section's argument, so it is described rather
            than dropped — but described once, here, instead of on the image.
            `SofteningImage` renders TWO copies of its picture, so an `alt` on
            it is announced twice; the layer is `decorative`, which hides both,
            and this line says the thing a single time. */}
        <span className="sr-only">{VISION_ALT.tile}</span>

        {/* 2 + 3. The gold and the tile, in ONE layer — and that is a fix, not
            a tidy-up. They were two, with only the tile travelling, and the
            halo promptly slid out from behind it: Figma insets the glow 12px
            inside the tile on every side (x717 y113, 485 × 918 against the
            tile's x705 y100, 510 × 1006), so it is a rim light on that
            silhouette, not a lamp behind it. A rim light that stays put while
            its object moves stops being a rim light. Sharing a layer means one
            transform carries both and the offset can never open.

            Inside the layer the glow stays two rectangles, because it carries
            two blurs (47px and 17px): the soft one is the halo and the tight
            one is the light on the tile's own edge, and one rectangle cannot
            be both. Its numbers are Figma's, restated as fractions of the tile
            box rather than of the section.

            The tile is the only thing in the section that travels, and it
            RISES as the page scrolls down — hence the negative `speed`. A
            positive one pushes a layer down the page, lagging the scroll so it
            reads as distant, which is what the site's backdrops do. This one is
            the subject and comes up to meet the reader.

            The resting `top` is Figma's 9.04% plus HALF the travel, so the
            design's framing is what the tile holds mid-crossing — the moment
            the section is squarely in the window and being looked at. The
            previous pass anchored the design position to the END of the range
            instead, and both of the things that went wrong followed from that:
            the tile spent the whole visible passage 140px low, which pushed its
            faded foot past this band's `overflow-hidden` and cropped the very
            studs the design fades out, and it only reached the right place once
            the section was leaving.

            Where the slack comes from is worth stating, because there is none
            to spare: 100 + 1006 is 1106, the section's exact height, so the
            image is flush top and bottom and any movement must give something
            up at one end. It gives it up at the FOOT. The tile's last ~60px are
            already faded to nothing in the PNG and sit under the darkest part
            of the vignette, whereas the globe is at the head — clipping that
            would remove the subject.

            The anchor is the default crossing. `foot` was tried on D16's
            reasoning, since it guarantees the range exists, but it completes
            the move the instant the section comes to rest fully in view — which
            is the instant the reader starts looking, so the rise was over before
            anyone could see it. D16's stall only afflicts the LAST section on a
            page, and Pillars and Mission follow this one.

            `contain`, because the tile is a cut-out with its own margins and
            `cover` would crop the globe or the foot depending on the window. */}
        <ParallaxLayer
          speed={-12}
          decorative
          className="absolute top-[14.5%] left-[36.72%] h-[91%] w-[26.56%] max-lg:opacity-40"
        >
          <div className="pointer-events-none absolute top-[1.29%] left-[2.35%] h-[91.25%] w-[95.1%]">
            <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_50%_50%,var(--color-gold-dark)_0%,var(--color-gold-light)_100%)] blur-[47px]" />
            <div className="absolute inset-0 rounded-[60px] bg-[radial-gradient(circle_at_50%_50%,var(--color-gold-dark)_0%,var(--color-gold-light)_100%)] blur-[17px]" />
          </div>

          <SofteningImage
            src="/assets/global/globe-tile.png"
            alt=""
            from="14px"
            to="0px"
            duration={DURATION * 1.4}
            fill
            sizes="(min-width: 1024px) 27vw, 60vw"
            imageClassName="object-contain object-bottom"
          />
        </ParallaxLayer>

        {/* 4. The vignette that puts the tile back into the dark — a radial
            fall to `--color-bg`, transparent for the first 45% of its radius so
            the glow survives inside it. Over the tile, under the copy. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[33%] bottom-0 bg-[radial-gradient(circle_at_51%_0%,transparent_45%,var(--color-bg)_88%)]"
        />

        {/* 5. The left column — Figma x80 y411, 560 wide. Absolute from `lg`,
            where the design's overlap with the tile is the point; below it the
            two columns are simply stacked and read in order. */}
        <div className="relative flex flex-col gap-16 px-5 py-20 md:px-10 lg:absolute lg:inset-0 lg:block lg:p-0">
          <Reveal
            y={48}
            className="lg:absolute lg:top-[37.2%] lg:left-[4.17%] lg:w-[29.17%]"
          >
            <p className="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-white uppercase">
              {VISION_COPY.eyebrow}
            </p>

            <h2 className="font-display mt-9 bg-[image:var(--gradient-gold-text)] bg-clip-text text-[length:var(--text-display-statement)] leading-[1.08] text-transparent uppercase">
              {VISION_COPY.heading.map((line) => (
                // A block per line so the design's break survives without a
                // `<br>` a translation would have to carry (RULES §9).
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>

            <p className="font-sans mt-9 text-[length:var(--text-body-lg)] leading-[1.22] text-white">
              {VISION_COPY.lead}
            </p>
          </Reveal>

          {/* 6. The right column — x1280 y675, under a 127.5px rule. It trails
              the left one in: the design puts it a third of the way further
              down the section, so it is read second. */}
          <Reveal
            y={40}
            delay={STAGGER * 2}
            className="lg:absolute lg:top-[58.7%] lg:left-[66.67%] lg:w-[29.17%]"
          >
            <span
              aria-hidden="true"
              className="block h-0.5 w-[127.5px] max-w-full bg-white/40"
            />

            {/* The paragraph is painted with the design's own white→grey fall
                at half opacity — it is the section's closing note, set quieter
                than the claim above it. */}
            <p className="font-sans mt-6 bg-[linear-gradient(180deg,#ffffff_0%,var(--color-silver-mid)_100%)] bg-clip-text text-[length:var(--text-body-md)] leading-[1.5] text-transparent opacity-50">
              {VISION_COPY.detail}
            </p>
          </Reveal>
        </div>
      </div>
    </EntranceGroup>
  )
}
