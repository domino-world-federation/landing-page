// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt({
  rules: {
    /**
     * Off, and not as a convenience.
     *
     * The rule exists for the Options API, where an absent prop and a prop
     * passed `undefined` are indistinguishable and a missing default is a real
     * ambiguity. Every prop in this project is declared through TypeScript, so
     * `blurFrom?: string` already says that absent is a legal state — and for
     * most of them it is the meaningful one: `Reveal` with no `blurFrom` renders
     * one copy of its children instead of two, and `SofteningImage` with no
     * `quality` lets the image module pick. Writing `default: undefined` beside
     * each would restate the type signature in a second place and change
     * nothing at runtime.
     */
    "vue/require-default-prop": "off",
  },
})
