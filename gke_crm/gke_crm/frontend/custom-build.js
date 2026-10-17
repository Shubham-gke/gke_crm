// import fs from "fs"
// import path from "path"
// import { fileURLToPath } from "url"
// import { execSync } from "child_process"

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// /*
//  * This file lives at:
//  *   apps/gke_crm/gke_crm/gke_crm/frontend/custom-build.js
//  * so ../../../../.. is the bench directory.
//  *
//  * It is run by `bench build` through the root package.json of gke_crm:
//  *   "build": "node gke_crm/gke_crm/frontend/custom-build.js"
//  */

// const BENCH = path.resolve(__dirname, "../../../../..")
// const CRM_APP = path.join(BENCH, "apps/crm")
// const CRM_FRONTEND = path.join(CRM_APP, "frontend")
// const CUSTOM_FRONTEND = __dirname

// /*
//  * The staging copy is created INSIDE apps/crm, next to the real frontend.
//  *
//  * CRM's vite/tailwind config and package.json use paths relative to the
//  * frontend folder (../crm/public/frontend, ../crm/www, ../../frappe/ui/src,
//  * ../../whatsapp/ui/src). A sibling folder sits at the same depth, so every
//  * one of those paths resolves exactly as it does for the standard build.
//  */
// const BUILD_DIR = path.join(CRM_APP, ".gke_crm_build") // changes 
// // const BUILD_DIR = path.join(CUSTOM_FRONTEND, ".crm_build")

// const CRM_INDEX = path.join(CRM_APP, "crm/public/frontend/index.html")

// const SKIP = new Set(["node_modules", "dist", ".vite", "coverage"])

// function copyRecursive(source, destination) {
//   fs.mkdirSync(destination, { recursive: true })

//   for (const item of fs.readdirSync(source, { withFileTypes: true })) {
//     if (SKIP.has(item.name)) continue

//     const src = path.join(source, item.name)
//     const dest = path.join(destination, item.name)

//     if (item.isDirectory()) {
//       copyRecursive(src, dest)
//     } else {
//       fs.copyFileSync(src, dest)
//     }
//   }
// }

// function copyOverride(relativeSource, relativeTarget) {
//   const source = path.join(CUSTOM_FRONTEND, relativeSource)
//   const target = path.join(BUILD_DIR, relativeTarget)

//   if (!fs.existsSync(source)) {
//     throw new Error(`Custom file not found: ${source}`)
//   }

//   fs.mkdirSync(path.dirname(target), { recursive: true })
//   fs.copyFileSync(source, target)
//   console.log(`   + ${relativeTarget}`)
// }

// function removeBuildDir() {
//   fs.rmSync(BUILD_DIR, { recursive: true, force: true })
// }

// console.log("")
// console.log("======================================")
// console.log(" CRM CUSTOM FRONTEND BUILD")
// console.log("======================================")
// console.log("Bench:           " + BENCH)
// console.log("CRM frontend:    " + CRM_FRONTEND)
// console.log("Custom frontend: " + CUSTOM_FRONTEND)
// console.log("Build directory: " + BUILD_DIR)
// console.log("")

// if (!fs.existsSync(path.join(CRM_FRONTEND, "package.json"))) {
//   throw new Error(
//     `CRM frontend not found at ${CRM_FRONTEND}. ` +
//       "The crm app must be installed on the bench before gke_crm."
//   )
// }

// try {
//   console.log("1. Copying standard CRM frontend...")
//   removeBuildDir()
//   copyRecursive(CRM_FRONTEND, BUILD_DIR)

//   console.log("2. Applying custom pages...")
//   const customPages = path.join(CUSTOM_FRONTEND, "src/pages")
//   const overridePages = path.join(CUSTOM_FRONTEND, "src_override/pages")
//   const overrideComponents = path.join(
//     CUSTOM_FRONTEND,
//     "src_override/components"
//   )
//   // Copy custom pages from src/pages
//   if (fs.existsSync(customPages)) {
//     for (const file of fs.readdirSync(customPages)) {
//       if (file.endsWith(".vue")) {
//         copyOverride(`src/pages/${file}`, `src/pages/${file}`)
//       }
//     }
//   }

//   // Copy overridden pages from src_override/pages
//   if (fs.existsSync(overridePages)) {
//     for (const file of fs.readdirSync(overridePages)) {
//       if (file.endsWith(".vue")) {
//         copyOverride(`src_override/pages/${file}`, `src/pages/${file}`)
//       }
//     }
//   }

// //Copy overridden components recursively
// // Copy overridden components recursively.
// // Merge into standard CRM components; do not delete existing components.
// if (fs.existsSync(overrideComponents)) {
//   copyRecursive(
//     overrideComponents,
//     path.join(BUILD_DIR, "src/components")
//   )
//   console.log("   + Override components copied")
// }

//   console.log("3. Applying router and sidebar overrides...")
//   copyOverride(
//     "src_override/components/Layouts/AppSidebar.vue",
//     "src/components/Layouts/AppSidebar.vue"
//   )

//   console.log("4. Preparing node_modules...")
//   const crmNodeModules = path.join(CRM_FRONTEND, "node_modules")
//   if (fs.existsSync(crmNodeModules)) {
//     fs.symlinkSync(
//       crmNodeModules,
//       path.join(BUILD_DIR, "node_modules"),
//       "dir"
//     )
//     console.log("   Linked CRM node_modules.")
//   } else {
//     console.log("   CRM node_modules not found, running yarn install...")
//     execSync("yarn install", { cwd: BUILD_DIR, stdio: "inherit" })
//   }

//   console.log("5. Building custom CRM frontend...")
//   execSync("yarn build", { cwd: BUILD_DIR, stdio: "inherit" })

//   if (!fs.existsSync(CRM_INDEX)) {
//     throw new Error(`CRM frontend index.html was not generated: ${CRM_INDEX}`)
//   }
// } finally {
//   // Never leave the staging copy inside the crm app.
//   removeBuildDir() //changes 
//   // console.log("Build directory preserved at: " + BUILD_DIR)
// }

// console.log("")
// console.log("======================================")
// console.log(" CRM CUSTOM BUILD SUCCESSFUL")
// console.log("======================================")
// console.log("")



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
const BUILD_DIR = path.join(CRM_APP, ".gke_crm_build") // changes 
// const BUILD_DIR = path.join(CUSTOM_FRONTEND, ".crm_build")

const CRM_INDEX = path.join(CRM_APP, "crm/public/frontend/index.html")

// Output of the build. A failed build leaves this folder half written, so it is
// backed up before the build and restored when the build fails.
const OUTPUT_DIR = path.join(CRM_APP, "crm/public/frontend")
const OUTPUT_BACKUP = path.join(CRM_APP, "crm/public/.frontend_backup")

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


// new



function patchRouter() {
  const routerPath = path.join(BUILD_DIR, "src/router.js")
  let content = fs.readFileSync(routerPath, "utf8")

  const routesToAdd = `  {
    path: '/customer-management',
    name: 'CustomerManagement',
    component: () => import('@/pages/CustomerManagement.vue'),
  },
  {
    path: '/administrator-management',
    name: 'AdministratorManagement',
    component: () => import('@/pages/AdministratorManagement.vue'),
  },
`

  if (
    content.includes("name: 'CustomerManagement'") ||
    content.includes('name: "CustomerManagement"')
  ) {
    console.log("   Custom routes already present; skipping.")
    return
  }

  const marker = "  {\n    path: '/:invalidpath',"

  if (!content.includes(marker)) {
    throw new Error("Could not find invalidpath route in standard router.js")
  }

  content = content.replace(marker, routesToAdd + marker)
  fs.writeFileSync(routerPath, content, "utf8")

  console.log("   Added CustomerManagement and AdministratorManagement routes.")
}


/*
 * Copy the files of src_override/components into the build and show which of
 * them REPLACE a standard CRM file. An old copy of a standard component is the
 * most common reason why a custom build breaks while the standard build works.
 * Layouts/AppSidebar.vue is not copied: it is patched by patches.mjs.
 */
function copyComponentOverrides(source, destination, relative = "") {
  fs.mkdirSync(destination, { recursive: true })

  for (const item of fs.readdirSync(source, { withFileTypes: true })) {
    if (SKIP.has(item.name)) continue

    const rel = path.join(relative, item.name)
    const src = path.join(source, item.name)
    const dest = path.join(destination, item.name)

    if (item.isDirectory()) {
      copyComponentOverrides(src, dest, rel)
      continue
    }

    // // AppSidebar.vue is copied from src_override
    if (rel === path.join("Layouts", "AppSidebar.vue")) {
      fs.mkdirSync(path.dirname(dest), { recursive: true })
      fs.copyFileSync(src, dest)
      console.log(`   + components/${rel}   <-- CUSTOM SIDEBAR`)
      continue
    }

    const replaces = fs.existsSync(dest)
    fs.copyFileSync(src, dest)
    console.log(
      `   + components/${rel}` + (replaces ? "   <-- REPLACES a standard CRM file" : "")
    )
  }
}

function removeBuildDir() {
  fs.rmSync(BUILD_DIR, { recursive: true, force: true })
}

function backupOutput() {
  fs.rmSync(OUTPUT_BACKUP, { recursive: true, force: true })
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.cpSync(OUTPUT_DIR, OUTPUT_BACKUP, { recursive: true })
  }
}

function restoreOutput() {
  if (!fs.existsSync(OUTPUT_BACKUP)) return

  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true })
  fs.renameSync(OUTPUT_BACKUP, OUTPUT_DIR)
  console.log("   The build failed, so the previous frontend was restored.")
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
  const overridePages = path.join(CUSTOM_FRONTEND, "src_override/pages")
  const overrideComponents = path.join(
    CUSTOM_FRONTEND,
    "src_override/components"
  )
  // Copy custom pages from src/pages
  if (fs.existsSync(customPages)) {
    for (const file of fs.readdirSync(customPages)) {
      if (file.endsWith(".vue")) {
        copyOverride(`src/pages/${file}`, `src/pages/${file}`)
      }
    }
  }

  // Copy overridden pages from src_override/pages
  if (fs.existsSync(overridePages)) {
    for (const file of fs.readdirSync(overridePages)) {
      if (file.endsWith(".vue")) {
        copyOverride(`src_override/pages/${file}`, `src/pages/${file}`)
      }
    }
  }

  // Copy overridden components.
  // Merge into standard CRM components; do not delete existing components.
  if (fs.existsSync(overrideComponents)) {
    copyComponentOverrides(
      overrideComponents,
      path.join(BUILD_DIR, "src/components")
    )
  }

  // The standard router.js and AppSidebar.vue are patched, not replaced,
  // so they always match the installed CRM version.
  console.log("3. Applying router and sidebar patches...")
  patchRouter()

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
  backupOutput()

  try {
    execSync("yarn build", { cwd: BUILD_DIR, stdio: "inherit" })

    if (!fs.existsSync(CRM_INDEX)) {
      throw new Error(`CRM frontend index.html was not generated: ${CRM_INDEX}`)
    }
  } catch (error) {
    restoreOutput()
    throw error
  }

  fs.rmSync(OUTPUT_BACKUP, { recursive: true, force: true })
} finally {
  // Never leave the staging copy inside the crm app.
  removeBuildDir() //changes 
  // console.log("Build directory preserved at: " + BUILD_DIR)
}

console.log("")
console.log("======================================")
console.log(" CRM CUSTOM BUILD SUCCESSFUL")
console.log("======================================")
console.log("")