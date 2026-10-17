/*
	Applies the gke_crm customizations on top of the standard CRM frontend, so the
	whole router.js and AppSidebar.vue do not have to be copied and kept in sync
	with every CRM version.

	custom-build.js calls applyCustomPatches(buildDir) after it copied the standard
	CRM frontend into the build directory. If a marker cannot be found in the CRM
	files, the build stops with a clear message instead of building a broken CRM.
*/

import fs from 'node:fs'
import path from 'node:path'

/* =====================================================
   SETTINGS
===================================================== */

// Users who see "Administrator Management" (lowercase)
const ADMIN_USERS = [
	'shubham_s@gkexport.com',
	'shubham_si@gkexport.com',
	'jignesh_v@gkexport.com',
	'cdr@gkexport.com',
	'abhishek_s@gkexport.com',
]

// The route name used in router.js and the "to" of the sidebar link MUST be the same.
const ROUTES = [
	{
		marker: "name: 'CustomerManagement'",
		text: `  {
    path: '/customer-management',
    name: 'CustomerManagement',
    component: () => import('@/pages/CustomerManagement.vue'),
  },`,
	},
	{
		marker: "name: 'AdministratorManagement'",
		text: `  {
    path: '/administrator-management',
    name: 'AdministratorManagement',
    component: () => import('@/pages/AdministratorManagement.vue'),
  },`,
	},
]

const LINKS = [
	{
		marker: "to: 'CustomerManagement'",
		text: `  {
    label: 'Customer Management',
    icon: OrganizationsIcon,
    to: 'CustomerManagement',
  },`,
	},
	{
		marker: "to: 'AdministratorManagement'",
		text: `  {
    label: 'Administrator Management',
    icon: OrganizationsIcon,
    to: 'AdministratorManagement',
    condition: () => isAdministrator.value,
  },`,
	},
]

// Added before "const allViews = computed(" in AppSidebar.vue
const ADMIN_CHECK = `const isAdministrator = ref(false)

async function checkAdministrator() {
  try {
    const response = await fetch('/api/method/frappe.auth.get_logged_user')
    const data = await response.json()
    const loggedInUser = (data.message || '').toLowerCase()
    const adminUsers = ${JSON.stringify(ADMIN_USERS)}

    isAdministrator.value =
      loggedInUser === 'administrator' || adminUsers.includes(loggedInUser)
  } catch (error) {
    console.error('User check failed:', error)
    isAdministrator.value = false
  }
}

`

/* =====================================================
   HELPERS
===================================================== */

// Insert text just before the "]" that closes the array which starts at startMarker
function insertBeforeArrayEnd(content, startMarker, text) {
	const start = content.indexOf(startMarker)
	if (start === -1) return null

	const end = content.indexOf('\n]', start)
	if (end === -1) return null

	return content.slice(0, end) + '\n' + text + content.slice(end)
}

function fail(file, what) {
	throw new Error(
		`[gke_crm patch] ${what} in ${file}. ` +
			`The standard CRM file changed, update patches.mjs.`
	)
}

/* =====================================================
   router.js
===================================================== */

export function patchRouter(file) {
	let content = fs.readFileSync(file, 'utf8')
	let changed = 0

	for (const route of ROUTES) {
		if (content.includes(route.marker)) continue

		// the routes have to sit before the catch-all '/:invalidpath' route
		const catchAll = content.indexOf("path: '/:invalidpath'")
		let result = null

		if (catchAll !== -1) {
			const open = content.lastIndexOf('\n  {', catchAll)
			if (open !== -1) {
				result = content.slice(0, open) + '\n' + route.text + content.slice(open)
			}
		} else {
			result = insertBeforeArrayEnd(content, 'const routes = [', route.text)
		}

		if (result === null) fail(file, "could not find the 'const routes = [' array")

		content = result
		changed++
	}

	fs.writeFileSync(file, content)
	console.log(`   router.js: ${changed} route(s) added`)
}

/* =====================================================
   AppSidebar.vue
===================================================== */

export function patchSidebar(file) {
	let content = fs.readFileSync(file, 'utf8')
	let changed = 0

	// 1. links
	for (const link of LINKS) {
		if (content.includes(link.marker)) continue

		const result = insertBeforeArrayEnd(content, 'const links = [', link.text)
		if (result === null) fail(file, "could not find the 'const links = [' array")

		content = result
		changed++
	}

	// 2. the administrator check
	if (!content.includes('async function checkAdministrator')) {
		const marker = 'const allViews = computed('
		if (!content.includes(marker)) fail(file, `could not find '${marker}'`)

		content = content.replace(marker, ADMIN_CHECK + marker)
		changed++
	}

	// 3. call it when the sidebar is mounted (not awaited, so a slow call can not block the sidebar)
	if (!/checkAdministrator\(\)\n/.test(content.replace(/async function checkAdministrator\(\)/, ''))) {
		const mounted = /onMounted\(async \(\) => \{\s*if \(props\.mobile\) return\s*/

		if (!mounted.test(content)) fail(file, 'could not find the onMounted block')

		content = content.replace(mounted, (match) => match + 'checkAdministrator()\n\n  ')
		changed++
	}

	// 4. links need the "condition" support of the standard sidebar
	if (!content.includes('link.condition')) {
		console.warn(
			"   WARNING: the sidebar has no 'link.condition' filter, so " +
				'Administrator Management is shown to everyone.'
		)
	}

	fs.writeFileSync(file, content)
	console.log(`   AppSidebar.vue: ${changed} change(s) applied`)
}

/* =====================================================
   ENTRY POINT
===================================================== */

// export function applyCustomPatches(buildDir) {
// 	patchRouter(path.join(buildDir, 'src', 'router.js'))
// 	patchSidebar(path.join(buildDir, 'src', 'components', 'Layouts', 'AppSidebar.vue'))
// }


export function applyCustomPatches(buildDir) {
    patchRouter(path.join(buildDir, 'src', 'router.js'))
}