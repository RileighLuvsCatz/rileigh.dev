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

The browser refreshes every 30 seconds, and the server requests fresh Last.fm data
without caching. Missing keys, API errors, and timeouts keep the profile link but
show "listening status unavailable" instead of claiming Rileigh is idle.

To troubleshoot, open `/api/now-playing` on the preview deployment while signed
into Vercel. A genuine idle response is `{"listening":false}`. Unavailable responses
include a safe `reason`: `missing_api_key`, `lastfm_api_error` (with a numeric
`lastfmErrorCode`), `http_error` (with `upstreamStatus`), `invalid_response`, `timeout`,
or `request_failed`. The response never includes the API key or upstream error text.

Run `node --test tests/*.test.mjs` with Node.js 22.18+ to check Last.fm response handling and endpoint failures.
