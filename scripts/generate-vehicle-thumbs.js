#!/usr/bin/env node
/**
 * Scan public/images/vehicles and generate data/vehicle-thumbs.ts
 *
 * Usage: node scripts/generate-vehicle-thumbs.js
 */
const fs = require('fs')
const path = require('path')

const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'images', 'vehicles')
const OUT_FILE = path.join(__dirname, '..', 'data', 'vehicle-thumbs.ts')

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let files = []
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      files = files.concat(walk(full))
    } else {
      files.push(full)
    }
  }
  return files
}

function slugFromPath(dir, fullPath) {
  // dir = .../public/images/vehicles
  // fullPath = .../public/images/vehicles/<category>/<slug>/filename.ext
  const rel = path.relative(dir, fullPath)
  const parts = rel.split(path.sep)
  if (parts.length >= 2) {
    return parts[1] // slug
  }
  return null
}

function isThumbName(name) {
  const n = name.toLowerCase()
  return n === 'thumbnail.jpg' || n === 'thumbnail.png' || n === 'thumb.jpg' || n === 'thumb.png' || n.includes('thumb') || n.toLowerCase().includes('thumbnail')
}

function main() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error('No vehicles public directory found at', PUBLIC_DIR)
    process.exit(0)
  }

  const files = walk(PUBLIC_DIR)
  const map = {}
  for (const f of files) {
    const name = path.basename(f)
    const slug = slugFromPath(PUBLIC_DIR, f)
    if (!slug) continue
    if (isThumbName(name)) {
      const webPath = `/images/vehicles/${path.relative(PUBLIC_DIR, path.dirname(f)).split(path.sep).join('/')}/${name}`
      map[slug] = webPath
    } else {
      // if no explicit thumbnail matched yet, record first image as fallback
      if (!map[slug]) {
        const webPath = `/images/vehicles/${path.relative(PUBLIC_DIR, path.dirname(f)).split(path.sep).join('/')}/${name}`
        map[slug] = webPath
      }
    }
  }

  const content = `// GENERATED FILE — do not edit by hand. Run scripts/generate-vehicle-thumbs.js\nexport const VEHICLE_THUMBNAILS = ${JSON.stringify(map, null, 2)} as Record<string,string>\n`
  fs.writeFileSync(OUT_FILE, content)
  console.log('Wrote', OUT_FILE)
}

main()

