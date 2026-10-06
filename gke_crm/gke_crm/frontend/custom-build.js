import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { execSync } from "child_process"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/*
 * Current file:
 *
 * apps/
 * └── crm_custom_001/
 *     └── crm_custom_001/
 *         └── crm_custom/
 *             └── frontend/
 *                 └── custom-build.js
 *
 * Therefore ../../../../.. = frappe-bench
 */

const BENCH = path.resolve(__dirname, "../../../../..")

const CRM_APP = path.join(
  BENCH,
  "apps/crm"
)

const CRM_FRONTEND = path.join(
  CRM_APP,
  "frontend"
)

const CUSTOM_FRONTEND = __dirname

const BUILD_DIR = path.join(
  CUSTOM_FRONTEND,
  ".crm_build"
)

const CRM_OUTPUT = path.join(
  CRM_APP,
  "crm/public/frontend"
)


/* =========================================================
   Utility: recursive copy
   ========================================================= */

function copyRecursive(source, destination) {
  fs.mkdirSync(destination, {
    recursive: true,
  })

  for (const item of fs.readdirSync(source, {
    withFileTypes: true,
  })) {
    const src = path.join(
      source,
      item.name
    )

    const dest = path.join(
      destination,
      item.name
    )

    /*
     * Do not copy these folders from standard CRM.
     */
    if (
      item.name === "node_modules" ||
      item.name === "dist" ||
      item.name === ".vite"
    ) {
      continue
    }

    if (item.isDirectory()) {
      copyRecursive(
        src,
        dest
      )
    } else {
      fs.copyFileSync(
        src,
        dest
      )
    }
  }
}


/* =========================================================
   Start
   ========================================================= */

console.log("")
console.log("======================================")
console.log(" CRM CUSTOM FRONTEND BUILD")
console.log("======================================")
console.log("")

console.log("Bench:")
console.log(BENCH)

console.log("CRM frontend:")
console.log(CRM_FRONTEND)

console.log("Custom frontend:")
console.log(CUSTOM_FRONTEND)

console.log("Build directory:")
console.log(BUILD_DIR)

console.log("")


/* =========================================================
   Validate paths
   ========================================================= */

if (!fs.existsSync(BENCH)) {
  throw new Error(
    `Bench directory not found: ${BENCH}`
  )
}

if (!fs.existsSync(CRM_FRONTEND)) {
  throw new Error(
    `CRM frontend not found: ${CRM_FRONTEND}`
  )
}

if (!fs.existsSync(
  path.join(
    CRM_FRONTEND,
    "package.json"
  )
)) {
  throw new Error(
    `CRM frontend package.json not found`
  )
}


/* =========================================================
   1. Remove old staging directory
   ========================================================= */

console.log("1. Cleaning previous staging directory...")

if (fs.existsSync(BUILD_DIR)) {
  fs.rmSync(
    BUILD_DIR,
    {
      recursive: true,
      force: true,
    }
  )
}


/* =========================================================
   2. Copy standard CRM frontend
   ========================================================= */

console.log("2. Copying standard CRM frontend...")

copyRecursive(
  CRM_FRONTEND,
  BUILD_DIR
)

console.log("   Standard CRM copied.")
console.log("")


/* =========================================================
   3. Copy custom pages
   ========================================================= */

console.log("3. Applying custom pages...")

const CUSTOM_PAGES = path.join(
  CUSTOM_FRONTEND,
  "src/pages"
)

const BUILD_PAGES = path.join(
  BUILD_DIR,
  "src/pages"
)

if (fs.existsSync(CUSTOM_PAGES)) {
  fs.mkdirSync(
    BUILD_PAGES,
    {
      recursive: true,
    }
  )

  for (
    const file of fs.readdirSync(CUSTOM_PAGES)
  ) {
    if (!file.endsWith(".vue")) {
      continue
    }

    const source = path.join(
      CUSTOM_PAGES,
      file
    )

    const destination = path.join(
      BUILD_PAGES,
      file
    )

    fs.copyFileSync(
      source,
      destination
    )

    console.log(
      `   + ${file}`
    )
  }
}

console.log("")


/* =========================================================
   4. Apply router override
   ========================================================= */

console.log("4. Applying router override...")

const CUSTOM_ROUTER = path.join(
  CUSTOM_FRONTEND,
  "src_override/router.js"
)

const BUILD_ROUTER = path.join(
  BUILD_DIR,
  "src/router.js"
)

if (!fs.existsSync(CUSTOM_ROUTER)) {
  throw new Error(
    `Custom router not found: ${CUSTOM_ROUTER}`
  )
}

fs.copyFileSync(
  CUSTOM_ROUTER,
  BUILD_ROUTER
)

console.log(
  "   + src/router.js"
)

console.log("")


/* =========================================================
   5. Apply AppSidebar override
   ========================================================= */

console.log("5. Applying AppSidebar override...")

const CUSTOM_SIDEBAR = path.join(
  CUSTOM_FRONTEND,
  "src_override/components/Layouts/AppSidebar.vue"
)

const BUILD_SIDEBAR = path.join(
  BUILD_DIR,
  "src/components/Layouts/AppSidebar.vue"
)

if (!fs.existsSync(CUSTOM_SIDEBAR)) {
  throw new Error(
    `Custom AppSidebar not found: ${CUSTOM_SIDEBAR}`
  )
}

fs.mkdirSync(
  path.dirname(BUILD_SIDEBAR),
  {
    recursive: true,
  }
)

fs.copyFileSync(
  CUSTOM_SIDEBAR,
  BUILD_SIDEBAR
)

console.log(
  "   + src/components/Layouts/AppSidebar.vue"
)

console.log("")


/* =========================================================
   6. Prepare CRM directory structure for build
   =========================================================

   Original CRM build expects:

   frontend/
   └── ../crm/
       ├── public/frontend/
       └── www/

   Our staging directory is:

   frontend/
   └── .crm_build/

   So create:

   frontend/
   └── crm -> apps/crm/crm

   This makes:

   ../crm/public/frontend
   ../crm/www

   resolve correctly.
   */

console.log(
  "6. Preparing CRM build directory structure..."
)

const STAGED_CRM_DIR = path.join(
  BUILD_DIR,
  "..",
  "crm"
)

const ORIGINAL_CRM_DIR = path.join(
  CRM_APP,
  "crm"
)

if (
  fs.existsSync(STAGED_CRM_DIR) ||
  fs.lstatSync(
    path.dirname(STAGED_CRM_DIR)
  ).isSymbolicLink?.()
) {
  try {
    fs.rmSync(
      STAGED_CRM_DIR,
      {
        recursive: true,
        force: true,
      }
    )
  } catch (error) {
    console.log(
      "   Existing staged CRM path could not be removed."
    )
  }
}

if (!fs.existsSync(STAGED_CRM_DIR)) {
  fs.symlinkSync(
    ORIGINAL_CRM_DIR,
    STAGED_CRM_DIR,
    "dir"
  )
}

console.log(
  "   CRM directory linked."
)

console.log("")


/* =========================================================
   7. Use original CRM node_modules
   ========================================================= */

console.log(
  "7. Linking CRM node_modules..."
)

const CRM_NODE_MODULES = path.join(
  CRM_FRONTEND,
  "node_modules"
)

const BUILD_NODE_MODULES = path.join(
  BUILD_DIR,
  "node_modules"
)

if (!fs.existsSync(CRM_NODE_MODULES)) {
  throw new Error(
    `CRM node_modules not found: ${CRM_NODE_MODULES}`
  )
}

if (fs.existsSync(BUILD_NODE_MODULES)) {
  fs.rmSync(
    BUILD_NODE_MODULES,
    {
      recursive: true,
      force: true,
    }
  )
}

fs.symlinkSync(
  CRM_NODE_MODULES,
  BUILD_NODE_MODULES,
  "dir"
)

console.log(
  "   node_modules linked."
)

console.log("")


/* =========================================================
   8. Build
   ========================================================= */

console.log(
  "8. Building custom CRM frontend..."
)

console.log("")

execSync(
  "yarn build",
  {
    cwd: BUILD_DIR,
    stdio: "inherit",
  }
)

console.log("")

console.log(
  "   Vite build completed."
)

console.log("")


/* =========================================================
   9. Verify build output
   ========================================================= */

/* =========================================================
   9. Verify generated CRM frontend
   ========================================================= */

console.log(
  "9. Checking generated CRM frontend..."
)

const CRM_INDEX = path.join(
  CRM_APP,
  "crm/public/frontend/index.html"
)

const CRM_SW = path.join(
  CRM_APP,
  "crm/public/frontend/sw.js"
)

if (!fs.existsSync(CRM_INDEX)) {
  throw new Error(
    `CRM frontend index.html was not generated: ${CRM_INDEX}`
  )
}

if (!fs.existsSync(CRM_SW)) {
  console.log(
    "   Warning: sw.js was not found, but index.html exists."
  )
}

console.log(
  "   CRM frontend generated successfully."
)

console.log("")
console.log("======================================")
console.log(" CRM CUSTOM BUILD SUCCESSFUL")
console.log("======================================")
console.log("")

console.log(
  "Custom pages:"
)

console.log(
  "  - Customer Management"
)

console.log(
  "  - Administrator Management"
)

console.log("")

console.log(
  "Custom router + sidebar applied."
)

console.log("")