import Image from "next/image"
import Link from "next/link"

import { NAV_COPY } from "@/content/navigation"

import { NavMenu } from "./NavMenu"
import { NavShell } from "./NavShell"

/**
 * S1 — Figma node `42:2143`.
 *
 * The navbar sits at y:0 on top of the hero, so at rest it overlays rather than
 * occupying a band of its own. It travels with the page: `NavShell` holds it
 * fixed and gives it a backdrop once the hero is no longer behind it.
 *
 * Server Component; only the shell and the menu reach for the client (RULES §5).
 */
export function Navbar() {
  return (
    <NavShell>
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
    </NavShell>
  )
}
