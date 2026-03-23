const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const IGNORE_DIRS = new Set(["node_modules", ".git", ".next"]);

function cleanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        cleanDir(fullPath);
      }
      continue;
    }

    if (entry.isFile() && entry.name.startsWith("._")) {
      try {
        fs.unlinkSync(fullPath);
      } catch (error) {
        // Ignore files we cannot remove; they can be cleaned manually.
      }
    }
  }
}

cleanDir(ROOT);
