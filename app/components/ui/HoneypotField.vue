<script setup lang="ts">
/**
 * The trap field, rendered by every form that POSTs.
 *
 * Empty means a human. A bot fills every input it finds, and this one is not
 * findable by a person: it is off-screen, out of the tab order, `aria-hidden`
 * from screen readers, and `autocomplete="off"` so no browser offers to fill it
 * on someone's behalf. If it arrives with anything in it, the server answers
 * success and writes nothing — the bot is told it won, because an error would
 * teach it how to pass.
 *
 * **Off-screen rather than `display: none` or `type="hidden"`.** Both of those
 * are exactly what a bot skips: a field the page itself has hidden is the field
 * a scraper knows not to touch. The trap only works while it looks, to a
 * machine reading the markup, like an ordinary text input the reader simply has
 * not reached yet.
 *
 * The `name` is the server's — `SubmissionController::HONEYPOT` — and renaming
 * it here alone disarms the trap silently, which is the one failure this
 * component cannot report.
 *
 * The `id` is a prop because two of these can share a page: the footer carries
 * one on every route, and `/contact` adds a second below it. Duplicate ids
 * would point both labels at whichever came first.
 */
defineProps<{ id: string }>()

const value = defineModel<string>({ required: true })
</script>

<template>
  <!-- `-left-[9999px]`, not `sr-only`: `sr-only` is a technique for hiding
       things from EYES while keeping them for screen readers, and this field
       should reach neither. It is out of flow, so it cannot affect the layout
       of the form around it, and a negative offset in an LTR document creates
       no scrollable overflow. -->
  <div aria-hidden="true" class="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden">
    <label :for="id">Leave this field empty</label>
    <input
      :id="id"
      v-model="value"
      type="text"
      name="website"
      tabindex="-1"
      autocomplete="off"
    >
  </div>
</template>
