import Image from "next/image"
import Link from "next/link"

import { NAV_COPY } from "@/content/navigation"

import { NavMenu } from "./NavMenu"

/**
 * S1 — Figma node `42:2143`.
 *
 * The navbar sits at y:0 on top of the hero, so it overlays rather than
 * occupies its own band. It is deliberately NOT fixed: the text is white and
 * later sections (S4 onward) sit on white backgrounds.
 *
 * Server Component; only the menu itself needs the client (RULES §5).
 */
export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-5 pt-6 pb-4 md:px-10 lg:px-20 lg:pt-9">
      <Link
        href="/"
        className="focus-visible:ring-gold rounded-sm focus-visible:ring-2 focus-visible:outline-none"
      >
        {/* Above the fold, so `priority` — but the file is an SVG, which
            next/image serves unoptimized either way (RULES §7). */}
        <Image
          src="/assets/global/logo-dwf-horizontal.svg"
          alt={NAV_COPY.logoAlt}
          width={156}
          height={60}
          priority
          className="h-11 w-auto lg:h-15"
        />
      </Link>

      <NavMenu />
    </header>
  )
}
