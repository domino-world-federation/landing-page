<script setup lang="ts">
/**
 * `/contact` — **no Figma screen**.
 *
 * The design draws ten screens and this is not one of them. What it does draw is
 * a button pointing here and a sentence saying what the page is for, both on the
 * terms sidebar's "Need Support?" card (`174:11252`) — so the page is built from
 * that sentence: its five named kinds of enquiry are the form's topics, its
 * wording is the header's intro, and the terms' own closing address is the
 * address printed here.
 *
 * Everything else — the two-column arrangement, the section headings, the form's
 * fields — is extrapolated from the pages that ARE drawn, chiefly the
 * Development support card whose form this borrows wholesale. That is D48's call
 * at a much larger scale, which is why it is recorded as **R14** rather than as
 * a footnote: a page standing on one sentence is a page the designer needs to
 * see before it is published.
 */
useSeoMeta({
  title: "Contact | Domino World Federation",
  description:
    "Reach the Domino World Federation for general enquiries, membership information, tournament support, partnerships and media requests.",
})
</script>

<template>
  <main>
    <ContactHeader />

    <!-- The details column first in source and in reading order: a reader who
         only wants the address should not have to pass a four-field form to
         reach it. Above `lg` the form takes the wider half, since it is the
         thing with something to fill in. -->
    <div
      class="flex flex-col gap-10 px-5 pb-16 md:px-10 lg:flex-row lg:items-start lg:gap-16 lg:px-20 lg:pb-24"
    >
      <div class="lg:w-[356px] lg:shrink-0">
        <ContactDetails />
      </div>

      <div class="min-w-0 flex-1">
        <ContactForm />
      </div>
    </div>
  </main>
</template>
