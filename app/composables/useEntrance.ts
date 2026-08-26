import type { InjectionKey, Ref } from "vue"

const ENTRANCE_KEY = Symbol("dwf:entrance") as InjectionKey<Ref<boolean>>

/**
 * Whether the enclosing `EntranceGroup` is on screen.
 *
 * The fallback is a ref that is permanently `true`, which is what keeps a layer
 * used outside any group behaving as it would alone: it plays on mount and
 * stays put. The React build got the same default from `createContext(true)`.
 */
export function useEntrance(): Ref<boolean> {
  return inject(ENTRANCE_KEY, computed(() => true))
}

/** Publishes one group's viewport state to every layer beneath it. */
export function provideEntrance(inView: Ref<boolean>): void {
  provide(ENTRANCE_KEY, inView)
}
