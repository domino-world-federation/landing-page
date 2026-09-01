<script setup lang="ts">
import { getMembershipStats } from "~/lib/api/client"
import { MEMBERS_COPY } from "~/content/members"

/**
 * The members hero — Figma node `401:19063`, 1920 × 1080 full bleed.
 *
 * This page does NOT open on the header band the other inner pages share. It
 * opens on a centred title over a gradient with a gold pill under it and four
 * figures across the foot, and that is the design's call rather than an
 * oversight to correct: the band is for pages that are documents or archives,
 * and this one is a pitch (D64).
 *
 * The title is not run through `SharpeningHeadline` for the same reason — Figma
 * gives it no `blur(7.5px)` start (`401:19069`), unlike every header-band title
 * in the file. Nothing to clear from, so nothing clears.
 *
 * **The vertical rhythm is measured, not flowed.** Figma positions all four
 * pieces absolutely — content at y:214, pill at 604, figures at 805 — and an
 * evenly-gapped column does not reproduce that: it centres everything and the
 * glow ends up behind the wrong element. The gaps below are the design's own
 * distances written as `vw` against the 1920 canvas, so the block is exact at
 * the design width and stays proportional either side of it.
 */
/**
 * The one fade both globe layers wear, and the reason it is a constant.
 *
 * The halo and the sphere draw the same edge from two different elements — the
 * halo the light outside it, the sphere the lit limb itself. If their masks
 * differ by so much as a stop, one dies before the other and the join between
 * them opens up: at the sides the rim was still burning after its glow had gone,
 * which reads as light leaking out of a seam. Written once, bound to both, so
 * they cannot drift apart.
 *
 * Anchored at the crown and falling off horizontally, and its radius is a
 * CUSTOM PROPERTY because the right value is not one number.
 *
 * The fade is measured against the sphere's box, but what has to be faded by is
 * the edge of the WINDOW — and the window covers a different share of the box at
 * every breakpoint, because a narrow screen needs a bigger circle to get a flat
 * horizon out of it. At 1920 the frame reaches ±37% of the box; at 768 it is
 * ±29%; on a 390 phone only ±21%. A single 44% radius is spent by the frame's
 * edge on desktop and barely started on a phone, which is exactly what happened:
 * the arc ran off both sides of the phone at full brightness.
 *
 * So each breakpoint sets `--edge-r` to roughly its own reach divided by 0.85 —
 * the fade is ~85% spent where the window ends, whatever the window is.
 */
const EDGE_FADE = `radial-gradient(
  ellipse var(--edge-r) 130% at 50% 0%,
  #000 0%,
  #000 18%,
  rgba(0, 0, 0, 0.62) 48%,
  rgba(0, 0, 0, 0.22) 72%,
  rgba(0, 0, 0, 0.05) 88%,
  transparent 100%
)`

/** How far round the sphere the light survives, by height. Shared for the same
 *  reason `EDGE_FADE` is. */
const LIMB_FADE = `linear-gradient(
  180deg,
  #000 0%,
  #000 10%,
  rgba(0, 0, 0, 0.6) 20%,
  rgba(0, 0, 0, 0.25) 31%,
  transparent 44%
)`

const haloStyle = {
  background: `radial-gradient(
    circle closest-side at 50% 50%,
    rgba(255, 248, 205, 0) 0%,
    rgba(255, 248, 205, 0) 84.6%,
    rgba(255, 248, 205, 0.741) 87.2%,
    rgba(252, 232, 178, 0.51) 88.2%,
    rgba(247, 218, 152, 0.317) 89.2%,
    rgba(242, 205, 133, 0.18) 90.2%,
    rgba(238, 196, 120, 0.128) 91.2%,
    rgba(232, 188, 110, 0.056) 93.2%,
    rgba(228, 182, 104, 0.017) 95.2%,
    rgba(228, 182, 104, 0) 97.2%
  )`,
  maskImage: `${LIMB_FADE}, ${EDGE_FADE}`,
  WebkitMaskImage: `${LIMB_FADE}, ${EDGE_FADE}`,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
}

/**
 * The sphere's limb, measured off `decor-hero-globe.png` down the column at
 * x=960: the edge begins at rgb(171,136,71) and falls away inward. The warm band
 * is deliberately NARROW — it starts at 96% of the 1306px radius, which is 52px
 * in. Earlier passes started it at 85% and 94%, and both washed amber a long way
 * down the sphere's face; the render keeps its light on the rim.
 */
const sphereStyle = {
  background: `radial-gradient(
    circle closest-side at 50% 50%,
    rgb(17, 16, 14) 0%,
    rgb(18, 16, 14) 88%,
    rgb(24, 21, 16) 93%,
    rgb(32, 25, 15) 96%,
    rgb(58, 45, 26) 97.8%,
    rgb(101, 81, 43) 98.8%,
    rgb(171, 136, 71) 100%
  )`,
  maskImage: `${LIMB_FADE}, ${EDGE_FADE}`,
  WebkitMaskImage: `${LIMB_FADE}, ${EDGE_FADE}`,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
}

const { data: stats } = await useAsyncData(
  "members-stats",
  () => getMembershipStats(),
  { default: () => [] },
)
</script>

<template>
  <!-- `isolate` so the glow can sit at `-z-10` without sliding behind the
       section's own background. -->
  <section
    class="relative isolate flex snap-screen min-h-[640px] flex-col items-center justify-center overflow-hidden bg-linear-to-b from-[#262626] to-[#0e0e0e] px-5 pt-36 pb-16 md:px-10 lg:px-20 lg:pt-[var(--nav-clearance)] lg:pb-[5.36vw]"
  >

    <!-- The globe — `401:19063`, built in CSS against `decor-hero-globe.png`,
         which is the designer's own 1920 x 741 render and stays in the repo as
         the thing this is matched to.

         **One positioned box, everything else a percentage of it.** The sphere,
         its halo and the map used to be three siblings positioned against the
         SECTION — which worked at 1920 x 1080 and nowhere else, because `top` is
         a share of the section's HEIGHT while `width` is a share of its WIDTH. On
         a 390 x 844 phone those two diverge hard: the map's box came out
         portrait, so the continents were squeezed into a tall narrow rectangle,
         and the arc drew a tight dome behind the title instead of a horizon. Now
         this box IS the sphere and the other two are sized off it, so the whole
         system scales as one thing and only this element knows about
         breakpoints.

         **The geometry is measured off the render.** Its arc rises ~420px above
         where it leaves the frame across a half-width of 960, and a circle
         through those points has radius (420^2 + 960^2) / (2 x 420) = 1307 — so
         the sphere is 2614 wide in a 1920 frame, which is 136%.

         The frame shows the middle ~74% of the sphere at every width, which is
         what keeps the arc the same SHAPE everywhere. What changes per breakpoint
         is how much sphere there is: a narrow screen needs a bigger circle to get
         a flat horizon out of it, and it wants that horizon lower down, under the
         copy rather than behind it.

         `--edge-r` rides along for the same reason — see `EDGE_FADE`. It is set
         here rather than in the style object because it has to change per
         breakpoint, and an inline style cannot hold a media query. -->
    <div
      aria-hidden
      class="pointer-events-none absolute top-[56%] left-1/2 -z-10 aspect-square w-[240%] max-w-none -translate-x-1/2 [--edge-r:24.5%] md:top-[46%] md:w-[172%] md:[--edge-r:34%] lg:top-[38%] lg:w-[136%] lg:[--edge-r:44%]"
    >
      <!-- The halo: the rim's light spilling outward into the dark.

           A SECOND circle sharing the sphere's centre. The sphere is clipped by
           `rounded-full`, so nothing painted on it can reach past its own edge —
           every glow tried on the sphere itself stopped dead at the horizon and
           the sky above went abruptly black.

           114.7% of the sphere, centred on it. That is the old 156/136 pair
           reduced to one ratio, which is the point of nesting: the two circles
           can no longer drift out of concentricity when a width changes.

           Its stops are measured — see `haloStyle`. It is a RING, not a disc:
           filled to the centre, the bright interior showed straight through
           wherever the sphere's own mask had faded, washing the lower half. -->
      <div
        class="absolute top-1/2 left-1/2 aspect-square w-[114.7%] max-w-none -translate-x-1/2 -translate-y-1/2 rounded-full"
        :style="haloStyle"
      />

      <!-- The sphere. Its fill is measured off the render — see `sphereStyle`.

           **There is no bright stroke, and that was the mistake.** Three passes
           put a near-white line on this edge. The render has nothing of the kind:
           its brightest pixel on the sphere is rgb(171,136,71), luminance 138,
           and the peak of the whole image — luminance 187 — sits OUTSIDE the
           sphere, in the halo. The rim is not drawn on the planet. It is the
           inside edge of its atmosphere.

           `closest-side` is load-bearing. A `radial-gradient(circle at 50% 50%)`
           defaults to `farthest-corner`, so on a square box 100% lands at root-2
           times the radius — every rim stop written at 97-99% is then drawn
           outside the circle and clipped away by `rounded-full`. That is why
           three rounds of making the rim brighter changed nothing: it was never
           on screen. -->
      <div class="absolute inset-0 rounded-full" :style="sphereStyle" />

      <!-- The continents, drifting across the sphere.

           **It drifts sideways, and the direction is not a preference.** Asked
           for upward, tried upward, and upward cannot loop: turning a globe
           vertically means tumbling it over its poles, and a world map will not
           do that. Longitude wraps — sail west far enough and you arrive back
           east — so a map scrolled sideways meets itself. Latitude does not. A
           map scrolled upward runs off its own top edge and the next copy starts
           at the Arctic, which is the cut that showed in the loop. No mask hides
           it for a whole lap; it crosses the frame once every time round.

           Sideways is also what a globe actually does. Two copies side by side,
           translated by exactly half the pair's width so copy two lands where
           copy one began — the join is Pacific meeting Pacific, which is where
           the map's own edges already agree.

           Sized off the SPHERE, not off the section: 42.7% of the circle wide and
           21.5% of it tall, which is the 1114 x 562 it measured at the design
           width. Two shares of the same square cannot come apart the way a share
           of the width and a share of the height did.

           `rotateX` lays the plane onto the sphere. `perspective` is in `vw` so
           the foreshortening scales with the globe instead of staying a fixed
           1100px, which on a phone tilted the map almost flat.

           The fade masks live on this OUTER element, not on the copies: they
           describe where the sphere is lit, which does not move. Only the map
           moves. -->
      <div class="absolute inset-0 [perspective:58vw] [perspective-origin:50%_0%]">
        <div
          class="absolute top-[0.84%] left-1/2 h-[21.5%] w-[42.7%] -translate-x-1/2 overflow-hidden [transform:rotateX(57deg)]"
          style="
            mask-image:
              radial-gradient(ellipse 66% 74% at 50% 26%, #000 18%, rgba(0, 0, 0, 0.55) 48%, transparent 78%),
              linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.5) 7%, #000 20%, #000 62%, transparent 92%),
              linear-gradient(96deg, rgba(0, 0, 0, 0.22) 0%, rgba(0, 0, 0, 0.75) 22%, #000 42%, #000 80%, rgba(0, 0, 0, 0.45) 100%);
            -webkit-mask-image:
              radial-gradient(ellipse 66% 74% at 50% 26%, #000 18%, rgba(0, 0, 0, 0.55) 48%, transparent 78%),
              linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.5) 7%, #000 20%, #000 62%, transparent 92%),
              linear-gradient(96deg, rgba(0, 0, 0, 0.22) 0%, rgba(0, 0, 0, 0.75) 22%, #000 42%, #000 80%, rgba(0, 0, 0, 0.45) 100%);
            mask-composite: intersect;
            -webkit-mask-composite: source-in;
          "
        >
          <div class="globe-drift absolute inset-y-0 left-0 w-[200%]">
            <div
              class="globe-dots absolute inset-y-0 left-0 w-1/2"
              style="
                mask-image: url('/assets/members/decor-map-frame.svg');
                -webkit-mask-image: url('/assets/members/decor-map-frame.svg');
              "
            />
            <div
              class="globe-dots absolute inset-y-0 left-1/2 w-1/2"
              style="
                mask-image: url('/assets/members/decor-map-frame.svg');
                -webkit-mask-image: url('/assets/members/decor-map-frame.svg');
              "
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex w-full max-w-[1200px] flex-col items-center gap-8 lg:gap-16">
      <!-- Inter Medium 84, centred. -->
      <h1
        class="font-sans text-center text-[length:var(--text-page-title)] leading-[1.1] font-medium text-white"
      >
        {{ MEMBERS_COPY.heroTitle }}
      </h1>

      <!-- 728 of the design's 1920, centred under the title. -->
      <p
        class="font-sans max-w-[728px] text-center text-[length:var(--text-eyebrow)] leading-8 text-white/60"
      >
        {{ MEMBERS_COPY.heroIntro }}
      </p>
    </div>

    <!-- 604 − 443 = 161px below the copy at the design width. `401:19075` is the
         landing page's gold pill exactly — the same radial fill, the same 3px
         conic stroke, the same glow, the same 48px radius and Bebas 36 label
         through the ink gradient. So it is `GoldCta`, not a second button that
         happens to look like it. -->
    <UiGoldCta
      :href="MEMBERS_COPY.heroCtaHref"
      class="mt-10 lg:mt-[8.39vw] lg:w-[340px]"
    >
      {{ MEMBERS_COPY.heroCta }}
    </UiGoldCta>

    <!-- `404:19188` — four figures across the foot, 129px below the pill. A
         `<dl>` because each is a label and a value; the design puts the value
         above the label, which `flex-col-reverse` gives without reversing the
         markup.

         A QUARTER of the row each from `lg`, not Figma's 400px. Four fixed 400s
         need 1600 and a 1280 laptop leaves 1120, so they wrapped to two rows —
         which pushed the section to 910px inside an 800px window and spilled the
         last two figures below the fold of their own snap stop. A share of the
         row is 400 at the design width and still one row at 1280. -->
    <dl
      class="mt-12 flex w-full flex-wrap items-start justify-center gap-x-3 gap-y-10 lg:mt-[6.72vw]"
    >
      <div
        v-for="stat in stats"
        :key="stat.id"
        class="flex w-[calc(50%-0.75rem)] flex-col-reverse items-center gap-6 lg:w-[calc(25%-0.75rem)]"
      >
        <dt
          class="font-sans text-center text-[length:var(--text-body-md)] leading-[1.25] font-medium text-white/80"
        >
          {{ stat.label }}
        </dt>
        <!-- Bebas 100 through the page's gold gradient. The gradient is painted
             through the glyphs, so it has to stay on the element the text is in
             — `CountUp` renders spans inside this one and none of them
             re-declare a fill. -->
        <dd
          class="font-display text-gold-gradient text-center text-[length:var(--text-display-statement)] leading-none"
        >
          <MotionCountUp :value="stat.value" />
        </dd>
      </div>
    </dl>
  </section>
</template>
