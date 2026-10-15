# rileigh personal site yahooo

nextjs + ts + prisma postgresql

## Last.fm listening status

The shared navigation shows headphones with music notes while Rileigh is listening.
Hover or focus the icon to preview the title and artist; click to open the track on
Last.fm. When idle, the icon links to Rileigh's Last.fm profile.

Create a [Last.fm API key](https://www.last.fm/api/account/create) and set
`LASTFM_API_KEY` in `.env.local` for local development and in the deployment's
environment variables (including the testing/preview environment). Restart the
development server or redeploy after adding it. Keep the key server-side; do not
use a `NEXT_PUBLIC_` prefix or commit it.

The browser refreshes every 30 seconds, and the server caches Last.fm responses
for 30 seconds. Missing keys, API errors, and timeouts use the idle profile link.

Run `node --test tests/lastfm.test.mjs` with Node.js 22.18+ to check Last.fm response handling.
