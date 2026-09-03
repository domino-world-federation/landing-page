<script setup lang="ts">
import { transformSync } from "ultrahtml"
import sanitize from "ultrahtml/transformers/sanitize"

/**
 * Prose that came from somewhere else — a text field an editor typed into
 * rather than a string this repo wrote.
 *
 * **It was being printed, tags and all.** The tournament overview arrived from
 * the CMS as `<p>…</p><p>…</p>` and the page set it as text, so readers saw the
 * markup. The same field shape is everywhere the API returns prose — a news
 * article's `body`, a tournament's `summary` — so the fix belongs in one
 * component rather than at each call site.
 *
 * **Two inputs, and only one of them is HTML.** The mock data is plain text with
 * blank lines between paragraphs, which is also what a plain `<textarea>` field
 * would send; a rich editor sends markup. A string with no `<` in it is treated
 * as the former and rendered as real `<p>` elements, so the common case never
 * goes near `v-html` at all.
 *
 * **The HTML case is sanitised, and that is not optional.** Whatever the CMS's
 * own editor allows, this renders on the public site under this domain: a
 * `<script>` or an `onerror=` that reached the field — pasted in, or arriving
 * through some later import — would be running as first-party code. The
 * allowlist below is what the design actually draws in prose, plus links.
 * Everything else is dropped rather than escaped: an editor who bolds a word
 * should see it bold, and an editor who pastes a tracking pixel should see
 * nothing.
 *
 * `transformSync` rather than the async `transform`, because a computed cannot
 * await and this has to render identically during SSR and after hydration.
 */
const props = defineProps<{ text: string }>()

/**
 * What prose may contain: paragraphs, the two emphases, the two lists, a break,
 * and a link. No headings — the sections here supply their own, and a heading
 * inside a block would land in the document outline under it.
 */
const ALLOWED = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
] as const

/**
 * Only a link's own attributes, and only three of them. Everything else —
 * `style`, `class`, every `on*` handler, `id` — is dropped, so the field cannot
 * restyle the page it lands in or run anything.
 */
const ALLOWED_ATTRIBUTES = { a: ["href", "target", "rel"] }

/** True when the field looks like markup rather than typed prose. */
const isMarkup = computed(() => props.text.includes("<"))

/**
 * The plain-text case: paragraphs are blank-line separated, which is what the
 * mock stores and what a plain field would send.
 */
const paragraphs = computed(() =>
  props.text
    .split(/\n{2,}/)
    .map((line) => line.trim())
    .filter(Boolean),
)

const safeHtml = computed(() =>
  isMarkup.value
    ? transformSync(props.text, [
        sanitize({
          allowElements: [...ALLOWED],
          allowAttributes: ALLOWED_ATTRIBUTES,
        }),
      ])
    : "",
)
</script>

<template>
  <!-- The prose styles ride on the wrapper rather than on each element, because
       with `v-html` there are no elements here to put classes on. `[&_p]` and
       friends are how the same look is given to tags this component did not
       write. -->
  <!-- The sanitising happens in `safeHtml` above, against an element and
       attribute allowlist; the component's note has why escaping the string
       instead is not the answer. -->
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="isMarkup"
    class="flex flex-col gap-6 [&_a]:underline [&_a]:decoration-from-font [&_a]:underline-offset-4 [&_li]:ml-6 [&_li]:list-disc [&_ol_li]:list-decimal [&_strong]:font-semibold"
    v-html="safeHtml"
  />
  <!-- eslint-enable vue/no-v-html -->

  <div v-else class="flex flex-col gap-6">
    <p v-for="paragraph in paragraphs" :key="paragraph">{{ paragraph }}</p>
  </div>
</template>
