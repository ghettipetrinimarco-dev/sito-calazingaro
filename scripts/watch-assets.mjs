#!/usr/bin/env node
import chokidar from "chokidar"
import { execSync } from "child_process"
import path from "path"

const ROOT = process.cwd()
const WATCH_DIR = path.join(ROOT, "public")

let debounceTimer = null

function syncAssets(filePath) {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const rel = path.relative(ROOT, filePath)
    console.log(`\n📁 Nuovo asset rilevato: ${rel}`)
    try {
      execSync("git add public/", { cwd: ROOT, stdio: "inherit" })
      const diff = execSync("git diff --cached --name-only", { cwd: ROOT }).toString().trim()
      if (!diff) {
        console.log("✓ Nessuna modifica da committare.")
        return
      }
      execSync(`git commit -m "assets: aggiornamento contenuti"`, { cwd: ROOT, stdio: "inherit" })
      execSync("git push origin HEAD", { cwd: ROOT, stdio: "inherit" })
      console.log("✅ Asset pushati su GitHub.")
    } catch (err) {
      console.error("❌ Errore durante il push:", err.message)
    }
  }, 3000) // aspetta 3s prima di fare il commit (per upload multipli)
}

console.log(`👀 Watching ${WATCH_DIR} per nuovi asset...`)
console.log("   Aggiungi foto/video in public/ — verranno pushati automaticamente su GitHub.\n")

chokidar
  .watch(WATCH_DIR, {
    ignoreInitial: true,
    ignored: /(^|[/\\])\../,
    persistent: true,
  })
  .on("add", syncAssets)
  .on("change", syncAssets)
