<script setup lang="ts">
import { CONTACT_COPY } from "~/content/contact"
import { socialLinks } from "~/utils/social"

/**
 * Where the federation is and how to reach it.
 *
 * **Everything printed here comes from the CMS since 2026-09-05** — `GET
 * /settings`, the same request the footer makes and the same one it is deduped
 * against. Each field falls back to the copy this page shipped with, so it
 * still renders whole with no API behind it.
 *
 * The address is the FULL one (`headquartersAddress`), not the footer's short
 * label: the backoffice draws them as two different fields, one an input and
 * one a textarea, described as "shown in the global footer" and "used on
 * detailed contact/about content". This is the detailed content.
 *
 * The social marks are the same list the footer renders, through the same
 * `socialLinks` — `content/footer.ts` sits at the root of `content/` because it
 * belongs to a layout component rather than to a page, so reading it here is
 * not the cross-page dependency D32 forbids. Their `href`s are real now
 * wherever the federation has named an account.
 *
 * **The two email addresses have become one, and that is the point.** The
 * design gave a malformed one in the footer (`56:4977`) and a well-formed one
 * in the terms (`174:11543`), and `content/federation.ts` recorded that merging
 * them was the designer's call to make. It is not any more: the backoffice has a
 * single Primary Email, so whoever fills it in decides — which is a better
 * answer than either file could have held.
 */
const settings = useSiteSettings()

/**
 * The full postal address, as lines.
 *
 * Split on newlines because the backoffice field is a TEXTAREA — a postal
 * address is one of the few places a line break carries meaning, and the screen
 * that captures it lets one be typed. Figma breaks its own into two for the
 * same reason.
 */
const addressLines = computed<readonly string[]>(() => {
  const fromCms = settings.value.headquartersAddress?.trim()

  return fromCms ? fromCms.split(/\r?\n/) : CONTACT_COPY.address
})

const email = computed(() => settings.value.primaryEmail ?? CONTACT_COPY.email)

const socials = computed(() => socialLinks(settings.value))
</script>

<template>
  <section aria-labelledby="details-heading" class="flex flex-col gap-8">
    <h2
      id="details-heading"
      class="font-display w-fit text-gold-gradient text-[length:var(--text-display-sm)] leading-[0.95] uppercase"
    >
      {{ CONTACT_COPY.detailsHeading }}
    </h2>

    <dl class="flex flex-col gap-8">
      <div class="flex flex-col gap-3">
        <dt
          class="font-sans text-label-muted text-[length:var(--text-eyebrow)] leading-7 font-medium"
        >
          {{ CONTACT_COPY.addressLabel }}
        </dt>
        <!-- The address is two lines because Figma breaks it, and a postal
             address is one of the few places a line break carries meaning. -->
        <dd class="font-sans text-[length:var(--text-body-sm)] leading-8 text-white">
          <span v-for="line in addressLines" :key="line" class="block">{{ line }}</span>
        </dd>
      </div>

      <div class="flex flex-col gap-3">
        <dt
          class="font-sans text-label-muted text-[length:var(--text-eyebrow)] leading-7 font-medium"
        >
          {{ CONTACT_COPY.emailLabel }}
        </dt>
        <dd class="font-sans text-[length:var(--text-body-sm)] leading-8 text-white">
          <!-- A real `mailto:`, unlike the footer's. That address has no
               top-level domain and is printed as text because a mail link to
               somewhere that cannot receive mail is worse than none; this one is
               well formed, which is exactly the condition the footer's own note
               names for when its address becomes a link. -->
          <a
            :href="`mailto:${email}`"
            class="focus-visible:ring-gold underline decoration-from-font underline-offset-4 transition-colors hover:text-white/70 focus-visible:ring-2 focus-visible:outline-none"
          >{{ email }}</a>
        </dd>
      </div>

      <div class="flex flex-col gap-3">
        <dt
          class="font-sans text-label-muted text-[length:var(--text-eyebrow)] leading-7 font-medium"
        >
          {{ CONTACT_COPY.socialHeading }}
        </dt>
        <dd>
          <ul class="flex flex-wrap items-center gap-4">
            <li v-for="social in socials" :key="social.id">
              <a
                :href="social.href"
                :aria-label="social.label"
                class="focus-visible:ring-gold flex size-12 items-center justify-center rounded-[var(--radius-btn)] bg-white/10 transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:outline-none"
              >
                <!-- A 24px inline SVG sized in CSS. Drawn in white already. -->
                <img
                  :src="social.iconUrl"
                  alt=""
                  width="24"
                  height="24"
                  class="size-6"
                >
              </a>
            </li>
          </ul>
        </dd>
      </div>
    </dl>
  </section>
</template>
