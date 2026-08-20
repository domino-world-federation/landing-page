"use client"

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"
import { useRef, type ReactNode } from "react"

import { cn } from "@/lib/utils/cn"

type ParallaxLayerProps = {
  children: ReactNode
  /**
   * Besar pergeseran relatif terhadap tinggi layer, dalam persen.
   * Nilai kecil = terasa jauh (bergerak lambat), besar = terasa dekat.
   * Negatif membalik arah — layer naik saat halaman turun.
   */
  speed?: number
  className?: string
  /** Layer dekoratif: sembunyikan dari screen reader (RULES §11). */
  decorative?: boolean
}

export function ParallaxLayer({
  children,
  speed = 20,
  className,
  decorative = false,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // target dibatasi ke elemen ini — tanpa itu seluruh halaman ikut terhitung
  // dan efeknya meleset (RULES §11).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed}%`])

  // Hook tetap dipanggil tanpa syarat; yang berubah hanya nilai yang dipakai.
  // prefers-reduced-motion mematikan parallax PENUH, bukan memperlambat —
  // layer berhenti di posisi diamnya.
  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      aria-hidden={decorative || undefined}
    >
      <motion.div
        style={prefersReducedMotion ? undefined : { y, willChange: "transform" }}
      >
        {children}
      </motion.div>
    </div>
  )
}
