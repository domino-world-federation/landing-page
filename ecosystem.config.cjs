/**
 * PM2 process definition for the Nuxt port of the DWF prototype.
 *
 * Deploy:
 *
 *   bun install --frozen-lockfile
 *   bun run build                   # writes .output/, which is gitignored
 *   pm2 start ecosystem.config.cjs
 *   pm2 save                        # survives a reboot, with `pm2 startup`
 *
 * Redeploy after a pull: `bun run build && pm2 reload dwf-nuxt`. Reload rather
 * than restart so the old process keeps serving until the new one is listening.
 *
 * **The extension is `.cjs`, and it has to be.** `package.json` here declares
 * `"type": "module"`, so a file called `ecosystem.config.js` is parsed as ESM.
 *
 * That does not crash, which is the trap. Tested on Node 22.22: `require()` of
 * this same content named `.js` returns successfully and hands back an object
 * with `apps` **undefined** — the `module.exports` assignment is simply dropped,
 * with no error anywhere. PM2 would then start nothing and say so in a way that
 * points at the config's contents rather than at its name.
 *
 * The Next project's config is a plain `.js` because its own package.json makes
 * no `type` declaration. Copying that filename across is the mistake this note
 * exists to prevent.
 *
 * **Bun installs and builds; Node runs.** Same division the Next config makes,
 * for a simpler reason: `nuxt build` is a Node CLI with its own shebang, so
 * `bun run build` uses Bun as the task runner and Node as the runtime either
 * way, and the built server is plain Node ESM. `bun install` stays the package
 * manager (CLAUDE.md).
 */

module.exports = {
  apps: [
    {
      name: "dwf-nuxt",

      // The Nitro build output, run by Node. Not `bun run preview`, and not a
      // package-manager wrapper of any kind: a wrapper puts a shell between PM2
      // and the server, so PM2 ends up supervising the shell and a crashed
      // server can go unnoticed.
      script: ".output/server/index.mjs",
      interpreter: "node",
      cwd: __dirname,

      // One process in fork mode. Cluster mode is available and Nitro supports
      // it, but this is a prototype serving mock data — the traffic does not
      // justify the memory, and one process is one set of logs to read when
      // something breaks.
      instances: 1,
      exec_mode: "fork",

      env: {
        NODE_ENV: "production",

        // **Env vars, not flags.** The Next config passes `-H`/`-p` to
        // `next start`; Nitro's server has no CLI at all and reads these two
        // (falling back to HOST/PORT). Verified against the built output.
        //
        // Loopback is the point: nothing should reach the Node server except
        // nginx, and Nitro's default `0.0.0.0` would leave the port open on the
        // host's public interface beside the proxy that is supposed to front
        // it.
        NITRO_HOST: "127.0.0.1",
        // 3036, one above the Next prototype's 3035, so the two can run side by
        // side on the same box while the port is being compared.
        NITRO_PORT: "3036",

        // **The API exists now** (blocker B2 closed 2026-09-03), so this is no
        // longer optional: `lib/api/client.ts` falls back to MOCK data when it
        // is unset, and mock data in production looks exactly like a working
        // site — the pages render, the content is just wrong. Nothing errors,
        // and nothing appears in the browser's Network tab either.
        //
        // Read at RUNTIME, unlike the Next build's `NEXT_PUBLIC_*`: changing it
        // here and restarting PM2 is enough, no rebuild.
        //
        // A boot-time warning in `server/plugins/warn-when-serving-mocks.ts`
        // says so in the PM2 log if this is ever missing again.
        NUXT_PUBLIC_API_BASE_URL: "https://fed-api.pborado.com/api/v1",

        // Origin situs ini sendiri — dipakai `<link rel="canonical">` dan URL
        // absolut di /sitemap.xml. Kosong berarti memakai origin permintaan,
        // yang salah begitu ada proxy yang tidak meneruskan host aslinya.
        NUXT_PUBLIC_SITE_URL: "https://fed-web.pborado.com",

        // Mesin pencari: DITUTUP sampai situsnya siap diumumkan. Tiap halaman
        // membawa `noindex` dan /robots.txt menolak semuanya.
        //
        // Ubah jadi "true" saat peluncuran — dan itu SATU-SATUNYA yang perlu
        // diubah; server mengingatkan di log setiap restart selama masih
        // tertutup.
        NUXT_PUBLIC_ALLOW_INDEXING: "false",
      },

      autorestart: true,
      // A tight crash loop means the build is broken, not that the next restart
      // will help. Ten tries with a rising delay, then PM2 stops and says so.
      max_restarts: 10,
      restart_delay: 2000,
      // Nitro's server sits well under this; crossing it means a leak — most
      // likely in sharp, which the `/_ipx/` endpoint keeps warm — and a restart
      // is a better answer than an OOM kill.
      max_memory_restart: "512M",

      // Logs go to ~/.pm2/logs/dwf-nuxt-{out,error}.log. Timestamped, because
      // the default lines carry none and a prototype's logs are read after the
      // fact.
      time: true,
      merge_logs: true,
    },
  ],
}
