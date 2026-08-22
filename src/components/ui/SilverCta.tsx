import type { ReactNode } from "react"

import { cn } from "@/lib/utils/cn"

type SilverCtaProps = {
  children: ReactNode
  href: string
  className?: string
}

/**
 * The secondary pill — DESIGN-TOKENS §4's silver gradient on a `radius-btn`
 * box, Bebas 32/40 in black.
 *
 * Extracted once S13 (`56:4684`) turned out to draw the same button S3 already
 * had (`24:1025`'s footer). The two differ only in width — S3's fills its
 * card, S13's is a fixed 264 — so the width is left to the caller and
 * everything else lives here.
 *
 * Width is never set to Figma's 264 directly: a fixed width clips a longer
 * translation (RULES §9). But it is not a pure hug either. The design's 264 is
 * a fixed frame around a label that only measures ~129px in Bebas 32, so its
 * `20px` padding cannot account for the rest — a hug renders 169 and the pill
 * reads visibly meaner than the design. So 264 is set as a `min-w`: the design
 * width is honoured at the design's label, and a longer translation grows past
 * it instead of being cut. The floor is proportional so it cannot become a
 * fixed demand on a phone (D14), where the section's own gutters are all the
 * room there is.
 *
 * Not a Client Component — the gradient is a static background and the focus
 * ring is CSS, so there is nothing here that needs the client (RULES §5).
 */
export function SilverCta({ children, href, className }: SilverCtaProps) {
  return (
    <a
      href={href}
      className={cn(
        // `h-16` rather than padding: the design's 64px is a 40px line box plus
        // 2 × 12px, and that arithmetic only holds at the 32px label. Once the
        // label steps down on a phone the same padding leaves the button
        // shorter than the design, so the height is set and the label centres.
        //
        // The offset on the focus ring is `transparent`, not a colour: this
        // button sits on the countdown's glass in S3 and on the shine backdrop
        // in S13, and a solid offset would print a rectangle over both.
        "rounded-btn font-display focus-visible:ring-gold flex h-16 min-w-[min(100%,13.75vw)] items-center justify-center bg-[image:var(--gradient-silver-btn)] px-5 text-[length:var(--text-display-btn)] leading-10 text-black transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none",
        className,
      )}
    >
      {children}
    </a>
  )
}
