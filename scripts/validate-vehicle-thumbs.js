#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

const ROOT = path.join(__dirname, '..');
const VEHICLES_DIR = path.join(ROOT, 'public', 'images', 'vehicles');
const DATA_VEHICLES_TS = path.join(ROOT, 'data', 'vehicles.ts');

async function readJson(file) {
  const txt = await fs.readFile(file, 'utf8');
  return JSON.parse(txt);
}

async function writeJson(file, obj) {
  const txt = JSON.stringify(obj, null, 2) + '\\n';
  await fs.writeFile(file, txt, 'utf8');
}

async function findVehicleFolders() {
  const categories = await fs.readdir(VEHICLES_DIR, { withFileTypes: true });
  const out = [];
  for (const c of categories.filter(d => d.isDirectory())) {
    const catName = c.name;
    const catPath = path.join(VEHICLES_DIR, catName);
    const vehicles = await fs.readdir(catPath, { withFileTypes: true });
    for (const v of vehicles.filter(d => d.isDirectory())) {
      out.push({
        category: catName,
        folder: v.name,
        folderPath: path.join(catPath, v.name),
      });
    }
  }
  return out;
}

function makeCanonicalThumbPath(category, folder, thumbFile) {
  return `/images/vehicles/${category}/${folder}/${thumbFile}`;
}

async function updateVehiclesTs(updates) {
  let content = await fs.readFile(DATA_VEHICLES_TS, 'utf8');
  let changed = 0;

  for (const u of updates) {
    const { slug, category, folder, thumbnailPath } = u;

    // Try to replace existing thumbnail: "..."
    const thumbRegex = new RegExp(`(slug:\\s*\"${slug}\"[\\s\\S]*?thumbnail:\\s*\")([^\"]*)(\")`, 'm');
    if (thumbRegex.test(content)) {
      content = content.replace(thumbRegex, `$1${thumbnailPath}$3`);
      changed++;
      continue;
    }

    // If no thumbnail field exists in that object, try to insert after slug line
    const slugIndex = content.indexOf(`slug: \"${slug}\"`);
    if (slugIndex !== -1) {
      const lineEnd = content.indexOf('\\n', slugIndex);
      const insertAt = lineEnd + 1;
      const insertion = `    thumbnail: \"${thumbnailPath}\",\\n`;
      content = content.slice(0, insertAt) + insertion + content.slice(insertAt);
      changed++;
      continue;
    }

    console.warn(`Could not locate vehicle entry for slug="${slug}" in data/vehicles.ts`);
  }

  if (changed > 0) {
    await fs.writeFile(DATA_VEHICLES_TS, content, 'utf8');
  }

  return changed;
}

async function main() {
  const folders = await findVehicleFolders();
  const vehiclesTsUpdates = [];
  let fixedGalleryCount = 0;

  for (const f of folders) {
    const dataJsonPath = path.join(f.folderPath, 'data.json');
    try {
      const stat = await fs.stat(dataJsonPath);
      if (!stat.isFile()) continue;
    } catch (e) {
      // no data.json — skip
      continue;
    }

    const data = await readJson(dataJsonPath);
    const thumbnail = data.thumbnail;
    const slug = data.slug || f.folder;
    let gallery = Array.isArray(data.gallery) ? data.gallery : [];
    let modified = false;

    if (thumbnail) {
      // Remove any gallery items that exactly match the thumbnail filename
      const before = gallery.length;
      gallery = gallery.filter((g) => g !== thumbnail);
      if (gallery.length !== before) {
        data.gallery = gallery;
        await writeJson(dataJsonPath, data);
        fixedGalleryCount++;
        modified = true;
        console.log(`Removed thumbnail "${thumbnail}" from gallery in ${dataJsonPath}`);
      }

      // Prepare update for data/vehicles.ts
      const canonical = makeCanonicalThumbPath(f.category, f.folder, thumbnail);
      vehiclesTsUpdates.push({
        slug,
        category: f.category,
        folder: f.folder,
        thumbnailPath: canonical,
        modified,
      });
    }
  }

  const changedCount = await updateVehiclesTs(vehiclesTsUpdates);

  console.log('\\nSummary:');
  console.log(`  vehicle folders scanned: ${folders.length}`);
  console.log(`  galleries fixed (thumbnail removed): ${fixedGalleryCount}`);
  console.log(`  data/vehicles.ts entries updated: ${changedCount}`);

  if (fixedGalleryCount === 0 && changedCount === 0) {
    console.log('No changes necessary. Everything looks good.');
  }
}

main().catch((err) => {
  console.error('Error running validation script:', err);
  process.exit(1);
});

