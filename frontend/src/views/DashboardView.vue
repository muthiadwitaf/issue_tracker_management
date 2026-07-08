<script setup>
import { onMounted, ref, watch } from 'vue';
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
</script>

<template>
  <div>
    <div class="d-flex align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-medium">Dashboard</h1>
        <p class="text-body-2 text-medium-emphasis">Overview of issues across all projects</p>
      </div>
      <v-spacer />
      <v-select
        v-model="selectedProjectId"
        :items="projectsStore.items"
        item-title="name"
        item-value="id"
        label="Filter by project"
        prepend-inner-icon="mdi-folder-outline"
        clearable
        density="compact"
        hide-details
        style="max-width: 280px"
      />
    </div>

    <v-card variant="flat" border>
      <v-card-title class="d-flex align-center text-subtitle-1 font-weight-medium">
        <v-icon icon="mdi-format-list-bulleted" class="mr-2" size="20" />
        Issues
        <span class="text-body-2 text-medium-emphasis ml-2">
          ({{ selectedProjectId ? projectsStore.items.find((p) => p.id === selectedProjectId)?.name : 'all projects' }})
        </span>
      </v-card-title>
      <v-divider />
      <v-table hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Project</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assignee</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="issue in issuesStore.items"
            :key="issue.id"
            style="cursor: pointer"
            @click="router.push(`/issues/${issue.id}`)"
          >
            <td class="font-weight-medium">{{ issue.title }}</td>
            <td>{{ issue.project?.name }}</td>
            <td><StatusChip :status="issue.status" /></td>
            <td><PriorityChip :priority="issue.priority" /></td>
            <td>
              <div v-if="issue.assignee" class="d-flex align-center">
                <UserAvatar :name="issue.assignee.name" :size="22" class="mr-2" />
                {{ issue.assignee.name }}
              </div>
              <span v-else class="text-medium-emphasis">Unassigned</span>
            </td>
          </tr>
          <tr v-if="!issuesStore.loading && !issuesStore.items.length">
            <td colspan="5" class="text-center text-medium-emphasis py-8">No issues for this project.</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>
