/**
 * Makes the header travel with the page.
 *
 * It used to be `absolute` at the document's `y:0` — the Figma placement, where
 * the bar sits on top of the hero rather than in a band of its own. Measured,
 * that meant it scrolled away with the hero and was gone by 150px, logo and all.
 * `fixed` keeps exactly the same overlay look at rest while letting it follow.
 *
 * It stays transparent the whole way down, by design: the bar's own contents
 * already carry the glass — the menu pill and the burger are `bg-black/40` with
 * a backdrop blur of their own (S1) — so a second pane behind them would double
 * the treatment and put a hard band across the artwork. What passes underneath
 * shows through untouched.
 *
 * No client hooks, so this stays a Server Component: `fixed` is a class, not a
 * scroll listener, and nothing here depends on the scroll position.
 */
export function NavShell({ children }: { children: React.ReactNode }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 pt-6 pb-4 md:px-10 lg:px-20 lg:pt-9">
      {children}
    </header>
  )
}
