import { defineConfig, type Plugin, type PreviewServer, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Map locale homepages and journal directories onto index.html in dev/preview. */
function localeHtmlPlugin(): Plugin {
  const journalPrefixes = ['/artykuly', '/en/articles', '/ua/statti'] as const

  const rewrite = (url: string | undefined) => {
    if (!url) return url
    const qIndex = url.indexOf('?')
    const path = qIndex === -1 ? url : url.slice(0, qIndex)
    const q = qIndex === -1 ? '' : url.slice(qIndex)
    if (path === '/en' || path === '/en/') return `/en/index.html${q}`
    if (path === '/ua' || path === '/ua/') return `/ua/index.html${q}`
    if (path === '/krajobraz' || path === '/krajobraz/') return `/krajobraz.html${q}`
    const archive = path.match(/^\/(en|ua)\/(v[1-6]\.html)$/)
    if (archive) return `/${archive[2]}${q}`
    for (const prefix of journalPrefixes) {
      if (path === prefix || path === `${prefix}/`) return `${prefix}/index.html${q}`
      if (path.startsWith(`${prefix}/`) && !path.endsWith('.html')) {
        const rest = path.slice(prefix.length + 1).replace(/\/$/, '')
        if (rest && !rest.includes('/')) return `${prefix}/${rest}/index.html${q}`
      }
    }
    return url
  }

  const attach = (server: ViteDevServer | PreviewServer) => {
    server.middlewares.use((req, res, next) => {
      const raw = req.url || ''
      const qIndex = raw.indexOf('?')
      const pathOnly = qIndex === -1 ? raw : raw.slice(0, qIndex)
      const q = qIndex === -1 ? '' : raw.slice(qIndex)
      if (pathOnly === '/uk' || pathOnly === '/uk/') {
        res.statusCode = 301
        res.setHeader('Location', `/ua/${q}`)
        res.end()
        return
      }
      if (pathOnly === '/uk/statti' || pathOnly === '/uk/statti/' || pathOnly.startsWith('/uk/statti/')) {
        res.statusCode = 301
        res.setHeader('Location', `/ua${pathOnly.slice('/uk'.length)}${q}`)
        res.end()
        return
      }
      if (pathOnly === '/mb-ai-uk.html') {
        res.statusCode = 301
        res.setHeader('Location', `/mb-ai-ua.html${q}`)
        res.end()
        return
      }
      const nextUrl = rewrite(req.url)
      if (nextUrl && nextUrl !== req.url) req.url = nextUrl
      next()
    })
  }

  return {
    name: 'locale-html-routes',
    configureServer: attach,
    configurePreviewServer: attach,
  }
}

// `npm run build` runs `node scripts/generate-articles.mjs` before `tsc -b && vite build`
// (see the "build" script in package.json) — articles must exist before Vite bundles them.
export default defineConfig({
  appType: 'mpa',
  plugins: [react(), tailwindcss(), localeHtmlPlugin()],
  server: {
    port: 5190,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        studio: 'studio.html',
        studioEn: 'studio-en.html',
        studioUa: 'studio-ua.html',
        lab: 'lab.html',
        en: 'en/index.html',
        ua: 'ua/index.html',
        v1: 'v1.html',
        v2: 'v2.html',
        v3: 'v3.html',
        v4: 'v4.html',
        gra: 'gra.html',
        mbAi: 'mb-ai.html',
        mbAiEn: 'mb-ai-en.html',
        mbAiUa: 'mb-ai-ua.html',
        notFound: '404.html',
        v5: 'v5.html',
        v6: 'v6.html',
        krajobraz: 'krajobraz.html',
      },
      output: {
        // Tripwire: a stray import of these packages should land in its own
        // named chunk, not silently inflate `main`/`vendor`. No rapier/cannon/ammo
        // physics engine is used anywhere in this repo (v4's flight physics is
        // hand-rolled in src/v4/ship, not a package) — nothing to chunk for that yet.
        //
        // @splinetool/react-spline is deliberately NOT chunked here: it is only
        // ever reached through the lazy `import()` in SplineEmbed.tsx, and giving
        // it a manualChunks entry forced Rollup to resolve that chunk eagerly on
        // every entry that imports SplineEmbed — shipping a ~1.45 MB chunk on 9
        // pages even though every VITE_SPLINE_*_URL is unset in this build and the
        // feature never renders. Leaving it unlisted lets it fall back to a real
        // on-demand chunk, fetched only when a scene URL is actually configured.
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
        },
      },
    },
  },
})
