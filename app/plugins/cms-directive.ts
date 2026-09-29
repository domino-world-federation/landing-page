/**
 * `v-cms="'section.field'"` — marks an element as the page editor's target for
 * that field, so a click on it in the editor's preview opens the field.
 *
 * Renders nothing anywhere but the preview: the attribute is added on the
 * client, after mount, and only while `?cms-preview=` is in the URL. On the
 * server `getSSRProps` returns nothing, so the published page's markup is the
 * same with or without the directive — which is also why this plugin is
 * universal rather than `.client`: Vue has to resolve the directive during the
 * server render too.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const enabled = () =>
    import.meta.client && new URL(window.location.href).searchParams.has("cms-preview")

  const apply = (el: HTMLElement, key: unknown) => {
    if (enabled() && typeof key === "string") el.dataset.editKey = key
  }

  nuxtApp.vueApp.directive<HTMLElement, string>("cms", {
    mounted: (el, binding) => apply(el, binding.value),
    updated: (el, binding) => apply(el, binding.value),
    getSSRProps: () => ({}),
  })
})
