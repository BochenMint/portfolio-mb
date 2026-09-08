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
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
        },
      },
    },
  },
})
