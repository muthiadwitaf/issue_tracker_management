<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useIssuesStore } from '../stores/issues';
import { useProjectsStore } from '../stores/projects';
import StatusChip from '../components/StatusChip.vue';
import PriorityChip from '../components/PriorityChip.vue';
import UserAvatar from '../components/UserAvatar.vue';

const router = useRouter();
const issuesStore = useIssuesStore();
const projectsStore = useProjectsStore();
const selectedProjectId = ref(null);

async function load() {
  const filters = selectedProjectId.value ? { projectId: selectedProjectId.value } : {};
  await issuesStore.fetchAll(filters);
}

onMounted(async () => {
  await projectsStore.fetchAll();
  await load();
});

watch(selectedProjectId, load);

function isOverdue(issue) {
  return issue.dueDate && new Date(issue.dueDate) < new Date() && issue.status !== 'CLOSED';
}

const stats = computed(() => {
  const items = issuesStore.items;
  return {
    total: items.length,
    open: items.filter((i) => i.status === 'OPEN').length,
    overdue: items.filter(isOverdue).length,
    critical: items.filter((i) => i.priority === 'CRITICAL').length,
  };
});

const summaryCards = computed(() => [
  {
    label: 'Total Issue',
    value: stats.value.total,
    icon: 'mdi-format-list-bulleted',
    color: 'primary',
  },
  {
    label: 'Terbuka',
    value: stats.value.open,
    icon: 'mdi-alert-circle-outline',
    color: 'statusOpen',
  },
  {
    label: 'Lewat Tenggat',
    value: stats.value.overdue,
    icon: 'mdi-calendar-alert-outline',
    color: 'error',
  },
  {
    label: 'Prioritas Kritis',
    value: stats.value.critical,
    icon: 'mdi-chevron-double-up',
    color: 'priorityCritical',
  },
]);
</script>

<template>
  <div>
    <div class="d-flex align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-medium">Dashboard</h1>
        <p class="text-body-2 text-medium-emphasis">Ringkasan issue di semua proyek</p>
      </div>
      <v-spacer />
      <v-select
        v-model="selectedProjectId"
        :items="projectsStore.items"
        item-title="name"
        item-value="id"
        label="Filter berdasarkan proyek"
        prepend-inner-icon="mdi-folder-outline"
        clearable
        density="compact"
        hide-details
        style="max-width: 280px"
      />
    </div>

    <v-row class="mb-2">
      <v-col v-for="card in summaryCards" :key="card.label" cols="6" md="3">
        <v-card variant="flat" border>
          <v-card-text class="d-flex align-center">
            <v-avatar :color="card.color" variant="tonal" rounded="lg" size="44" class="mr-3">
              <v-icon :icon="card.icon" :color="card.color" />
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-medium">{{ card.value }}</div>
              <div class="text-caption text-medium-emphasis">{{ card.label }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card variant="flat" border>
      <v-card-title class="d-flex align-center text-subtitle-1 font-weight-medium">
        <v-icon icon="mdi-format-list-bulleted" class="mr-2" size="20" />
        Issue
        <span class="text-body-2 text-medium-emphasis ml-2">
          ({{ selectedProjectId ? projectsStore.items.find((p) => p.id === selectedProjectId)?.name : 'semua proyek' }})
        </span>
      </v-card-title>
      <v-divider />
      <div style="overflow-x: auto">
        <v-table hover style="min-width: 720px">
          <thead>
            <tr>
              <th>Judul</th>
              <th>Proyek</th>
              <th>Status</th>
              <th>Prioritas</th>
              <th>Penanggung Jawab</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="issue in issuesStore.items"
              :key="issue.id"
              style="cursor: pointer"
              @click="router.push(`/issues/${issue.id}`)"
            >
              <td class="font-weight-medium text-truncate" style="max-width: 320px">{{ issue.title }}</td>
              <td>{{ issue.project?.name }}</td>
              <td><StatusChip :status="issue.status" /></td>
              <td><PriorityChip :priority="issue.priority" /></td>
              <td>
                <div v-if="issue.assignee" class="d-flex align-center">
                  <UserAvatar :name="issue.assignee.name" :size="22" class="mr-2" />
                  {{ issue.assignee.name }}
                </div>
                <span v-else class="text-medium-emphasis">Belum ditugaskan</span>
              </td>
            </tr>
            <tr v-if="!issuesStore.loading && !issuesStore.items.length">
              <td colspan="5" class="text-center text-medium-emphasis py-8">Tidak ada issue untuk proyek ini.</td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-card>
  </div>
</template>
