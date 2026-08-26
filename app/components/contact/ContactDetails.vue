<script setup lang="ts">
import { CONTACT_COPY } from "~/content/contact"
import { FOOTER_SOCIALS } from "~/content/footer"

/**
 * Where the federation is and how to reach it.
 *
 * Everything printed here is drawn from somewhere real: the postal address from
 * `content/federation.ts` (the footer's, promoted when this page became its
 * second reader), and the address from the terms' closing clause. The headings
 * around them are extrapolated — see the copy file and R14.
 *
 * The social marks are the footer's own list, imported rather than re-declared:
 * `content/footer.ts` sits at the root of `content/` because it belongs to a
 * layout component rather than to a page, so reading it here is not the
 * cross-page dependency D32 forbids. Their `href`s are still `#` — the
 * federation's accounts are not known — and they keep their `aria-label`s for
 * the same reason the footer gives: a social icon with nothing behind it says
 * nothing, so the name has to be spoken.
 */
</script>

<template>
  <section aria-labelledby="details-heading" class="flex flex-col gap-8">
    <h2
      id="details-heading"
      class="font-display w-fit bg-[image:var(--gradient-gold-text)] bg-clip-text text-[length:var(--text-display-sm)] leading-[0.95] text-transparent uppercase"
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
          <span
            v-for="line in CONTACT_COPY.address"
            :key="line"
            class="block"
          >{{ line }}</span>
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
            :href="`mailto:${CONTACT_COPY.email}`"
            class="focus-visible:ring-gold underline decoration-from-font underline-offset-4 transition-colors hover:text-white/70 focus-visible:ring-2 focus-visible:outline-none"
          >{{ CONTACT_COPY.email }}</a>
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
            <li v-for="social in FOOTER_SOCIALS" :key="social.id">
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
