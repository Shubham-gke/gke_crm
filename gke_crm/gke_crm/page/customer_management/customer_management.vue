<template>
  <div class="flex h-full flex-col">

    <!-- Header -->
    <div class="border-b px-5 py-4">
      <h1 class="text-xl font-semibold text-ink-gray-9">
        Customer Management
      </h1>
    </div>

    <!-- Tabs -->
    <div class="border-b px-5">
      <div class="flex gap-6">

        <!-- DVR -->
        <button
          @click="changeTab('dvr')"
          class="border-b-2 px-2 py-3 text-sm font-medium transition-colors duration-200"
          :class="
            activeTab === 'dvr'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-ink-gray-6 hover:text-ink-gray-9'
          "
        >
          Daily Visit Report
        </button>

        <!-- Approval -->
        <button
          @click="changeTab('approval')"
          class="border-b-2 px-2 py-3 text-sm font-medium transition-colors duration-200"
          :class="
            activeTab === 'approval'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-ink-gray-6 hover:text-ink-gray-9'
          "
        >
          Approval
        </button>

        <!-- Sales Visit Report -->
        <button
          @click="changeTab('sales_visit_report_user')"
          class="border-b-2 px-2 py-3 text-sm font-medium transition-colors duration-200"
          :class="
            activeTab === 'sales_visit_report_user'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-ink-gray-6 hover:text-ink-gray-9'
          "
        >
          Sales Visit Report
        </button>

      </div>
    </div>

    <!-- Tab Content -->
    <div class="min-h-0 flex-1 p-5">

      <!-- DVR -->
      <div
        v-if="activeTab === 'dvr'"
        class="h-full w-full"
      >
        <iframe
          :key="iframeKey"
          :src="dvrUrl"
          title="Daily Visit Report"
          class="h-full min-h-[calc(100vh-180px)] w-full border-0"
        ></iframe>
      </div>

      <!-- Approval -->
      <div
        v-else-if="activeTab === 'approval'"
        class="h-full w-full"
      >
        <iframe
          :key="iframeKey"
          :src="approvalUrl"
          title="Approval"
          class="h-full min-h-[calc(100vh-180px)] w-full border-0"
        ></iframe>
      </div>

      <!-- Sales Visit Report -->
      <div
        v-else-if="activeTab === 'sales_visit_report_user'"
        class="h-full w-full"
      >
        <iframe
          :key="iframeKey"
          :src="salesVisitReportUrl"
          title="Sales Visit Report"
          class="h-full min-h-[calc(100vh-180px)] w-full border-0"
        ></iframe>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue"

const activeTab = ref("dvr")

const iframeKey = ref(0)

const dvrUrl = ref(
  `/desk/daily-visit-report?v=${Date.now()}`
)

const approvalUrl = ref(
  `/assets/gke_crm/html/approval_user.html?v=${Date.now()}`
)

const salesVisitReportUrl = ref(
  `/assets/gke_crm/html/sales_visit_report_user.html?v=${Date.now()}`
)

function changeTab(tab) {
  activeTab.value = tab

  // Force iframe completely reload
  iframeKey.value++

  const version = Date.now()

  if (tab === "dvr") {
    dvrUrl.value =
      `/desk/daily-visit-report?v=${version}`
  }

  if (tab === "approval") {
  approvalUrl.value =
    `/assets/gke_crm/html/approval_user.html?v=${version}`
}

if (tab === "sales_visit_report_user") {
  salesVisitReportUrl.value =
    `/assets/gke_crm/html/sales_visit_report_user.html?v=${version}`
}
}
</script>