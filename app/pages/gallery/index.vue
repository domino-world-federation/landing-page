<script setup lang="ts">
import { getGalleryAlbums } from "~/lib/api/client"
import { GALLERY_COPY } from "~/content/gallery"

/**
 * `/gallery` — Figma screen `156:7154`.
 *
 * The eighth page, and the second to be built on the side-tab shell the legal
 * screens use — which is what finally moved two pieces out of
 * `components/terms/`: the "Need Support?" card and the tab rows themselves are
 * identical in both designs, so they are now `ui/SupportCard` and `ui/SideTab`
 * (D32/D43 — a component moves on its second user, never on the guess that there
 * will be one).
 *
 * **The event filter is links, not state**, exactly as the news archive's
 * category tabs are (D50): each tab is a link to `?event=`, `getGalleryAlbums`
 * filters during SSR, nothing on the page has to hydrate for it, and a filtered
 * gallery is a URL somebody can send.
 *
 * The layout is written out here rather than taken from `ui/SideTabLayout`,
 * because this page's sidebar is sticky at a different width (388 against the
 * shared 388, but the content column carries its own 16/24 stack of albums) —
 * the shared component covers the four pages whose bodies are one block.
 */
useSeoMeta({
  title: "Gallery | Domino World Federation",
  description:
    "Photographs and films from Domino World Federation events — world championships, continental masters, and the federation's own documentaries.",
})

const route = useRoute()
const event = computed(() =>
  typeof route.query.event === "string" ? route.query.event : undefined,
)

// The tab column always lists every album — a filter that hides the way back to
// the other events is a dead end — while the content column shows only what was
// asked for.
const { data: albums } = await useAsyncData(
  "gallery-albums",
  () => getGalleryAlbums(),
  { default: () => [] },
)

const { data: shown } = await useAsyncData(
  "gallery-albums-filtered",
  () => getGalleryAlbums(event.value),
  { watch: [event], default: () => [] },
)

// `?event=` naming nothing real: the tabs are still listed, so the reader can
// get out, and the column says plainly that there is nothing here rather than
// rendering an empty page.
const unknown = computed(
  () => event.value !== undefined && shown.value.length === 0,
)

const results = useTemplateRef<HTMLElement>("results")

/**
 * Choosing an event carries the reader to what they chose.
 *
 * The filter lives in the URL so it can be shared (D50), and the router is told
 * to stay put on a query-only change — jumping to the top of the document to
 * swap a list in place reads as a reload. That is right for the news archive,
 * where the list is already under the eye. It is wrong here: the event column is
 * `order-first` above `lg` and BELOW the pictures on a phone, so tapping an
 * event on a phone swaps a column the reader cannot see and leaves them looking
 * at the last album they scrolled past. Nothing appears to have happened.
 *
 * `scrollIntoView` rather than an offset computed here — it honours the
 * target's own `scroll-margin-top`, so the navbar clearance is the same
 * `--anchor-offset` every other jump on the site stops at, declared once in the
 * stylesheet.
 *
 * Only on a CHANGE, never on first render: arriving at `/gallery?event=…` from
 * a shared link should open at the top of the page like any other, not scroll
 * itself the moment it appears.
 */
watch(event, async (value, previous) => {
  if (value === previous) return

  await nextTick()

  const target = results.value
  if (!target) return

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
})
</script>

<template>
  <main>
    <GalleryHeader />

    <!-- 468 + 1452 at the design width. The event column comes SECOND in the
         source and is pulled back with `order` above `lg`, so a reader on a
         phone — and a screen reader on any width — meets the pictures before the
         index of them. -->
    <div
      class="flex flex-col gap-10 px-5 pb-16 md:px-10 lg:flex-row lg:items-start lg:gap-12 lg:px-20 lg:pb-24"
    >
      <div class="flex flex-col gap-10 lg:order-first lg:w-[388px] lg:shrink-0">
        <!-- Sticky so the event list stays reachable through an archive that is
             4827px tall at the design width. `top` clears the navbar; `max-h`
             with its own scroll keeps the column usable on a short window. -->
        <div
          class="flex flex-col gap-10 lg:sticky lg:top-[var(--anchor-offset)] lg:max-h-[calc(100dvh-var(--anchor-offset)-2rem)] lg:overflow-y-auto"
        >
          <GalleryEventTabs :albums="albums" :active="event" />
          <UiSupportCard />
        </div>
      </div>

      <!-- `scroll-mt` is what keeps the heading clear of the `fixed` navbar when
           the column is scrolled to; `scrollIntoView` reads it, unlike the
           router's own scrolling. -->
      <div
        ref="results"
        class="flex min-w-0 flex-1 scroll-mt-[var(--anchor-offset)] flex-col gap-16 lg:gap-24"
      >
        <p
          v-if="unknown"
          class="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60"
        >
          {{ GALLERY_COPY.empty }}
        </p>

        <!-- The `v-else` sits on a `<template>` rather than on the section
             itself: `v-if` outranks `v-for` in Vue 3, so the two on one element
             work but read backwards, and the linter rejects the pair. -->
        <template v-else>
          <GalleryAlbumSection
            v-for="album in shown"
            :key="album.id"
            :album="album"
          />
        </template>
      </div>
    </div>
  </main>
</template>
