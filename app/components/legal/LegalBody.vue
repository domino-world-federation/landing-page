<script setup lang="ts">
import type { LegalSectionFromApi } from "~/lib/api/types"

/**
 * The document itself — Figma node `613:24579`, the "Update 30 Aug" screen.
 *
 * **The white card is gone**, the same change `/faq` took in the same pass. It
 * was a white 20px-radius panel padded 60 with the clauses separated by 4px
 * rules — black type on white, on a page that is `#1B1B1B` everywhere else. The
 * redraw makes it one translucent `rgba(255,255,255,0.08)` panel at a 16px
 * radius padded 32, headings in white and bodies in `#A3A3A3`: the same box the
 * FAQ items are drawn as, one of them holding the whole document.
 *
 * **The rules between clauses went with it.** They existed to separate rows that
 * had no edges of their own on a flat white field; the redraw spaces the clauses
 * 36 apart inside the panel and draws nothing between them (`613:24579` holds
 * nine items and no rectangles). The same reasoning `UiFaqAccordion` records for
 * its two tones.
 *
 * An `<ol>` because the clauses are numbered and their numbers matter: both
 * documents close by referring readers to a desk, and a document whose sections
 * can be cited needs the citation to come from somewhere stable. The markers are
 * drawn rather than left to the browser, because the heading and the number sit
 * on one line at 36/48 and a list marker would not.
 */
defineProps<{ sections: readonly LegalSectionFromApi[] }>()
</script>

<template>
  <!-- 32 of padding on a 16 radius (`613:24579`), and no shadow: the panel is a
       lift out of the ground rather than a card standing on it. -->
  <article
    class="rounded-[var(--radius-item)] bg-white/[0.08] p-6 md:p-8"
  >
    <!-- 36 between clauses, which is the whole separation now. -->
    <ol class="flex flex-col gap-9">
      <li
        v-for="(section, index) in sections"
        :key="section.id"
        class="flex flex-col"
      >
        <div class="flex flex-col gap-6">
          <!-- `scroll-mt` clears the `fixed` navbar: without it a fragment jump
               parks the heading underneath the bar. The id is on the heading
               rather than the item because that is what the contents observer
               watches, and the heading is what should end up at the top of the
               viewport. -->
          <h2
            :id="section.id"
            class="font-sans scroll-mt-32 text-[length:var(--text-body-lg)] leading-[1.33] font-semibold text-white"
          >
            {{ index + 1 }}. {{ section.title }}
          </h2>

          <!-- `#A3A3A3` on the dark panel, where it was `#616161` on white.
               Figma steps the body to 28/40 here; it stays on `--text-body-sm`
               (24/36) because that is the size the repo owner set for every
               long-form answer on the site, and one document reading a step
               larger than the FAQ beside it is not what "the same" means. -->
          <p
            class="font-sans text-[length:var(--text-body-sm)] leading-[1.5] text-[#A3A3A3]"
          >
            <!-- HTML, bukan teks: klausanya ditulis di editor teks kaya
                 backoffice, dan daftar berpoin maupun tautan `mailto:` tidak
                 bisa dibawa string polos. Server membersihkannya dengan
                 `Purifier` sebelum menyimpan, disempitkan ke tebal, miring,
                 garis bawah, coret, daftar, dan tautan. Membersihkan ulang di
                 browser tidak bisa membatalkan apa yang dikirim server yang
                 sudah disusupi, dan justru akan membuang daftar yang dibuat
                 toolbar-nya sendiri. -->
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="section.description" />
          </p>
        </div>
      </li>
    </ol>
  </article>
</template>
