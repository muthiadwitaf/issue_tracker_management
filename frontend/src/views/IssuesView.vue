<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useIssuesStore } from '../stores/issues';
import { useProjectsStore } from '../stores/projects';
import { useUsersStore } from '../stores/users';
import { useLabelsStore } from '../stores/labels';
import StatusChip from '../components/StatusChip.vue';
import PriorityChip from '../components/PriorityChip.vue';
import UserAvatar from '../components/UserAvatar.vue';
import LabelChip from '../components/LabelChip.vue';
import IssueFormDialog from '../components/IssueFormDialog.vue';
import LabelManagerDialog from '../components/LabelManagerDialog.vue';
import { notify } from '../composables/snackbar';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../utils/issueOptions';

const router = useRouter();
const issuesStore = useIssuesStore();
const projectsStore = useProjectsStore();
const usersStore = useUsersStore();
const labelsStore = useLabelsStore();
const dialogOpen = ref(false);
const labelManagerOpen = ref(false);

const filters = ref({ projectId: null, status: null, priority: null, assigneeId: null, labelId: null, overdue: false });

const activeFilters = computed(() => {
  const f = {};
  Object.entries(filters.value).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '' && v !== false) f[k] = v;
  });
  return f;
});

function isOverdue(issue) {
  return issue.dueDate && new Date(issue.dueDate) < new Date() && issue.status !== 'CLOSED';
}

async function load() {
  await Promise.all([projectsStore.fetchAll(), usersStore.fetchAll(), labelsStore.fetchAll()]);
  await issuesStore.fetchAll(activeFilters.value);
}

onMounted(load);
watch(filters, () => issuesStore.fetchAll(activeFilters.value), { deep: true });

async function handleSave(payload) {
  await issuesStore.create(payload);
  notify('Issue berhasil dibuat');
}

async function quickStatusChange(issue, status) {
  await issuesStore.updateStatus(issue.id, { status, solution: issue.solution });
  notify('Status berhasil diperbarui');
}

async function quickAssign(issue, assigneeId) {
  await issuesStore.assign(issue.id, assigneeId);
  notify('Penanggung jawab berhasil diperbarui');
}

// Menutup dropdown status/penanggung jawab yang mungkin masih terbuka di tabel
// sebelum membuka dialog baru — kalau tidak, menu itu tetap aktif dan tampilannya
// bertumpuk aneh di atas dialog. blur() saja tidak cukup untuk menutup menu
// Vuetify, jadi kita kirim juga tombol Escape yang memang ditangani v-overlay.
function closeOpenMenus() {
  document.activeElement?.blur();
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
}

function openIssueDialog() {
  closeOpenMenus();
  dialogOpen.value = true;
}

function openLabelManager() {
  closeOpenMenus();
  labelManagerOpen.value = true;
}
</script>

<template>
  <div>
    <div class="d-flex align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-medium">Issue</h1>
        <p class="text-body-2 text-medium-emphasis">{{ issuesStore.items.length }} issue ditemukan</p>
      </div>
      <v-spacer />
      <v-btn variant="outlined" prepend-icon="mdi-tag-outline" class="mr-2" @click="openLabelManager">
        Kelola Kategori
      </v-btn>
      <v-btn color="primary" prepend-icon="mdi-plus" variant="flat" @click="openIssueDialog">Issue Baru</v-btn>
    </div>

    <v-card variant="flat" border class="mb-4 pa-3">
      <v-row dense align="center">
        <v-col cols="12" sm="2">
          <v-select
            v-model="filters.projectId"
            :items="projectsStore.items"
            item-title="name"
            item-value="id"
            label="Proyek"
            prepend-inner-icon="mdi-folder-outline"
            clearable
            density="compact"
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="2">
          <v-select
            v-model="filters.status"
            :items="STATUS_OPTIONS"
            item-title="title"
            item-value="value"
            label="Status"
            prepend-inner-icon="mdi-progress-check"
            clearable
            density="compact"
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="2">
          <v-select
            v-model="filters.priority"
            :items="PRIORITY_OPTIONS"
            item-title="title"
            item-value="value"
            label="Prioritas"
            prepend-inner-icon="mdi-flag-outline"
            clearable
            density="compact"
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="2">
          <v-select
            v-model="filters.assigneeId"
            :items="usersStore.items"
            item-title="name"
            item-value="id"
            label="Penanggung Jawab"
            prepend-inner-icon="mdi-account-outline"
            clearable
            density="compact"
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="2">
          <v-select
            v-model="filters.labelId"
            :items="labelsStore.items"
            item-title="name"
            item-value="id"
            label="Kategori"
            prepend-inner-icon="mdi-tag-outline"
            clearable
            density="compact"
            hide-details
          />
        </v-col>
        <v-col cols="12" sm="2">
          <v-checkbox v-model="filters.overdue" label="Lewat tenggat" density="compact" hide-details color="error" />
        </v-col>
      </v-row>
    </v-card>

    <v-card variant="flat" border>
      <div style="overflow-x: auto">
        <v-table hover style="min-width: 900px">
          <thead>
            <tr>
              <th>Judul</th>
              <th>Proyek</th>
              <th>Kategori</th>
              <th>Status</th>
              <th>Prioritas</th>
              <th>Penanggung Jawab</th>
              <th>Tenggat</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="issue in issuesStore.items"
              :key="issue.id"
              style="cursor: pointer"
              @click="router.push(`/issues/${issue.id}`)"
            >
              <td>
                <div class="font-weight-medium text-truncate" style="max-width: 260px">{{ issue.title }}</div>
                <div v-if="issue.moduleName" class="text-caption text-medium-emphasis">{{ issue.moduleName }}</div>
              </td>
              <td>{{ issue.project?.name }}</td>
              <td>
                <LabelChip v-for="l in issue.labels" :key="l.labelId" :label="l.label" class="mr-1 mb-1" />
              </td>
              <td @click.stop>
                <v-select
                  :model-value="issue.status"
                  :items="STATUS_OPTIONS"
                  item-title="title"
                  item-value="value"
                  density="compact"
                  variant="plain"
                  hide-details
                  style="min-width: 140px"
                  @update:model-value="quickStatusChange(issue, $event)"
                >
                  <template #selection="{ item }"><StatusChip :status="item.raw.value" /></template>
                </v-select>
              </td>
              <td><PriorityChip :priority="issue.priority" /></td>
              <td @click.stop>
                <v-select
                  :model-value="issue.assigneeId"
                  :items="usersStore.items"
                  item-title="name"
                  item-value="id"
                  density="compact"
                  variant="plain"
                  hide-details
                  clearable
                  placeholder="Belum ditugaskan"
                  style="min-width: 160px"
                  @update:model-value="quickAssign(issue, $event)"
                >
                  <template #selection="{ item }">
                    <div class="d-flex align-center">
                      <UserAvatar :name="item.raw.name" :size="20" class="mr-2" />
                      {{ item.raw.name }}
                    </div>
                  </template>
                </v-select>
              </td>
              <td :class="{ 'text-error font-weight-medium': isOverdue(issue) }">
                {{ issue.dueDate ? new Date(issue.dueDate).toLocaleDateString('id-ID') : '—' }}
              </td>
            </tr>
            <tr v-if="!issuesStore.loading && !issuesStore.items.length">
              <td colspan="7" class="text-center text-medium-emphasis py-8">
                <v-icon icon="mdi-magnify" size="32" class="mb-2 d-block mx-auto" />
                Tidak ada issue yang cocok dengan filter ini.
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-card>

    <IssueFormDialog
      v-model="dialogOpen"
      :projects="projectsStore.items"
      :users="usersStore.items"
      @save="handleSave"
    />
    <LabelManagerDialog v-model="labelManagerOpen" />
  </div>
</template>
