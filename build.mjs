import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));
const outDir = join(rootDir, "dist");

const deployEntries = [
  "index.html",
  "about.html",
  "academics.html",
  "art.html",
  "community.html",
  "contact.html",
  "downloads.html",
  "music.html",
  "resume.html",
  "main.js",
  "styles.css",
  "images"
];

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const entry of deployEntries) {
  const source = join(rootDir, entry);

  if (!existsSync(source)) {
    throw new Error(`Missing deploy asset: ${entry}`);
  }

  cpSync(source, join(outDir, entry), { recursive: true });
}

console.log(`Built static site into ${outDir}`);
