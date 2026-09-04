<script setup lang="ts">
import type { LegalPageChrome } from "~/content/legal"
import type { LegalSectionFromApi } from "~/lib/api/types"

/**
 * A whole legal page, minus the navbar and the footer — Figma screens
 * `174:11162` (terms) and `174:10759` (privacy), which are one screen with
 * different clauses in it.
 *
 * Both routes are this component plus their own copy, so the two pages cannot
 * drift apart the way two hand-built copies of the same screen would. The FAQ
 * screen (`173:9459`) was offered this component and did NOT take it: it draws
 * the same shell, but its body is a filtered accordion rather than a numbered
 * document, so `/faq` shares `PageHeader`, `SideTabLayout` and `SupportCard` and
 * stops there (D57's line, applied).
 */
const props = defineProps<{
  /** Judul dokumen, dari API — bukan dari naskah di repo. */
  title: string
  /**
   * Tanggal revisi PILIHAN REDAKSI, bukan `updated_at` barisnya. Opsional
   * karena dokumen yang baru dibuat belum tentu sudah punya tanggalnya.
   */
  updatedAt?: string
  sections: readonly LegalSectionFromApi[]
  /** Label antarmuka yang sama untuk tiap dokumen. */
  chrome: LegalPageChrome
}>()

/*
 * `UiPageHeader` menerima larik baris — desainnya memutus judul panjang
 * sendiri. API mengirim satu string, jadi ia dibungkus di sini alih-alih
 * memaksa setiap pemanggil mengingatnya.
 */
const titleLines = computed(() => [props.title])
</script>

<template>
  <UiPageHeader
    :title="titleLines"
    :back="{ label: chrome.back, href: chrome.backHref }"
  >
    <template #meta>
      <!-- Inter Medium 24/32 in `#AAAAAA`. A `<time>` because it is one — the
           machine-readable value is the ISO string the copy file stores. -->
      <!-- Dicetak hanya kalau tanggalnya ada: "Last updated" tanpa tanggal
           lebih buruk daripada tidak ada baris sama sekali. -->
      <time
        v-if="updatedAt"
        :datetime="updatedAt"
        class="font-sans text-[length:var(--text-body-sm)] leading-8 font-medium text-[#aaaaaa]"
      >
        {{ chrome.updatedLabel.replace("%s", formatShortDate(updatedAt)) }}
      </time>
    </template>
  </UiPageHeader>

  <UiSideTabLayout>
    <template #sidebar>
      <LegalContents
        :sections="sections"
        :title="chrome.contentsTitle"
        :label="chrome.contentsLabel"
      />
      <UiSupportCard />
    </template>

    <LegalBody :sections="sections" />
  </UiSideTabLayout>
</template>
