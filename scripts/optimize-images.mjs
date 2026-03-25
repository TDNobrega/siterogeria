/**
 * Image optimization script — run once after adding new assets.
 * Usage: node scripts/optimize-images.mjs
 */
import sharp from 'sharp'
import { existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ASSETS = join(__dirname, '..', 'public', 'assets')

const jobs = [
  // Logo — keep PNG transparency, resize to max 600px wide
  {
    input: join(ASSETS, 'logo.png'),
    output: join(ASSETS, 'logo.png'),
    options: { width: 600, withoutEnlargement: true },
    format: 'png',
    formatOptions: { compressionLevel: 9, effort: 10 },
  },
  // Logo icon
  {
    input: join(ASSETS, 'logo-icon.png'),
    output: join(ASSETS, 'logo-icon.png'),
    options: { width: 120, withoutEnlargement: true },
    format: 'png',
    formatOptions: { compressionLevel: 9, effort: 10 },
  },
  // Hero banner — 1920px wide, WebP + JPEG fallback
  {
    input: join(ASSETS, 'banner.jpg'),
    output: join(ASSETS, 'banner.webp'),
    options: { width: 1920, withoutEnlargement: true },
    format: 'webp',
    formatOptions: { quality: 82, effort: 6 },
  },
  {
    input: join(ASSETS, 'banner.jpg'),
    output: join(ASSETS, 'banner.jpg'),
    options: { width: 1920, withoutEnlargement: true },
    format: 'jpeg',
    formatOptions: { quality: 85, mozjpeg: true },
  },
  // Office photos — 1200px wide, WebP + JPEG
  ...['office-1', 'office-2'].flatMap((name) => [
    {
      input: join(ASSETS, `${name}.jpg`),
      output: join(ASSETS, `${name}.webp`),
      options: { width: 1200, withoutEnlargement: true },
      format: 'webp',
      formatOptions: { quality: 82, effort: 6 },
    },
    {
      input: join(ASSETS, `${name}.jpg`),
      output: join(ASSETS, `${name}.jpg`),
      options: { width: 1200, withoutEnlargement: true },
      format: 'jpeg',
      formatOptions: { quality: 85, mozjpeg: true },
    },
  ]),
]

let saved = 0
for (const job of jobs) {
  if (!existsSync(job.input)) {
    console.log(`⚠  Skipped (not found): ${job.input}`)
    continue
  }
  try {
    const { size: before } = await import('fs').then(m => m.promises.stat(job.input))
    await sharp(job.input)
      .resize(job.options)
      [job.format](job.formatOptions)
      .toFile(job.output + '.tmp')

    const { size: after } = await import('fs').then(m => m.promises.stat(job.output + '.tmp'))
    await import('fs').then(m => m.promises.rename(job.output + '.tmp', job.output))

    const diff = Math.round((1 - after / before) * 100)
    saved += before - after
    console.log(`✓ ${job.output.split('/assets/')[1].padEnd(20)} ${kb(before)} → ${kb(after)}  (${diff > 0 ? '-' : '+'}${Math.abs(diff)}%)`)
  } catch (e) {
    console.error(`✗ ${job.input}: ${e.message}`)
  }
}

console.log(`\nTotal saved: ${kb(saved)}`)

function kb(bytes) {
  return `${Math.round(bytes / 1024)}KB`.padStart(7)
}
