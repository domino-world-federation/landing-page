<script setup lang="ts">
import { ALL_TOURNAMENTS_COPY } from "~/content/tournaments/all"

/**
 * The search box in the `/tournaments/all` header — Figma node `517:2501`.
 *
 * A 12%-white glass box, a placeholder at one end and a magnifier at the other:
 * the same field the news header draws, at the same 402px.
 *
 * **This one actually searches**, which is what makes it a different component
 * from `news/Search`. That box refuses because the archive it sits over renders
 * whatever page of the feed the URL asks for — there is nothing loaded to match
 * against, and no endpoint to ask (B2). The tournament calendar is small enough
 * that the page holds all of it, so the match is real and runs where every other
 * filter on this page runs: in the URL, during SSR, on a list somebody can send.
 *
 * Submitting navigates rather than mutating a `ref`, and the current `?status=`
 * rides along — searching should narrow the tab the reader is on, not throw them
 * back to "All".
 */
const props = defineProps<{
  /** The `?q=` in force. */
  query?: string
  /** The `?status=` in force, carried through so a search does not drop it. */
  status?: string
}>()

const router = useRouter()

// Seeded from the URL and kept in step with it: arriving on `?q=madrid`, or
// pressing Back to a different term, must leave the field showing what the list
// is actually filtered by.
const term = ref(props.query ?? "")
watch(
  () => props.query,
  (value) => {
    term.value = value ?? ""
  },
)

function submit() {
  const search = new URLSearchParams()
  if (props.status) search.set("status", props.status)

  const trimmed = term.value.trim()
  if (trimmed) search.set("q", trimmed)

  router.push(
    search.size > 0 ? `/tournaments/all?${search}` : "/tournaments/all",
  )
}
</script>

<template>
  <!-- `min-w-0` on the form as well as the input: the form is a flex item in the
       header row and carries the same implicit `auto` minimum the input has just
       given up, so without it the box re-imposes the intrinsic width and pushes
       the heading beside it (D29). -->
  <form
    role="search"
    class="flex w-full min-w-0 items-center gap-4 rounded-[var(--radius-glass)] bg-white/12 px-4 py-3.5 focus-within:ring-2 focus-within:ring-white/40 lg:max-w-[402px]"
    @submit.prevent="submit"
  >
    <!-- A placeholder is not a label — it vanishes the moment there is text in
         the field, leaving a reader who arrives mid-entry with nothing
         announced. Rendered and hidden, so Figma's shape is kept without
         dropping the name. -->
    <label for="tournament-search" class="sr-only">
      {{ ALL_TOURNAMENTS_COPY.searchLabel }}
    </label>

    <!-- `w-0 flex-1`, not `min-w-0`: a text input's default `size` is a
         preferred WIDTH of about 20 characters, not a minimum, so lowering the
         floor alone leaves it still asking for ~187px whenever anything measures
         the box intrinsically (D29).

         `type="search"` for the phone keyboard and the clear affordance; the
         native cancel button is hidden because the design draws none and it
         renders as a second, differently-styled control inside the box. -->
    <input
      id="tournament-search"
      v-model="term"
      type="search"
      :placeholder="ALL_TOURNAMENTS_COPY.searchPlaceholder"
      class="font-sans w-0 flex-1 bg-transparent text-[length:var(--text-eyebrow)] leading-8 text-white placeholder:text-white/60 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
    >

    <button
      type="submit"
      :aria-label="ALL_TOURNAMENTS_COPY.searchLabel"
      class="focus-visible:ring-gold flex size-9 shrink-0 items-center justify-center rounded-[4px] transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:outline-none"
    >
      <!-- A 36px inline SVG sized in CSS. Drawn in white already, so no
           `invert`. -->
      <img
        src="/assets/global/icon-search.svg"
        alt=""
        width="36"
        height="36"
        class="size-9"
      >
    </button>
  </form>
</template>
