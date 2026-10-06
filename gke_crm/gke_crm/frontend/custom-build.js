import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { execSync } from "child_process"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/*
 * This file lives at:
 *   apps/gke_crm/gke_crm/gke_crm/frontend/custom-build.js
 * so ../../../../.. is the bench directory.
 *
 * It is run by `bench build` through the root package.json of gke_crm:
 *   "build": "node gke_crm/gke_crm/frontend/custom-build.js"
 */

const BENCH = path.resolve(__dirname, "../../../../..")
const CRM_APP = path.join(BENCH, "apps/crm")
const CRM_FRONTEND = path.join(CRM_APP, "frontend")
const CUSTOM_FRONTEND = __dirname

/*
 * The staging copy is created INSIDE apps/crm, next to the real frontend.
 *
 * CRM's vite/tailwind config and package.json use paths relative to the
 * frontend folder (../crm/public/frontend, ../crm/www, ../../frappe/ui/src,
 * ../../whatsapp/ui/src). A sibling folder sits at the same depth, so every
 * one of those paths resolves exactly as it does for the standard build.
 */
const BUILD_DIR = path.join(CRM_APP, ".gke_crm_build")

const CRM_INDEX = path.join(CRM_APP, "crm/public/frontend/index.html")

const SKIP = new Set(["node_modules", "dist", ".vite", "coverage"])

function copyRecursive(source, destination) {
  fs.mkdirSync(destination, { recursive: true })

  for (const item of fs.readdirSync(source, { withFileTypes: true })) {
    if (SKIP.has(item.name)) continue

    const src = path.join(source, item.name)
    const dest = path.join(destination, item.name)

    if (item.isDirectory()) {
      copyRecursive(src, dest)
    } else {
      fs.copyFileSync(src, dest)
    }
  }
}

function copyOverride(relativeSource, relativeTarget) {
  const source = path.join(CUSTOM_FRONTEND, relativeSource)
  const target = path.join(BUILD_DIR, relativeTarget)

  if (!fs.existsSync(source)) {
    throw new Error(`Custom file not found: ${source}`)
  }

  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(source, target)
  console.log(`   + ${relativeTarget}`)
}

function removeBuildDir() {
  fs.rmSync(BUILD_DIR, { recursive: true, force: true })
}

console.log("")
console.log("======================================")
console.log(" CRM CUSTOM FRONTEND BUILD")
console.log("======================================")
console.log("Bench:           " + BENCH)
console.log("CRM frontend:    " + CRM_FRONTEND)
console.log("Custom frontend: " + CUSTOM_FRONTEND)
console.log("Build directory: " + BUILD_DIR)
console.log("")

if (!fs.existsSync(path.join(CRM_FRONTEND, "package.json"))) {
  throw new Error(
    `CRM frontend not found at ${CRM_FRONTEND}. ` +
      "The crm app must be installed on the bench before gke_crm."
  )
}

try {
  console.log("1. Copying standard CRM frontend...")
  removeBuildDir()
  copyRecursive(CRM_FRONTEND, BUILD_DIR)

  console.log("2. Applying custom pages...")
  const customPages = path.join(CUSTOM_FRONTEND, "src/pages")
  if (fs.existsSync(customPages)) {
    for (const file of fs.readdirSync(customPages)) {
      if (file.endsWith(".vue")) {
        copyOverride(`src/pages/${file}`, `src/pages/${file}`)
      }
    }
  }

  console.log("3. Applying router and sidebar overrides...")
  copyOverride("src_override/router.js", "src/router.js")
  copyOverride(
    "src_override/components/Layouts/AppSidebar.vue",
    "src/components/Layouts/AppSidebar.vue"
  )

  console.log("4. Preparing node_modules...")
  const crmNodeModules = path.join(CRM_FRONTEND, "node_modules")
  if (fs.existsSync(crmNodeModules)) {
    fs.symlinkSync(
      crmNodeModules,
      path.join(BUILD_DIR, "node_modules"),
      "dir"
    )
    console.log("   Linked CRM node_modules.")
  } else {
    console.log("   CRM node_modules not found, running yarn install...")
    execSync("yarn install", { cwd: BUILD_DIR, stdio: "inherit" })
  }

  console.log("5. Building custom CRM frontend...")
  execSync("yarn build", { cwd: BUILD_DIR, stdio: "inherit" })

  if (!fs.existsSync(CRM_INDEX)) {
    throw new Error(`CRM frontend index.html was not generated: ${CRM_INDEX}`)
  }
} finally {
  // Never leave the staging copy inside the crm app.
  removeBuildDir()
}

console.log("")
console.log("======================================")
console.log(" CRM CUSTOM BUILD SUCCESSFUL")
console.log("======================================")
console.log("")
