# DWF Website — Nuxt

A Nuxt 4 port of the Next 16 build that preceded it. The same thirteen routes,
the same copy, the same assets, the same design decisions.

That project's folder is gone from the repo; it is archived at
`../landing-page-next.zip`, and its git history lives at
`git@github.com:domino-world-federation/landing-page.git` on `main`.

Product and technical rules moved here with it, byte-identical:
[`docs/`](docs/) — PRD, RULES, DESIGN-TOKENS, PROGRESS. **Several RULES clauses
were written for Next and no longer hold as written** — §5 (Server Components),
§7 (`next/image`), §11 (`motion/react`), §13 (`bun --bun next`). What replaces
them is the table below. The documents are deliberately left unrewritten: they
are the project's record, and this file is the delta.

## Running it

```bash
bun install
bun run dev        # http://localhost:3000
bun run build      # then: node .output/server/index.mjs
bun run typecheck  # vue-tsc, via nuxt typecheck
bun run lint       # eslint (@nuxt/eslint)
```

Bun always — never npm/yarn/pnpm. Commit `bun.lock`.

## Layout

Nuxt 4 uses `app/` as its srcDir, so every directory the framework owns lives
inside it. `public/` and `deploy/` stay at the root.

```
app/
  app.vue              NuxtLayout > NuxtPage
  assets/css/main.css  @theme tokens — a straight move from globals.css
  components/          auto-imported
    motion/            motion primitives (ParallaxLayer, Reveal, …)
    layout/            Navbar, Footer and their pieces
    ui/                primitives used across pages
    home/ about/ …     sections belonging to one page
  composables/         useEntrance, useDragToPan
  content/             static copy (i18n groundwork)
  layouts/             default.vue, home.vue
  lib/api/             data contract, client, mock
  pages/               13 routes
  plugins/             route-progress.client.ts
  router.options.ts    scroll behaviour
  types/               shared types + PageMeta augmentation
  utils/               auto-imported: cn, dates, motion constants, imageSizes
public/assets/         110 files, copied verbatim
docs/                  PRD, PROGRESS, RULES, DESIGN-TOKENS — moved here intact
deploy/nginx/          nginx config
ecosystem.config.cjs   PM2 process definition
CLAUDE.md              the short version, for whoever opens this next
```

**Component names are the folder plus the file**, and Nuxt drops a repeated
segment: `about/Header.vue` and `contact/ContactDetails.vue` register as
`AboutHeader` and `ContactDetails` — the second is *not* `ContactContactDetails`.
Both spellings therefore land on the name the Next build used. Files here are
written without the prefix (`about/Header.vue`) purely for consistency; it is a
cosmetic choice, not a requirement.

## What changed, and why

| Next | Nuxt | Why |
|---|---|---|
| Server / Client Component | plain SFC | Nuxt renders everything on the server and hydrates it; there is no boundary to mark. The component split is kept anyway — it is still a correct split of responsibilities. |
| `async` Server Component | `useAsyncData` | Runs the fetch during SSR and hands the result to the client in the payload, so the browser never asks again. |
| `searchParams` | `useRoute().query` | The filter stays in the URL, stays server-rendered, and stays something you can send as a link (D50). |
| `metadata` | `useSeoMeta` | |
| page shell rewritten per route | `layouts/default.vue` + `home.vue` | Navbar and footer in one place. |
| `next/image` | `<NuxtImg>` | For raster only. SVGs use a plain `<img>` — the image pipeline would hand back the same bytes (RULES §7). |
| `next/font` | `@nuxt/fonts` | Self-hosts by family name, so the `--font-bebas`/`--font-inter` bridge that DESIGN-TOKENS §1 needed has nothing left to solve. |
| `motion/react` | `motion-v` | The official Vue port from the Motion org, on the same `framer-motion@13` core. `whileTap` is `whilePress`; `viewport` is `inViewOptions`. |
| `RouteProgress` + a per-link `onClick` | `plugins/route-progress.client.ts` | Nuxt has `page:start`/`page:finish` hooks; Next has none, which is why that bar had to be wired into every link by hand. |
| `scroll={false}` per link | `app/router.options.ts` | One rule for every filter strip, and it covers a filter changed with the back button too. |
| `process.env.NEXT_PUBLIC_API_BASE_URL` | `runtimeConfig.public.apiBaseUrl` | Read at runtime instead of inlined at build. Override with `NUXT_PUBLIC_API_BASE_URL`. |
| `next: { revalidate: 300 }` | — | Nuxt has no per-request equivalent, and should not: caching belongs to Nitro. When the API lands, the five minutes become `routeRules` in `nuxt.config`. |
| `app/loading.tsx` | none | **Not an omission.** That screen exists because Next blanks the old page while it waits for a new segment. Nuxt holds the old page and raises an indicator instead, so there is no empty moment to fill. The sweeping bar is identical. |

### `sizes` — different syntax, and one trap

`sizes` in `@nuxt/image` is not a media-query string the way `next/image`'s is.
A key names the **viewport width the candidate is computed at**, and each key
emits one `srcset` entry.

A bare `sizes="100vw"` is parsed as the key `1px`, producing a `srcset` of
**1w and 2w** — a full-bleed hero served as a two-pixel image. It builds, it
typechecks, and it looks like a broken asset. Found by rendering the page and
reading the markup.

So no `sizes` is written by hand. They all go through
`imageSizes({ xs: "60vw", lg: "28vw" })` in
[`app/utils/image-sizes.ts`](app/utils/image-sizes.ts), which expands the spec
across the whole breakpoint ladder. The media queries still collapse to the
boundaries asked for, and the `srcset` gains a candidate at every width the site
is actually viewed at.

### `noUncheckedIndexedAccess`

On by default in Nuxt 4; the Next tsconfig did not have it. Kept — it is
stricter and it is the framework's convention. Literal indexes into `as const`
arrays are asserted with `!` in the three FAQ copy files.

## Deploy

Same shape as the Next project — PM2 behind nginx — on its own port so the two
can run side by side while they are compared.

```bash
bun install --frozen-lockfile
bun run build                     # writes .output/, which is gitignored
pm2 start ecosystem.config.cjs
pm2 save                          # survives a reboot, with `pm2 startup`
```

Redeploy after a pull: `bun run build && pm2 reload dwf-nuxt`.

| | Next | Nuxt |
|---|---|---|
| Port | 3035 | **3036** |
| PM2 process name | `proto-dwf` | `dwf-nuxt` |
| Entry | `node_modules/next/dist/bin/next start` | `.output/server/index.mjs` |
| Host/port set by | `-H` / `-p` flags | **env `NITRO_HOST` / `NITRO_PORT`** |
| PM2 config file | `ecosystem.config.js` | **`ecosystem.config.cjs`** |

### Why `.cjs` and not `.js`

`package.json` here declares `"type": "module"`, so a file named
`ecosystem.config.js` is parsed as ESM. That does **not** throw, which is the
trap. Tested on Node 22.22: `require()` of this exact content named `.js`
succeeds and returns an object whose `apps` is **undefined** — the
`module.exports` assignment is dropped with no error anywhere. PM2 would then
start nothing, and complain in a way that points at the config's contents rather
than at its name.

The Next project uses a plain `.js` because its own package.json makes no `type`
declaration. Copying that filename across is the mistake the note in
[`ecosystem.config.cjs`](ecosystem.config.cjs) exists to prevent.

### nginx: yes, it needs its own config

Not just a different port.
[`deploy/nginx/dwf-nuxt.conf`](deploy/nginx/dwf-nuxt.conf) is an adaptation of
the Next one; most of it is unchanged, because most of it is about the **site**
rather than the framework — gzip, the `X-Robots-Tag` noindex (R11/R13/R16 apply
to this port word for word), the security headers, and the `/assets/` block.

Four things changed, all of them measured against a built server:

1. **Upstream 3036.** Two server blocks cannot claim one `server_name`; the
   `server_name` in that file is still a **placeholder** and has to be set.
2. **A new `/_ipx/` block.** @nuxt/image's transform endpoint has no counterpart
   in Next. It defaults to `cache-control: max-age=60` — one minute, after which
   sharp recomputes the resize. Raised to a day at the app layer
   (`runtimeConfig.ipx.maxAge`), with nginx caching in front of it. **It needs
   one `proxy_cache_path` line in `http{}`** — without it `nginx -t` fails with
   "zone dwf_ipx not found". The line is in the config file's comments.
3. **`proxy_buffering off` removed.** In the Next config it was there for one
   specific reason: Next streams the `loading.tsx` fallback ahead of a slow page,
   and a buffering proxy holds the whole response. Neither half applies here —
   this port has no `loading.tsx`, and Nitro does not stream (a rendered page
   comes back with a `Content-Length`, measured). With nothing to stream,
   buffering on is the better default: nginx takes the response at once and
   frees the Node process.
4. **`/_nuxt/` deliberately untouched.** Nitro already sends
   `max-age=31536000, immutable` for its own bundles, as `/_next/` did. The
   `/assets/` block stays because Nitro sends no cache header at all for
   `public/` — also measured.

## What is not done

### Carried over from the Next build — this port changed none of them

The authoritative text is PRD §risks. In short:

- **B2** — no API; every getter serves `mock/`.
- **R10** — 25 assets over 1 MB, deferred by the repo owner until after the
  presentation.
- **R11 / R13 / R16** — real, identifiable people used as this federation's
  officers, champions and news subjects. All three are marked **must be resolved
  before publication**, and the noindex header in the nginx config is there for
  exactly this reason.
- **R12** — the Rulebook block is built, but the two blocks that were
  extrapolated from the greyscale wireframe (regulations, FAQ) have still not
  been checked against the hi-fi that now exists.
- **R14** — `/contact` was built from one sentence; the design screen
  (`361:16242`) turned out to exist and the page has not been compared to it.
- **R15** — the FAQ pager is not built, waiting on copy for pages 2–3.

### Not verified in this port

- **Pixel parity against Figma.** Build, typecheck and lint are clean, all
  thirteen routes answer 200 with exactly one `<h1>`, and every section renders —
  but nothing has been compared to the design at 360/768/1440/1920 (RULES §15).
  This is the next step, and the largest remaining piece of work.
- **`nginx -t`** has not been run: nginx is not installed on the machine this was
  written on.

### Loose ends in the port itself

- `DominoRulebookCard` is registered but used nowhere. It is orphaned in the Next
  project too — the only mention there is a comment in `ResourceCard` — so this
  is inherited, not introduced. Delete it or wire it up; do not assume it is
  live.
- `content/loading.ts` is dead: `LOADING_COPY` has no reader now that
  `loading.tsx` has no counterpart. Kept in case a real pending state ever wants
  it.
- The 37 `TODO(copy)` / `TODO(design)` markers are all in `content/` and
  `lib/api/mock/`, inherited verbatim. None were added here.
