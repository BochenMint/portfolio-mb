#!/usr/bin/env node
/**
 * Generates 800px-wide `-sm.webp` variants for every face image referenced
 * by public/projects/<id>/faces.json, for use in the ProjectCube srcset.
 * Idempotent: skips a variant that already exists and is newer than its
 * source file.
 *
 * Usage: NODE_PATH=<repo>/node_modules node scripts/faces-optimize.mjs
 */
import { readFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const projectsDir = path.join(root, 'public', 'projects')

const SM_WIDTH = 800

function smPathFor(filePath) {
  const dir = path.dirname(filePath)
  const ext = path.extname(filePath)
  const base = path.basename(filePath, ext)
  return path.join(dir, `${base}-sm${ext}`)
}

async function needsBuild(src, dst) {
  if (!existsSync(dst)) return true
  const [srcStat, dstStat] = await Promise.all([stat(src), stat(dst)])
  return srcStat.mtimeMs > dstStat.mtimeMs
}

async function buildVariant(file) {
  const dst = smPathFor(file)
  if (!(await needsBuild(file, dst))) {
    console.log(`skip  ${path.relative(root, dst)} (up to date)`)
    return
  }
  await sharp(file).resize({ width: SM_WIDTH, withoutEnlargement: true }).webp({ quality: 82 }).toFile(dst)
  console.log(`build ${path.relative(root, dst)}`)
}

async function main() {
  const { readdir } = await import('node:fs/promises')
  const projectIds = (await readdir(projectsDir, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  const files = new Set()

  for (const id of projectIds) {
    const facesJsonPath = path.join(projectsDir, id, 'faces.json')
    if (!existsSync(facesJsonPath)) continue
    const faces = JSON.parse(await readFile(facesJsonPath, 'utf8'))
    for (const face of faces) {
      if (face.file && !face.file.endsWith('-sm.webp')) {
        files.add(path.join(projectsDir, id, face.file))
      }
      if (face.light && !face.light.endsWith('-sm.webp')) {
        files.add(path.join(projectsDir, id, face.light))
      }
    }
  }

  if (files.size === 0) {
    console.log('No faces.json files found — nothing to do.')
    return
  }

  for (const file of files) {
    if (!existsSync(file)) {
      console.warn(`warn  missing source image: ${path.relative(root, file)}`)
      continue
    }
    await buildVariant(file)
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
