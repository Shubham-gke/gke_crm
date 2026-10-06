<template>
  <div class="flex h-full flex-col">

    <!-- ================= HEADER ================= -->
    <div class="border-b px-5 py-4">
      <h1 class="text-xl font-semibold text-ink-gray-9">
        Administrator Management
      </h1>
    </div>


    <!-- ================= TABS ================= -->
    <div class="border-b px-5">
      <div class="flex gap-6">

        <!-- Sales Person Visit Report -->
        <button
          @click="changeTab('visit-report')"
          class="border-b-2 px-2 py-3 text-sm font-medium transition-colors duration-200"
          :class="
            activeTab === 'visit-report'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-ink-gray-6 hover:text-ink-gray-9'
          "
        >
          Sales Person Visit Report
        </button>


        <!-- Approval Dashboard -->
        <button
          @click="changeTab('follow-up')"
          class="border-b-2 px-2 py-3 text-sm font-medium transition-colors duration-200"
          :class="
            activeTab === 'follow-up'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-ink-gray-6 hover:text-ink-gray-9'
          "
        >
          Approval Dashboard
        </button>

      </div>
    </div>


    <!-- ================= TAB CONTENT ================= -->
    <div class="min-h-0 flex-1 p-5">

      <!-- ================= VISIT REPORT ================= -->
      <div
        v-if="activeTab === 'visit-report'"
        class="h-full w-full"
      >

        <iframe
          :key="iframeKey"
          :src="visitReportUrl"
          title="Sales Person Visit Report"
          class="h-full min-h-[calc(100vh-180px)] w-full border-0"
        ></iframe>

      </div>


      <!-- ================= APPROVAL DASHBOARD ================= -->
      <div
        v-else-if="activeTab === 'follow-up'"
        class="h-full w-full"
      >

        <iframe
          :key="iframeKey"
          :src="approvalDashboardUrl"
          title="Approval Dashboard"
          class="h-full min-h-[calc(100vh-180px)] w-full border-0"
        ></iframe>

      </div>

    </div>

  </div>
</template>


<script setup>
import { ref } from "vue"


// ==================================================
// ACTIVE TAB
// ==================================================

const activeTab = ref("visit-report")


// ==================================================
// CACHE BUSTING
// ==================================================

// Har page load par unique value banegi.
// Isse browser purani HTML/CSS file cache se nahi uthayega.
const cacheVersion = ref(Date.now())


// ==================================================
// IFRAME KEY
// ==================================================

// Tab change hone par iframe completely reload hoga.
const iframeKey = ref(0)


// ==================================================
// IFRAME URLs
// ==================================================

const visitReportUrl = ref(
  `/assets/gke_crm/html/sales_visit_report_administrator.html?v=${cacheVersion.value}`
)

const approvalDashboardUrl = ref(
  `/assets/gke_crm/html/administrator.html?v=${cacheVersion.value}`
)


// ==================================================
// CHANGE TAB
// ==================================================

function changeTab(tab) {

  activeTab.value = tab

  // iframe ko completely recreate/reload karega
  iframeKey.value++

  // Fresh cache version
  const version = Date.now()

  if (tab === "visit-report") {

    visitReportUrl.value =
      `/assets/gke_crm/html/sales_visit_report_administrator.html?v=${version}`

  } else if (tab === "follow-up") {

    approvalDashboardUrl.value =
      `/assets/gke_crm/html/administrator.html?v=${version}`

  }

}
</script>