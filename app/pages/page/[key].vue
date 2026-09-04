<script setup lang="ts">
import { getLegalPage } from "~/lib/api/client"
import { LEGAL_PAGE_CHROME } from "~/content/legal"

/**
 * `/page/[key]` — dokumen hukum, satu rute untuk semuanya.
 *
 * Terms (`613:24310`) dan Privacy (`613:23545`) adalah layar yang sama dengan
 * klausa berbeda, dan Cookie Policy yang ketiga. Kuncinya menamai dokumennya;
 * tidak ada satu pun berkas di `pages/` yang berubah saat federasi menambah
 * dokumen keempat — ia cukup membuatnya di backoffice.
 *
 * **Klausanya datang dari API sekarang**, bukan dari `content/`. Naskah hukum
 * yang tinggal di repo berarti mengubah satu kalimat menuntut deploy, dan yang
 * mengubahnya bukan orang yang bisa men-deploy.
 *
 * **Kunci yang tidak dikenal 404, bukan dokumen kosong.** `createError` dengan
 * `fatal: true` merender halaman galat saat SSR dengan status yang benar, jadi
 * salah ketik atau tautan basi dilaporkan — bukan dijawab halaman kosong
 * berstatus 200 (D28, kali ini di sebuah rute).
 */
const route = useRoute()
const key = computed(() => String(route.params.key ?? ""))

const { data: page } = await useAsyncData(
  () => `legal-${key.value}`,
  () => getLegalPage(key.value),
  { watch: [key] },
)

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  })
}

/*
 * Judul dan deskripsi di sini LANTAI, bukan keputusan akhir: kalau federasi
 * mengisi barisnya di "SEO & Social", `useCmsSeo()` di `app.vue` menimpanya.
 * Yang ditulis di sini yang dipakai selama barisnya belum ada.
 */
useSeoMeta({
  title: () => `${page.value?.title} | Domino World Federation`,
})
</script>

<template>
  <main v-if="page">
    <LegalDocument
      :title="page.title"
      :updated-at="page.lastUpdatedAt"
      :sections="page.sections"
      :chrome="LEGAL_PAGE_CHROME"
    />
  </main>
</template>
