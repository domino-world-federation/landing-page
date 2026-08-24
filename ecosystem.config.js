/**
 * PM2 process definition for the DWF prototype at proto-dwf.moonthesky.com.
 *
 * Deploy:
 *
 *   bun install --frozen-lockfile
 *   bunx next build                 # NOT `bun run build` — see below
 *   pm2 start ecosystem.config.js
 *   pm2 save                        # survives a reboot, with `pm2 startup`
 *
 * Redeploy after a pull: `bunx next build && pm2 reload proto-dwf`. Reload
 * rather than restart so the old process keeps serving until the new one is
 * listening.
 *
 * **Bun installs and builds; Node runs.** `bun --bun next build` fails on Bun's
 * runtime ("Expected CommonJS module to have a function wrapper", PRD R6/D9),
 * so the build is `bunx next build` — Bun as the launcher, Node as the runtime
 * — and the server here is started by Node for the same reason. `bun install`
 * is unaffected and stays the package manager (CLAUDE.md).
 */

module.exports = {
  apps: [
    {
      name: "proto-dwf",

      // The Next binary directly, run by Node. Not `bun run start`, and not
      // `npm start`: a package-manager wrapper puts a shell between PM2 and the
      // server, so PM2 ends up supervising the wrapper and a crashed Next can
      // go unnoticed.
      script: "node_modules/next/dist/bin/next",
      // Host and port as flags rather than as env vars: `next start` takes
      // `-H`/`-p` directly, and a flag cannot be quietly ignored the way an
      // env var the runtime does not read would be.
      args: "start -H 127.0.0.1 -p 3035",
      interpreter: "node",
      cwd: __dirname,

      // One process in fork mode. Cluster mode is available (`exec_mode:
      // "cluster"`, `instances: "max"`) and Next supports it, but this is a
      // prototype serving mock data — the traffic does not justify the memory,
      // and one process is one set of logs to read when something breaks.
      instances: 1,
      exec_mode: "fork",

      env: {
        NODE_ENV: "production",

        // The host and port are in `args` above. Loopback is the point:
        // nothing should reach the Node server except nginx, and the default
        // 0.0.0.0 would leave port 3035 open on the host's public interface
        // beside the proxy that is supposed to front it.

        // NEXT_PUBLIC_API_BASE_URL is deliberately absent: `lib/api/client.ts`
        // falls back to mock data when it is unset (blocker B2), which is what
        // this prototype serves. Setting it here would not be enough anyway —
        // `NEXT_PUBLIC_*` is inlined at build time, so it has to be present for
        // `bunx next build`, not just for the process.
      },

      autorestart: true,
      // A tight crash loop means the build is broken, not that the next restart
      // will help. Ten tries with a rising delay, then PM2 stops and says so.
      max_restarts: 10,
      restart_delay: 2000,
      // Next's server sits well under this; crossing it means a leak, and a
      // restart is a better answer than an OOM kill.
      max_memory_restart: "512M",

      // Logs go to ~/.pm2/logs/proto-dwf-{out,error}.log. Timestamped, because
      // the default lines carry none and a prototype's logs are read after the
      // fact.
      time: true,
      merge_logs: true,
    },
  ],
}
